import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import {
  Flag,
  Hexagon,
  Layers,
  LocationCity,
  Route,
  Square,
} from '@mui/icons-material';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from '../../../components/TreeView/StyledTreeItem';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';
import { CardContent } from '@mui/material';

export function createLayerPanel(): GridItem {
  return {
    layout: {
      i: 'Layers',
      x: 22,
      y: 10,
      w: 10,
      h: 8,
      isDraggable: true,
      isResizable: true,
      resizeHandles: ['se'],
    },
    resource: {
      id: 'Layers',
      type: GridItemType.FloatingPanel,
      title: 'Layers',
      icon: <Layers />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'LayersButton',
      children: (
        <CardContent
          style={{
            height: '300px',
            overflowY: 'scroll',
            backgroundColor: 'red',
          }}
        >
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
        </CardContent>
      ),
    },
  };
}
