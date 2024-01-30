import { SessionState } from '../../models/SessionState';
import useIntervalExpScale from '../../hooks/useIntervalExpScape';

export const useRaceTrackSimulator = ({
  setSessionState,
  startSimulation,
  resetSimulation,
  tickSimulation,
}: {
  setSessionState: (
    func: (draft: SessionState) => void,
    commit: boolean,
    label: string,
  ) => void;
  startSimulation: (sessionState: SessionState) => void;
  resetSimulation: (sessionState: SessionState) => void;
  tickSimulation: (sessionState: SessionState) => void;
}) => {
  const simulation = useIntervalExpScale<boolean>({
    onStarted: () => {
      requestAnimationFrame(() => {
        setSessionState(startSimulation, false, 'simulationStart');
      });
    },
    onReset: () => {
      requestAnimationFrame(() => {
        setSessionState((draft) => {}, true, 'simulationReset0');
        setSessionState(resetSimulation, true, 'simulationReset1');
      });
    },
    tick: () => {
      requestAnimationFrame(() => {
        setSessionState(tickSimulation, false, 'simulationTick');
      });
      return true;
    },
    isFinished: (result: boolean): boolean => {
      return false;
    },
    onFinished: (result: boolean) => {
      requestAnimationFrame(() => {
        setSessionState((draft) => {}, true, 'simulationFinished');
      });
    },
    minInterval: 10,
    maxInterval: 3000,
    initialIntervalScale: 0.5,
  });

  return simulation;
};
