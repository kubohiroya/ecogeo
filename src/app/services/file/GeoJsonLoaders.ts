import { GeoRegionEntity } from "~/app//models/geo/GeoRegionEntity";
import { JSONParser } from "@streamparser/json-whatwg";
import { FileLoaderResponseType } from "./FileLoaderResponseType";
import { LoaderProgressResponse } from "./FileLoaderResponse";
import { getTileMortonNumbers, MAX_ZOOM_LEVEL, SpecialMortonNumbers } from "../../utils/mortonNumberUtil";
import { DexieError, Table } from "dexie";
import { getPolygonsBounds } from "../../utils/mapUtil";
import { combinedValueMap, Coordinate, simplifyPolygons } from "../../utils/simplify";
import { GeoDatabase } from "~/app/services/database/GeoDatabase";
import { GeoJsonEntity } from "~/app/services/database/GeoJsonEntity";

import { geojsonToBinary } from "@loaders.gl/gis";

const SIMPLIFY_TOLERANCE = 0.05;
const STORE_AS_GEO_REGIONS = false;
const STORE_AS_GEO_JSONS = true;

type Feature = {
  properties: {
    COUNTRY: string;
    NAME_1?: string;
    NAME_2?: string;
    GID_0: string;
    GID_1?: string;
    GID_2?: string;
  };
  geometry: {
    coordinates: number[][][][];
  };
};

export const storeGeoRegions = async ({
  db,
  stream,
  fileName,
  fileSize,
  startedCallback,
  progressCallback,
  errorCallback,
  finishedCallback,
  cancelCallback,
}: {
  db: GeoDatabase;
  stream: ReadableStream;
  fileName: string;
  fileSize?: number;
  startedCallback?: (fileName: string, dbName: string) => void;
  progressCallback?: (value: LoaderProgressResponse) => void;
  errorCallback?: (fileName: string, errorMessage: string) => void;
  cancelCallback?: (fileName: string) => void;
  finishedCallback?: (fileName: string) => void;
}) => {
  if (STORE_AS_GEO_REGIONS) {
    await storeAsGeoRegions({
      db,
      stream,
      fileName,
      fileSize,
      startedCallback,
      progressCallback,
      errorCallback,
      finishedCallback,
      cancelCallback,
    });
  }
  if (STORE_AS_GEO_JSONS) {
    await storeAsGeoJsons({
      db,
      stream,
      fileName,
      fileSize,
      startedCallback,
      progressCallback,
      errorCallback,
      finishedCallback,
      cancelCallback,
    });
  }
};

