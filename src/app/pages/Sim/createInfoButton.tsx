import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Info } from '@mui/icons-material';
import React from 'react';

export function createInfoButton(): GridItem {
  return {
    layout: {
      i: 'InfoButton',
      x: 0,
      y: 8,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'InfoButton',
      type: GridItemType.FloatingButton,
      tooltip: 'Info',
      icon: <Info />,
      bindToPanelId: 'Info',
      shown: true,
      enabled: false,
    },
  };
}
