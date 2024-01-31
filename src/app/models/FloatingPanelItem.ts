import { FloatingPanelResource } from './FloatingPanelResource';
import { FloatingItem } from './FloatingItem';

export type FloatingPanelItem = {
  resource: FloatingPanelResource;
} & FloatingItem;
