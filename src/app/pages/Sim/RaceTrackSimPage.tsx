import React from 'react';
import { SimLoaderResult } from './SimLoader';
import { useLoaderData } from 'react-router-dom';
import { SimComponent } from './SimComponent';
import { BackgroundPane } from './BackgroundPane';
import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { ViewportCenter } from '../../models/ViewportCenter';
import { ProjectTypes } from '../../services/database/ProjectType';

export const RaceTrackSimPage = () => {
  const { uuid, x, y, zoom } = useLoaderData() as SimLoaderResult;

  return (
    <SimComponent
      type={ProjectTypes.racetrack}
      {...{ uuid, x, y, zoom }}
      backgroundPanel={(params: {
        width: number;
        height: number;
        sessionState: SessionState;
        uiState: UIState;
        matrices: AppMatrices;
        onDragStart: (x: number, y: number, index: number) => void;
        onDragEnd: (diffX: number, diffY: number, index: number) => void;
        onDrag: (diffX: number, diffY: number, index: number) => void;
        onFocus: (focusIndices: number[]) => void;
        onUnfocus: (unfocusIndices: number[]) => void;
        onPointerUp: (x: number, y: number, index: number) => void;
        onClearSelection: () => void;
        overrideViewportCenter: (viewportCenter: ViewportCenter) => void;
        onMoved: ({
          zoom,
          y,
          x,
        }: {
          x: number;
          y: number;
          zoom: number;
        }) => void;
        onMovedEnd: ({
          zoom,
          y,
          x,
        }: {
          x: number;
          y: number;
          zoom: number;
        }) => void;
      }) => <BackgroundPane {...params} />}
    />
  );
};
