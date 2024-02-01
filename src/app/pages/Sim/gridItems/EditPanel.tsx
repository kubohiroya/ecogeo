import { GridItemTypes } from '../../../models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';
import { RESIZE_HANDLES, ROW_HEIGHT } from '../SimDesktopComponent';

import { FloatingPanelItem } from '../../../models/FloatingPanelItem';
import { LayoutDefault } from '../LayoutDefault';

export function EditPanel(props: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'EditPanel',
      x: props?.x ?? 1,
      y: props?.y ?? 7,
      w: props?.w ?? 7,
      h: props?.h ?? 3,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'EditPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Editor Panel',
      icon: <Edit />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: props?.shown || false,
      bindToButtonId: 'EditButton',
    },
  };
}
