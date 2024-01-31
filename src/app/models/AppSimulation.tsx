export interface AppSimulation {
  start: () => void;
  stop: () => void;
  reset: () => void;
  intervalScale: number;
  changeIntervalScale: (scale: number) => void;
}
