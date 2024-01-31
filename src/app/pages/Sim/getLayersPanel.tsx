import { GridItemTypes } from '../../models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getLayersPanel({ shown = true }): FloatingPanelItem {
  return {
    layout: {
      i: 'Layers',
      x: 22,
      y: 10,
      w: 10,
      h: 8,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'Layers',
      type: GridItemTypes.FloatingPanel,
      title: 'Layers',
      icon: <Layers />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown,
      bindToButtonId: 'LayersButton',
    },
  };
}
