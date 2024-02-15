import { GridItemTypes } from "~/app/models/GridItemType";
import { Home } from "@mui/icons-material";
import React from "react";
import { FloatingButtonItem } from "~/app/models/FloatingButtonItem";
import { LayoutDefault } from "~/app/pages/Sim/LayoutDefault";

export function HomeButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'HomeButton',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'HomeButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'Home',
      icon: <Home />,
      navigateTo: '/',
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
