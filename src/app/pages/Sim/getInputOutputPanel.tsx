import { GridItemTypes } from '../../models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingPanelItem } from '../../models/FloatingPanelItem';

type InputOutputPanelProps = {
  shown?: boolean;
};

export function getInputOutputPanel({
  shown,
}: InputOutputPanelProps): FloatingPanelItem {
  return {
    layout: {
      i: 'InputOutput',
      x: 1,
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
      id: 'InputOutput',
      type: GridItemTypes.FloatingPanel,
      title: 'Input/Output',
      icon: <FolderOpen />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: shown || false,
      bindToButtonId: 'InputOutputButton',
    },
  };
}
