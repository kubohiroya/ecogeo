import { GeoPointEntity } from "~/app/models/geo/GeoPointEntity";
import { GeoRouteSegmentEntity } from "~/app/models/geo/GeoRouteSegmentEntity";
import { GeoRegionEntity } from "~/app/models/geo/GeoRegionEntity";
import { GeoDatabase } from "~/app/services/database/GeoDatabase";
import { GeoDatabaseTableTypes } from "~/app/models/GeoDatabaseTableType";
import { CircleSource, convertCirclesToBuffer } from "~/app/worker/convertCirclesToBuffer";
import { convertLinesToBuffer, LineSource } from "~/app/worker/convertLinesToBuffer";
import { Color } from "@deck.gl/core/typed";
import { convertPolygonsToBuffer, PolygonSource } from "~/app/worker/convertPolygonsToBuffer";
import { createIDtoPoint2DMap } from "~/app/worker/createIDtoPoint2DMap";
import { GeoResponseTransferable } from "~/app/worker/GeoResponseTransferable";

export async function convertMortonNumbersToTransferables(
  uuidArray: string[],
  mortonNumbers: number[][][],
  zoom: number,
): Promise<GeoResponseTransferable> {
  const points: GeoPointEntity[][] = [];
  const routeSegments: GeoRouteSegmentEntity[][] = [];
  const regions: GeoRegionEntity[][] = [];

  await Promise.all(
    uuidArray.map(async (uuid: string) => {
      const db: GeoDatabase = await GeoDatabase.openWithUUID(
        GeoDatabaseTableTypes.resources,
        uuid,
      );

      points.push(await db.findAllGeoPoints(mortonNumbers, zoom));
      routeSegments.push(await db.findAllGeoLineStrings(mortonNumbers, zoom));
      regions.push(await db.findAllGeoRegions(mortonNumbers, zoom));
    }),
  );
  const circlesData = points.flat(1).map(
    (p) =>
      ({
        id: p.name,
        centerPosition: [p.lng, p.lat],
        radius: 10,
        strokeWidth: 1,
        strokeColor: [255, 0, 0, 255] as Color,
        fillColor: [255, 0, 0, 15] as Color,
      }) as CircleSource,
  );

  const idToPoint2DMap = createIDtoPoint2DMap(circlesData);

  const flattedLines = routeSegments.flat(1);
  const linesData = flattedLines.map(
    (l) =>
      ({
        sourcePositionIDRef: l.sourceIdRef!,
        targetPositionIDRef: l.targetIdRef!,
        strokeWidth: 1,
        strokeColor: [0, 0, 255, 255] as Color,
      }) as LineSource,
  );

  const circlesBuffer = convertCirclesToBuffer(circlesData);
  const { buffer: linesBuffer, indices: lineIndices } = convertLinesToBuffer(
    linesData,
    idToPoint2DMap,
  );

  const regionsData: PolygonSource[] = regions.flat(1).map((region) => ({
    strokeWidth: region.gid_2 ? 1 : region.gid_1 ? 2 : region.gid_0 ? 3 : 0,
    strokeColor: [0, 255, 0, 255] as Color,
    fillColor: [0, 255, 0, 15] as Color,
    coordinates: region.coordinates,
  }));

  const {
    positions,
    polygonMetadata,
    polygonIndices,
    pathIndices,
    positionIndices,
  } = convertPolygonsToBuffer(regionsData);

  return [
    circlesBuffer,
    linesBuffer,
    lineIndices,
    positions,
    polygonMetadata,
    polygonIndices,
    pathIndices,
    positionIndices,
  ];
}
