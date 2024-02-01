import { GridItemTypes } from '../../../models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from '../SimDesktopComponent';
import { FloatingPanelItem } from '../../../models/FloatingPanelItem';
import { LayoutDefault } from '../LayoutDefault';

export function InputOutputPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'InputOutputPanel',
      x: props?.x ?? 0,
      y: props?.y ?? 0,
      w: props?.w ?? 8,
      h: props?.h ?? 3,
      minW: 5,
      minH: 3,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'InputOutputPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Input/Output',
      icon: <FolderOpen />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: props?.shown,
      bindToButtonId: 'InputOutputButton',
    },
  };
}
