import { GridItemType } from '../../models/GridItemType';
import { GridOn } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getMatricesButton(): FloatingButtonItem {
  return {
    layout: {
      i: 'MatricesButton',
      x: 0,
      y: 5,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'MatricesButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'Matrices',
      tooltip: 'Open Matrices Panel',
      icon: <GridOn />,
      shown: true,
      enabled: false,
    },
  };
}
