import { BinaryAttribute } from "@deck.gl/core/typed";

export type PolygonData = {
  length: number;
  startIndices: Uint32Array;
  //holeIndices: Uint32Array;
  //polygonVertices: Float32Array;
  //polygonFillColors: Uint8Array;
  //polygonLineColors: Uint8Array;
  //polygonLineWidths: Float32Array;
  attributes: {
    getPolygon: BinaryAttribute;
    getLineWidth: BinaryAttribute;
    getLineColor: BinaryAttribute;
    getFillColor: BinaryAttribute;
  };
  _pathType: 'open';
  //getPolygon: BinaryAttribute;
  //getLineWidth: BinaryAttribute;
  //getLineColor: BinaryAttribute;
  //getFillColor: BinaryAttribute;
};
