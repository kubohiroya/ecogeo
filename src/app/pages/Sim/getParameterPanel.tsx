import { GridItemType } from '../../models/GridItemType';
import { Tune } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getParameterPanel(): FloatingPanelItem {
  return {
    layout: {
      i: 'Parameters',
      x: 1,
      y: 0,
      w: 9,
      h: 9,
      minW: 9,
      minH: 9,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'Parameters',
      type: GridItemType.FloatingPanel,
      title: 'Parameters',
      icon: <Tune />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'ParametersButton',
    },
  };
}
