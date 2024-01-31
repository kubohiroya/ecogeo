import { GridItemTypes } from '../../models/GridItemType';
import { BarChart } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';

import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getChartPanel(): FloatingPanelItem {
  return {
    layout: {
      i: 'Chart',
      x: 22,
      y: 0,
      w: 10,
      h: 10,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'Chart',
      type: GridItemTypes.FloatingPanel,
      title: 'Chart',
      icon: <BarChart />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'ChartButton',
    },
  };
}
