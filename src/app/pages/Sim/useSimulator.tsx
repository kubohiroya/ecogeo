import { useIntervalExpScale } from 'src/app/hooks/timerAtom';
import { AppSimulation } from 'src/app/models/AppSimulation';

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
}): AppSimulation => {
  return useIntervalExpScale({
    onStarted: () => {
      requestAnimationFrame(() => {
        startSimulation();
      });
    },
    onReset: () => {
      requestAnimationFrame(() => {
        resetSimulation();
      });
    },
    onStopped: () => {
      stopSimulation();
    },
    tick: () => {
      requestAnimationFrame(() => {
        tickSimulation();
      });
    },
    minInterval: 5,
    maxInterval: 2000,
    initialIntervalScale: 0.5,
  });
};
