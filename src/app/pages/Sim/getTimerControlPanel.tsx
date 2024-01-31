import { GridItemTypes } from '../../models/GridItemType';
import { Timer } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getTimerControlPanel(): FloatingPanelItem {
  return {
    layout: {
      i: 'TimerControl',
      x: 1,
      y: 9,
      w: 8,
      h: 4,
      minW: 8,
      minH: 4,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'TimerControl',
      type: GridItemTypes.FloatingPanel,
      title: 'TimerControl',
      icon: <Timer />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'TimerControlButton',
    },
  };
}
