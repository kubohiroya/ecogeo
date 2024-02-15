import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { Buffer } from "@luma.gl/webgl";
import GL from "@luma.gl/constants";

export function createScatterplotLayer(
  gl: WebGLRenderingContext,
  circlesBuffer: ArrayBuffer,
  length: number,
) {
  const buffer = new Buffer(gl, circlesBuffer);

  const getPosition = {
    buffer,
    type: GL.FLOAT,
    size: 2,
    offset: 0,
  };
  const getRadius = {
    buffer,
    type: GL.FLOAT,
    size: 1,
    offset: 8,
  };
  const getStrokeWidth = {
    buffer,
    type: GL.FLOAT,
    size: 1,
    offset: 12,
  };

  const getStrokeColor = {
    buffer,
    type: GL.UNSIGNED_BYTE,
    size: 4,
    offset: 16,
  };
  const getFillColor = {
    buffer,
    type: GL.UNSIGNED_BYTE,
    size: 4,
    offset: 20,
  };

  return new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: {
      length,
      attributes: {
        getPosition,
        getRadius,
        getStrokeWidth,
        getStrokeColor,
        getFillColor,
      },
    },
    pickable: true,
    autoHighlight: true,
    _normalize: false,
  });
}
