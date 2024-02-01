import { GridItemTypes } from '../../../models/GridItemType';

import { FloatingPanelItem } from '../../../models/FloatingPanelItem';
import { LayoutDefault } from '../LayoutDefault';

export function BackgroundPanel(prop?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'BackgroundPanel',
      x: prop?.x ?? 0,
      y: prop?.y ?? 0,
      w: prop?.w ?? 1,
      h: prop?.h ?? 1,
      resizeHandles: [],
      static: true,
    },
    resource: {
      id: 'BackgroundPanel',
      type: GridItemTypes.BackgroundPanel,
      shown: true,
    },
  };
}
