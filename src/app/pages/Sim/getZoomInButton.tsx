import { GridItemTypes } from '../../models/GridItemType';
import { ZoomIn } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getZoomInButton({
  height,
  onClick,
}: {
  height: number;
  onClick: () => void;
}): FloatingButtonItem {
  return {
    layout: {
      i: 'ZoomInButton',
      x: 0,
      y: Math.floor(height / ROW_HEIGHT) - 7,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'ZoomInButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'zoom in',
      icon: <ZoomIn />,
      shown: true,
      enabled: true,
      onClick,
    },
  };
}
