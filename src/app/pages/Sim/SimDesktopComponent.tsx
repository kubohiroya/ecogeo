import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SessionState } from '../../models/SessionState';
import { FloatingItemResource } from '../../models/FloatingItemResource';
import { DesktopComponent } from './DesktopComponent';
import { AppMatrices } from '../../models/AppMatrices';
import { AppPreference } from '../../models/AppPreference';
import { UIState } from '../../models/UIState';
import { AppSimulation } from '../../models/AppSimulation';
import { HomeButton } from './gridItems/HomeButton';
import { ZoomInButton } from './gridItems/ZoomInButton';
import { ZoomOutButton } from './gridItems/ZoomOutButton';
import { FitScreenButton } from './gridItems/FitScreenButton';
import { InputOutputButton } from './gridItems/InputOutputButton';
import { InputOutput } from './gridItems/InputOutput';
import { ChartPanel } from './gridItems/ChartPanel';
import { useWindowDimensions } from '../../hooks/useWindowDimenstions';
import { useGraphEditActions } from './useGraphEditActions';
import { useChartActions } from './useChartActions';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';
import { useViewportActions } from './useViewportActions';
import { useNavigate } from 'react-router-dom';
import { ResizeHandle } from 'react-resizable';
import { ChartButton } from './gridItems/ChartButton';
import { ChartPanelComponent } from './components/ChartPanelComponent';
import { InputOutputPanelComponent } from './components/InputOutputPanelComponent';
import { EditPanelComponent } from './components/EditPanelComponent';
import { BackgroundPanel } from './gridItems/BackgroundPanel';
import { useParameterActions } from './useParameterActions';
import { ProjectType } from '../../services/database/ProjectType';
import { sessionStateAtom } from './SimLoader';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { AsyncFunctionManager } from '../../utils/AsyncFunctionManager';
import { LayoutDefault } from './LayoutDefault';
import { InfoPanelComponent } from './components/InfoPanelComponent';
import { LayersPanelComponent } from './components/LayerPanelComponent';
import { ParametersPanelComponent } from './components/ParameterPanelComponent';
import { MatricesPanelComponent } from './components/MatricesPanelComponent';
import { TimerControlPanelComponent } from './components/TimerControlPanelComponent';
import { FloatingButtonResource } from '../../models/FloatingButtonResource';
import { FloatingPanelResource } from '../../models/FloatingPanelResource';
import { EditButton } from './gridItems/EditButton';
import { ParametersButton } from './gridItems/ParametersButton';
import { ParametersPanel } from './gridItems/ParametersPanel';
import { TimerControlButton } from './gridItems/TimerControlButton';
import { TimerControlPanel } from './gridItems/TimerControlPanel';
import { MatricesButton } from './gridItems/MatricesButton';
import { MatricesPanel } from './gridItems/MatricesPanel';
import { LayersButton } from './gridItems/LayersButton';
import { LayersPanel } from './gridItems/LayersPanel';
import { InfoButton } from './gridItems/InfoButton';
import { InfoPanel } from './gridItems/InfoPanel';
import { UndoButton } from './gridItems/UndoButton';
import { RedoButton } from './gridItems/RedoButton';
import { EditPanel } from './gridItems/EditPanel';

export const ROW_HEIGHT = 32;
export const RESIZE_HANDLES: ResizeHandle[] = ['se', 'sw', 'nw'];

const getRows = (height?: number) =>
  height && height > 0 ? Math.floor(height / ROW_HEIGHT) - 3 : 0;

const getY = (
  props: { y?: number; height?: number },
  layoutDefault: LayoutDefault,
) => {
  if (props.y) {
    if (props.y >= 0) {
      return props.y;
    } else if (layoutDefault.height && layoutDefault.height > 0) {
      const rows = getRows(layoutDefault.height);
      return rows + props.y;
    }
  }
  return 0;
};

type SimDesktopComponentProps = {
  type: ProjectType;
  backgroundColor: string;
  uuid: string;
  simulation: AppSimulation;
  matrices: AppMatrices;
  setMatrices: (matrices: AppMatrices) => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
  preferences: AppPreference;
  updateAndSetMatrices: (locations: City[], edges: Edge[]) => void;
  backgroundPanel: (props: {
    width: number;
    height: number;
    sessionState: SessionState;
    uiState: UIState;
    matrices: AppMatrices;
    onDragStart: (x: number, y: number, index: number) => void;
    onDragEnd: (diffX: number, diffY: number, index: number) => void;
    onDrag: (diffX: number, diffY: number, index: number) => void;
    onFocus: (focusIndices: number[]) => void;
    onUnfocus: (unfocusIndices: number[]) => void;
    onPointerUp: (x: number, y: number, index: number) => void;
    onClearSelection: () => void;
    onMoved: ({ zoom, y, x }: { zoom: number; y: number; x: number }) => void;
    onMovedEnd: ({
      zoom,
      y,
      x,
    }: {
      zoom: number;
      y: number;
      x: number;
    }) => void;
    overrideViewportCenter: (viewportCenter: [number, number, number]) => void;
  }) => ReactNode;
};

