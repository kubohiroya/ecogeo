import { GridItemTypes } from "~/app/models/GridItemType";
import { FolderOpen } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "~/app/pages/Sim/SimDesktopComponent";
import { FloatingPanelItem } from "~/app/models/FloatingPanelItem";
import { LayoutDefault } from "~/app/pages/Sim/LayoutDefault";

export function InputOutputPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'InputOutputPanel',
      x: props?.x ?? 0,
      y: props?.y ?? 0,
      w: props?.w ?? 8,
      h: props?.h ?? 3,
      minW: 5,
      minH: 2,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'InputOutputPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Input/Output',
      icon: <FolderOpen />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: props?.shown,
      bindToButtonId: 'InputOutputButton',
    },
  };
}
