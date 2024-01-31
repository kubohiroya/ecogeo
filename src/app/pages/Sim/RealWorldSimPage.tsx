import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import MapComponent from '../../components/SessionPanel/MapPanel/deckgl/MapComponent';
import { useLoaderData } from 'react-router-dom';
import { useWindowDimensions } from '../../hooks/useWindowDimenstions';
import { MapCopyright } from '../../../components/MapCopyright/MapCopyright';
import { SessionState } from '../../models/SessionState';
import { SimLoaderResult } from './SimLoader';
import { SimComponent } from './SimComponent';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { ViewportCenter } from '../../models/ViewportCenter';
import { ProjectTypes } from '../../services/database/ProjectType';

export const RealWorldSimPage = () => {
  const { uuid, x, y, zoom } = useLoaderData() as SimLoaderResult;
  const { width, height } = useWindowDimensions();
  return (
    <SimComponent
      type={ProjectTypes.realWorld}
      {...{ uuid, x, y, zoom }}
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
