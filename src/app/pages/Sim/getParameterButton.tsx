import { GridItemType } from '../../models/GridItemType';
import { Tune } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getParameterButton(): FloatingButtonItem {
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
