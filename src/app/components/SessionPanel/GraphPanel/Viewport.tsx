import React, { useEffect } from 'react';
import { PixiComponent, useApp } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { ViewportWindow } from '../../../model/ViewportWindow';
import { createViewportWindow } from './CreateViewportWindow';
import { BoundingBox } from '../../../type/BoundingBox';
import { ZoomedEvent } from 'pixi-viewport/dist/types';

export interface ViewportBaseProps {
  pause: boolean;
  boundingBox: BoundingBox;
  viewportWindow: ViewportWindow | null;
  onSetViewportWindow: (viewportWindow: ViewportWindow) => void;
  screenWidth: number;
  screenHeight: number;
  children?: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  onSnapStart?: () => void;
  onSnapEnd?: () => void;
  onSnapZoomStart?: () => void;
  onSnapZoomEnd?: () => void;
  onZoomed?: (event: ZoomedEvent) => void;
  onZoomedEnd?: () => void;
  onMouseUp: () => void;
}

export interface ViewportAppProps extends ViewportBaseProps {
  app: PIXI.Application;
}

const createPixiViewport = (props: ViewportAppProps) => {
  const viewport = new PixiViewport({
    passiveWheel: false,
    events: props.app.renderer.events,
    stopPropagation: true,
    //ticker: props.app.ticker,
    screenWidth: props.screenWidth, //window.innerWidth,
    screenHeight: props.screenHeight, //window.innerHeight,

    worldWidth: 1000,
    worldHeight: 1000,
  });

  viewport.moveCenter(
    props.viewportWindow?.centerX || 0,
    props.viewportWindow?.centerY || 0
  );
  viewport.setZoom(props.viewportWindow?.scale || 1, true);

  viewport
    .drag({
      wheel: false,
    })
    .wheel({
      wheelZoom: true,
    })
    .pinch()
    .clampZoom({
      maxScale: 5,
      minScale: 0.1,
    });

  props.onDragStart && viewport.on('drag-start', props.onDragStart);
  props.onDragEnd && viewport.on('drag-end', props.onDragEnd);
  props.onPinchStart && viewport.on('pinch-start', props.onPinchStart);
  props.onPinchEnd && viewport.on('pinch-end', props.onPinchEnd);
  props.onSnapStart && viewport.on('snap-start', props.onSnapStart);
  props.onSnapEnd && viewport.on('snap-end', props.onSnapEnd);
  props.onSnapZoomStart &&
    viewport.on('snap-zoom-start', props.onSnapZoomStart);
  props.onSnapZoomEnd && viewport.on('snap-zoom-end', props.onSnapZoomEnd);
  props.onZoomed && viewport.on('zoomed', props.onZoomed);
  props.onZoomedEnd && viewport.on('zoomed-end', props.onZoomedEnd);
  props.onMouseUp && viewport.on('mouseup', props.onMouseUp);

  return viewport;
};

export const Viewport = (props: ViewportBaseProps) => {
  const app = useApp();

  const fit = ({
    left,
    top,
    right,
    bottom,
    paddingMarginRatio,
  }: BoundingBox) => {
    const viewport = app.stage.getChildAt(0) as PixiViewport;

    const viewportWindow = createViewportWindow({
      left,
      top,
      right,
      bottom,
      screenWidth: props.screenWidth,
      screenHeight: props.screenHeight,
      paddingMarginRatio,
    });

    viewport.moveCenter(viewportWindow.centerX, viewportWindow.centerY);
    viewport.setZoom(viewportWindow.scale, true);

    props.onSetViewportWindow(viewportWindow);
  };

  useEffect(() => {
    const viewport = app.stage.getChildAt(0) as PixiViewport;
    if (props.screenWidth > 0 && props.screenHeight > 0) {
      if (props.viewportWindow) {
        viewport.moveCenter(
          props.viewportWindow.centerX,
          props.viewportWindow.centerY
        );
        viewport.setZoom(props.viewportWindow.scale, true);
      } else {
        fit(props.boundingBox);
      }
    }
  }, [props.screenWidth, props.screenHeight, props.viewportWindow]);

  useEffect(() => {
    const viewport = app.stage.getChildAt(0) as PixiViewport;
    viewport.pause = props.pause;
  }, [props.pause]);

  const PixiComponentViewport = PixiComponent('Viewport', {
    create: (props: ViewportAppProps) => {
      const viewport = createPixiViewport(props);
      viewport.options.events.domElement = props.app.renderer.view as any;
      return viewport;
    },
    didMount(viewport: PixiViewport, parent: Container) {},
    willUnmount: (viewport: PixiViewport) => {
      /*
      props.onSetViewportWindow({
        centerX: viewport.center.x,
        centerY: viewport.center.y,
        scale: viewport.scaled,
      });
       */
      //viewport.options.noTicker = true;
      viewport.destroy({ children: true });
    },
  });

  return <PixiComponentViewport app={app} {...props} />;
};
