import * as uuid from 'uuid';
import { GeoPointEntity } from '../../models/geo/GeoPointEntity';
import { GeoPointTypes } from '../../models/geo/GeoPointType';
import { GeoRouteSegmentEntity } from '../../models/geo/GeoRouteSegmentEntity';
import { GeoRouteSegmentModes } from '../../models/geo/GeoRouteSegmentMode';
import { FileLoaderHandler } from './FileLoaderHandler';
import {
  getTileMortonNumbers,
  globalPixelToTileXYZ,
  latLngToGlobalPixel,
  MAX_ZOOM_LEVEL,
  SpecialMortonNumbers,
  tileXYZToMorton,
} from '../../utils/mortonNumberUtil';
import { FileLoaderResponseType } from './FileLoaderResponseType';
import { LoaderProgressResponse } from './FileLoaderResponse';
import { GeoDatabase } from '../database/GeoDatabase';

export const loadCsvFile = async <T>({
  db,
  stream,
  fileName,
  fileSize,
  csvLoaders,
  startedCallback,
  progressCallback,
  errorCallback,
  cancelCallback,
  finishedCallback,
}: {
  db: GeoDatabase;
  stream: ReadableStream;
  fileName: string;
  fileSize: number;
  csvLoaders: CsvLoaders;
  startedCallback: (fileName: string, dbName: string) => void;
  progressCallback: (value: LoaderProgressResponse) => void;
  errorCallback: (fileName: string, message: string) => void;
  cancelCallback: (fileName: string) => void;
  finishedCallback: (fileName: string) => void;
}): Promise<void> => {
  let entityItemBuffer: T[] = [];
  const itemBufferLengthMax = 64;
  let itemBufferLength = 0;

  startedCallback(fileName, db.name);

  let chunkText = '';
  let selectedLoader = null;

  let lineNumber = 0;
  let total = 0;

  const reader = stream.getReader();

  while (true) {
    console.log(fileName, lineNumber);
    const { done, value } = (await reader.read()) as any;
    if (done || !value) {
      break;
    }
    const decoded = new TextDecoder('utf-8').decode(value);
    chunkText += decoded;
    // CSVデータのチャンク処理
    const lines = chunkText.split(/[\r\n]+/);
    total += lines.length;
    if (chunkText.endsWith('\n')) {
      chunkText = '';
    } else {
      chunkText = lines.pop() || '';
    }
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      lineNumber++;
      const line = lines[lineIndex];
      if (itemBufferLength === 0 && lineIndex === 0) {
        const [, loader] = Object.entries(csvLoaders).find(([key, loader]) => {
          if (loader.check(line)) {
            return true;
          }
        }) || [null, null];
        if (loader == null) {
          throw new Error('loader not found:' + line);
        }
        selectedLoader = loader;
        continue;
      }
      if (selectedLoader == null) {
        throw new Error('loader not selected');
      }
      const entity = (await selectedLoader.createEntity(db, line)) as T | null;
      // if (!entity) return;
      // console.log(entity);
      if (entity) {
        entityItemBuffer.push(entity);
        itemBufferLength++;
        if (entityItemBuffer.length === itemBufferLengthMax) {
          // console.log('bulkAdd', await db.cities.count());
          await selectedLoader.bulkAddEntity(db, entityItemBuffer as any[]);
          entityItemBuffer = [];
        }
      }

      progressCallback({
        type: FileLoaderResponseType.progress,
        fileName,
        fileSize,
        progress: Math.round((lineNumber / total) * 100),
        index: lineNumber,
        total,
        unit: 'lines',
      });
    }
  }
  if (selectedLoader == null) {
    throw new Error('loader not selected');
  }
  if (entityItemBuffer.length > 0) {
    await selectedLoader.bulkAddEntity(db, entityItemBuffer as any[]);
  }
  finishedCallback(fileName);
};

export enum CsvFileTypes {
  cities,
  routes,
}

export const getCityType = (name: string, centroid: boolean) => {
  const capitalCityWords = name.split(/[.\s]/);
  return capitalCityWords[0] === 'Stn'
    ? GeoPointTypes.RailwayStation
    : capitalCityWords[0] === 'Port'
      ? GeoPointTypes.Seaport
      : capitalCityWords[0] === 'Airport'
        ? GeoPointTypes.Airport
        : centroid
          ? GeoPointTypes.RegionCentroid
          : GeoPointTypes.RoadWaypoint;
};

export const getRouteSegmentMode = (mode: string) => {
  if (mode === '0') {
    return GeoRouteSegmentModes.Road;
  } else if (mode === '1') {
    return GeoRouteSegmentModes.Seaway;
  } else if (mode === '2') {
    return GeoRouteSegmentModes.Airway;
  } else if (mode === '3') {
    return GeoRouteSegmentModes.Railway;
  } else if (mode === '4') {
    return GeoRouteSegmentModes.HighSpeedRailway;
  } else {
    throw new Error();
  }
};

