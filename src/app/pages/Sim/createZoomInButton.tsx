import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { ZoomIn } from '@mui/icons-material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createZoomInButton({ height }: { height: number }): GridItem {
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
      type: GridItemType.FloatingButton,
      tooltip: 'zoom in',
      icon: <ZoomIn />,
      shown: true,
      enabled: true,
    },
  };
}
