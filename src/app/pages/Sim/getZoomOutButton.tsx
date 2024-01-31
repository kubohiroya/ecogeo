import { GridItemTypes } from '../../models/GridItemType';
import { ZoomOut } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getZoomOutButton({
  height,
  onClick,
}: {
  height: number;
  onClick: () => void;
}): FloatingButtonItem {
  return {
    layout: {
      i: 'ZoomOutButton',
      x: 0,
      y: Math.floor(height / ROW_HEIGHT - 6),
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'ZoomOutButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'zoom out',
      icon: <ZoomOut />,
      shown: true,
      enabled: true,
      onClick,
    },
  };
}
