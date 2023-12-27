import React, { useCallback, useRef, useState } from 'react';
import { City } from '../../../../model/City';
import { Stage } from '@pixi/react';
import { Viewport } from './Viewport';
import { Edge } from '../../../../model/Graph';
import { CityDetailed } from './CityDetailed';
import * as PIXI from 'pixi.js';
import { FederatedPointerEvent } from 'pixi.js';
import { CITY_SVGDATA_URL } from '../CitySvgUrl';
import { FocusedLocationEffects } from './FocusedLocationEffects';
import { SelectedLocationEffects } from './SelectedLocationEffects';
import { Edges } from './Edges';
import { Locations } from './Locations';
import { FocusedEdgeEffects } from './FocusedEdgeEffects';
import { ViewportCenter } from '../../../../model/ViewportCenter';
import { BACKGROUND_COLOR } from '../Constatns';
import { getById } from '../../../../util/arrayUtil';
import { SessionState } from '../../../../model/SessionState';
import { AppMatrices } from '../../../../model/AppMatrices';
import { isInfinity } from '../../../../util/mathUtil';
import { ZoomedEvent } from 'pixi-viewport/dist/types';
import { CheckerBackground } from './CheckerBackground';

const cityTexture = PIXI.Texture.from(CITY_SVGDATA_URL);

export type GraphCanvasProps = {
  width: number;
  height: number;
  boundingBox: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    paddingMarginRatio: number;
  };
  setViewportCenter: (viewportCenter: ViewportCenter) => void;
  onDragStart: (x: number, y: number, index: number) => void;
  onDragEnd: (x: number, y: number, index: number) => void;
  onDrag: (diffX: number, diffY: number, index: number) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onPointerUp: (x: number, y: number, index: number) => void;
  onClearSelection: () => void;
  onMoved: (centerX: number, centerY: number, scale: number) => void;
  draggingIndex: number | null;
  sessionState: SessionState;
  focusedIndices: number[];
  selectedIndices: number[];
  viewportCenter: ViewportCenter | null;
  matrices: AppMatrices;
};

