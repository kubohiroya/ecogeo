import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';
import { Redo } from '@mui/icons-material';

export function createRedoButton({
  height,
  enabled,
  onClick,
}: {
  height: number;
  enabled: boolean;
  onClick: () => void;
}): GridItem {
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
