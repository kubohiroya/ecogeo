import { AppSimulation } from '../../models/AppSimulation';
import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Timer } from '@mui/icons-material';
import TimeControlPanel from '../../components/SessionPanel/TimeControPanel/TimeControlPanel';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createTimeControlPanel({
  simulation,
}: {
  simulation: AppSimulation;
}): GridItem {
  return {
    layout: {
      i: 'TimerControl',
      x: 1,
      y: 12,
      w: 8,
      h: 4,
      minW: 8,
      minH: 4,
      isDraggable: true,
      isResizable: true,
      resizeHandles: ['se'],
    },
    resource: {
      id: 'TimerControl',
      type: GridItemType.FloatingPanel,
      title: 'TimerControl',
      icon: <Timer />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'TimerControlButton',
      children: (
        <TimeControlPanel
          counter={simulation.counter}
          isStarted={simulation.isStarted}
          onStart={simulation.start}
          onStop={simulation.stop}
          onReset={simulation.reset}
          intervalScale={simulation.intervalScale}
          changeIntervalScale={simulation.changeIntervalScale}
        />
      ),
    },
  };
}
