import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Tune } from '@mui/icons-material';
import React from 'react';

export function createParameterButton(): GridItem {
  return {
    layout: {
      i: 'ParametersButton',
      x: 0,
      y: 3,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'ParametersButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'Parameters',
      tooltip: 'Open Parameters Panel',
      icon: <Tune />,
      shown: true,
      enabled: false,
    },
  };
}
