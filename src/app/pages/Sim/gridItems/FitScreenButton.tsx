import { GridItemTypes } from '../../../models/GridItemType';
import { FitScreen } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../../models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function FitScreenButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'FitScreenButton',
      x: props?.x ?? 0,
      y: props?.y ?? 0,
      w: props?.w ?? 1,
      h: props?.w ?? 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'FitScreenButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'fit to screen',
      icon: <FitScreen />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
