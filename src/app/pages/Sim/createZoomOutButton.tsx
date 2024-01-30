import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { ZoomOut } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createZoomOutButton({ height }: { height: number }): GridItem {
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
      type: GridItemType.FloatingButton,
      tooltip: 'zoom out',
      icon: <ZoomOut />,
      shown: true,
      enabled: true,
    },
  };
}
