import { AppSimulation } from '../../models/AppSimulation';
import TimeControlPanel from '../../components/SessionPanel/TimeControPanel/TimeControlPanel';
import React from 'react';

export const TimerControlPane = ({
  simulation,
}: {
  simulation: AppSimulation;
}) => {
  console.log('*', simulation.counter);
  return (
    <TimeControlPanel
      isStarted={simulation.isStarted}
      counter={simulation.counter}
      intervalScale={simulation.intervalScale}
      start={simulation.start}
      stop={simulation.stop}
      reset={simulation.reset}
      changeIntervalScale={simulation.changeIntervalScale}
    />
  );
};
