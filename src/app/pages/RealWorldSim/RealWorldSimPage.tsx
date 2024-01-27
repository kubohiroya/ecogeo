import React, { useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, Button, CardContent } from '@mui/material';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import ReactGridLayout, {
  ItemCallback,
  Responsive as ResponsiveGridLayout,
} from 'react-grid-layout';
import useWindowDimensions from '../../hooks/useWindowDimenstions';
import { FloatingButton } from '../../../components/FloatingButton/FloatingButton';
import { FloatingPanel } from '../../../components/FloatingPanel/FloatingPanel';
import { MapCopyright } from '../../../components/MapCopyright/MapCopyright';
import {
  Flag,
  FolderOpen,
  Hexagon,
  Layers,
  LocationCity,
  Route,
  Square,
} from '@mui/icons-material';
import MapComponent from '../../components/SessionPanel/MapPanel/deckgl/MapComponent';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from '../../../components/TreeView/StyledTreeItem';

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;
const ROW_HEIGHT = 32;

enum GridItemType {
  Map = 'Map',
  FloatingButton = 'FloatingButton',
  FloatingPanel = 'FloatingPanel',
}

interface GridItemResources {
  id: string;
  type: GridItemType;
  bindTo?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  title?: string;
  titleBarMode?: 'win' | 'mac';
  rowHeight?: number;
  hide?: boolean;
  children?: React.ReactNode;
}