const asyncFunctionManager = new AsyncFunctionManager();

export const SimDesktopComponent = (props: SimDesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const {
    backgroundColor,
    type,
    uuid,
    uiState,
    setUIState,
    matrices,
    preferences,
    updateAndSetMatrices,
  } = props;

  const {
    set: setSessionState,
    current: sessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    history,
    future,
  } = useUndoRedo<SessionState>(sessionStateAtom);

  const { setSessionChartScale, setSessionChartType } = useChartActions({
    setUIState,
  });

  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>([]);
  const [resources, setResources] = useState<
    Record<string, FloatingItemResource>
  >({});

  const [gridItemChildrenMap, setGridItemChildrenMap] = useState<
    Record<string, ReactElement>
  >({});

  const onMoved = ({ zoom, y, x }: { x: number; y: number; zoom: number }) => {
    // do nothing
  };

  const onMovedEnd = ({
    zoom,
    y,
    x,
  }: {
    x: number;
    y: number;
    zoom: number;
  }) => {
    setUIState((draft) => {
      draft.viewportCenter = [zoom, y, x];
      replaceURL(draft.viewportCenter);
    });
  };

  const { onFit } = useViewportActions({
    width,
    height,
    locations: sessionState?.locations,
    uiState,
    setUIState,
  });

  const overrideViewportCenter = useCallback(
    (viewportCenter: [number, number, number]) => {
      setUIState((draft) => {
        draft.viewportCenter = viewportCenter;
        replaceURL(draft.viewportCenter);
      });
    },
    [setUIState],
  );

  const {
    // onAddLocation,
    onAddBulkLocations,
    // onRemoveLocation,
    onRemoveBulkLocations,
    // onAddEdge,
    // onRemoveEdge,
    onDragStart,
    onDrag,
    onDragEnd,
    onFocus,
    onUnfocus,
    onSelect,
    onUnselect,
    onPointerUp,
    onClearSelection,
  } = useGraphEditActions({
    sessionState,
    setSessionState,
    uiState,
    setUIState,
    matrices,
    updateAndSetMatrices,
  });

  const {
    onParameterSetChange,
    setManufactureShare,
    setTransportationCost,
    setElasticitySubstitution,
    setNumLocations,
  } = useParameterActions({
    type,
    sessionState,
    setSessionState,
    onAddBulkLocations,
    onRemoveBulkLocations,
  });

  const replaceURL = useCallback(
    (viewportCenter: [number, number, number]) => {
      const updatedViewportCenter = viewportCenter.map((value) =>
        parseFloat(value.toFixed(4)),
      ) as [number, number, number];
      const url = `/${type}/${uuid}/${updatedViewportCenter[0]}/${updatedViewportCenter[1]}/${updatedViewportCenter[2]}/`;
      asyncFunctionManager.runAsyncFunction(() => {
        navigate(url, { replace: true });
      });
    },
    [navigate, type, uuid],
  );

  const onZoom = useCallback(
    (value: number) => {
      setUIState((draft) => {
        draft.viewportCenter[0] += value;
        replaceURL(draft.viewportCenter);
        return draft;
      });
    },
    [setUIState],
  );

  const onZoomIn = useCallback(() => onZoom(0.25), [onZoom]);
  const onZoomOut = useCallback(() => onZoom(-0.25), [onZoom]);

  const onFitScreen = useCallback(() => {
    const viewportCenter = onFit();
    setUIState((draft) => {
      draft.viewportCenter = viewportCenter;
      replaceURL(viewportCenter);
      return draft;
    });
  }, [onFit, replaceURL, setUIState]);

  const gridItemState: Record<string, LayoutDefault> = {
    BackgroundPanel: {},
    HomeButton: {},
    InputOutputButton: { enabled: false },
    InputOutputPanel: { shown: false },
    ChartButton: { enabled: false },
    ChartPanel: {},
    EditButton: { enabled: false },
    EditPanel: { shown: false },
    ParametersButton: { enabled: false },
    ParametersPanel: { x: 1, y: 0, w: 8, h: 4, shown: true },
    TimerControlButton: { enabled: false },
    TimerControlPanel: { y: 9 },
    MatricesButton: { enabled: false },
    MatricesPanel: { height, y: -9 },
    LayersButton: { enabled: false },
    LayersPanel: { shown: false },
    InfoButton: { shown: false },
    InfoPanel: { shown: false },
    UndoButton: {
      height,
      y: -6,
      onClick: undoSessionState,
      enabled: history.length > 0,
    },
    RedoButton: {
      height,
      y: -5,
      onClick: redoSessionState,
      enabled: future.length > 0,
    },
    ZoomInButton: {
      height,
      y: -3,
      onClick: onZoomIn,
    },
    ZoomOutButton: {
      height,
      y: -2,
      onClick: onZoomOut,
    },
    FitScreenButton: {
      height,
      y: -1,
      onClick: onFitScreen,
    },
  };

  useEffect(() => {
    const newLayouts: ReactGridLayout.Layout[] = [];
    const newResources: Record<
      string,
      FloatingButtonResource | FloatingPanelResource
    > = {};
    [
      BackgroundPanel,
      HomeButton,
      InputOutputButton,
      InputOutput,
      ChartButton,
      ChartPanel,
      EditButton,
      EditPanel,
      ParametersButton,
      ParametersPanel,
      TimerControlButton,
      TimerControlPanel,
      MatricesButton,
      MatricesPanel,
      LayersButton,
      LayersPanel,
      InfoButton,
      InfoPanel,
      UndoButton,
      RedoButton,
      ZoomInButton,
      ZoomOutButton,
      FitScreenButton,
    ].forEach((func, index) => {
      const item = gridItemState[func.name] && func(gridItemState[func.name]);
      if (item) {
        if (item.layout) {
          item.layout.y = getY(item.layout, gridItemState[func.name]);
          newLayouts.push({ ...item.layout });
        }
        if (item.resource) {
          newResources[item.resource.id] = item.resource;
        }
      }
    });

    setLayouts(newLayouts);
    setResources(newResources);

    setGridItemChildrenMap((draft) => ({
      ChartPanel: (
        <ChartPanelComponent
          {...{
            sessionState,
            uiState,
            setSessionChartType,
            setSessionChartScale,
            onSelect,
            onUnselect,
            onFocus,
            onUnfocus,
          }}
        />
      ),
      ParametersPanel: (
        <ParametersPanelComponent
          {...{
            type: props.type,
            parameterSet: sessionState.parameterSet,
            sessionStateAtom,
            onParameterSetChange,
          }}
        />
      ),
      InputOutput: <InputOutputPanelComponent />,
      EditPanel: <EditPanelComponent />,
      InfoPanel: <InfoPanelComponent />,
      LayersPanel: <LayersPanelComponent />,
      MatricesPanel: (
        <MatricesPanelComponent
          {...{
            sessionState,
            matrices,
            uiState,
            preferences,
            onSelect,
            onFocus,
            onUnfocus,
          }}
        />
      ),
    }));

    return () => {
      asyncFunctionManager.cancelAll();
      // TODO: store viewportCenter in DB
      console.warn(
        'TODO: store viewportCenter in DB ' +
          JSON.stringify(uiState.viewportCenter),
      );
    };
  }, []);

  useEffect(() => {
    setResources((draft: Record<string, FloatingItemResource>) => {
      draft.ZoomInButton = ZoomInButton({
        height,
        onClick: onZoomIn,
      }).resource;
      return draft;
    });
  }, [onZoomOut]);
  useEffect(() => {
    setResources((draft) => {
      draft.ZoomOutButton = ZoomOutButton({
        height,
        onClick: onZoomOut,
      }).resource;
      return draft;
    });
  }, [onZoomIn]);
  useEffect(() => {
    setResources((draft: Record<string, FloatingItemResource>) => {
      draft.FitScreenButton = FitScreenButton({
        height,
        onClick: onFitScreen,
      }).resource;
      return draft;
    });
  }, [onFitScreen]);

  useEffect(() => {
    setGridItemChildrenMap((draft) => ({
      ...draft,
      ParametersPanel: (
        <ParametersPanelComponent
          {...{
            type: props.type,
            sessionStateAtom,
            parameterSet: sessionState.parameterSet,
            onParameterSetChange,
            setNumLocations,
            setManufactureShare,
            setTransportationCost,
            setElasticitySubstitution,
          }}
        />
      ),
    }));
  }, [sessionState.parameterSet]);

  useEffect(() => {
    setGridItemChildrenMap((draft) => ({
      ...draft,
      ChartPanel: (
        <ChartPanelComponent
          {...{
            sessionState,
            uiState,
            setSessionChartType,
            setSessionChartScale,
            onSelect,
            onUnselect,
            onFocus,
            onUnfocus,
          }}
        />
      ),
    }));
  }, [sessionState.locations, uiState]);

  useEffect(() => {
    setGridItemChildrenMap((draft) => ({
      ...draft,
      MatricesPanel: (
        <MatricesPanelComponent
          {...{
            sessionState,
            matrices,
            uiState,
            preferences,
            onSelect,
            onFocus,
            onUnfocus,
          }}
        />
      ),
    }));
  }, [matrices]);

  useEffect(() => {
    setGridItemChildrenMap((draft) => {
      const newMap = { ...draft };
      newMap.TimerControlPanel = (
        <TimerControlPanelComponent simulation={props.simulation} />
      );
      return newMap;
    });
  }, [props.simulation]);

  if (
    layouts.length === 0 ||
    Object.keys(resources).length === 0 ||
    Object.keys(gridItemChildrenMap).length === 0
  ) {
    return;
  }

  return (
    <DesktopComponent
      initialLayouts={layouts}
      resources={resources}
      gridItemChildrenMap={gridItemChildrenMap}
      backgroundColor={backgroundColor}
    >
      {props.backgroundPanel({
        width,
        height,
        sessionState,
        uiState,
        matrices,
        onDragStart,
        onDragEnd,
        onDrag,
        onFocus,
        onUnfocus,
        onPointerUp,
        onClearSelection,
        onMoved,
        onMovedEnd,
        overrideViewportCenter,
      })}
    </DesktopComponent>
  );
};
