import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { undoRedoSessionStateAtom } from './RaceTrackSimLoader';
import { useCallback, useState } from 'react';
import useHotkeys from '@reecelucas/react-use-hotkeys';

const useUndoRedoActions = ({
  uiState,
  setUIState,
}: {
  sessionState: SessionState;
  setSessionState: (
    func: (draft: SessionState) => void,
    commit: boolean,
    label: string,
  ) => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
}) => {
  const {
    set: setSessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    current: sessionState,
    history,
    future,
    staging,
  } = useUndoRedo<SessionState>(undoRedoSessionStateAtom);

  const undo = useCallback(() => {
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.focusedIndices = [];
        draft.selectedIndices = [];
      });
      undoSessionState();
    });
  }, [undoSessionState, setUIState]);
  const redo = useCallback(() => {
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.focusedIndices = [];
        draft.selectedIndices = [];
      });
      redoSessionState();
    });
  }, [redoSessionState, setUIState]);

  useHotkeys(['Meta+z', 'Control+z'], () => {
    if (history.length == 0) {
      openSnackBar('No more undo!');
      return;
    }
    undo();
  });
  useHotkeys(['Shift+Meta+z', 'Shift+Control+z'], () => {
    if (future.length == 0) {
      openSnackBar('No more redo!');
      return;
    }
    redo();
  });

  useHotkeys(['h'], () => {
    console.log({
      numLocations: sessionState.locations.length,
      locations: sessionState.locations,
      selectedIndices: uiState.selectedIndices,
    });
    console.log({ history, staging, future });
    //console.log({ uiState });
  });
  useHotkeys(['e'], () => {
    console.log(JSON.stringify(sessionState.edges, null, ' '));
  });

  const [snackBarState, setSnackBarState] = useState<{
    open: boolean;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    message: string;
  }>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  });

  const openSnackBar = useCallback(
    (message: string) => {
      setSnackBarState({ ...snackBarState, open: true, message });
    },
    [snackBarState, setSnackBarState],
  );

  const closeSnackBar = useCallback(() => {
    setSnackBarState({ ...snackBarState, open: false });
  }, [snackBarState, setSnackBarState]);
};
