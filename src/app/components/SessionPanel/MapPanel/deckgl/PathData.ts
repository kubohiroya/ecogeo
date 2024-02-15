import { AttributeItem } from "~/app/components/SessionPanel/MapPanel/deckgl/AttributeItem";

export type PathData = {
  length: number;
  startIndices: Uint32Array;
  attributes: {
    getPath: AttributeItem;
    getLineWidth: AttributeItem;
    getLineColor: AttributeItem;
  };
};
