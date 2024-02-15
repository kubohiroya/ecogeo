import { AttributeItem } from '~/app/components/SessionPanel/MapPanel/deckgl/AttributeItem';

export type ScatterplotData = {
  length: number;
  attributes: {
    getPosition: AttributeItem;
    getRadius: AttributeItem;
    getStrokeWidth: AttributeItem;
    getStrokeColor: AttributeItem;
    getFillColor: AttributeItem;
  };
};
