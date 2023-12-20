import { useEffect, useRef, useState } from 'react';

const useInterval = <T>(props: {
  tick: () => T;
  isFinished: (result: T) => boolean;
  onStarted: () => void;
  onReset: () => void;
  onFinished: (result: T) => void;
  interval: number;
}) => {
  const [interval, setIntervalValue] = useState<number>(props.interval);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [result, setResult] = useState<T>();
  const currentInterval = useRef<number>(Number.POSITIVE_INFINITY);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const changeInterval = (interval: number) => {
    setIntervalValue(interval);
  };

  const start = () => {
    setIsStarted(true);
    props.onStarted();
  };

  const stop = () => {
    setIsStarted(false);
  };

  const reset = () => {
    setCounter(0);
    props.onReset();
  };

  useEffect(() => {
    if (!isStarted && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isStarted && currentInterval.current != interval) {
      currentInterval.current = interval;
      intervalRef.current = setInterval(() => {
        const tickResult = props.tick();

        if (props.isFinished(tickResult)) {
          setResult(tickResult);
          setIsStarted(false);
          props.onFinished(tickResult);
        } else {
          setCounter((prevCounter) => prevCounter + 1);
        }
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        currentInterval.current = Number.POSITIVE_INFINITY;
      }
    };
  }, [isStarted, interval, props.tick]);

  return {
    changeInterval,
    interval,
    start,
    stop,
    isStarted,
    counter,
    reset,
    result,
  };
};

export default useInterval;
