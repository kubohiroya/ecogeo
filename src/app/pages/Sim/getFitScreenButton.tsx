import { GridItemTypes } from '../../models/GridItemType';
import { FitScreen } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './SimDesktopComponent';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getFitScreenButton({
  height,
  onClick,
}: {
  height: number;
  onClick: () => void;
}): FloatingButtonItem {
  return {
    layout: {
      i: 'FitScreenButton',
      x: 0,
      y: Math.floor(height / ROW_HEIGHT - 5),
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'FitScreenButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'fit to screen',
      icon: <FitScreen />,
      shown: true,
      enabled: true,
      onClick,
    },
  };
}
