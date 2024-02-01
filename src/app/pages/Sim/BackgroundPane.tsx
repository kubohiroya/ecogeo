import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
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
  onMovedEnd,
  onMoved,
}: {
  width: number;
  height: number;
  sessionState: SessionState;
  uiState: UIState;
  matrices: AppMatrices;
  overrideViewportCenter: (viewportCenter: [number, number, number]) => void;
  onDragStart: (x: number, y: number, index: number) => void;
  onDrag: (dx: number, dy: number, index: number) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onPointerUp: (x: number, y: number, index: number) => void;
  onClearSelection: () => void;
  onDragEnd: (x: number, y: number, index: number) => void;
  onMoved: ({ x, y, zoom }: { x: number; y: number; zoom: number }) => void;
  onMovedEnd: ({ x, y, zoom }: { x: number; y: number; zoom: number }) => void;
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
      onDrag={onDrag}
      onMoved={onMoved}
      onMovedEnd={onMovedEnd}
      onDragEnd={onDragEnd}
      onFocus={onFocus}
      onUnfocus={onUnfocus}
      onPointerUp={onPointerUp}
      onClearSelection={onClearSelection}
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
