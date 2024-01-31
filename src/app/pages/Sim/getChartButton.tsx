import { GridItemTypes } from '../../models/GridItemType';
import { BarChart } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getChartButton(): FloatingButtonItem {
  return {
    layout: {
      i: 'ChartButton',
      x: 0,
      y: 6,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'ChartButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'Chart',
      tooltip: 'Open Chart Panel',
      icon: <BarChart />,
      shown: true,
      enabled: false,
    },
  };
}
