import { EuclideanCanvas } from '../../components/SessionPanel/MapPanel/pixi/EuclideanCanvas';
import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import React from 'react';
import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { calcBoundingRect } from '../../components/SessionPanel/MapPanel/calcBoundingRect';
import { PADDING_MARGIN_RATIO } from '../../components/SessionPanel/MapPanel/Constatns';
import { ViewportCenter } from '../../models/ViewportCenter';

export function createBackground({
  width,
  height,
  sessionState,
  uiState,
  matrices,
  setSessionViewportCenter,
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
  setSessionViewportCenter: (viewportCenter: ViewportCenter) => void;
  onDragStart: (x: number, y: number, index: number) => void;
  onDragEnd: (x: number, y: number, index: number) => void;
  onDrag: (dx: number, dy: number, index: number) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onPointerUp: (x: number, y: number, index: number) => void;
  onClearSelection: () => void;
  onMoved: (dx: number, dy: number, index: number) => void;
}): GridItem {
  return {
    layout: {
      i: 'Background',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      static: true,
    },
    resource: {
      id: 'Background',
      type: GridItemType.Background,
      children: (
        <div
          style={{
            width: width + 'px',
            height: height + 'px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eef',
          }}
        >
          {
            <EuclideanCanvas
              width={width}
              height={height}
              boundingBox={{
                ...calcBoundingRect(sessionState?.locations),
                paddingMarginRatio: PADDING_MARGIN_RATIO,
              }}
              setViewportCenter={setSessionViewportCenter}
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
              selectedIndices={uiState.selectedIndices}
              focusedIndices={uiState.focusedIndices}
              matrices={matrices}
            />
          }
        </div>
      ),
      shown: true,
      enabled: true,
    },
  };
}
