import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';

export function createEditButton(): GridItem {
  return {
    layout: {
      i: 'EditButton',
      x: 0,
      y: 2,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'EditButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'Edit',
      tooltip: 'Open Edit Panel',
      icon: <Edit />,
      shown: true,
      enabled: false,
    },
  };
}
