import { useState } from 'react';
import useInterval from './useInterval';
import { expScale } from '../util/mathUtil';

function useIntervalExpScale<T>(props: {
  onStarted: () => void;
  tick: () => T;
  onReset: () => void;
  isFinished: (result: T) => boolean;
  onFinished: (result: T) => void;
  minInterval: number;
  maxInterval: number;
  initialIntervalScale: number;
}) {
  const [intervalScale, setIntervalScale] = useState<number>(
    props.initialIntervalScale
  );
  const interval = expScale(
    props.minInterval,
    props.maxInterval,
    intervalScale
  );

  const { changeInterval, start, stop, isStarted, counter, reset, result } =
    useInterval<T>({
      onStarted: props.onStarted,
      onReset: props.onReset,
      tick: props.tick,
      isFinished: props.isFinished,
      onFinished: props.onFinished,
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

export default useIntervalExpScale;
