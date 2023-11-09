import { Atom, atom, WritableAtom } from 'jotai';

export interface AppTimer {
  speed: number;
  counter: number;
  interval: NodeJS.Timer | null;
  tick?: (counter: number) => void;
}

export interface TimerAtoms {
  isStartedAtom: Atom<boolean>;
  speedAtom: WritableAtom<number, [newValue: number], void>;
  counterAtom: WritableAtom<number, [newValue: number], void>;
  tickAtom: WritableAtom<null, [], void>;
  startAtom: WritableAtom<null, [(counter: number) => void], void>;
  stopAtom: WritableAtom<null, [], void>;
  resetAtom: WritableAtom<null, [], void>;
}

export type TickCallback = (counter: number) => void;
export const createTimerAtoms = (): TimerAtoms => {
  const baseAtom = atom<AppTimer>({
    speed: 0.5,
    counter: 0,
    interval: null,
  });

  const restart = (timer: AppTimer, tick: TickCallback) => {
    if (timer.interval) {
      clearInterval(timer.interval);
    }
    const intervalMSec = expScale(timer.speed);
    return setInterval(() => {
      tick && tick(timer.counter++);
    }, intervalMSec);
  };

  const speedAtom = atom(
    (get) => get(baseAtom).speed,
    (get, set, speed: number) => {
      const timer = get(baseAtom);
      const newValue = { ...timer, speed };
      set(baseAtom, newValue);
    }
  );
  const counterAtom = atom(
    (get) => get(baseAtom).counter,
    (get, set, newValue: number) => {
      set(baseAtom, { ...get(baseAtom), counter: newValue });
    }
  );
  const tickAtom = atom(null, (get, set) =>
    set(baseAtom, (timer) => ({
      ...timer,
      counter: timer.counter + 1,
    }))
  );
  const isStarted = atom((get) => get(baseAtom).interval != null);

  const startAtom = atom(null, (get, set, tick: TickCallback) =>
    set(baseAtom, (timer) => ({
      ...timer,
      interval: restart(timer, tick),
    }))
  );

  const expScale = (value: number): number => {
    const minLog = Math.log(10); // 10 msec / tick
    const maxLog = Math.log(3000); // 3000 msec / tick
    const scale = minLog + (1 - value) * (maxLog - minLog);
    return Math.exp(scale);
  };

  const stopAtom = atom(null, (get, set) =>
    set(baseAtom, (timer) => {
      if (timer.interval) {
        clearInterval(timer.interval);
      }
      return { ...timer, interval: null };
    })
  );

  const resetAtom = atom(null, (get, set) =>
    set(baseAtom, (timer) => {
      return { ...timer, counter: 0 };
    })
  );

  return {
    isStartedAtom: isStarted,
    speedAtom,
    counterAtom,
    tickAtom,
    startAtom,
    stopAtom,
    resetAtom,
  };
};
