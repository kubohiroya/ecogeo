import useIntervalExpScale from '../../hooks/useIntervalExpScape';

export const useSimulator = ({
  startSimulation,
  stopSimulation,
  resetSimulation,
  tickSimulation,
}: {
  startSimulation: () => void;
  resetSimulation: () => void;
  tickSimulation: () => void;
  stopSimulation: () => void;
}) => {
  /*
  const { set: setSessionState } = useUndoRedo<SessionState>(
    undoRedoSessionStateAtom,
  );
   */
  return useIntervalExpScale<boolean>({
    onStarted: () => {
      requestAnimationFrame(() => {
        startSimulation();
        //setSessionState(startSimulation, false, 'simulationStart');
      });
    },
    onReset: () => {
      requestAnimationFrame(() => {
        resetSimulation();
        //setSessionState((draft) => {}, true, 'simulationReset0');
        //setSessionState(resetSimulation, true, 'simulationReset1');
      });
    },
    onStopped: () => {
      stopSimulation();
    },
    tick: () => {
      requestAnimationFrame(() => {
        tickSimulation();
        //setSessionState(tickSimulation, false, 'simulationTick');
      });
      return true;
    },
    isStopped: (result: boolean): boolean => {
      return false;
    },
    minInterval: 10,
    maxInterval: 3000,
    initialIntervalScale: 0.5,
  });
};
