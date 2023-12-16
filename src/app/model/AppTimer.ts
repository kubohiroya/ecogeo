export interface AppTimer {
  speed: number;
  counter: number;
  interval: NodeJS.Timer | null;
  ticker?: TickCallback;
  onTerminate?: () => void;
}

export type TickCallback = () => boolean;
export type TerminateCallback = () => void;

export const createTimer = (speed: number): AppTimer => ({
  speed,
  counter: 0,
  interval: null,
});

const expScale = (value: number): number => {
  const minLog = Math.log(10); // 10 msec / tick
  const maxLog = Math.log(3000); // 3000 msec / tick
  const scale = minLog + (1 - value) * (maxLog - minLog);
  return Math.exp(scale);
};

export const isTimerStarted = (timer: AppTimer) =>
  timer.interval != null && timer.speed > 0;

export const resetTimer = (timer: AppTimer): AppTimer => {
  return {
    ...timer,
    counter: 0,
  };
};

export const updateSpeed = (
  speed: number,
  timer: AppTimer,
  onTick: TickCallback,
  onTerminate: TerminateCallback
) => {
  return updateInterval({ ...timer, speed }, onTick, onTerminate, false);
};

export const updateInterval = (
  timer: AppTimer,
  onTick: TickCallback,
  onTerminate: TerminateCallback,
  start: boolean
): AppTimer => {
  if (start || timer.interval) {
    if (timer.interval) {
      clearInterval(timer.interval);
    }

    const interval = setInterval(() => {
      const result = onTick();
      if (result) {
        clearInterval(interval);
        timer.interval = null;
        onTerminate();
      }
    }, expScale(timer.speed));

    return {
      ...timer,
      interval,
    };
  }

  return {
    ...timer,
    interval: null,
  };
};

export const startTimer = (
  timer: AppTimer,
  speed: number,
  onTick: TickCallback,
  onTerminate: TerminateCallback
) => {
  return updateInterval({ ...timer, speed }, onTick, onTerminate, true);
};

export const stopTimer = (timer: AppTimer, speed?: number) => {
  if (timer.interval) {
    clearInterval(timer.interval);
  }
  if (speed) {
    return { ...timer, speed, interval: null };
  } else {
    return { ...timer, interval: null };
  }
};
