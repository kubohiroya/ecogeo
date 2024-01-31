import { GridItemTypes } from '../../models/GridItemType';

import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getBackground(): FloatingPanelItem {
  return {
    layout: {
      i: 'Background',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      static: true,
    },
    resource: {
      id: 'Background',
      type: GridItemTypes.Background,
      shown: true,
    },
  };
}
