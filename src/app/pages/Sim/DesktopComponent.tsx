import React, { useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, CardContent } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import ReactGridLayout, {
  ItemCallback,
  Responsive as ResponsiveGridLayout,
} from 'react-grid-layout';
import useWindowDimensions from '../../hooks/useWindowDimenstions';
import { FloatingButton } from '../../../components/FloatingButton/FloatingButton';
import { FloatingPanel } from '../../../components/FloatingPanel/FloatingPanel';
import { GridItemResources } from './GridItemResources';
import { entriesToRecord, filterRecord } from '../../utils/arrayUtil';
import { GridItemType } from './GridItemType';

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;
const ROW_HEIGHT = 32;

const StyledResponsiveGridLayout = styled(ResponsiveGridLayout)`
  .react-grid-item.react-grid-placeholder {
    background: grey !important;
  }
`;

export type DesktopComponentProps = {
  gridItems: {
    layout: ReactGridLayout.Layout;
    resource: GridItemResources;
  }[];
  children?: React.ReactNode;
};

export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const { width, height } = useWindowDimensions();
  const [forefront, setForefront] = useState<string>('' as string);

  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>(
    props.gridItems
      .filter((item) => item.resource.shown)
      .map((item) => item.layout),
  );

  const [resources, setResources] = useState<Record<string, GridItemResources>>(
    entriesToRecord<string, GridItemResources>(
      props.gridItems.map((item) => [item.resource.id, item.resource]),
    ),
  );

  const [buttonEnabledState, setButtonEnabledState] = useState<
    Record<string, boolean>
  >(
    entriesToRecord<string, boolean>(
      props.gridItems
        .filter(
          (item) =>
            item.resource.enabled &&
            item.resource.type === GridItemType.FloatingButton,
        )
        .map((item) => [item.resource.id, true]),
    ),
  );

  const [removedLayoutsMap, setRemovedLayoutsMap] = useState<
    Record<string, ReactGridLayout.Layout>
  >(
    entriesToRecord<string, ReactGridLayout.Layout>(
      props.gridItems
        .filter((item) => !item.resource.shown)
        .map((item) => [item.resource.id, item.layout]),
    ),
  );

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

  const onShowOrHide = (panelId: string, show: boolean) => {
    if (show) {
      setLayouts((layouts: ReactGridLayout.Layout[]) => {
        const addingLayout = removedLayoutsMap[panelId];
        if (addingLayout && !layouts.some((item) => item.i === panelId)) {
          return [...layouts, addingLayout];
        } else {
          return [...layouts];
        }
      });

      setRemovedLayoutsMap(
        (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
          return filterRecord(removedLayoutsMap, (key) => key !== panelId);
        },
      );

      setButtonEnabledState((buttonEnabledState) => {
        const buttonId = resources[panelId].bindToButtonId;
        if (buttonId) {
          return {
            ...buttonEnabledState,
            [buttonId]: !buttonEnabledState[buttonId],
          };
        } else {
          return buttonEnabledState;
        }
      });
    } else {
      const removingLayout = layouts.find((layout) => layout.i == panelId);
      if (removingLayout) {
        setRemovedLayoutsMap(
          (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
            return {
              ...removedLayoutsMap,
              [removingLayout.i]: removingLayout,
            };
          },
        );
        setLayouts((layouts: ReactGridLayout.Layout[]) => {
          return layouts.filter((layout) => layout.i !== panelId);
        });
        setButtonEnabledState((enableState) => {
          // console.log(panelId, resources[panelId]);
          if (resources[panelId].bindToButtonId) {
            return {
              ...enableState,
              [resources[panelId].bindToButtonId as string]: true,
            };
          } else {
            return enableState;
          }
        });
      }
    }

    setResources((resources: Record<string, GridItemResources>) => {
      return { ...resources, [panelId]: { ...resources[panelId], show } };
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
    // console.log('onLayoutChange', newLayouts, forefront);
    setLayouts(newLayouts);
  };

  const createDOM = (
    layout: ReactGridLayout.Layout,
    resource: GridItemResources,
  ) => {
    switch (resource.type) {
      case 'Background':
        return (
          <Box
            id={layout.i}
            key={layout.i}
            sx={{ position: 'absolute', top: 0, left: '-8px' }}
          >
            {resource.children}
          </Box>
        );

      case 'FloatingButton':
        return (
          <FloatingButton
            id={layout.i}
            key={layout.i}
            tooltip={resource.tooltip!}
            onClick={() => {
              if (resource.bindToPanelId) {
                onShowOrHide(
                  resource.bindToPanelId,
                  !buttonEnabledState[resource.bindToPanelId],
                );
                onForefront(resource.bindToPanelId);
              } else if (resource.navigateTo) {
                navigate(resource.navigateTo);
              }
            }}
            disabled={!buttonEnabledState[layout.i]}
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
            onClose={() => {
              onShowOrHide(resource.id, false);
            }}
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
      style={{
        margin: 0,
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
        {layouts.map((layout) => createDOM(layout, resources[layout.i]))}
      </StyledResponsiveGridLayout>
      {props.children}
    </Box>
  );
};