export const GeoCsvLoaders: CsvLoaders = {
  [CsvFileTypes.cities]: {
    check: (headerLine: string): boolean => {
      return (
        headerLine ===
          'CapitalCity,Latitude,Longitude,Region,Country,Habitable,Population,Employment,EmplyomentA,EmploymentM1,EmploymentM2,EmploymentM3,EmploymentM4,EmploymentM5,EmploymentS,EmploymentA2,GDP,GDPA,GDPM1,GDPM2,GDPM3,GDPM4,GDPM5,GDPS,GDPA2,Area,Mining,Grate,Plimit' ||
        headerLine ===
          'CapitalCity,Latitude,Longitude,Region,Country,Habitable,Population,Employment,EmploymentA,EmploymentM1,EmploymentM2,EmploymentM3,EmploymentM4,EmploymentM5,EmploymentS,EmploymentA2,GDP,GDPA,GDPM1,GDPM2,GDPM3,GDPM4,GDPM5,GDPS,GDPA2,Area,Mining,Grate,Plimit'
      );
    },
    createEntity: async (db: GeoDatabase, line: string) => {
      const [name, latitude, longitude, region, country, centroid, ...rest] =
        line.split(',');

      if (name === '') return null;

      const coordinate: [number, number] = [
        parseFloat(latitude),
        parseFloat(longitude),
      ];

      const mortonNumbersByZoomLevels: Record<string, number> = {};
      for (let zoom = 0; zoom <= MAX_ZOOM_LEVEL; zoom++) {
        mortonNumbersByZoomLevels[`z${zoom}`] = tileXYZToMorton(
          globalPixelToTileXYZ(
            latLngToGlobalPixel(
              {
                lat: coordinate[0],
                lng: coordinate[1],
              },
              zoom,
            ),
            zoom,
          ),
        );
      }

      const _centroid = centroid === '1';
      const type = getCityType(name, _centroid);
      const entity = {
        uuid: uuid.v4(),
        lat: coordinate[0],
        lng: coordinate[1],
        country,
        name_1: region,
        name_2: '',
        name,
        type,
        ...mortonNumbersByZoomLevels,
      } as unknown as GeoPointEntity;
      console.log(entity);
      return entity;
    },
    bulkAddEntity: async (
      db: GeoDatabase,
      entityItemBuffer: GeoPointEntity[],
    ): Promise<void> => {
      await db.points.bulkAdd(entityItemBuffer);
    },
  },
  [CsvFileTypes.routes]: {
    check: (headerLine: string): boolean => {
      return (
        headerLine ===
          'Start,End,Name,Distance,Speed,Border,Orverhead,Loading,Mode,Quality,Oneway,Freight,Country1,Region1,Country2,Region2' ||
        headerLine ===
          'Start,End,Name,Distance,Speed,Border,Overhead,Loading,Mode,Quality,Oneway,Freight,Country1,Region1,Country2,Region2'
      );
    },
    createEntity: async (db: GeoDatabase, line: string) => {
      // FIXME
      const [
        start,
        end,
        name,
        distance,
        speed,
        border,
        overhead,
        loading,
        mode,
        quality,
        oneway,
        freight,
        country1,
        region1,
        country2,
        region2,
      ] = line.split(',');

      const startCity = await db.points.where('name').equals(start).last();
      const endCity = await db.points.where('name').equals(end).last();
      if (!startCity || !endCity) {
        throw new Error();
      }

      const [north, south] =
        startCity.lat > endCity.lat
          ? [startCity.lat, endCity.lat]
          : [endCity.lat, startCity.lat];
      const [east, west] =
        startCity.lng > endCity.lng
          ? [startCity.lng, endCity.lng]
          : [endCity.lng, startCity.lng];

      const mortonNumbersByZoomLevels: Record<string, number> = {};

      for (let zoom = 0; zoom <= MAX_ZOOM_LEVEL; zoom++) {
        const mortonNumbers = getTileMortonNumbers(
          { lat: north, lng: east },
          { lat: south, lng: west },
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

      const source: GeoRouteSegmentEntity = {
        uuid: uuid.v4(),
        sourceName: startCity.name,
        sourceIdRef: startCity.uuid,
        sourceCountry: country1,
        sourceName1: region1,
        sourceName2: '',
        targetName: endCity.name,
        targetIdRef: endCity.uuid,
        targetCountry: country2,
        targetName1: region2,
        targetName2: '',
        name,
        mode: getRouteSegmentMode(mode),
        ...mortonNumbersByZoomLevels,
      } as unknown as GeoRouteSegmentEntity;
      return source;
    },
    bulkAddEntity: async (
      db: GeoDatabase,
      entityItemBuffer: GeoRouteSegmentEntity[],
    ): Promise<void> => {
      await db.routeSegments.bulkAdd(entityItemBuffer);
    },
  },
};
export type CsvLoaders = Record<
  CsvFileTypes,
  FileLoaderHandler<GeoPointEntity> | FileLoaderHandler<GeoRouteSegmentEntity>
>;
