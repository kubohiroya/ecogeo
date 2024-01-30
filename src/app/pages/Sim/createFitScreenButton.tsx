import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { FitScreen } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createFitScreenButton({
  height,
}: {
  height: number;
}): GridItem {
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
      type: GridItemType.FloatingButton,
      tooltip: 'fit to screen',
      icon: <FitScreen />,
      shown: true,
      enabled: true,
    },
  };
}
