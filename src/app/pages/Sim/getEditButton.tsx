import { GridItemType } from '../../models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

export function getEditButton({
  enabled,
  shown,
}: {
  enabled?: boolean;
  shown?: boolean;
}): FloatingButtonItem {
  return {
    layout: {
      i: 'EditButton',
      x: 0,
      y: 2,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'EditButton',
      type: GridItemType.FloatingButton,
      bindToPanelId: 'Edit',
      tooltip: 'Open Edit Panel',
      icon: <Edit />,
      shown: shown ?? true,
      enabled: enabled ?? true,
    },
  };
}
