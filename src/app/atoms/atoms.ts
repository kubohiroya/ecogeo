import { atom } from 'jotai';
import { initialAppPreferences } from '../model/initialAppPreferences';

export const preferencesAtom = atom(initialAppPreferences);

/*
export const sessionsAtomAtom = atomFamily((sessionId: string) =>
  atom(
    (get) => get(sessionAtomsAtom)[sessionId],
    (get, set, arg: SessionState) => {
      const prev = get(sessionAtomsAtom);
      set(sessionAtomsAtom, {
        ...prev,
        [sessionId]: { ...prev[sessionId], ...arg },
      });
    }
  )
);

 */
/*
export const addSessionAtom = atom(null, (get, set, newSession: Session) => {
  set(sessionsAtom, {
    ...get(sessionsAtom),
    [newSession.sessionId]: newSession,
  });
});

export const removeSessionAtom = atom(null, (get, set, sessionId: string) => {
  const { [sessionId]: _, ...rest } = get(sessionsAtom);
  set(sessionsAtom, rest);
});
export const setSessionPropertyAtom = <T>(
  sessionId: string,
  updater: (session: Session, value: T) => void
) =>
  atom(null, (get, set, newValue: T) => {
    const sessions = get(sessionsAtom);
    const newSessions = { ...sessions };
    updater(newSessions[sessionId], newValue);
    set(sessionsAtom, newSessions);
  });

export const incrementSessionPropertyAtom = (
  sessionId: string,
  incrementer: (session: Session) => number
) =>
  atom(null, (get, set) => {
    const sessions = get(sessionsAtom);
    const newSessions = { ...sessions };
    const value = incrementer(sessions[sessionId]);
    set(sessionsAtom, newSessions);
    return value;
  });

export const incrementSessionLocationSerialNumberAtom = (sessionId: string) =>
  incrementSessionPropertyAtom(sessionId, (session) => {
    return session.state.current.locationSerialNumber++;
  });

export const setSessionCountryAtom = (sessionId: string) =>
  setSessionPropertyAtom<Country>(sessionId, (session, value) => {
    session.state.current.country = value;
  });

export const setSessionLocationsAtom = (sessionId: string) =>
  setSessionPropertyAtom<City[]>(
    sessionId,
    (session, value) => (session.locations = value)
  );

export const setSessionEdgesAtom = (sessionId: string) =>
  setSessionPropertyAtom<Edge[]>(
    sessionId,
    (session, value) => (session.edges = value)
  );

export const setSessionViewportWindowAtom = (sessionId: string) =>
  setSessionPropertyAtom<ViewportWindow | null>(
    sessionId,
    (session, value) => (session.uiState.viewportWindow = value)
  );

export const setSessionFocusedIndicesAtom = (sessionId: string) =>
  setSessionPropertyAtom<number[]>(
    sessionId,
    (session, value) => (session.uiState.focusedIndices = value)
  );

export const setSessionSelectedIndicesAtom = (sessionId: string) =>
  setSessionPropertyAtom<number[]>(
    sessionId,
    (session, value) => (session.uiState.selectedIndices = value)
  );

export const setSessionDraggingIndexAtom = (sessionId: string) =>
  setSessionPropertyAtom<number | null>(sessionId, (session, value) => {
    //session.uiState = { ...session.uiState, draggingId: value };
    session.uiState.draggingIndex = value;
  });

export const setCountryConfigPanelAccordionAtom = (sessionId: string) =>
  setSessionPropertyAtom<boolean>(sessionId, (session, value) => {
    session.uiState.countryConfigPanelAccordion = value;
  });

export const setMatrixSetPanelAccordionAtom = (sessionId: string) =>
  setSessionPropertyAtom<boolean>(sessionId, (session, value) => {
    session.uiState.matrixSetPanelAccordion = value;
  });

//             setLockDiagonalMatrixSetAtom
export const setLockMatrixSetPanelAccordionAtom = (sessionId: string) =>
  setSessionPropertyAtom<boolean>(sessionId, (session, value) => {
    session.uiState.lockMatrixSetPanelAccordion = value;
  });

export const setSessionChartTypeAtom = (sessionId: string) =>
  setSessionPropertyAtom<string>(
    sessionId,
    (session: SessionState, value: string) => {
      session.chartType = value;
    }
  );

export const setSessionChartScaleAtom = (sessionId: string) =>
  setSessionPropertyAtom<number>(
    sessionId,
    (session, value) => (session.chartScale = value)
  );

export const setAutoGraphLayoutTimerAtom = (sessionId: string) =>
  setSessionPropertyAtom<AppTimer>(sessionId, (session, value) => {
    session.autoGraphLayoutTimer = value;
  });

export const setSessionSimulationTimerAtom = (sessionId: string) =>
  setSessionPropertyAtom<AppTimer>(
    sessionId,
    (session, value) => (session.simulationTimer = value)
  );

export const setSessionPanelLayoutAtom = (sessionId: string) =>
  setSessionPropertyAtom<PanelLayout>(
    sessionId,
    (session, value) => (session.panelLayout = value)
  );

export const setSessionMapLayerAtom = (sessionId: string) =>
  setSessionPropertyAtom<boolean>(
    sessionId,
    (session, value) => (session.layer.map = value)
  );

export const setSessionMatricesAtom = (sessionId: string) =>
  setSessionPropertyAtom<{
    adjacencyMatrix: number[][];
    distanceMatrix: number[][];
    predecessorMatrix: number[][];
    transportationCostMatrix: number[][];
  }>(sessionId, (session, values) => {
    session.adjacencyMatrix = values.adjacencyMatrix;
    session.distanceMatrix = values.distanceMatrix;
    session.predecessorMatrix = values.predecessorMatrix;
    session.transportationCostMatrix = values.transportationCostMatrix;
  });
*/
