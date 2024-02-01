import { GridItemTypes } from '../../../models/GridItemType';
import { ZoomOut } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../../models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function ZoomOutButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ZoomOutButton',
      x: 0,
      y: props?.y ?? 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'ZoomOutButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'zoom out',
      icon: <ZoomOut />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
