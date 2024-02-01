import { CardContent } from '@mui/material';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from '../../../../components/TreeView/StyledTreeItem';
import {
  Flag,
  Hexagon,
  LocationCity,
  Route,
  Square,
} from '@mui/icons-material';
import React from 'react';

export const LayersPanelComponent = () => (
  <CardContent
    style={{
      height: '300px',
      overflowY: 'scroll',
      // backgroundColor: 'red',
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
);
