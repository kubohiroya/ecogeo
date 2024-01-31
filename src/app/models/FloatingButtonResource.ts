import { FloatingItemResource } from './FloatingItemResource';

export type FloatingButtonResource = {
  enabled: boolean;
  bindToPanelId?: string;
  navigateTo?: string;
  onClick?: () => void;
} & FloatingItemResource;
