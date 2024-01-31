import { GridItemType } from '../../models/GridItemType';
import React from 'react';
import { ROW_HEIGHT } from './SimDesktopComponent';
import { Redo } from '@mui/icons-material';

import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getRedoButton({
  height,
  enabled,
  onClick,
}: {
  height: number;
  enabled: boolean;
  onClick: () => void;
}): FloatingButtonItem {
  return {
    layout: {
      i: 'RedoButton',
      x: 0,
      y: Math.floor(height / ROW_HEIGHT) - 9,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'RedoButton',
      type: GridItemType.FloatingButton,
      tooltip: 'redo',
      icon: <Redo />,
      shown: true,
      enabled,
      onClick,
    },
  };
}
