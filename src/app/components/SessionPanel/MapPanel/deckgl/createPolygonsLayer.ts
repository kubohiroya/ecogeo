import { PolygonLayer, PolygonLayerProps } from "@deck.gl/layers/typed";
import GL from "@luma.gl/constants";
import { Buffer } from "@luma.gl/webgl";

export function createPolygonsLayer(
  gl: WebGLRenderingContext,
  positions: ArrayBuffer,
  polygonMetadata: ArrayBuffer,
  polygonIndices: ArrayBuffer,
  pathIndices: ArrayBuffer,
  positionIndices: ArrayBuffer,
): PolygonLayer {
  console.log(positions, polygonIndices, pathIndices, polygonMetadata);
  const positionsBuffer = new Buffer(gl, positions);
  const polygonMetadataBuffer = new Buffer(gl, polygonMetadata);
  const pathIndicesBuffer = new Buffer(gl, pathIndices);
  const polygonIndicesBuffer = new Buffer(gl, polygonIndices);
  const positionIndicesBuffer = new Buffer(gl, positionIndices);

  const length = pathIndices.byteLength / 4;
  console.log(length);

  return new PolygonLayer<PolygonLayerProps>({
    id: 'polygon-layer',
    positionFormat: 'XY',
    //length,
    _normalize: false,
    //startIndices: polygonIndicesBuffer,
    data: {
      length,
      attributes: {
        startIndices: polygonIndicesBuffer,
        getPolygon: { buffer: positionsBuffer, size: 2, type: GL.FLOAT },
        /*
        getLineWidth: {
          buffer: polygonMetadataBuffer,
          type: GL.FLOAT,
          size: 1,
          offset: 0,
          stride: 12,
        },
        getLineColor: {
          buffer: polygonMetadataBuffer,
          type: GL.UNSIGNED_BYTE,
          size: 4,
          offset: 4,
          stride: 12,
        },
        getFillColor: {
          buffer: polygonMetadataBuffer,
          type: GL.UNSIGNED_BYTE,
          size: 4,
          offset: 8,
          stride: 12,
        },
        gtPolygon: {
          value: positionsBuffer,
          size: 2,
          type: GL.FLOAT,
          normalized: true,
          //instanceDivisor: 1,
        },
         */
      },
    },
  });
}
