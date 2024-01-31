import React, { ReactNode, useEffect } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { City, resetCity } from '../../models/City';
import { Edge } from '../../models/Graph';
import { SessionState } from '../../models/SessionState';
import { enablePatches } from 'immer';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { AppMatrices } from '../../models/AppMatrices';
import {
  matricesAtom,
  uiStateAtom,
  undoRedoSessionStateAtom,
} from './SimLoader';
import { useImmerAtom } from 'jotai-immer';
import { useAtom, useAtomValue } from 'jotai';
import { preferencesAtom } from '../../models/AppPreference';
import { tickSimulator } from '../../models/Simulator';
import { useMatrixEngine } from './useMatrixEngine';
import { SimDesktopComponent } from './SimDesktopComponent';
import { useSimulator } from './useSimulator';
import { CASE_ARRAY } from '../../models/CaseArray';
import { UIState } from '../../models/UIState';
import { ViewportCenter } from '../../models/ViewportCenter';
import { ProjectType } from '../../services/database/ProjectType';
import { useSnackBar } from './useSnackBar';
import { useUndoRedoActions } from './useUndoRedoActions';

enablePatches();

type SimComponentProps = {
  type: ProjectType;
  x: number;
  y: number;
  zoom: number;
  uuid: string;
  backgroundPanel: (params: {
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
export const SimComponent = (props: SimComponentProps) => {
  const { type, uuid, x, y, zoom, backgroundPanel } = props;

  const { set: setSessionState, current: sessionState } =
    useUndoRedo<SessionState>(undoRedoSessionStateAtom);
  const [uiState, setUIState] = useImmerAtom(uiStateAtom);

  const { openSnackBar, closeSnackBar } = useSnackBar();
  useUndoRedoActions({ uiState, setUIState, openSnackBar, closeSnackBar });

  const preferences = useAtomValue(preferencesAtom);
  const [matrices, setMatrices] = useAtom(matricesAtom);

  useEffect(() => {
    if (x !== undefined && y !== undefined && zoom !== undefined) {
      setUIState((draft) => {
        draft.viewportCenter = {
          centerX: x,
          centerY: y,
          scale: zoom,
        };
      });
    }
  }, [setUIState, x, y, zoom]);

  //const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);

  const resetToCaseDefault = () => {
    const caseDefault = CASE_ARRAY.find(
      (c) => sessionState.parameterSet.caseId === c.caseId,
    );
    caseDefault &&
      setSessionState((draft) => {
        draft.parameterSet.numLocations = caseDefault.numLocations;
        draft.parameterSet.manufactureShare = caseDefault.manufactureShare;
        draft.parameterSet.transportationCost = caseDefault.transportationCost;
        draft.parameterSet.elasticitySubstitution =
          caseDefault!.elasticitySubstitution;
      });
  };

  function startSimulation() {
    setSessionState((draft) => {}, true, 'simulationStart');
  }

  function stopSimulation() {
    setSessionState((draft) => {}, true, 'simulationStop');
  }

  function resetSimulation() {
    setSessionState(
      (draft) => {
        draft.locations.forEach((city) =>
          resetCity(city, draft.locations.length),
        );
        resetToCaseDefault();
      },
      true,
      'resetSimulation',
    );
  }

  function tickSimulation() {
    setSessionState(
      (draft) => {
        tickSimulator(draft, matrices.transportationCostMatrix!);
      },
      false,
      'tick',
    );
  }

  const simulation = useSimulator({
    startSimulation,
    stopSimulation,
    resetSimulation,
    tickSimulation,
  });

  const matrixEngine = useMatrixEngine(
    sessionState?.locations?.length,
    sessionState?.edges?.length,
  );

  const updateMatrices = (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<AppMatrices> => {
    if (!matrixEngine) throw new Error();
    return matrixEngine.updateAdjacencyMatrix(
      locations,
      edges,
      transportationCost,
    );
  };

  const updateAndSetMatrices = (locations: City[], edges: Edge[]) => {
    updateMatrices(
      locations,
      edges,
      sessionState.parameterSet.transportationCost,
    ).then((newMatrices) => {
      setMatrices({
        adjacencyMatrix: newMatrices.adjacencyMatrix,
        distanceMatrix: newMatrices.distanceMatrix,
        predecessorMatrix: newMatrices.predecessorMatrix,
        transportationCostMatrix: newMatrices.transportationCostMatrix,
      });
    });
  };

  useEffect(() => {
    updateAndSetMatrices(sessionState?.locations, sessionState?.edges);
  }, [
    sessionState?.locations,
    sessionState?.edges,
    sessionState?.parameterSet?.transportationCost,
  ]);

  useEffect(() => {
    if (sessionState?.parameterSet?.title) {
      document.title = `Eco-Geo - ${sessionState?.parameterSet?.title}`;
    } else {
      document.title = `Eco-Geo - Geological Economics Modeling Simulator`;
    }
  }, [sessionState?.parameterSet?.title]);

  return (
    <SimDesktopComponent
      {...{
        type,
        uuid,
        x,
        y,
        zoom,
        simulation,
        matrices,
        setMatrices,
        uiState,
        setUIState,
        preferences,
        updateMatrices,
        updateAndSetMatrices,
        backgroundPanel,
      }}
    />
  );
};
