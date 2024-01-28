import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, Button } from '@mui/material';
import {
  Flag,
  FolderOpen,
  Hexagon,
  Home,
  Layers,
  LocationCity,
  Route,
  Square,
} from '@mui/icons-material';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from '../../../components/TreeView/StyledTreeItem';
import { DesktopComponent } from './DesktopComponent';
import { useLoaderData } from 'react-router-dom';
import { GridItemType } from './GridItemType';

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;
const ROW_HEIGHT = 32;

export const RaceTrackSimPage = () => {
  const params = useLoaderData() as { uuid: string };
  return (
    <DesktopComponent
      gridItems={[
        {
          layout: {
            i: 'Background',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            resizeHandles: [],
            static: true,
          },
          resource: {
            id: 'Background',
            type: GridItemType.Background,
            children: <Box />,
            shown: true,
            enabled: true,
          },
        },
        {
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
            type: GridItemType.FloatingButton,
            tooltip: 'Home',
            icon: <Home />,
            navigateTo: '/',
            shown: true,
            enabled: true,
          },
        },
        {
          layout: {
            i: 'InputOutputButton',
            x: 0,
            y: 1,
            w: 1,
            h: 1,
            resizeHandles: [],
            isDraggable: true,
            isResizable: false,
          },
          resource: {
            id: 'InputOutputButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'InputOutput',
            tooltip: 'Open Input/Output Panel',
            icon: <FolderOpen />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'LayersButton',
            x: 0,
            y: 2,
            w: 1,
            h: 1,
            isDraggable: true,
            isResizable: false,
            resizeHandles: [],
          },
          resource: {
            id: 'LayersButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'Layers',
            tooltip: 'Open Layers Panel',
            icon: <Layers />,
            shown: true,
            enabled: true,
          },
        },
        {
          layout: {
            i: 'InputOutput',
            x: 5,
            y: 5,
            w: 10,
            h: 5,
            resizeHandles: ['se'],
            isDraggable: true,
            isResizable: true,
          },
          resource: {
            id: 'InputOutput',
            type: GridItemType.FloatingPanel,
            title: 'Input/Output Panel',
            icon: <FolderOpen />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: true,
            children: (
              <Box style={{ display: 'flex', gap: '10px' }}>
                <Button variant={'contained'}>Import...</Button>
                <Button variant={'contained'}>Export...</Button>
              </Box>
            ),
            bindToButtonId: 'InputOutputButton',
          },
        },
        {
          layout: {
            i: 'Layers',
            x: 5,
            y: 10,
            w: 10,
            h: 10,
            isDraggable: true,
            isResizable: true,
            resizeHandles: ['se'],
          },
          resource: {
            id: 'Layers',
            type: GridItemType.FloatingPanel,
            title: 'Layers Panel',
            icon: <Layers />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: false,
            bindToButtonId: 'LayersButton',
            children: (
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultExpanded={['1', '2']}
              >
                <StyledTreeItem
                  nodeId="1"
                  level={1}
                  labelText="Country Shapes"
                  labelIcon={Flag}
                >
                  <StyledTreeItem
                    nodeId="1-1"
                    level={2}
                    labelText="Region1 Shapes"
                    labelIcon={Hexagon}
                  >
                    <StyledTreeItem
                      nodeId="1-1-1"
                      level={3}
                      labelText="Region2 Shapes"
                      labelIcon={Square}
                    />
                  </StyledTreeItem>
                </StyledTreeItem>
                <StyledTreeItem
                  nodeId="2"
                  level={1}
                  labelText="Cities"
                  labelIcon={LocationCity}
                />
                <StyledTreeItem
                  nodeId="3"
                  level={1}
                  labelText="Routes"
                  labelIcon={Route}
                />
              </TreeView>
            ),
          },
        },
      ]}
    />
  );
};
