import { PathLayer } from "@deck.gl/layers/typed";
import { Buffer } from "@luma.gl/webgl";
import GL from "@luma.gl/constants";

export function createPathLayer(
  gl: WebGLRenderingContext,
  linesBuffer: ArrayBuffer,
  startIndices: ArrayBuffer,
): PathLayer {
  const buffer = new Buffer(gl, linesBuffer);

  const getPath = {
    buffer,
    type: GL.FLOAT,
    size: 3,
    offset: 0,
    stride: 24,
  };

  const getLineWidth = {
    buffer,
    type: GL.FLOAT,
    size: 1,
    offset: 16,
    stride: 24,
  };

  const getLineColor = {
    buffer,
    type: GL.UNSIGNED_BYTE,
    size: 4,
    offset: 20,
    stride: 24,
  };

  return new PathLayer({
    id: 'path-layer',
    positionFormat: `XY`,
    data: {
      length: startIndices.byteLength / 4,
      startIndices: new Uint32Array(startIndices),
      attributes: {
        getPath,
        getLineWidth,
        getLineColor,
      },
    },
    pickable: true,
    autoHighlight: true,
    _pathType: 'open',
  });
}
