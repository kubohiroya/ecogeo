import { PolygonLayerProps, SolidPolygonLayer } from '@deck.gl/layers/typed';

export function createPolygonsLayer(
  gl: WebGLRenderingContext,
  positions: ArrayBuffer,
  polygonIndices: ArrayBuffer,
  pathIndices: ArrayBuffer,
  lineWidths: ArrayBuffer,
  lineColors: ArrayBuffer,
  fillColors: ArrayBuffer,
): SolidPolygonLayer {
  const positionsArray = new Float32Array(positions);
  const polygonIndicesArray = new Uint32Array(polygonIndices);
  const pathIndicesArray = new Uint32Array(pathIndices);
  const lineWidthsArray = new Float32Array(lineWidths);
  const lineColorsArray = new Uint32Array(lineColors);
  const fillColorsArray = new Uint32Array(fillColors);

  console.log({ positionsArray, polygonIndicesArray, fillColorsArray });

  return new SolidPolygonLayer<PolygonLayerProps>({
    id: 'polygon-layer',
    positionFormat: 'XY',
    _normalize: true, // TODO: false,
    getFillColor: (object, { index, data, target }) => {
      const color = fillColorsArray[index];
      return [
        color & 0xff,
        (color >> 8) & 0xff,
        (color >> 16) & 0xff,
        (color >> 24) & 0xff,
      ];
    },
    data: {
      length: polygonIndicesArray.length,
      startIndices: polygonIndicesArray,
      attributes: {
        getPolygon: { value: positionsArray, size: 2 }, //{ buffer: positionsBuffer, size: 2, type: GL.FLOAT },
      },
    } as any,
  });
}
