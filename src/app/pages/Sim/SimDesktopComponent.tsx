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
import { getHomeButton } from './getHomeButton';
import { getZoomInButton } from './getZoomInButton';
import { getZoomOutButton } from './getZoomOutButton';
import { getFitScreenButton } from './getFitScreenButton';
import { getInputOutputButton } from './getInputOutputButton';
import { getInputOutputPanel } from './getInputOutputPanel';
import { getEditButton } from './getEditButton';
import { getParameterButton } from './getParameterButton';
import { getTimerControlButton } from './getTimerControlButton';
import { getTimerControlPanel } from './getTimerControlPanel';
import { getMatricesButton } from './getMatricesButton';
import { getChartPanel } from './getChartPanel';
import { getLayersButton } from './getLayersButton';
import { getLayersPanel } from './getLayersPanel';
import { getMatricesPanel } from './getMatricesPanel';
import { useWindowDimensions } from '../../hooks/useWindowDimenstions';
import { useGraphEditActions } from './useGraphEditActions';
import { useChartActions } from './useChartActions';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';
import { useViewportActions } from './useViewportActions';
import { getUndoButton } from './getUndoButton';
import { getRedoButton } from './getRedoButton';
import { getInfoButton } from './getInfoButton';
import { getInfoPanel } from './getInfoPanel';
import { useNavigate } from 'react-router-dom';
import { ViewportCenter } from '../../models/ViewportCenter';
import { ResizeHandle } from 'react-resizable';
import { getChartButton } from './getChartButton';
import { ChartPanel } from './ChartPanel';
import { getParameterPanel } from './getParameterPanel';
import { ParametersPanel } from './ParametersPanel';
import { LayersPanel } from './LayersPanel';
import { InputOutputPanel } from './OutputPanel';
import { InfoPanel } from './InfoPanel';
import { MatricesPanel } from './MatricesPanel';
import { EditPanel } from './EditPanel';
import { getBackground } from './getBackground';
import { useParameterActions } from './useParameterActions';
import { ProjectType } from '../../services/database/ProjectType';
import { getEditPanel } from './getEditPanel';
import { undoRedoSessionStateAtom } from './SimLoader';
import { TimerControlPane } from './TimerControlPanel';

export const ROW_HEIGHT = 32;
export const RESIZE_HANDLES: ResizeHandle[] = ['se', 'sw', 'nw'];

type SimDesktopComponentProps = {
  type: ProjectType;
  uuid: string;
  x: number;
  y: number;
  zoom: number;
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
    onMoved: ({ zoom, y, x }: { x: number; y: number; zoom: number }) => void;
    onMovedEnd: ({
      zoom,
      y,
      x,
    }: {
      x: number;
      y: number;
      zoom: number;
    }) => void;
    overrideViewportCenter: (viewportCenter: ViewportCenter) => void;
  }) => ReactNode;
};

