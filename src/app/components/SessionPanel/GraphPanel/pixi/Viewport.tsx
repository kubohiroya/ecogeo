import React, { useEffect, useLayoutEffect } from 'react';
import { PixiComponent, useApp } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { ViewportCenter } from '../../../../model/ViewportCenter';
import { createViewportCenter } from '../CreateViewportCenter';
import { BoundingBox } from '../../../../type/BoundingBox';
import { ZoomedEvent } from 'pixi-viewport/dist/types';
import PixiViewportDragEvent = GlobalMixins.PixiVieportDragEvent;
import PixiViewportMovedEvent = GlobalMixins.PixiVieportMovedEvent;

export interface ViewportBaseProps {
  pause: boolean;
  boundingBox: BoundingBox;
  viewportCenter: ViewportCenter | null;
  onSetViewportCenter: (viewportWindow: ViewportCenter) => void;
  screenWidth: number;
  screenHeight: number;
  children?: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: (ev: PixiViewportDragEvent) => void;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  onSnapStart?: () => void;
  onSnapEnd?: () => void;
  onSnapZoomStart?: () => void;
  onSnapZoomEnd?: () => void;
  onZoomed?: (event: ZoomedEvent) => void;
  onZoomedEnd?: () => void;
  onMouseUp: () => void;

  onMoved?: (ev: PixiViewportMovedEvent) => void;
}

export interface ViewportAppProps extends ViewportBaseProps {
  app: PIXI.Application;
}

const createPixiViewport = (props: ViewportAppProps) => {
  const viewport = new PixiViewport({
    passiveWheel: false,
    events: props.app.renderer.events,
    stopPropagation: true,
    screenWidth: props.screenWidth,
    screenHeight: props.screenHeight,

    worldWidth: 1000,
    worldHeight: 1000,
  });

  viewport.moveCenter(
    props.viewportCenter?.centerX || 0,
    props.viewportCenter?.centerY || 0
  );
  viewport.setZoom(props.viewportCenter?.scale || 1, true);

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

  props.onMoved && viewport.on('moved', props.onMoved);

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
    if (props.screenWidth == 0) return;

    const viewport = app.stage.getChildAt(0) as PixiViewport;

    const viewportCenter = createViewportCenter({
      left,
      top,
      right,
      bottom,
      width: props.screenWidth,
      height: props.screenHeight,
      paddingMarginRatio,
    });

    viewport.moveCenter(viewportCenter.centerX, viewportCenter.centerY);
    viewport.setZoom(viewportCenter.scale, true);

    requestAnimationFrame(() => {
      props.onSetViewportCenter(viewportCenter);
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      const viewport = app.stage.getChildAt(0) as PixiViewport;
      if (props.screenWidth > 0 && props.screenHeight > 0) {
        if (props.viewportCenter) {
          viewport.moveCenter(
            props.viewportCenter.centerX,
            props.viewportCenter.centerY
          );
          viewport.setZoom(props.viewportCenter.scale, true);
        } else {
          fit(props.boundingBox);
        }
      }
    });
  }, [props.viewportCenter]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      const viewport = app.stage.getChildAt(0) as PixiViewport;
      viewport.pause = props.pause;
    });
  }, [props.pause]);

  const PixiComponentViewport = PixiComponent('Viewport', {
    create: (props: ViewportAppProps) => {
      const viewport = createPixiViewport(props);
      viewport.options.events.domElement = props.app.renderer.view as any;
      return viewport;
    },
    didMount(viewport: PixiViewport, parent: Container) {
      fit(props.boundingBox);
    },
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
