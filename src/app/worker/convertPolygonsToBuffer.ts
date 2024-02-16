import { Color } from '@deck.gl/core/typed';

export type PolygonSource = {
  strokeWidth: number; // 4
  strokeColor: Color; // 4
  fillColor: Color; // 4
  coordinates: number[][][][]; // 64 * numVertices
};

export type PolygonBuffer = {
  positions: ArrayBuffer;
  polygonIndices: ArrayBuffer;
  pathIndices: ArrayBuffer;
  lineWidths: ArrayBuffer;
  lineColors: ArrayBuffer;
  fillColors: ArrayBuffer;
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
  const positionsIndices: ArrayBuffer = new ArrayBuffer(totalPositions * 4 * 2); // Float32 x 2

  const lineWidths: ArrayBuffer = new ArrayBuffer(sources.length * 4); // Float32 x 1
  const lineColors: ArrayBuffer = new ArrayBuffer(sources.length * 4); // Uint8 x 4
  const fillColors: ArrayBuffer = new ArrayBuffer(sources.length * 4); // Uint8x 4

  const positionsView = new Float32Array(positions);
  const polygonIndicesView = new Uint32Array(polygonIndices);
  const pathIndicesView = new Uint32Array(pathIndices);
  const lineWidthsView = new Float32Array(lineWidths);
  const lineColorsView = new Uint8Array(lineColors);
  const fillColorsView = new Uint8Array(fillColors);

  let pathIndex = 0;
  let positionIndex = 0;

  sources.forEach((source, sourceIndex: number) => {
    polygonIndicesView[sourceIndex] = positionIndex;
    source.coordinates.forEach((polygon) => {
      polygon.forEach((ring, ringIndex) => {
        if (ringIndex == 0) {
          pathIndicesView[pathIndex++] = positionIndex;
          ring.forEach(([x, y]) => {
            positionsView[positionIndex++] = x;
            positionsView[positionIndex++] = y;
          });
        } else {
          console.log('ringIndex=' + ringIndex + ' is not 0, skipping...');
        }
      });
    });

    lineWidthsView[sourceIndex] = source.strokeWidth;
    lineColorsView[sourceIndex * 4 + 0] = source.strokeColor[0];
    lineColorsView[sourceIndex * 4 + 1] = source.strokeColor[1];
    lineColorsView[sourceIndex * 4 + 2] = source.strokeColor[2];
    lineColorsView[sourceIndex * 4 + 3] = source.strokeColor[3] ?? 255;
    fillColorsView[sourceIndex * 4 + 0] = source.fillColor[0];
    fillColorsView[sourceIndex * 4 + 1] = source.fillColor[1];
    fillColorsView[sourceIndex * 4 + 2] = source.fillColor[2];
    fillColorsView[sourceIndex * 4 + 3] = source.fillColor[3] ?? 255;
  });

  return {
    positions,
    polygonIndices,
    pathIndices,
    lineWidths,
    lineColors,
    fillColors,
  };
}
