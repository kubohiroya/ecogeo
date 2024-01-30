import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';

export function createLayerButton(): GridItem {
  return {
    layout: {
      i: 'LayersButton',
      x: 0,
      y: 7,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'LayersButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'Layers',
      tooltip: 'Open Layers Panel',
      icon: <Layers />,
      shown: true,
      enabled: false,
    },
  };
}
