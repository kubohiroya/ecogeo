import { useState } from 'react';
import useInterval from './useInterval';
import { expScale } from '../utils/mathUtil';

export function _useIntervalExpScale<T>(props: {
  onStarted: () => void;
  tick: () => T;
  onReset: () => void;
  isStopped: (result: T) => boolean;
  onStopped: (result: T) => void;
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

  const { changeInterval, start, stop, isStarted, counter, reset, result } =
    useInterval<T>({
      onStarted: props.onStarted,
      onReset: props.onReset,
      tick: props.tick,
      isStopped: props.isStopped,
      onStopped: props.onStopped,
      interval,
    });

  const changeIntervalScale = (newScale: number) => {
    setIntervalScale(newScale);
    const interval = expScale(props.minInterval, props.maxInterval, newScale);
    changeInterval(interval);
  };

  return {
    changeIntervalScale,
    interval,
    start,
    stop,
    isStarted,
    counter,
    reset,
    result,
    intervalScale,
  };
}
