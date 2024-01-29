import { UIState } from './UIState';
import { AppMatrices } from './AppMatrices';
import { Country } from './Country';
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
  //sessionId: string,
  country: Country,
): UndoRedoState<SessionState> {
  const graph = updateAddedSubGraph(
    //sessionId,
    {
      country,
      locations: [],
      edges: [],
      locationSerialNumber: 0,
    },
    [],
    country.numLocations,
  );

  const current = {
    country,
    locations: graph.locations,
    edges: graph.edges,
    locationSerialNumber: graph.locationSerialNumber,
    units: country.units,
  };

  return createInitialUndoRedoState<SessionState>(current);
}

export function createSession(country: Country): {
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
    sessionState: createSessionState(country),
  };
}

/*

export const sessionAtoms: Record<string, PrimitiveAtom<Session>> = {};
export const sessionStateAtoms: Record<
  string,
  PrimitiveAtom<UndoRedoState<SessionState>>
> = {};

const initialSessionStateArray = INITIAL_COUNTRY_ARRAY.map((country) =>
  createSession(country),
);

initialSessionStateArray.forEach(({ session, sessionState }) => {
  sessionAtoms[session.sessionId] = atom(session);
  sessionStateAtoms[session.sessionId] = atom(sessionState);
});

const initialSelectedSessionIndex = initialSessionStateArray.length - 1;
export const { session, sessionState } =
  initialSessionStateArray[initialSelectedSessionIndex];
export const initialSelectedSessionId = session.sessionId;
*/