import { GridItemTypes } from '../../../models/GridItemType';
import { ZoomIn } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../../models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function ZoomInButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ZoomInButton',
      x: 0,
      y: props?.y ?? 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'ZoomInButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'zoom in',
      icon: <ZoomIn />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
