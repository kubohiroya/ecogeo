import { GridItemTypes } from 'src/app/models/GridItemType';
import { GridOn } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from 'src/app/models/FloatingButtonItem';
import { LayoutDefault } from 'src/app/pages/Sim/LayoutDefault';

export function MatricesButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'MatricesButton',
      x: 0,
      y: props?.y ?? 5,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'MatricesButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'MatricesPanel',
      tooltip: 'Open Matrices Panel',
      icon: <GridOn />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
