import { GridItemTypes } from '../../../models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '../../../models/FloatingButtonItem';
import { LayoutDefault } from '../LayoutDefault';

export function EditButton(props: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'EditButton',
      x: props?.x ?? 0,
      y: props?.y ?? 2,
      w: props?.w ?? 1,
      h: props?.h ?? 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'EditButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'EditPanel',
      tooltip: 'Open Edit Panel',
      icon: <Edit />,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
