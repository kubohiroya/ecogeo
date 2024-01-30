import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Undo } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createUndoButton({
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
      i: 'UndoButton',
      x: 0,
      y: Math.floor(height / ROW_HEIGHT) - 10,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'UndoButton',
      type: GridItemType.FloatingButton,
      tooltip: 'undo',
      icon: <Undo />,
      shown: true,
      enabled,
      onClick,
    },
  };
}
