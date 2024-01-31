import { GridItemTypes } from '../../models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../models/FloatingButtonItem';

type LayersButtonProps = {
  enabled?: boolean;
  shown?: boolean;
};

export function getLayersButton({
  shown = true,
  enabled = true,
}: LayersButtonProps): FloatingButtonItem {
  return {
    layout: {
      i: 'LayersButton',
      x: 0,
      y: 7,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
    },
    resource: {
      id: 'LayersButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'Layers',
      tooltip: 'Open Layers Panel',
      icon: <Layers />,
      shown,
      enabled,
    },
  };
}
