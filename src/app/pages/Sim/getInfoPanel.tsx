import { GridItemType } from '../../models/GridItemType';
import { Info } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getInfoPanel(): FloatingPanelItem {
  return {
    layout: {
      i: 'Info',
      x: 10,
      y: 0,
      w: 5,
      h: 3,
      minW: 5,
      minH: 3,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'Info',
      type: GridItemType.FloatingPanel,
      title: 'Information',
      icon: <Info />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      bindToButtonId: 'InfoButton',
      shown: false,
    },
  };
}