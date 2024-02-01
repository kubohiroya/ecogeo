import { GridItemTypes } from '../../../models/GridItemType';
import { History } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from '../SimDesktopComponent';
import { FloatingPanelItem } from '../../../models/FloatingPanelItem';
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
      minH: 4,
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
