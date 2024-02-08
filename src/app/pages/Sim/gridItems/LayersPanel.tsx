import { GridItemTypes } from 'src/app/models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import {
  RESIZE_HANDLES,
  ROW_HEIGHT,
} from 'src/app/pages/Sim/SimDesktopComponent';
import { FloatingPanelItem } from 'src/app/models/FloatingPanelItem';
import { LayoutDefault } from 'src/app/pages/Sim/LayoutDefault';

export function LayersPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'LayersPanel',
      x: props?.x ?? 22,
      y: props?.y ?? 7,
      w: props?.w ?? 10,
      h: props?.h ?? 8,
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
