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
import { ProjectType } from '../../services/database/ProjectType';

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;
const ROW_HEIGHT = 32;

export const RealWorldSimPage = () => {
  const { type, uuid, x, y, zoom } = useLoaderData() as SimLoaderResult;
  const { width, height } = useWindowDimensions();
  return (
    <SimComponent
      type={ProjectType.realWorld}
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
