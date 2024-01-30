import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Edit } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createEditPanel({ height }: { height: number }): GridItem {
  return {
    layout: {
      i: 'Edit',
      x: 1,
      y: Math.floor(height / ROW_HEIGHT - 7),
      w: 7,
      h: 3,
      resizeHandles: ['se'],
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'Edit',
      type: GridItemType.FloatingPanel,
      title: 'Editor Panel',
      icon: <Edit />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: false,
      children: (
        <Box style={{ display: 'flex', gap: '10px' }}>
          <Button variant={'contained'}>AddNode</Button>
          <Button variant={'contained'}>RemoveNode</Button>
          <Button variant={'contained'}>AddRoute</Button>
          <Button variant={'contained'}>RemoveRoute</Button>
        </Box>
      ),
      bindToButtonId: 'EditButton',
    },
  };
}
