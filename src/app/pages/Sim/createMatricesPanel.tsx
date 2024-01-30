import { SessionState } from '../../models/SessionState';
import { AppMatrices } from '../../models/AppMatrices';
import { UIState } from '../../models/UIState';
import { AppPreference } from '../../models/AppPreference';
import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { GridOn } from '@mui/icons-material';
import MatrixSetPanel from '../../components/SessionPanel/MatrixSetPanel/MatrixSetPanel';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function onSelect(
  prevSelectedIndices: number[],
  indices: number[],
): void {
  // FIXME!
}

export function onFocus(indices: number[]): void {
  // FIXME!
}

export function onUnfocus(indices: number[]): void {
  // FIXME!
}

export function createMatricesPanel({
  height,
  sessionState,
  matrices,
  uiState,
  preferences,
}: {
  height: number;
  sessionState: SessionState;
  matrices: AppMatrices;
  uiState: UIState;
  preferences: AppPreference;
}): GridItem {
  return {
    layout: {
      i: 'Matrices',
      x: 10,
      y: Math.floor(height / ROW_HEIGHT - 14),
      w: 23,
      h: 10,
      isDraggable: true,
      isResizable: true,
      resizeHandles: ['se'],
    },
    resource: {
      id: 'Matrices',
      type: GridItemType.FloatingPanel,
      title: 'Matrices',
      icon: <GridOn />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'MatricesButton',
      children: (
        <MatrixSetPanel
          // ref={diagonalMatrixSetPanelRef}
          locations={sessionState?.locations}
          maxRowColLength={preferences?.maxRowColLength}
          adjacencyMatrix={matrices?.adjacencyMatrix}
          distanceMatrix={matrices?.distanceMatrix}
          transportationCostMatrix={matrices?.transportationCostMatrix}
          rgb={{ r: 23, g: 111, b: 203 }}
          selectedIndices={uiState?.selectedIndices}
          focusedIndices={uiState?.focusedIndices}
          onSelected={onSelect}
          onFocus={onFocus}
          onUnfocus={onUnfocus}
        />
      ),
    },
  };
}
