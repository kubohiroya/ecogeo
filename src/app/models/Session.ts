import { ParameterSet } from './ParameterSet';
import { updateAddedSubGraph } from '../components/SessionPanel/MapPanel/GraphHandlers';
import { SessionState } from './SessionState';
import {
  createInitialUndoRedoState,
  UndoRedoState,
} from '../hooks/useUndoRedo';

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
