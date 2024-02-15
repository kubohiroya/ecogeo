import { GridItemTypes } from "~/app/models/GridItemType";
import { Info } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "~/app/pages/Sim/SimDesktopComponent";
import { FloatingPanelItem } from "~/app/models/FloatingPanelItem";
import { LayoutDefault } from "~/app/pages/Sim/LayoutDefault";

export function InfoPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'InfoPanel',
      x: 10,
      y: props?.y ?? 0,
      w: 5,
      h: 3,
      minW: 5,
      minH: 3,
      resizeHandles: RESIZE_HANDLES,
      isDraggable: true,
      isResizable: true,
    },
    resource: {
      id: 'InfoPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Information',
      icon: <Info />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      bindToButtonId: 'InfoButton',
      shown: false,
    },
  };
}
