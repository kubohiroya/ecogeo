import { UIState } from './UIState';
import { AppMatrices } from './AppMatrices';
import { Country } from './Country';
import { ChartType } from '../type/ChartType';
import * as uuid from 'uuid';
import { updateAddedSubGraph } from '../components/SessionPanel/GraphPanel/GraphHandlers';
import { SessionState } from './SessionState';
import { createInitialState } from '../hooks/useUndoRedo';
import { DEFAULT_MAIN_CONTAINER_HEIGHT } from '../components/SessionPanel/SessionLayoutPanel';
import { UndoRedoSessionState } from './Root';
import { PrimitiveAtom } from 'jotai';
import { INITIAL_COUNTRY_ARRAY } from './initialCountryArray';
import { atom } from 'jotai/index';

export type Session = {
  sessionId: string;

  matrices: AppMatrices;

  uiState: UIState;
};

export function createSessionState(
  sessionId: string,
  country: Country
): UndoRedoSessionState {
  const graph = updateAddedSubGraph(
    sessionId,
    { country, locations: [], edges: [], locationSerialNumber: 0 },
    [],
    country.numLocations
  );

  const current = {
    country,
    locations: graph.locations,
    edges: graph.edges,
    locationSerialNumber: graph.locationSerialNumber,
  };

  return createInitialState<SessionState>(current);
}

export function createSession(country: Country): {
  session: Session;
  sessionState: UndoRedoSessionState;
} {
  const sessionId = uuid.v4();
  return {
    session: {
      sessionId,
      matrices: {
        adjacencyMatrix: null,
        distanceMatrix: null,
        predecessorMatrix: null,
        transportationCostMatrix: null,
      },
      uiState: {
        viewportWindow: null,
        splitPanelHeight: DEFAULT_MAIN_CONTAINER_HEIGHT,
        splitPanelSizes: [0, 0],
        focusedIndices: [],
        selectedIndices: [],
        draggingIndex: null,
        countryConfigPanelAccordion: true,
        matrixSetPanelAccordion: false,
        lockMatrixSetPanelAccordion: false,
        chartScale: 1,
        chartType: ChartType.ManufactureShare,
        autoLayoutFinished: true,
        layer: {
          map: false,
        },
      },
    },
    sessionState: createSessionState(sessionId, country),
  };
}

export const sessionAtoms: Record<string, PrimitiveAtom<Session>> = {};
export const sessionStateAtoms: Record<
  string,
  PrimitiveAtom<UndoRedoSessionState>
> = {};
const initialSessionStateArray = INITIAL_COUNTRY_ARRAY.map((country) =>
  createSession(country)
);

initialSessionStateArray.forEach(({ session, sessionState }) => {
  sessionAtoms[session.sessionId] = atom(session);
  sessionStateAtoms[session.sessionId] = atom(sessionState);
});

const initialSelectedSessionIndex = initialSessionStateArray.length - 1;
export const { session, sessionState } =
  initialSessionStateArray[initialSelectedSessionIndex];
export const initialSelectedSessionId = session.sessionId;
