import React from 'react';
import { SimLoaderResult } from './SimLoader';
import { useLoaderData } from 'react-router-dom';
import { SimComponent } from './SimComponent';
import { BackgroundPane } from './BackgroundPane';
import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { ProjectType } from '../../services/database/ProjectType';

export const RaceTrackSimPage = () => {
  const { uuid, x, y, zoom, type } = useLoaderData() as SimLoaderResult;

  return (
    <SimComponent
      {...{
        uuid,
        type: type as ProjectType,
        viewportCenter: [zoom, x, y],
      }}
      backgroundColor="rgba(255,230,230,0.6)"
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
        overrideViewportCenter: (
          viewportCenter: [number, number, number],
        ) => void;
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
