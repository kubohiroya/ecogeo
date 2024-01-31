import { atom } from 'jotai/index';
import { useEffect, useRef, useState } from 'react';
import { useImmerAtom } from 'jotai-immer';
import { expScale } from '../utils/mathUtil';

type Timer = {
  interval: number;
  isStarted: boolean;
  counter: number;
};
const initialTimer: Timer = {
  interval: 0,
  isStarted: false,
  counter: 0,
};

export const timerAtom = atom<Timer>(initialTimer);

const useInterval = (props: {
  tick: () => void;
  onStarted: () => void;
  onReset: () => void;
  onStopped: () => void;
}) => {
  const [timer, setTimer] = useImmerAtom(timerAtom);

  const currentInterval = useRef<number>(Number.POSITIVE_INFINITY);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const changeInterval = (interval: number) => {
    setTimer((draft) => {
      draft.interval = interval;
      return draft;
    });
  };

  const start = () => {
    setTimer((draft) => {
      draft.isStarted = true;
      return draft;
    });
    props.onStarted();
  };

  const stop = () => {
    setTimer((draft) => {
      draft.isStarted = false;
      return draft;
    });
  };

  const reset = () => {
    setTimer((draft) => {
      draft.counter = 0;
      return draft;
    });
    props.onReset();
  };

  useEffect(() => {
    if (!timer.isStarted && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timer.isStarted && currentInterval.current !== timer.interval) {
      currentInterval.current = timer.interval;
      intervalRef.current = setInterval(() => {
        props.tick();
        setTimer((draft) => {
          draft.counter++;
          return draft;
        });
      }, timer.interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        currentInterval.current = Number.POSITIVE_INFINITY;
      }
    };
  }, [timer.counter, timer.isStarted, timer.interval]);

  return {
    changeInterval,
    start,
    stop,
    reset,
  };
};

export function useIntervalExpScale(props: {
  onStarted: () => void;
  onReset: () => void;
  onStopped: () => void;
  tick: () => void;
  minInterval: number;
  maxInterval: number;
  initialIntervalScale: number;
}) {
  const [intervalScale, setIntervalScale] = useState<number>(
    props.initialIntervalScale,
  );
  const interval = expScale(
    props.minInterval,
    props.maxInterval,
    intervalScale,
  );

  const { changeInterval, start, stop, reset } = useInterval({
    tick: props.tick,
    onStarted: props.onStarted,
    onReset: props.onReset,
    onStopped: props.onStopped,
  });

  const changeIntervalScale = (newScale: number) => {
    setIntervalScale(newScale);
    const interval = expScale(props.minInterval, props.maxInterval, newScale);
    changeInterval(interval);
  };

  return {
    changeIntervalScale,
    start,
    stop,
    reset,
    interval,
    intervalScale,
  };
}