export const SimDesktopComponent = (props: SimDesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();
  const {
    set: setSessionState,
    current: sessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    history,
    future,
  } = useUndoRedo<SessionState>(undoRedoSessionStateAtom);
  const {
    type,
    uuid,
    // x: number,
    // y,
    // zoom,
    // simulation,
    matrices,
    // setMatrices,
    uiState,
    setUIState,
    preferences,
    updateAndSetMatrices,
    // backgroundPanel,
  } = props;

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
    // DO NOTHING
    // console.log('onmoved');
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
      draft.viewportCenter = { centerX: x, centerY: y, scale: zoom };
    });
    navigate(
      `/${type}/${uuid}/${zoom.toFixed(4)}/${y.toFixed(4)}/${x.toFixed(4)}/`,
      { replace: true },
    );
  };

  const { onFit } = useViewportActions({
    width,
    height,
    locations: sessionState?.locations,
    uiState,
    setUIState,
  });

  const overrideViewportCenter = useCallback(
    (viewportCenter: ViewportCenter) => {
      setUIState((draft) => {
        draft.viewportCenter = viewportCenter;
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

  const onZoom = useCallback(
    (value: number) => {
      if (uiState.viewportCenter) {
        setUIState((draft) => {
          draft.viewportCenter!.scale += value;
          return draft;
        });
        navigate(
          `/${type}/${uuid}/${(uiState.viewportCenter.scale + value).toFixed(4)}/${uiState.viewportCenter.centerY.toFixed(4)}/${uiState.viewportCenter.centerX.toFixed(4)}/`,
          { replace: true },
        );
      }
    },
    [uiState.viewportCenter, uiState.viewportCenter?.scale],
  );

  const onZoomIn = useCallback(() => onZoom(0.25), [onZoom]);
  const onZoomOut = useCallback(() => onZoom(-0.25), [onZoom]);
  const onFitScreen = useCallback(() => {
    onFit();
  }, [onZoom]);

  useEffect(() => {
    const newLayouts: ReactGridLayout.Layout[] = [];
    const newResources: Record<string, FloatingItemResource> = {};
    [
      getBackground(),
      getHomeButton(),
      getChartButton(),
      getChartPanel(),
      getEditButton({ enabled: false }),
      getEditPanel({ height, shown: false }),
      getParameterButton(),
      getParameterPanel(),
      getTimerControlButton(),
      getTimerControlPanel(),
      getMatricesButton(),
      getMatricesPanel({
        height,
      }),
      getLayersButton({ enabled: false }),
      getLayersPanel({ shown: false }),
      getInfoButton(),
      getInfoPanel(),
      getUndoButton({
        height,
        onClick: () => undoSessionState(),
        enabled: history.length > 0,
      }),
      getRedoButton({
        height,
        onClick: () => redoSessionState(),
        enabled: future.length > 0,
      }),
      getZoomInButton({
        height,
        onClick: onZoomIn,
      }),
      getZoomOutButton({ height, onClick: onZoomOut }),
      getFitScreenButton({ height, onClick: onFitScreen }),
      getInputOutputButton({ enabled: false }),
      getInputOutputPanel({ shown: false }),
    ].forEach((item, index) => {
      newLayouts.push({ ...item.layout });
      newResources[item.resource.id] = item.resource;
    });

    setLayouts(newLayouts);
    setResources(newResources);

    setGridItemChildrenMap((draft) => ({
      Chart: (
        <ChartPanel
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
      Parameters: (
        <ParametersPanel
          {...{
            type: props.type,
            parameterSet: sessionState.parameterSet,
            onParameterSetChange,
          }}
        />
      ),
      InputOutput: <InputOutputPanel />,
      Edit: <EditPanel />,
      Info: <InfoPanel />,
      Layers: <LayersPanel />,
      Matrices: (
        <MatricesPanel
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
  }, []);

  useEffect(() => {
    setResources((draft: Record<string, FloatingItemResource>) => {
      draft.ZoomInButton = getZoomInButton({
        height,
        onClick: onZoomIn,
      }).resource;
      return draft;
    });
  }, [onZoomOut]);
  useEffect(() => {
    setResources((draft) => {
      draft.ZoomOutButton = getZoomInButton({
        height,
        onClick: onZoomOut,
      }).resource;
      return draft;
    });
  }, [onZoomIn]);
  useEffect(() => {
    setResources((draft: Record<string, FloatingItemResource>) => {
      draft.FitScreenButton = getFitScreenButton({
        height,
        onClick: onFitScreen,
      }).resource;
      return draft;
    });
  }, [onFitScreen]);

  useEffect(() => {
    setGridItemChildrenMap((draft) => ({
      ...draft,
      Parameters: (
        <ParametersPanel
          {...{
            type: props.type,
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
      Chart: (
        <ChartPanel
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
      Matrices: (
        <MatricesPanel
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
      newMap.TimerControl = <TimerControlPane simulation={props.simulation} />;
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
