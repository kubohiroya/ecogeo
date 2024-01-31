import { GridItemTypes } from '../../models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

type InputOutputButtonProps = {
  enabled?: boolean;
  shown?: boolean;
};

export function getInputOutputButton({
  enabled,
  shown,
}: InputOutputButtonProps): FloatingButtonItem {
  return {
    layout: {
      i: 'InputOutputButton',
      x: 0,
      y: 1,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'InputOutputButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'InputOutput',
      tooltip: 'Open Input/Output Panel',
      icon: <FolderOpen />,
      shown: shown ?? true,
      enabled: enabled ?? true,
    },
  };
}
