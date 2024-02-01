import { GridItemTypes } from '../../../models/GridItemType';
import { GridOn } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from '../SimDesktopComponent';
import { FloatingPanelItem } from '../../../models/FloatingPanelItem';
import { LayoutDefault } from '../LayoutDefault';

export function MatricesPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'MatricesPanel',
      x: 10,
      y: props?.y ?? 5,
      w: 23,
      h: 9,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'MatricesPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Matrices',
      icon: <GridOn />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'MatricesButton',
    },
  };
}
