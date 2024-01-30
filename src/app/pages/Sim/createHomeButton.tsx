import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Home } from '@mui/icons-material';
import React from 'react';

export function createHomeButton(): GridItem {
  return {
    layout: {
      i: 'HomeButton',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'HomeButton',
      type: GridItemType.FloatingButton,
      tooltip: 'Home',
      icon: <Home />,
      navigateTo: '/',
      shown: true,
      enabled: true,
    },
  };
}
