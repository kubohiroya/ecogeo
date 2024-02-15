import { GridItemTypes } from "~/app/models/GridItemType";
import { Tune } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "~/app/pages/Sim/SimDesktopComponent";
import { FloatingPanelItem } from "~/app/models/FloatingPanelItem";
import { LayoutDefault } from "~/app/pages/Sim/LayoutDefault";

export function ParametersPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'ParametersPanel',
      x: 1,
      y: props?.y ?? 3,
      w: 9,
      h: 9,
      minW: 9,
      minH: 9,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
    },
    resource: {
      id: 'ParametersPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Parameters',
      icon: <Tune />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      bindToButtonId: 'ParametersButton',
      shown: props?.shown ?? true,
    },
  };
}
