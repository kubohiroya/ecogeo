import { AppSimulation } from 'src/app/models/AppSimulation';
import TimeControlPanel from 'src/app/components/SessionPanel/TimeControPanel/TimeControlPanel';
import React from 'react';
import { useAtomValue } from 'jotai';
import { timerAtom } from 'src/app/hooks/timerAtom';

export const TimerControlPanelComponent = ({
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