const initialLayouts: {
  layout: ReactGridLayout.Layout;
  resource: GridItemResources;
}[] = [
  {
    layout: {
      i: 'map',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      static: true,
    },
    resource: {
      id: 'map',
      type: GridItemType.Map,
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
      bindTo: 'InputOutput',
      tooltip: 'Open Input/Output Panel',
      icon: <FolderOpen />,
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
      bindTo: 'Layers',
      tooltip: 'Open Layers Panel',
      icon: <Layers />,
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
      hide: false,
      children: (
        <Box style={{ display: 'flex', gap: '10px' }}>
          <Button variant={'contained'}>Import...</Button>
          <Button variant={'contained'}>Export...</Button>
        </Box>
      ),
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
      hide: false,
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
];
const initialResources: Record<string, GridItemResources> = {};
for (const item of initialLayouts) {
  initialResources[item.resource.id] = item.resource;
}

const StyledResponsiveGridLayout = styled(ResponsiveGridLayout)`
  .react-grid-item.react-grid-placeholder {
    background: grey !important;
  }
`;

const RealWorldSimPageBase = () => {
  const params = useParams();
  const { width, height } = useWindowDimensions();
  const [layouts, setLayouts] = useState<Array<ReactGridLayout.Layout>>(
    initialLayouts.map((item) => item.layout),
  );

  const [removedLayoutsMap, setRemovedLayoutsMap] = useState<
    Record<string, ReactGridLayout.Layout | undefined>
  >({});
  const [resources, setResources] =
    useState<Record<string, GridItemResources>>(initialResources);
  const [forefront, setForefront] = useState<string>('' as string);

  const createForefront = (
    id: string,
    _layouts: Array<ReactGridLayout.Layout>,
  ) => {
    const index = _layouts.findIndex((layout) => layout.i === id);
    if (index < 0) return _layouts;
    const target = _layouts[index];
    const newLayouts = new Array<ReactGridLayout.Layout>(_layouts.length);
    for (let i = 0; i < index; i++) {
      newLayouts[i] = _layouts[i];
    }
    for (let i = index; i < _layouts.length - 1; i++) {
      newLayouts[i] = _layouts[i + 1];
    }
    newLayouts[_layouts.length - 1] = target;
    return newLayouts;
  };

  const onShowOrHide = (id: string, hide: boolean) => {
    if (hide) {
      const removingLayout = layouts.find((layout) => layout.i == id);
      if (removingLayout) {
        setRemovedLayoutsMap(
          (
            removedLayoutsMap: Record<
              string,
              ReactGridLayout.Layout | undefined
            >,
          ) => {
            return {
              ...removedLayoutsMap,
              [removingLayout.i]: { ...removingLayout },
            };
          },
        );
      } else {
        throw new Error();
      }
    } else {
      setRemovedLayoutsMap(
        (
          removedLayoutsMap: Record<string, ReactGridLayout.Layout | undefined>,
        ) => {
          const addingLayout = removedLayoutsMap[id];
          setLayouts((layouts: ReactGridLayout.Layout[]) => {
            if (!addingLayout || layouts.some((item) => item.i === id)) {
              return [...layouts];
            }
            return [...layouts, addingLayout];
          });
          return { ...removedLayoutsMap, [id]: undefined };
        },
      );
    }

    setResources((resources: Record<string, GridItemResources>) => {
      return { ...resources, [id]: { ...resources[id], hide } };
    });
  };

  const onForefront = (id: string) => {
    setForefront(id);
    setLayouts((layouts) => {
      return createForefront(id, layouts);
    });
  };

  const onResizeStop: ItemCallback = (
    current,
    oldItem,
    newItem,
    placeholder,
    e,
    element,
  ) => {
    const newLayouts = createForefront(oldItem.i, current);
    setLayouts(newLayouts);
  };

  const onDragStop: ItemCallback = (
    current,
    oldItem,
    newItem,
    placeholder,
    e,
    element,
  ) => {
    const newLayouts = createForefront(oldItem.i, current);
    setLayouts(newLayouts);
  };

  const onLayoutChange = (current: ReactGridLayout.Layout[]) => {
    const newLayouts = createForefront(forefront, current);
    setLayouts(newLayouts);
  };

  const createDOM = (
    layout: ReactGridLayout.Layout,
    resource: GridItemResources,
  ) => {
    switch (resource.type) {
      case 'Map':
        return (
          <Box
            id={layout.i}
            key={layout.i}
            sx={{ position: 'absolute', top: 0, left: '-8px' }}
          >
            <MapComponent
              uuid={params.uuid!}
              map="openstreetmap"
              width={width}
              height={height}
            ></MapComponent>
          </Box>
        );

      case 'FloatingButton':
        return (
          <FloatingButton
            id={layout.i}
            key={layout.i}
            tooltip={resource.tooltip!}
            onClick={() => {
              onShowOrHide(resource.bindTo!, false);
              onForefront(resource.bindTo!);
            }}
          >
            {resource.icon}
          </FloatingButton>
        );
      case 'FloatingPanel':
        return (
          <FloatingPanel
            id={layout.i}
            key={layout.i}
            title={resource.title!}
            icon={resource.icon}
            setToFront={() => onForefront(layout.i)}
            rowHeight={resource.rowHeight!}
            titleBarMode={resource.titleBarMode!}
            hide={() => onShowOrHide(resource.id, true)}
          >
            <CardContent>{resource.children}</CardContent>
          </FloatingPanel>
        );
      default:
        throw new Error(resource.type);
    }
  };

  return (
    <Box
      sx={{
        margin: { xs: 0, md: 0, lg: 0 },
        padding: 0,
        border: 'none',
      }}
    >
      <StyledResponsiveGridLayout
        style={{
          backgroundColor: 'rgba(255,255,255,0.6)',
          margin: 0,
          padding: 0,
        }}
        compactType={'vertical'}
        autoSize={true}
        allowOverlap={true}
        isResizable={false}
        isBounded={false}
        width={width}
        draggableHandle=".draggable"
        breakpoints={{ lg: 1140 /*, sm: 580, xs: 0*/ }}
        cols={{ lg: NUM_HORIZONTAL_GRIDS /*, sm: 9, xs: 3*/ }}
        rowHeight={ROW_HEIGHT}
        margin={[4, 4]}
        containerPadding={[8, 2]}
        layouts={{ lg: layouts }}
        onLayoutChange={onLayoutChange}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
      >
        {layouts.map(
          (layout) =>
            !resources[layout.i].hide && createDOM(layout, resources[layout.i]),
        )}
      </StyledResponsiveGridLayout>
      <MapCopyright />
    </Box>
  );
};

export const RealWorldSimPage = styled(RealWorldSimPageBase)``;
