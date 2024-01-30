import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { BarChart } from '@mui/icons-material';
import { ChartPanel } from '../../components/SessionPanel/ChartPanel/ChartPanel';
import { ChartCanvas } from '../../components/SessionPanel/ChartPanel/ChartCanvas';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createChartPanel({
  sessionState,
  uiState,
  setSessionChartType,
  setSessionChartScale,
  onSelect,
  onUnselect,
  onFocus,
  onUnfocus,
}: {
  sessionState: SessionState;
  uiState: UIState;
  setSessionChartType: (chartTitle: string) => void;
  setSessionChartScale: (scale: number) => void;
  onSelect: (prevSelectedIndices: number[], indices: number[]) => void;
  onUnselect: (prevSelectedIndices: number[], indices: number[]) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
}): GridItem {
  return {
    layout: {
      i: 'Chart',
      x: 22,
      y: 0,
      w: 10,
      h: 10,
      isDraggable: true,
      isResizable: true,
      resizeHandles: ['se'],
    },
    resource: {
      id: 'Chart',
      type: GridItemType.FloatingPanel,
      title: 'Chart',
      icon: <BarChart />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'ChartButton',
      children: (
        <ChartPanel
          onChangeChartType={setSessionChartType}
          onChangeScale={setSessionChartScale}
          scale={uiState?.chartScale}
          chartType={uiState?.chartType}
        >
          <ChartCanvas
            width={300}
            height={300}
            chartTypeKey={uiState?.chartType}
            scale={uiState?.chartScale}
            locations={sessionState?.locations}
            focusedIndices={uiState?.focusedIndices}
            selectedIndices={uiState?.selectedIndices}
            onFocus={onFocus}
            onUnfocus={onUnfocus}
            onSelect={onSelect}
            onUnselect={onUnselect}
          />
        </ChartPanel>
      ),
    },
  };
}
