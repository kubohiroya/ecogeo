import React, { useEffect, useState } from 'react';
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
import { GridItemResources } from '../../models/GridItemResources';
import { entriesToRecord, filterRecord } from '../../utils/arrayUtil';
import { GridItemType } from '../../models/GridItemType';

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;
const ROW_HEIGHT = 32;

const FloatingPanelContent = styled(CardContent)`
  padding: 8px;
  margin: 0;
  overflow: hidden;
`;

const StyledResponsiveGridLayout = styled(ResponsiveGridLayout)`
  .react-grid-item.react-grid-placeholder {
    background: grey !important;
  }
`;

export type DesktopComponentProps = {
  initialLayouts: ReactGridLayout.Layout[];
  resources: Record<string, GridItemResources>;
  children?: React.ReactNode;
};
export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const { width, height } = useWindowDimensions();
  const [forefront, setForefront] = useState<string>('' as string);

  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>(
    props.initialLayouts,
  );

  useEffect(() => {
    setLayouts([...props.initialLayouts]);
  }, [props.initialLayouts]);

  const [resources, setResources] = useState<Record<string, GridItemResources>>(
    { ...props.resources },
  );

  useEffect(() => {
    setResources({ ...props.resources });
  }, [props.resources]);

  /*
  const [buttonEnabledState, setButtonEnabledState] = useState<
    Record<string, boolean>
  >(
    entriesToRecord<string, boolean>(

        .filter(
          (item) =>
            item.resource.enabled &&
            item.resource.type === GridItemType.FloatingButton,
        )
        .map((item) => [item.resource.id, true]),
    ),
  );
   */

  const [removedLayoutsMap, setRemovedLayoutsMap] = useState<
    Record<string, ReactGridLayout.Layout>
  >(
    entriesToRecord<string, ReactGridLayout.Layout>(
      layouts
        .filter(
          (item) =>
            resources[item.i] &&
            resources[item.i].type == GridItemType.FloatingPanel &&
            !resources[item.i].shown,
        )
        .map((item) => [item.i, item]),
    ),
  );

  const [maximizedLayout, setMaximizedLayout] =
    useState<ReactGridLayout.Layout | null>(null);

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

  const createMaximizeLastItem = (_layouts: Array<ReactGridLayout.Layout>) => {
    const target = _layouts[_layouts.length - 1];
    setMaximizedLayout({ ...target });
    const newLayouts = [..._layouts];
    newLayouts[_layouts.length - 1] = {
      ...target,
      x: 0,
      y: 0,
      w: NUM_HORIZONTAL_GRIDS,
      h: Math.floor((height - 10) / ROW_HEIGHT - 3),
    };
    return newLayouts;
  };

  const onDemaximize = (id: string) => {
    if (maximizedLayout) {
      const newLayouts = [...layouts];
      newLayouts[layouts.length - 1] = maximizedLayout;
      setLayouts(newLayouts);
      setMaximizedLayout(null);
    }
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

      /*
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
       */
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
        /*
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
         */
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

  const onMaximize = (id: string) => {
    setForefront(id);
    setLayouts((layouts) => {
      return createMaximizeLastItem(createForefront(id, layouts));
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
    if (!resource) return;

    switch (resource.type) {
      case 'Background':
        return (
          <Box
            id={layout.i}
            key={layout.i}
            sx={{ position: 'absolute', top: '-2px', left: '-8px' }}
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
                  !resources[resource.bindToPanelId].shown,
                );
                onForefront(resource.bindToPanelId);
              } else if (resource.navigateTo) {
                navigate(resource.navigateTo);
              }
            }}
            disabled={!resources[layout.i].enabled}
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
            onMaximize={() => {
              onMaximize(layout.i);
            }}
            onDemaximize={() => {
              onDemaximize(layout.i);
            }}
            maximized={maximizedLayout?.i === layout.i}
          >
            <FloatingPanelContent>{resource.children}</FloatingPanelContent>
          </FloatingPanel>
        );
      default:
        console.error({ layout, resource });
        throw new Error('Unknown Item');
    }
  };

  /*
  useEffect(() => {
    setLayouts(createLayouts(props.gridItems));
    setResources(createResources(props.gridItems));
  }, [props.gridItems]);
   */

  if (layouts.length !== Object.keys(resources).length) {
    return;
  }

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
        {layouts.map((layout) => {
          return createDOM(layout, resources[layout.i]);
        })}
      </StyledResponsiveGridLayout>
      {props.children}
    </Box>
  );
};
