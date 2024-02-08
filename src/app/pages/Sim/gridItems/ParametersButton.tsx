import { GridItemTypes } from 'src/app/models/GridItemType';
import { Tune } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from 'src/app/models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function ParametersButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ParametersButton',
      x: 0,
      y: props?.y ?? 3,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'ParametersButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'ParametersPanel',
      tooltip: 'Open Parameters Panel',
      icon: <Tune />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
