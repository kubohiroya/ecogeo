export interface AppSimulation {
  counter: number;
  isStarted: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  intervalScale: number;
  changeIntervalScale: (intervalScale: number) => void;
}
