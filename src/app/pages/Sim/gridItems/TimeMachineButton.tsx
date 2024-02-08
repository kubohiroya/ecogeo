import { GridItemTypes } from 'src/app/models/GridItemType';
import { History } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from 'src/app/models/FloatingButtonItem';
import { LayoutDefault } from 'src/app/pages/Sim/LayoutDefault';

export function TimeMachineButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'TimeMachineButton',
      x: props?.x ?? 0,
      y: props?.y ?? 8,
      w: props?.w ?? 1,
      h: props?.h ?? 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'TimeMachineButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'TimeMachinePanel',
      tooltip: 'Open TimeMachine Panel',
      icon: <History />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
    },
  };
}
