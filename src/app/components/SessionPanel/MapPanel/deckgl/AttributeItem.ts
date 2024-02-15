import { Buffer } from "@luma.gl/webgl";

export type AttributeItem = {
  //value: Buffer;
  buffer: Buffer;
  type: number;
  size: number;
  offset: number;
  startIndices?: Uint32Array;
  stride?: number;
};
