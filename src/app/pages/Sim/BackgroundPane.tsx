import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { ViewportCenter } from '../../models/ViewportCenter';
import { EuclideanCanvas } from '../../components/SessionPanel/MapPanel/pixi/EuclideanCanvas';
import { calcBoundingRect } from '../../components/SessionPanel/MapPanel/calcBoundingRect';
import { PADDING_MARGIN_RATIO } from '../../components/SessionPanel/MapPanel/Constatns';
import React from 'react';

export function BackgroundPane({
  width,
  height,
  sessionState,
  uiState,
  matrices,
  overrideViewportCenter,
  onDragStart,
  onDragEnd,
  onDrag,
  onFocus,
  onUnfocus,
  onPointerUp,
  onClearSelection,
  onMoved,
}: {
  width: number;
  height: number;
  sessionState: SessionState;
  uiState: UIState;
  matrices: AppMatrices;
  overrideViewportCenter: (viewportCenter: ViewportCenter) => void;
  onDragStart: (x: number, y: number, index: number) => void;
  onDragEnd: (x: number, y: number, index: number) => void;
  onDrag: (dx: number, dy: number, index: number) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onPointerUp: (x: number, y: number, index: number) => void;
  onClearSelection: () => void;
  onMoved: ({ x, y, zoom }: { x: number; y: number; zoom: number }) => void;
}) {
  return (
    <EuclideanCanvas
      width={width}
      height={height}
      boundingBox={{
        ...calcBoundingRect(sessionState.locations),
        paddingMarginRatio: PADDING_MARGIN_RATIO,
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      onFocus={onFocus}
      onUnfocus={onUnfocus}
      onPointerUp={onPointerUp}
      onClearSelection={onClearSelection}
      onMoved={onMoved}
      draggingIndex={uiState.draggingIndex}
      sessionState={sessionState}
      viewportCenter={uiState.viewportCenter}
      overrideViewportCenter={overrideViewportCenter}
      selectedIndices={uiState.selectedIndices}
      focusedIndices={uiState.focusedIndices}
      matrices={matrices}
    />
  );
}
