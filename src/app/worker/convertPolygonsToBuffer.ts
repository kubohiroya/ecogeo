import { Color } from "@deck.gl/core/typed";

export type PolygonSource = {
  strokeWidth: number; // 4
  strokeColor: Color; // 4
  fillColor: Color; // 4
  coordinates: number[][][][]; // 64 * numVertices
};

export type PolygonBuffer = {
  positions: ArrayBuffer;
  polygonMetadata: ArrayBuffer;

  polygonIndices: ArrayBuffer;
  pathIndices: ArrayBuffer;
  positionIndices: ArrayBuffer;
};

export const vertexItemSize = 4 * 2; // Float32 x 2
export const indexItemSize = 4; // Uint32 x 1
export const polygonMetadataItemSize = 4 + 4 + 4; // Float32 x 1 + Uint8 x 4 + Uint8 x 4

export function convertPolygonsToBuffer(
  sources: PolygonSource[], // geojson: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>,
): PolygonBuffer {
  let totalPositions = 0;
  let totalPaths = 0;

  sources.forEach((feature) => {
    feature.coordinates.forEach((polygon, polygonIndex) => {
      polygon.forEach((path) => {
        totalPositions += path.length;
        totalPaths++;
      });
    });
  });

  const positions: ArrayBuffer = new ArrayBuffer(
    totalPositions * vertexItemSize,
  );

  const polygonIndices: ArrayBuffer = new ArrayBuffer(
    sources.length * indexItemSize,
  ); // Uint32 x 1
  const pathIndices: ArrayBuffer = new ArrayBuffer(totalPaths * indexItemSize); // Uint32 x 1
  const positionIndices: ArrayBuffer = new ArrayBuffer(
    totalPositions * indexItemSize,
  ); // Uint32 x 1
  const polygonMetadata: ArrayBuffer = new ArrayBuffer(
    sources.length * polygonMetadataItemSize,
  ); // Float32 x 1 + Uint8 x 4 + Uint8 x 4

  const polygonIndicesView = new Uint32Array(polygonIndices);
  const pathIndicesView = new Uint32Array(pathIndices);
  const positionIndicesView = new Uint32Array(positionIndices);
  const positionsView = new Float32Array(positions);
  const polygonMetadataView = new DataView(polygonMetadata);

  let pathIndex = 0;
  let positionIndex = 0;

  sources.forEach((source, sourceIndex: number) => {
    source.coordinates.forEach((polygon) => {
      polygonIndicesView[sourceIndex] = positionIndex / 2;
      polygon.forEach((ring, ringIndex) => {
        pathIndicesView[pathIndex++] = positionIndex / 2;
        ring.forEach(([x, y]) => {
          positionIndicesView[positionIndex] = positionIndex / 2;
          positionsView[positionIndex++] = x;
          positionsView[positionIndex++] = y;
        });
      });
    });

    let baseIndex = sourceIndex * 12;
    polygonMetadataView.setFloat32((baseIndex += 4), source.strokeWidth, true);
    polygonMetadataView.setUint8(baseIndex++, source.strokeColor[0]);
    polygonMetadataView.setUint8(baseIndex++, source.strokeColor[1]);
    polygonMetadataView.setUint8(baseIndex++, source.strokeColor[2]);
    polygonMetadataView.setUint8(baseIndex++, source.strokeColor[3] ?? 255);
    polygonMetadataView.setUint8(baseIndex++, source.fillColor[0]);
    polygonMetadataView.setUint8(baseIndex++, source.fillColor[1]);
    polygonMetadataView.setUint8(baseIndex++, source.fillColor[2]);
    polygonMetadataView.setUint8(baseIndex++, source.fillColor[3] ?? 255);
  });

  return {
    positions,
    polygonIndices,
    pathIndices,
    positionIndices,
    polygonMetadata,
  };
}
