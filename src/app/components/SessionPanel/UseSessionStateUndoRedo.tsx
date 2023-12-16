import { useImmerAtom } from 'jotai-immer';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { SessionState } from '../../model/SessionState';
import { focusAtom } from 'jotai-optics';
import { Session } from '../../model/Session';
import { OpticFor_ } from 'optics-ts';
import { rootAtom } from '../../model/Sessions';
import { useAtomValue } from 'jotai';

const uiStateSelector = (optic: OpticFor_<Session>) => optic.prop('uiState');
const matricesSelector = (optic: OpticFor_<Session>) => optic.prop('matrices');
const timersSelector = (optic: OpticFor_<Session>) => optic.prop('timers');

export const useSessionStateUndoRedo = (sessionId: string) => {
  const [rootState, setRootState] = useImmerAtom(rootAtom);
  const sessionAtom = useAtomValue(rootState.sessionAtoms)[sessionId];

  const uiStateAtom = focusAtom(sessionAtom, uiStateSelector);
  const [uiState, setUIState] = useImmerAtom(uiStateAtom);
  const matricesAtom = focusAtom(sessionAtom, matricesSelector);
  const [matrices, setMatrices] = useImmerAtom(matricesAtom);
  const timersAtom = focusAtom(sessionAtom, timersSelector);
  const [timers, setTimers] = useImmerAtom(timersAtom);

  const sessionStateAtom = useAtomValue(rootState.sessionStateAtoms)[sessionId];

  const [session, setSession] = useImmerAtom(sessionAtom);

  const {
    set: setSessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    current: sessionState,
    history,
    future,
  } = useUndoRedo<SessionState>(sessionStateAtom);

  return {
    session,
    setSession,
    sessionState,
    setSessionState,
    undoSessionState,
    redoSessionState,
    history,
    future,
    matrices,
    setMatrices,
    uiState,
    setUIState,
    timers,
    setTimers,
  };
};
