import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Info } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createInfoPanel(): GridItem {
  return {
    layout: {
      i: 'Info',
      x: 10,
      y: 0,
      w: 5,
      h: 3,
      minW: 5,
      minH: 3,
      resizeHandles: ['se'],
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'Info',
      type: GridItemType.FloatingPanel,
      title: 'Information',
      icon: <Info />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      children: <Box style={{ display: 'flex', gap: '10px' }}></Box>,
      bindToButtonId: 'InfoButton',
      shown: false,
    },
  };
}
