import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';

export function createInputOutputButton(): GridItem {
  return {
    layout: {
      i: 'InputOutputButton',
      x: 0,
      y: 1,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'InputOutputButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'InputOutput',
      tooltip: 'Open Input/Output Panel',
      icon: <FolderOpen />,
      shown: true,
      enabled: false,
    },
  };
}
