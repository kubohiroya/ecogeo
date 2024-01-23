import { useImmerAtom } from 'jotai-immer';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { SessionState } from '../../models/SessionState';
import { focusAtom } from 'jotai-optics';
import { Session } from '../../models/Session';
import { OpticFor_ } from 'optics-ts';
import { rootAtom } from '../../models/Root';

const uiStateSelector = (optic: OpticFor_<Session>) => optic.prop('uiState');
const matricesSelector = (optic: OpticFor_<Session>) => optic.prop('matrices');

export const useSessionStateUndoRedo = (sessionId: string) => {
  const [rootState, setRootState] = useImmerAtom(rootAtom);
  const sessionAtom = rootState.sessionAtoms[sessionId];

  const uiStateAtom = focusAtom(sessionAtom, uiStateSelector);
  const [uiState, setUIState] = useImmerAtom(uiStateAtom);
  const matricesAtom = focusAtom(sessionAtom, matricesSelector);
  const [matrices, setMatrices] = useImmerAtom(matricesAtom);

  //const sessionStateAtom = useAtomValue(rootState.sessionStateAtoms)[sessionId];
  const sessionStateAtom = rootState.sessionStateAtoms[sessionId];

  const [session, setSession] = useImmerAtom(sessionAtom);

  const {
    set: setSessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    current: sessionState,
    history,
    future,
    staging,
  } = useUndoRedo<SessionState>(sessionStateAtom);

  return {
    session,
    setSession,
    sessionState,
    setSessionState,
    undoSessionState,
    redoSessionState,
    history,
    staging,
    future,
    matrices,
    setMatrices,
    uiState,
    setUIState,
  };
};
