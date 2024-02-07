import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import MapComponent from '../../components/SessionPanel/MapPanel/deckgl/MapComponent';
import { useLoaderData } from 'react-router-dom';
import { useWindowDimensions } from 'src/app/hooks/useWindowDimenstions';
import { MapCopyright } from 'src/components/MapCopyright/MapCopyright';
import { SessionState } from 'src/app/models/SessionState';
import { SimComponent } from './SimComponent';
import { UIState } from 'src/app/models/UIState';
import { AppMatrices } from 'src/app/models/AppMatrices';
import { ProjectType } from 'src/app/models/ProjectType';
import { SimLoaderResult } from './SimLoader';

export const RealWorldSimPage = () => {
  const { uuid, zoom, y, x, type } = useLoaderData() as SimLoaderResult;
  const { width, height } = useWindowDimensions();

  return (
    <SimComponent
      {...{
        uuid,
        type: type as ProjectType,
        viewportCenter: [zoom, y, x],
      }}
      backgroundColor="rgba(230,230,230,0.6)"
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
      }) => (
        <MapComponent
          uuid={uuid}
          map="openstreetmap"
          width={width}
          height={height}
        >
          <MapCopyright />
        </MapComponent>
      )}
    />
  );
};
