import { GridItemTypes } from '../../../models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../../models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function LayersButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'LayersButton',
      x: 0,
      y: props?.y ?? 7,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'LayersButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'LayersPanel',
      tooltip: 'Open Layers Panel',
      icon: <Layers />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
