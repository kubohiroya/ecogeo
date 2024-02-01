import { GridItemTypes } from '../../../models/GridItemType';
import { BarChart } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../../models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function ChartButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ChartButton',
      x: props?.x ?? 0,
      y: props?.y ?? 6,
      w: props?.w ?? 1,
      h: props?.h ?? 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'ChartButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'ChartPanel',
      tooltip: 'Open Chart Panel',
      icon: <BarChart />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