export const GraphCanvas = React.memo((props: GraphCanvasProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [backgroundAlpha, setBackgroundAlpha] = useState<number>(0);
  const sessionState = props.sessionState;

  const locations: City[] = sessionState.locations;
  const edges: Edge[] = sessionState.edges;
  const focusedIndices: number[] = props.focusedIndices;
  const selectedIndices = props.selectedIndices;

  const draggingLocation =
    props.draggingIndex != null
      ? sessionState.locations[props.draggingIndex]
      : null;

  const focusedLocation =
    props.focusedIndices.length > 0
      ? getById(sessionState.locations, props.focusedIndices[0])
      : null;

  const selectedLocation =
    props.selectedIndices.length > 0
      ? getById(sessionState.locations, props.selectedIndices[0])
      : null;

  const setBackgroundEnabled = useCallback(() => {
    setBackgroundAlpha(0.5);
  }, []);
  const setBackgroundDisabled = useCallback(() => {
    setBackgroundAlpha(0);
  }, []);

  function cancelWheelAndTouchMoveEvent(element: HTMLDivElement) {
    function cancelEvent(event: Event) {
      event.preventDefault();
      event.stopPropagation();
    }

    element.addEventListener('wheel', cancelEvent, { passive: false }); // passive: false を指定することで、preventDefault()が機能します
    element.addEventListener('touchmove', cancelEvent, { passive: false });

    return () => {
      element.removeEventListener('wheel', cancelEvent);
      element.removeEventListener('touchmove', cancelEvent);
    };
  }

  const onPointerEnter = useCallback(
    (event: PIXI.FederatedPointerEvent, index: number) => {
      divRef.current!.style.cursor = 'pointer';
      if (!draggingLocation) {
        props.onFocus([index]);
      }
    },
    [props.onFocus]
  );

  const onPointerLeave = useCallback(
    (event: PIXI.FederatedPointerEvent, index: number) => {
      divRef.current!.style.cursor = 'default';
      if (!draggingLocation) {
        props.onUnfocus([index]);
      }
    },
    [props.onUnfocus]
  );

  const onPointerDown = useCallback(
    (event: FederatedPointerEvent, index: number) => {},
    []
  );

  const onPointerUp = useCallback(
    (event: PIXI.FederatedPointerEvent, index: number) => {
      event.preventDefault();
      divRef.current!.style.cursor = 'default';
      props.onPointerUp(event.clientX, event.clientY, index);
    },
    [props.onPointerUp]
  );

  const onPointerMove = useCallback((event: PIXI.FederatedPointerEvent) => {},
  []);

  const clearSelection = useCallback(() => {
    props.onClearSelection();
  }, [props.onClearSelection]);

  const targetLocation =
    focusedLocation ?? draggingLocation ?? selectedLocation;
  const targetIndex =
    focusedIndices.length > 0
      ? focusedIndices[0]
      : props.draggingIndex && props.draggingIndex >= 0
      ? props.draggingIndex
      : selectedIndices.length > 0
      ? selectedIndices[0]
      : -1;

  const onSetViewportCenter = useCallback(
    (viewporCenter: ViewportCenter) => {
      props.setViewportCenter(viewporCenter);
    },
    [props.setViewportCenter]
  );

  const onDragStart = useCallback(() => {
    setBackgroundEnabled();
    divRef.current!.style.cursor = 'grabbing';
  }, []);

  const onDragEnd = useCallback(
    (ev: any) => {
      props.onMoved(ev.viewport.x, ev.viewport.y, ev.viewport.scale.x);
      setBackgroundDisabled();
      divRef.current!.style.cursor = 'default';
    },
    [props.viewportCenter]
  );

  const setDefaultCursor = useCallback(() => {
    divRef.current!.style.cursor = 'default';
  }, []);

  const onZoomed = useCallback((event: ZoomedEvent) => {
    setBackgroundEnabled();
  }, []);

  const onMoved = useCallback((ev: any) => {
    props.onMoved(ev.viewport.x, ev.viewport.y, ev.viewport.scale.x);
  }, []);

  return (
    <div ref={divRef} style={{ zIndex: 100 }}>
      <Stage
        width={props.width}
        height={props.height}
        options={{ backgroundColor: BACKGROUND_COLOR, backgroundAlpha: 0.1 }}
      >
        <Viewport
          pause={props.draggingIndex !== null}
          boundingBox={props.boundingBox}
          screenWidth={props.width}
          screenHeight={props.height}
          viewportCenter={props.viewportCenter}
          onSetViewportCenter={onSetViewportCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onPinchStart={setBackgroundEnabled}
          onPinchEnd={setBackgroundDisabled}
          onSnapStart={setBackgroundEnabled}
          onSnapEnd={setBackgroundDisabled}
          onSnapZoomStart={setBackgroundEnabled}
          onSnapZoomEnd={setBackgroundDisabled}
          onZoomed={onZoomed}
          onZoomedEnd={setBackgroundDisabled}
          onMouseUp={setDefaultCursor}
          onMoved={onMoved}
        >
          <CheckerBackground
            backgroundAlpha={backgroundAlpha}
            clearSelection={clearSelection}
          />
          <FocusedLocationEffects
            focusedIndices={focusedIndices}
            locations={locations}
            width={props.width}
            height={props.height}
          />
          <SelectedLocationEffects
            selectedIndices={selectedIndices}
            focusedIndices={focusedIndices}
            locations={locations}
            width={props.width}
            height={props.height}
          />
          {focusedIndices.length == 2 &&
            props.matrices.distanceMatrix &&
            focusedIndices[0] < props.matrices.distanceMatrix.length &&
            focusedIndices[1] <
              props.matrices.distanceMatrix[focusedIndices[0]].length &&
            !isInfinity(
              props.matrices.distanceMatrix[focusedIndices[0]][
                focusedIndices[1]
              ]
            ) && (
              <FocusedEdgeEffects
                edges={edges}
                locations={locations}
                width={props.width}
                height={props.height}
                focusedIndices={focusedIndices}
                adjacencyMatrix={props.matrices.adjacencyMatrix}
                distanceMatrix={props.matrices.distanceMatrix}
                predecessorMatrix={props.matrices.predecessorMatrix}
              />
            )}
          {selectedIndices.length == 2 &&
            !isInfinity(
              props.matrices.distanceMatrix![selectedIndices[0]][
                selectedIndices[1]
              ]
            ) && (
              <FocusedEdgeEffects
                edges={edges}
                locations={locations}
                width={props.width}
                height={props.height}
                focusedIndices={selectedIndices}
                adjacencyMatrix={props.matrices.adjacencyMatrix}
                distanceMatrix={props.matrices.distanceMatrix}
                predecessorMatrix={props.matrices.predecessorMatrix}
                color={0xff3333}
              />
            )}
          <Edges
            edges={edges}
            locations={locations}
            focusedIndices={focusedIndices}
            selectedIndices={selectedIndices}
          />
          <Locations
            locations={locations}
            selectedIndices={selectedIndices}
            draggingIndex={props.draggingIndex}
            onDragStart={props.onDragStart}
            onDragEnd={props.onDragEnd}
            onDrag={props.onDrag}
            width={props.width}
            height={props.height}
            cityTexture={cityTexture}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
          />
        </Viewport>
        {targetLocation && (
          <CityDetailed
            index={targetIndex}
            city={targetLocation}
            x={95}
            y={props.height - 155}
          />
        )}
      </Stage>
    </div>
  );
});
