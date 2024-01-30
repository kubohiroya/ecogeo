import React, { useEffect, useState } from 'react';
import { SessionState } from '../../models/SessionState';
import { GridItemResources } from '../../models/GridItemResources';
import { DesktopComponent } from './DesktopComponent';
import { AppMatrices } from '../../models/AppMatrices';
import { AppPreference } from '../../models/AppPreference';
import { UIState } from '../../models/UIState';
import { AppSimulation } from '../../models/AppSimulation';
import { createBackground } from './createBackground';
import { createHomeButton } from './createHomeButton';
import { createZoomInButton } from './createZoomInButton';
import { createZoomOutButton } from './createZoomOutButton';
import { createFitScreenButton } from './createFitScreenButton';
import { createInputOutputButton } from './createInputOutputButton';
import { createInputOutputPanel } from './createInputOutputPanel';
import { createEditButton } from './createEditButton';
import { createEditPanel } from './createEditPanel';
import { createParameterButton } from './createParameterButton';
import { createParameterPanel } from './createParameterPanel';
import { createTimeControlButton } from './createTimeControlButton';
import { createTimeControlPanel } from './createTimeControlPanel';
import { createMatricesButton } from './createMatricesButton';
import { createChartButton } from './createChartButton';
import { createChartPanel } from './createChartPanel';
import { createLayerButton } from './createLayerButton';
import { createLayerPanel } from './createLayerPanel';
import { createMatricesPanel } from './createMatricesPanel';
import useWindowDimensions from '../../hooks/useWindowDimenstions';
import { useGraphEditActions } from './useGraphEditActions';
import { useChartActions } from './useChartActions';
import { PatchPair } from '../../hooks/useUndoRedo';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';
import { useViewportActions } from './useViewportActions';
import { ParameterSet } from '../../models/ParameterSet';
import { CASE_ARRAY } from '../../models/CaseArray';
import { createUndoButton } from './createUndoButton';
import { createRedoButton } from './createRedoButton';
import { createInfoButton } from './createInfoButton';
import { createInfoPanel } from './createInfoPanel';

export const ROW_HEIGHT = 32;

type SimDesktopComponentProps = {
  sessionState: SessionState;
  setSessionState: (
    updateFunction: (draft: SessionState) => void,
    commit?: boolean,
    label?: string | undefined,
  ) => void;
  undoSessionState: () => void;
  redoSessionState: () => void;
  history: PatchPair[];
  future: PatchPair[];
  staging: PatchPair[];
  simulation: AppSimulation;
  matrices: AppMatrices;
  setMatrices: (matrices: AppMatrices) => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
  preferences: AppPreference;
  updateAndSetMatrices: (locations: City[], edges: Edge[]) => void;
};

export const RaceTrackDesktopComponent = (props: SimDesktopComponentProps) => {
  const { width, height } = useWindowDimensions();
  const {
    sessionState,
    setSessionState,
    undoSessionState,
    redoSessionState,
    history,
    staging,
    future,
    simulation,
    matrices,
    setMatrices,
    uiState,
    setUIState,
    preferences,
    updateAndSetMatrices,
  } = props;

  const { setSessionChartScale, setSessionChartType } = useChartActions({
    setUIState,
  });

  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>([]);
  const [resources, setResources] = useState<Record<string, GridItemResources>>(
    {},
  );

  const { onFit, setSessionViewportCenter } = useViewportActions({
    width,
    height,
    locations: sessionState?.locations,
    uiState,
    setUIState,
  });

  const {
    onAddLocation,
    onAddBulkLocations,
    onRemoveLocation,
    onRemoveBulkLocations,
    onAddEdge,
    onRemoveEdge,
    onMoved,
    XYZ,
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
    //diagonalMatrixSetPanelRef,
  });

  useEffect(() => {
    const newLayouts: ReactGridLayout.Layout[] = [];
    const newResources: Record<string, GridItemResources> = {};
    [
      createBackground({
        width,
        height,
        sessionState,
        uiState,
        matrices,
        setSessionViewportCenter,
        onDragStart,
        onDragEnd,
        onDrag,
        onFocus,
        onUnfocus,
        onPointerUp,
        onClearSelection,
        onMoved,
      }),
      createHomeButton(),
      createUndoButton({
        height,
        onClick: () => undoSessionState(),
        enabled: history.length > 0,
      }),
      createRedoButton({
        height,
        onClick: () => redoSessionState(),
        enabled: future.length > 0,
      }),
      createZoomInButton({ height, onClick: () => console.log('zoom in') }),
      createZoomOutButton({ height, onClick: () => console.log('zoom out') }),
      createFitScreenButton({
        height,
        onClick: () => console.log('fit screen'),
      }),
      createInputOutputButton(),
      createInputOutputPanel(),
      createEditButton(),
      createEditPanel({ height }),
      createParameterButton(),
      createParameterPanel({
        parameterSet: sessionState.parameterSet,
        setNumLocations: (value: number) => {
          setSessionState((draft) => {
            draft.parameterSet.numLocations = value;
          });
        },
        setManufactureShare: (value: number) => {
          setSessionState((draft) => {
            draft.parameterSet.manufactureShare = value;
          });
        },
        setTransportationCost: (value: number) => {
          setSessionState((draft) => {
            draft.parameterSet.transportationCost = value;
          });
        },
        setElasticitySubstitution: (value: number) => {
          setSessionState((draft) => {
            draft.parameterSet.elasticitySubstitution = value;
          });
        },
        onParameterSetChanged: (caseId: string) => {
          setSessionState((draft) => {
            const newCase = CASE_ARRAY.find(
              (paramSet: ParameterSet) => caseId == paramSet.caseId,
            );
            if (newCase) draft.parameterSet = newCase;
          });
        },
      }),
      createTimeControlButton(),
      createTimeControlPanel({ simulation }),
      createMatricesButton(),
      createMatricesPanel({
        height,
        sessionState,
        matrices,
        uiState,
        preferences,
        onSelect,
        onFocus,
        onUnfocus,
      }),
      createChartButton(),
      createChartPanel({
        sessionState,
        uiState,
        setSessionChartType,
        setSessionChartScale,
        onSelect,
        onUnselect,
        onFocus,
        onUnfocus,
      }),
      createLayerButton(),
      createLayerPanel(),
      createInfoButton(),
      createInfoPanel(),
    ].forEach((item) => {
      newLayouts.push(item.layout);
      newResources[item.resource.id] = item.resource;
    });
    setLayouts(newLayouts);
    setResources(newResources);
  }, [width, height, sessionState]);

  return <DesktopComponent initialLayouts={layouts} resources={resources} />;
};
