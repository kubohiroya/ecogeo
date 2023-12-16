import { Country } from './Country';
import { ChartType } from '../type/ChartType';
import { createTimer } from './AppTimer';
import * as uuid from 'uuid';
import { addSubGraph } from './GraphHandlers';
import { Session } from './Session';
import { atom } from 'jotai/index';
import { SessionState } from './SessionState';
import { createInitialState, UndoRedoState } from '../hooks/useUndoRedo';
import { PrimitiveAtom } from 'jotai';
import { StateRoot } from './StateRoot';

export type UndoRedoSessionState = UndoRedoState<SessionState>;

export function createSessionState(country: Country): UndoRedoSessionState {
  const graph = addSubGraph(
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
        splitPanelHeight: 0,
        splitPanelSizes: [0, 0],
        focusedIndices: [],
        selectedIndices: [],
        draggingIndex: null,
        countryConfigPanelAccordion: true,
        matrixSetPanelAccordion: false,
        lockMatrixSetPanelAccordion: false,
        chartScale: 1,
        chartType: ChartType.ShareOfManufacturing,
        layer: {
          map: false,
        },
      },
      timers: {
        autoGraphLayoutTimer: createTimer(0),
        simulationTimer: createTimer(0.5),
      },
    },
    sessionState: createSessionState(country),
  };
}

const initialSessionAtoms: Record<string, PrimitiveAtom<Session>> = {};
const initialSessionStateAtoms: Record<
  string,
  PrimitiveAtom<UndoRedoSessionState>
> = {};
const sessionAtoms = atom(initialSessionAtoms);
const sessionStateAtoms = atom(initialSessionStateAtoms);
export const sessionIdsAtom = atom((get) =>
  Object.keys(get(sessionStateAtoms)).sort((a: string, b: string) => {
    const key_a = get(initialSessionStateAtoms[a]).current.country.title;
    const key_b = get(initialSessionStateAtoms[b]).current.country.title;
    return key_a < key_b ? -1 : key_a > key_b ? 1 : 0;
  })
);
const root: StateRoot = {
  sessionIdsAtom,
  sessionAtoms,
  sessionStateAtoms,
};

export const rootAtom = atom(root);
