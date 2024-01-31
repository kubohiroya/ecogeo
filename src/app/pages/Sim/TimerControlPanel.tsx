import { AppSimulation } from '../../models/AppSimulation';
import TimeControlPanel from '../../components/SessionPanel/TimeControPanel/TimeControlPanel';
import React from 'react';
import { useAtomValue } from 'jotai';
import { timerAtom } from '../../hooks/timerAtom';

export const TimerControlPane = ({
  simulation,
}: {
  simulation: AppSimulation;
}) => {
  const { counter, isStarted } = useAtomValue(timerAtom);
  return (
    <TimeControlPanel
      isStarted={isStarted}
      counter={counter}
      intervalScale={simulation.intervalScale}
      start={simulation.start}
      stop={simulation.stop}
      reset={simulation.reset}
      changeIntervalScale={simulation.changeIntervalScale}
    />
  );
};