export const storeAsGeoRegions = async ({
  db,
  stream,
  fileName,
  fileSize,
  startedCallback,
  progressCallback,
  errorCallback,
  finishedCallback,
  cancelCallback,
}: {
  db: GeoDatabase;
  stream: ReadableStream;
  fileName: string;
  fileSize?: number;
  startedCallback?: (fileName: string, dbName: string) => void;
  progressCallback?: (value: LoaderProgressResponse) => void;
  errorCallback?: (fileName: string, errorMessage: string) => void;
  cancelCallback?: (fileName: string) => void;
  finishedCallback?: (fileName: string) => void;
}) => {
  const bufferSize = 64;

  let countries: GeoRegionEntity[] = [];
  let regions1: GeoRegionEntity[] = [];
  let regions2: GeoRegionEntity[] = [];

  const parser = new JSONParser({
    stringBufferSize: undefined,
    paths: ['$.features'],
    keepStack: false,
  });

  const bulkAdd = async <T>(
    table: Table<T>,
    entities: T[],
    fileName: string,
  ) => {
    table.bulkAdd(entities).catch((error) => {
      errorCallback && errorCallback(fileName, error.message);
    });
  };

  let total = 0;
  const processJSONReader = async (reader: ReadableStream<Uint8Array>) => {
    startedCallback && startedCallback(fileName, db.name);

    reader
      .getReader()
      .read()
      .then((result) => {
        const { done, value } = result;
        if (done) {
          return;
        }

        const features = (value as any).value;
        total += features.length;

        features.forEach((feature: Feature, featureIndex: number) => {
          const { COUNTRY, NAME_1, NAME_2, GID_0, GID_1, GID_2 } =
            feature.properties;
          const coordinates = feature.geometry
            .coordinates as unknown as Coordinate[][][];

          const simplifiedCoordinates = simplifyPolygons(
            `${COUNTRY}\t${NAME_1}\t${NAME_2}`,
            coordinates,
            SIMPLIFY_TOLERANCE,
            true,
            combinedValueMap,
          );

          //NAME_1 === 'Kagawa' && console.log({ NAME_1, coordinates });
          //NAME_1 === 'Tokushima' && console.log({ NAME_1, coordinates });

          const mortonNumbersByZoomLevels: Record<string, number> = {};

          const boundingBox = getPolygonsBounds(simplifiedCoordinates);

          // console.log(coordinates, simplifiedCoordinates, boundingBox);

          for (let zoom = 0; zoom <= MAX_ZOOM_LEVEL; zoom++) {
            const mortonNumbers = getTileMortonNumbers(
              boundingBox.topLeft,
              boundingBox.bottomRight,
              zoom,
            );
            if (mortonNumbers.length === 0) {
              mortonNumbersByZoomLevels[`z${zoom}`] =
                SpecialMortonNumbers.NOT_CONTAINED;
            } else if (mortonNumbers.length === 1) {
              if (mortonNumbers[0].length === 1) {
                mortonNumbersByZoomLevels[`z${zoom}`] = mortonNumbers[0][0];
              } else if (mortonNumbers[0].length >= 2) {
                mortonNumbersByZoomLevels[`z${zoom}`] =
                  mortonNumbersByZoomLevels[`z${zoom - 1}`];
              } else {
                throw new Error();
              }
            } else if (mortonNumbers.length === 2) {
              if (mortonNumbers[1].length === 1) {
                mortonNumbersByZoomLevels[`z${zoom}_`] = mortonNumbers[1][0];
              } else if (mortonNumbers[1].length >= 2) {
                mortonNumbersByZoomLevels[`z${zoom}_`] =
                  mortonNumbersByZoomLevels[`z${zoom - 1}_`];
              }
            } else {
              throw new Error(
                'mortonNumber.length > 2 :' + mortonNumbers.join(' ,'),
              );
            }
          }

          const region: GeoRegionEntity = {
            country: COUNTRY,
            gid_0: GID_0,
            coordinates: simplifiedCoordinates,
            ...mortonNumbersByZoomLevels,
          } as unknown as GeoRegionEntity;

          if (region.coordinates.length > 0 && region.country) {
            if (NAME_1) {
              if (NAME_2) {
                regions2.push({
                  ...region,
                  name_1: NAME_1,
                  gid_1: GID_1,
                  name_2: NAME_2,
                  gid_2: GID_2,
                  name: region.name_2,
                });
              } else {
                regions1.push({
                  ...region,
                  name_1: NAME_1,
                  gid_1: GID_1,
                  name: region.name_1,
                });
              }
            } else {
              countries.push({ ...region, name: region.country });
            }

            progressCallback &&
              progressCallback({
                type: FileLoaderResponseType.progress,
                progress: (featureIndex / features.length) * 100,
                index: featureIndex,
                total,
                unit: 'items',
                fileName,
                fileSize: fileSize || -1,
              });

            /*
            console.log(
              'loading:',
              countries.length,
              regions1.length,
              regions2.length,
            );
             */

            if (countries.length === bufferSize) {
              bulkAdd<GeoRegionEntity>(db.countries, countries, fileName);
              countries = [];
            }
            if (regions1.length === bufferSize) {
              bulkAdd<GeoRegionEntity>(db.regions1, regions1, fileName);
              regions1 = [];
            }
            if (regions2.length === bufferSize) {
              bulkAdd<GeoRegionEntity>(db.regions2, regions2, fileName);
              regions2 = [];
            }
          }
        });

        if (countries.length > 0) {
          bulkAdd<GeoRegionEntity>(db.countries, countries, fileName);
        }
        if (regions1.length > 0) {
          bulkAdd<GeoRegionEntity>(db.regions1, regions1, fileName);
        }
        if (regions2.length > 0) {
          bulkAdd<GeoRegionEntity>(db.regions2, regions2, fileName);
        }

        progressCallback &&
          progressCallback({
            type: FileLoaderResponseType.progress,
            fileName,
            fileSize,
            progress: 100,
            total,
            index: total,
            unit: 'items_end',
          });

        finishedCallback && finishedCallback(fileName);
      });
  };

  try {
    await processJSONReader(stream.pipeThrough(parser));
  } catch (error) {
    console.error(error);
    errorCallback && errorCallback(fileName, (error as DexieError).message);
    return;
  }
};

