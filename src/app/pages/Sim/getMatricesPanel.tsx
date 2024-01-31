import { GridItemTypes } from '../../models/GridItemType';
import { GridOn } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getMatricesPanel({
  height,
}: {
  height: number;
}): FloatingPanelItem {
  return {
    layout: {
      i: 'Matrices',
      x: 10,
      y: Math.floor(height / ROW_HEIGHT - 13),
      w: 23,
      h: 9,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'Matrices',
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
