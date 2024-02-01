import { GridItemTypes } from '../../../models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from '../SimDesktopComponent';
import { FloatingPanelItem } from '../../../models/FloatingPanelItem';
import { LayoutDefault } from '../LayoutDefault';

export function LayersPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'LayersPanel',
      x: 22,
      y: props?.y ?? 7,
      w: 10,
      h: 8,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'LayersPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Layers',
      icon: <Layers />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: props?.shown ?? true,
      bindToButtonId: 'LayersButton',
    },
  };
}