export const storeAsGeoJsons = async ({
  db,
  stream,
  fileName,
  fileSize,
  startedCallback,
  progressCallback,
  errorCallback,
  finishedCallback,
  cancelCallback,
}: {
  db: GeoDatabase;
  stream: ReadableStream;
  fileName: string;
  fileSize?: number;
  startedCallback?: (fileName: string, dbName: string) => void;
  progressCallback?: (value: LoaderProgressResponse) => void;
  errorCallback?: (fileName: string, errorMessage: string) => void;
  cancelCallback?: (fileName: string) => void;
  finishedCallback?: (fileName: string) => void;
}) => {
  const bufferSize = 64;

  let countries: GeoJsonEntity[] = [];
  let regions1: GeoJsonEntity[] = [];
  let regions2: GeoJsonEntity[] = [];

  const parser = new JSONParser({
    stringBufferSize: undefined,
    paths: ['$.features'],
    keepStack: false,
  });

  const bulkAdd = async <T>(
    table: Table<T>,
    entities: T[],
    fileName: string,
  ) => {
    table.bulkAdd(entities).catch((error) => {
      errorCallback && errorCallback(fileName, error.message);
    });
  };

  let total = 0;
  const processJSONReader = async (reader: ReadableStream<Uint8Array>) => {
    startedCallback && startedCallback(fileName, db.name);

    reader
      .getReader()
      .read()
      .then((result) => {
        const { done, value } = result;
        if (done) {
          return;
        }

        const features = (value as any).value;
        total += features.length;

        features.forEach((feature: Feature, featureIndex: number) => {
          const { COUNTRY, NAME_1, NAME_2, GID_0, GID_1, GID_2 } =
            feature.properties;
          const coordinates = feature.geometry
            .coordinates as unknown as Coordinate[][][];

          const simplifiedCoordinates = simplifyPolygons(
            `${COUNTRY}\t${NAME_1}\t${NAME_2}`,
            coordinates,
            SIMPLIFY_TOLERANCE,
            true,
            combinedValueMap,
          );

          //NAME_1 === 'Kagawa' && console.log({ NAME_1, coordinates });
          //NAME_1 === 'Tokushima' && console.log({ NAME_1, coordinates });

          const mortonNumbersByZoomLevels: Record<string, number> = {};

          const boundingBox = getPolygonsBounds(simplifiedCoordinates);

          // console.log(coordinates, simplifiedCoordinates, boundingBox);

          for (let zoom = 0; zoom <= MAX_ZOOM_LEVEL; zoom++) {
            const mortonNumbers = getTileMortonNumbers(
              boundingBox.topLeft,
              boundingBox.bottomRight,
              zoom,
            );
            if (mortonNumbers.length === 0) {
              mortonNumbersByZoomLevels[`z${zoom}`] =
                SpecialMortonNumbers.NOT_CONTAINED;
            } else if (mortonNumbers.length === 1) {
              if (mortonNumbers[0].length === 1) {
                mortonNumbersByZoomLevels[`z${zoom}`] = mortonNumbers[0][0];
              } else if (mortonNumbers[0].length >= 2) {
                mortonNumbersByZoomLevels[`z${zoom}`] =
                  mortonNumbersByZoomLevels[`z${zoom - 1}`];
              } else {
                throw new Error();
              }
            } else if (mortonNumbers.length === 2) {
              if (mortonNumbers[1].length === 1) {
                mortonNumbersByZoomLevels[`z${zoom}_`] = mortonNumbers[1][0];
              } else if (mortonNumbers[1].length >= 2) {
                mortonNumbersByZoomLevels[`z${zoom}_`] =
                  mortonNumbersByZoomLevels[`z${zoom - 1}_`];
              }
            } else {
              throw new Error(
                'mortonNumber.length > 2 :' + mortonNumbers.join(' ,'),
              );
            }
          }

          const binaryFeatures = geojsonToBinary(features, {
            PositionDataType: Float32Array,
            fixRingWinding: true,
          });

          const region: GeoJsonEntity = {
            country: COUNTRY,
            gid_0: GID_0,
            binaryFeatures,
            ...mortonNumbersByZoomLevels,
          } as unknown as GeoJsonEntity;

          if (
            features.some(
              (feature: { coordinates: number[] }) =>
                feature.coordinates?.length > 0,
            ) &&
            region.country
          ) {
            if (NAME_1) {
              if (NAME_2) {
                regions2.push({
                  ...region,
                  name_1: NAME_1,
                  gid_1: GID_1,
                  name_2: NAME_2,
                  gid_2: GID_2,
                  name: region.name_2,
                });
              } else {
                regions1.push({
                  ...region,
                  name_1: NAME_1,
                  gid_1: GID_1,
                  name: region.name_1,
                });
              }
            } else {
              countries.push({ ...region, name: region.country });
            }

            progressCallback &&
              progressCallback({
                type: FileLoaderResponseType.progress,
                progress: (featureIndex / features.length) * 100,
                index: featureIndex,
                total,
                unit: 'items',
                fileName,
                fileSize: fileSize || -1,
              });

            /*
            console.log(
              'loading:',
              countries.length,
              regions1.length,
              regions2.length,
            );
             */

            if (countries.length === bufferSize) {
              bulkAdd<GeoJsonEntity>(db.gadm0, countries, fileName);
              countries = [];
            }
            if (regions1.length === bufferSize) {
              bulkAdd<GeoJsonEntity>(db.gadm1, regions1, fileName);
              regions1 = [];
            }
            if (regions2.length === bufferSize) {
              bulkAdd<GeoJsonEntity>(db.gadm2, regions2, fileName);
              regions2 = [];
            }
          }
        });

        if (countries.length > 0) {
          bulkAdd<GeoJsonEntity>(db.gadm0, countries, fileName);
        }
        if (regions1.length > 0) {
          bulkAdd<GeoJsonEntity>(db.gadm1, regions1, fileName);
        }
        if (regions2.length > 0) {
          bulkAdd<GeoJsonEntity>(db.gadm2, regions2, fileName);
        }

        progressCallback &&
          progressCallback({
            type: FileLoaderResponseType.progress,
            fileName,
            fileSize,
            progress: 100,
            total,
            index: total,
            unit: 'items_end',
          });

        finishedCallback && finishedCallback(fileName);
      });
  };

  try {
    await processJSONReader(stream.pipeThrough(parser));
  } catch (error) {
    console.error(error);
    errorCallback && errorCallback(fileName, (error as DexieError).message);
    return;
  }
};
