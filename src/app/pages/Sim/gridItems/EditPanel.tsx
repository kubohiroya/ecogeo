import { GridItemTypes } from "~/app/models/GridItemType";
import { Edit } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "../SimDesktopComponent";

import { FloatingPanelItem } from "~/app/models/FloatingPanelItem";
import { LayoutDefault } from "../LayoutDefault";

export function EditPanel(props: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'EditPanel',
      x: props?.x ?? 1,
      y: props?.y ?? 0,
      w: props?.w ?? 9,
      h: props?.h ?? 3,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'EditPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Edit Panel',
      icon: <Edit />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: props?.shown || false,
      bindToButtonId: 'EditButton',
    },
  };
}
