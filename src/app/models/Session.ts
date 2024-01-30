import { UIState } from './UIState';
import { AppMatrices } from './AppMatrices';
import { ParameterSet } from './ParameterSet';
import { ChartType } from './ChartType';
import { updateAddedSubGraph } from '../components/SessionPanel/MapPanel/GraphHandlers';
import { SessionState } from './SessionState';
import {
  createInitialUndoRedoState,
  UndoRedoState,
} from '../hooks/useUndoRedo';

export type Session = {
  matrices: AppMatrices;

  uiState: UIState;
};

export function createSessionState(
  parameterSet: ParameterSet,
): UndoRedoState<SessionState> {
  const graph = updateAddedSubGraph(
    {
      parameterSet: parameterSet,
      locations: [],
      edges: [],
      locationSerialNumber: 0,
    },
    [],
    parameterSet.numLocations,
  );

  const current = {
    parameterSet,
    locations: graph.locations,
    edges: graph.edges,
    locationSerialNumber: graph.locationSerialNumber,
    units: parameterSet.units,
  };

  return createInitialUndoRedoState<SessionState>(current);
}

export function createSession(parameterSet: ParameterSet): {
  session: Session;
  sessionState: UndoRedoState<SessionState>;
} {
  return {
    session: {
      matrices: {
        adjacencyMatrix: null,
        distanceMatrix: null,
        predecessorMatrix: null,
        transportationCostMatrix: null,
      },
      uiState: {
        viewportCenter: null,
        focusedIndices: [],
        selectedIndices: [],
        draggingIndex: null,
        chartScale: 1,
        chartType: ChartType.ManufactureShare,
        autoLayoutFinished: true,
      },
    },
    sessionState: createSessionState(parameterSet),
  };
}
