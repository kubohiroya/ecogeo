import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Timer } from '@mui/icons-material';
import React from 'react';

export function createTimeControlButton(): GridItem {
  return {
    layout: {
      i: 'TimerControlButton',
      x: 0,
      y: 4,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'TimerControlButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'TimerControl',
      tooltip: 'Open TimerControl Panel',
      icon: <Timer />,
      shown: true,
      enabled: false,
    },
  };
}
