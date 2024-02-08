import React, { ReactNode, useEffect, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, CardContent, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import ReactGridLayout, {
  ItemCallback,
  Responsive as ResponsiveGridLayout,
} from 'react-grid-layout';
import { useWindowDimensions } from 'src/app/hooks/useWindowDimenstions';
import { FloatingItemResource } from 'src/app/models/FloatingItemResource';
import { entriesToRecord } from 'src/app/utils/arrayUtil';
import { FloatingButton } from 'src/components/FloatingButton/FloatingButton';
import { FloatingPanel } from 'src/components/FloatingPanel/FloatingPanel';
import { FloatingButtonResource } from 'src/app/models/FloatingButtonResource';
import { FloatingPanelResource } from 'src/app/models/FloatingPanelResource';
import { GridItemTypes } from 'src/app/models/GridItemType';
import { NUM_HORIZONTAL_GRIDS, ROW_HEIGHT } from './DesktopConstants';

const FloatingPanelContent = styled(CardContent)`
  padding: 8px;
  margin: 0;
  overflow: hidden;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const StyledResponsiveGridLayout = styled(ResponsiveGridLayout)`
  .react-grid-item.react-grid-placeholder {
    background: grey !important;
  }
`;

export type DesktopComponentProps = {
  backgroundColor: string;
  initialLayouts: ReactGridLayout.Layout[];
  resources: Record<string, FloatingPanelResource | FloatingButtonResource>;
  gridItemChildrenMap: Record<string, ReactNode>;
  children?: ReactNode;
};

type ButtonState = {
  enabled: boolean;
  shown: boolean;
};
export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();
  const numRows = Math.floor((height - 10) / ROW_HEIGHT - 3);
  const [forefront, setForefront] = useState<string>('' as string);
  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>([
    ...props.initialLayouts.map((layout) => ({
      ...layout,
      y: !props.resources[layout.i].shown ? layout.y - numRows : layout.y,
    })),
  ]);

  const [maximizedLayout, setMaximizedLayout] =
    useState<ReactGridLayout.Layout | null>(null);

  console.log({ ini: props.initialLayouts, res: props.resources, layouts });

  useEffect(() => {
    requestAnimationFrame(() => {
      setLayouts((draft) => {
        draft.forEach((layout) => {
          if (props.resources[layout.i].x && props.resources[layout.i].x! < 0) {
            layout.x = NUM_HORIZONTAL_GRIDS + props.resources[layout.i].x!;
          }
          if (props.resources[layout.i].y && props.resources[layout.i].y! < 0) {
            const rows = Math.floor(height / ROW_HEIGHT) - 3; //getRows(height);
            layout.y = rows + props.resources[layout.i].y!;
          }
        });
        console.log({ width, height, draft });
        return draft;
      });
    });
  }, [width, height]);

  /*
  const [removedLayoutsMap, setRemovedLayoutsMap] = useState<
    Record<string, ReactGridLayout.Layout>
  >(
    entriesToRecord<string, ReactGridLayout.Layout>(
      layouts
        .filter(
          (item) =>
            props.resources[item.i] &&
            props.resources[item.i].type === GridItemType.FloatingPanel &&
            !props.resources[item.i].shown,
        )
        .map((item) => [item.i, item]),
    ),
  );

   */

  const [buttonStateMap, setButtonStateMap] = useState<
    Record<string, ButtonState>
  >(
    entriesToRecord<string, ButtonState>(
      layouts.map((item) => {
        if (!props.resources[item.i]) {
          console.error('ERROR', item.i, props.resources);
        }
        const shown = props.resources[item.i].shown || false;
        const enabled =
          props.resources[item.i].type === GridItemTypes.FloatingButton
            ? (props.resources[item.i] as FloatingButtonResource).enabled
            : true;
        return [
          item.i,
          {
            shown,
            enabled,
          },
        ];
      }),
    ),
  );

  const [gridItemMap, setGridItemMap] = useState<Record<
    string,
    ReactNode
  > | null>(null);

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

  const onDemaximize = () => {
    if (maximizedLayout) {
      const newLayouts = [...layouts];
      newLayouts[layouts.length - 1] = maximizedLayout;
      setLayouts(newLayouts);
      setMaximizedLayout(null);
    }
  };

  const onShow = (panelId: string) => {
    setLayouts((layouts: ReactGridLayout.Layout[]) => {
      //const addingLayout = removedLayoutsMap[panelId];
      /*
      if (addingLayout && !layouts.some((item) => item.i === panelId)) {
        return [...layouts, addingLayout];
      } else {
        return [...layouts];
      }
       */
      return layouts.map((layout) =>
        layout.i !== panelId ? layout : { ...layout, y: layout.y - numRows },
      );
    });

    /*
    setRemovedLayoutsMap(
      (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
        return filterRecord(removedLayoutsMap, (key) => key !== panelId);
      },
    );
     */

    const buttonId = (
      props.resources[panelId] as unknown as FloatingPanelResource
    ).bindToButtonId;
    if (buttonId) {
      setButtonStateMap((draft: Record<string, ButtonState>) => {
        return {
          ...draft,
          [panelId]: { ...draft[panelId], shown: true },
          [buttonId]: { ...draft[buttonId], enabled: false },
        };
      });
    }
  };

  const onHide = (panelId: string) => {
    const removingLayout = layouts.find((layout) => layout.i === panelId);
    if (removingLayout) {
      /*
      setRemovedLayoutsMap(
        (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
          return {
            ...removedLayoutsMap,
            [removingLayout.i]: { ...removingLayout },
          };
        },
      );
       */
      setLayouts((layouts: ReactGridLayout.Layout[]) => {
        return layouts.map((layout) =>
          layout.i !== panelId ? layout : { ...layout, y: layout.y - numRows },
        );
      });
    }

    const buttonId = (
      props.resources[panelId] as unknown as FloatingPanelResource
    ).bindToButtonId;
    if (buttonId) {
      setButtonStateMap((draft: Record<string, ButtonState>) => {
        return {
          ...draft,
          [panelId]: { ...draft[panelId], shown: false },
          [buttonId]: { ...draft[buttonId], enabled: true },
        };
      });
    }
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
    if (current.length === 0) return;
    const newLayouts = createForefront(forefront, current);
    /*
    setRemovedLayoutsMap(
      (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
        return filterRecord(removedLayoutsMap, (key) => key !== panelId);
      },
    );
     */

    /*
    console.log('⭐️onLayoutChange', {
      newLayouts,
      x: newLayouts[newLayouts.length - 1].i,
    });
     */
    setLayouts(newLayouts);
  };

  const createGridItem = (
    //layout: ReactGridLayout.Layout,
    id: string,
    resource: FloatingItemResource,
    children: ReactNode,
  ) => {
    if (!resource) return null;

    switch (resource.type) {
      case 'FloatingButton': {
        const itemResource = resource as FloatingButtonResource;
        return (
          <FloatingButton
            id={id}
            key={id}
            tooltip={resource.tooltip!}
            onClick={() => {
              if (itemResource.bindToPanelId) {
                onShow(itemResource.bindToPanelId);
                onForefront(itemResource.bindToPanelId);
              } else if (itemResource.onClick) {
                itemResource.onClick();
              } else if (itemResource.navigateTo) {
                navigate(itemResource.navigateTo);
              }
            }}
            disabled={!(buttonStateMap[id]?.enabled || false)}
          >
            {resource.icon}
          </FloatingButton>
        );
      }
      case 'FloatingPanel': {
        return (
          <FloatingPanel
            id={id}
            key={id}
            title={resource.title!}
            icon={resource.icon}
            setToFront={() => onForefront(id)}
            rowHeight={resource.rowHeight!}
            titleBarMode={resource.titleBarMode!}
            onClose={() => {
              onHide(resource.id);
            }}
            onMaximize={() => {
              onMaximize(id);
            }}
            onDemaximize={() => {
              onDemaximize();
            }}
            maximized={maximizedLayout?.i === id}
          >
            <FloatingPanelContent>{children}</FloatingPanelContent>
          </FloatingPanel>
        );
      }
      case 'BackgroundPanel':
      default:
        return <div id={id} key={id}></div>;
    }
  };

  useEffect(() => {
    if (layouts.length > 0 && Object.keys(props.resources).length > 0) {
      setGridItemMap(
        entriesToRecord(
          layouts.map((layout) => {
            return [
              layout.i,
              createGridItem(
                layout.i,
                props.resources[layout.i],
                props.gridItemChildrenMap[layout.i],
              ),
            ];
          }),
        ),
      );
    }
  }, [layouts, props.resources, props.gridItemChildrenMap]);

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
      }}
    >
      {width === 0 || layouts.length === 0 || gridItemMap === null ? (
        <Box
          sx={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ccc',
          }}
        >
          <CircularProgress variant={'indeterminate'} size={100} />
        </Box>
      ) : (
        <StyledResponsiveGridLayout
          style={{
            backgroundColor: props.backgroundColor,
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
          breakpoints={{ lg: 1140 }}
          cols={{ lg: NUM_HORIZONTAL_GRIDS }}
          rowHeight={ROW_HEIGHT}
          margin={[4, 4]}
          containerPadding={[8, 2]}
          layouts={{ lg: layouts }}
          onLayoutChange={onLayoutChange}
          onDragStop={onDragStop}
          onResizeStop={onResizeStop}
        >
          <Box
            sx={{ position: 'absolute', top: '-2px', left: '-8px' }}
            key={'BackgroundPanel'}
          >
            {props.children}
          </Box>
          {layouts
            .filter((layout) => layout.i !== 'BackgroundPanel')
            .map((layout, index) => gridItemMap[layout.i])}
        </StyledResponsiveGridLayout>
      )}
    </Box>
  );
};
