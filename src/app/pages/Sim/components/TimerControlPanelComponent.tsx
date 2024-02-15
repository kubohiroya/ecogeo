import { AppSimulation } from '~/app/models/AppSimulation';
import TimeControlPanel from '~/app/components/SessionPanel/TimeControPanel/TimeControlPanel';
import React from 'react';
import { useAtomValue } from 'jotai';
import { timerAtom } from '~/app/hooks/timerAtom';

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
