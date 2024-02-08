import { GridItemTypes } from 'src/app/models/GridItemType';
import { History } from '@mui/icons-material';
import React from 'react';
import {
  RESIZE_HANDLES,
  ROW_HEIGHT,
} from 'src/app/pages/Sim/SimDesktopComponent';
import { FloatingPanelItem } from 'src/app/models/FloatingPanelItem';
import { LayoutDefault } from '../LayoutDefault';

export function TimeMachinePanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'TimeMachinePanel',
      x: props?.x ?? 1,
      y: props?.y ?? 20,
      w: props?.w ?? 12,
      h: props?.h ?? 3,
      minW: 12,
      minH: 3,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'TimeMachinePanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Time Machine',
      icon: <History />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: props?.shown ?? true,
      bindToButtonId: 'TimeMachineButton',
    },
  };
}
