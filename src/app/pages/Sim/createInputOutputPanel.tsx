import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createInputOutputPanel(): GridItem {
  return {
    layout: {
      i: 'InputOutput',
      x: 1,
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
      id: 'InputOutput',
      type: GridItemType.FloatingPanel,
      title: 'Input/Output',
      icon: <FolderOpen />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      children: (
        <Box style={{ display: 'flex', gap: '10px' }}>
          <Button variant={'contained'}>Import...</Button>
          <Button variant={'contained'}>Export...</Button>
        </Box>
      ),
      bindToButtonId: 'InputOutputButton',
    },
  };
}
