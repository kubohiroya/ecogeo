import { GridItemTypes } from "~/app/models/GridItemType";
import { BarChart } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "../SimDesktopComponent";

import { FloatingPanelItem } from "~/app/models/FloatingPanelItem";
import { LayoutDefault } from "~/app/pages/Sim/LayoutDefault";

export function ChartPanel(prop: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'ChartPanel',
      x: prop?.x ?? 22,
      y: prop?.y ?? 0,
      w: prop?.w ?? 10,
      h: prop?.h ?? 10,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'ChartPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Chart',
      icon: <BarChart />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'ChartButton',
    },
  };
}
