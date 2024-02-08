import { GridItemTypes } from 'src/app/models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from 'src/app/models/FloatingButtonItem';
import { LayoutDefault } from 'src/app/pages/Sim/LayoutDefault';

export function InputOutputButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'InputOutputButton',
      x: 0,
      y: props?.y ?? 1,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'InputOutputButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'InputOutputPanel',
      tooltip: 'Open Input/Output Panel',
      icon: <FolderOpen />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
