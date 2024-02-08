import { GridItemTypes } from 'src/app/models/GridItemType';
import React from 'react';
import { Redo } from '@mui/icons-material';

import { FloatingButtonItem } from 'src/app/models/FloatingButtonItem';
import { LayoutDefault } from 'src/app/pages/Sim/LayoutDefault';

export function RedoButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'RedoButton',
      x: 0,
      y: props?.y ?? 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'RedoButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'redo',
      icon: <Redo />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
      x: props?.x,
      y: props?.y,
    },
  };
}
