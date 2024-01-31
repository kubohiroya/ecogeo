import { GridItemType } from '../../models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from './SimDesktopComponent';

import { FloatingPanelItem } from '../../models/FloatingPanelItem';

export function getEditPanel({
  height,
  shown,
}: {
  height: number;
  shown?: boolean;
}): FloatingPanelItem {
  return {
    layout: {
      i: 'Edit',
      x: 1,
      y: Math.floor(height / ROW_HEIGHT - 7),
      w: 7,
      h: 3,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'Edit',
      type: GridItemType.FloatingPanel,
      title: 'Editor Panel',
      icon: <Edit />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: shown || false,
      bindToButtonId: 'EditButton',
    },
  };
}
