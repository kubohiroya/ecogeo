import React, { useEffect, useRef, useState } from 'react';
import { GeoLocation } from '../model/GeoLocation';
import * as PIXI from 'pixi.js';
import { Application, Graphics } from 'pixi.js';
import styled from '@emotion/styled';
import { Viewport } from 'pixi-viewport';

export type GraphCanvasProps = {
  /*
  width: number;
  height: number;
  focusedIds: number[];
  selectedIds: number[];
   */
  locations: GeoLocation[];
  onFocus: (indices: number[]) => void;
  onSelect: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onUnselect: (indices: number[]) => void;
};

const CanvasContainer = styled.div`
  overflow: hidden;
  border-radius: 8px;
`;

const createGraphics = (width: number, height: number) => {
  const graphics = new PIXI.Graphics();
  graphics.lineStyle(3, 0x000000, 1);
  graphics.beginFill(0xffffff, 1);
  graphics.drawRect(0, 0, width, height);
  graphics.endFill();
  return graphics;
};

function cancelWheelAndTouchMoveEvent(element: HTMLElement) {
  function cancelEvent(event: Event) {
    // デフォルトのスクロール動作をキャンセルします
    event.preventDefault();
    // イベントが外部に伝播しないようにします
    event.stopPropagation();
    // ここで要素内でのホイール操作に対する処理を行います
  }

  // ホイールイベントのリスナーを追加します
  element.addEventListener('wheel', cancelEvent, { passive: false }); // passive: false を指定することで、preventDefault()が機能します
  // タッチイベントのリスナーも同様に追加できます
  element.addEventListener('touchmove', cancelEvent, { passive: false });
}

const createGraphics2 = (width: number, height: number) => {
  const graphics = new PIXI.Graphics();
  // Rectangle
  graphics.beginFill(0xde3249);
  graphics.drawRect(50, 50, 100, 100);
  graphics.endFill();

  // Rectangle + line style 1
  graphics.lineStyle(2, 0xfeeb77, 1);
  graphics.beginFill(0x650a5a);
  graphics.drawRect(200, 50, 100, 100);
  graphics.endFill();

  // Rectangle + line style 2
  graphics.lineStyle(10, 0xffbd01, 1);
  graphics.beginFill(0xc34288);
  graphics.drawRect(350, 50, 100, 100);
  graphics.endFill();

  // Rectangle 2
  graphics.lineStyle(2, 0xffffff, 1);
  graphics.beginFill(0xaa4f08);
  graphics.drawRect(530, 50, 140, 100);
  graphics.endFill();

  // Circle
  graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
  graphics.beginFill(0xde3249, 1);
  graphics.drawCircle(100, 250, 50);
  graphics.endFill();

  // Circle + line style 1
  graphics.lineStyle(2, 0xfeeb77, 1);
  graphics.beginFill(0x650a5a, 1);
  graphics.drawCircle(250, 250, 50);
  graphics.endFill();

  // Circle + line style 2
  graphics.lineStyle(10, 0xffbd01, 1);
  graphics.beginFill(0xc34288, 1);
  graphics.drawCircle(400, 250, 50);
  graphics.endFill();

  // Ellipse + line style 2
  graphics.lineStyle(2, 0xffffff, 1);
  graphics.beginFill(0xaa4f08, 1);
  graphics.drawEllipse(600, 250, 80, 50);
  graphics.endFill();

  // draw a shape
  graphics.beginFill(0xff3300);
  graphics.lineStyle(4, 0xffd900, 1);
  graphics.moveTo(50, 350);
  graphics.lineTo(250, 350);
  graphics.lineTo(100, 400);
  graphics.lineTo(50, 350);
  graphics.closePath();
  graphics.endFill();

  // draw a rounded rectangle
  graphics.lineStyle(2, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(50, 440, 100, 100, 16);
  graphics.endFill();

  // draw polygon
  const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

  graphics.lineStyle(0);
  graphics.beginFill(0x3500fa, 1);
  graphics.drawPolygon(path);
  graphics.endFill();

  graphics.lineStyle(0);
  graphics.drawRoundedRect(10, 10, 1000, 100, 10);
  graphics.endFill();
  return graphics;
};

export function GraphCanvas(props: GraphCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);

  const parent = ref.current?.parentNode as HTMLDivElement | null;
  const [app, setApp] = useState<Application<HTMLCanvasElement> | null>(null);

  //let application: Application<HTMLCanvasElement> | null = null;
  let graphics: Graphics | null = null;

  // let isDragging = false;
  // setMouseDownPoint = useState<DOMPoint | null>(null);

  /*
  const repaint = () => {
    if (graphics == null) {
      return;
    }
    if (app != null) {
      if (app.stage.children.length == 0) {
        app.stage.addChild(graphics);
      } else {
        graphics.transform.position.x = 0;
        graphics.transform.position.y = 0;
      }
    }
  };
   */

  useEffect(() => {
    if (parent == null) {
      return;
    }

    const numChildren = ref.current?.children.length;

    //console.log('len=', numChildren, ref.current?.children.item(0));
    if (numChildren == 0) {
      console.log('init');

      cancelWheelAndTouchMoveEvent(parent);
      graphics = createGraphics2(parent!.clientWidth, parent!.clientHeight);

      const application = new PIXI.Application<HTMLCanvasElement>({
        background: '#fff',
        resizeTo: parent,
      });
      setApp(application);
      if (application == null) {
        throw new Error();
      }

      const viewport = new Viewport({
        screenWidth: parent!.clientWidth,
        screenHeight: parent!.clientHeight,
        worldWidth: 2000,
        worldHeight: 2000,
        events: application.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      });

      //console.log('addChild');
      //application.stage.addChild(viewport);

      viewport.drag().pinch().wheel().decelerate();
      viewport.addChild(graphics);

      application.stage.addChild(viewport);

      ref.current?.appendChild(application.view);
    }

    if (app != null) {
      console.log('resize', parent!.clientWidth);
      app.resize();
    } else {
      console.log('?', parent!.clientWidth);
    }

    /*
    ref.current?.addEventListener('mousedown', (event: MouseEvent) => {
      mouseDownPoint = new DOMPoint(event.offsetX, event.offsetY);
    });
    ref.current?.addEventListener('mousemove', (event: MouseEvent) => {
      if (mouseDownPoint == null) return;
    });
    ref.current?.addEventListener('mouseup', (event: MouseEvent) => {
      if (mouseDownPoint == null) return;
      if (graphics != null) {
        graphics.transform.position.x -= event.offsetX - mouseDownPoint.x;
        graphics.transform.position.y -= event.offsetY - mouseDownPoint.y;
        console.log(
          graphics.transform.position.x,
          graphics.transform.position.y
        );
      }
      mouseDownPoint = null;
    });
     */
  }, [parent, parent?.clientWidth, ref.current?.clientWidth]);

  /*
  useEffect(() => {
    application && application.resize();
  }, [parent]);
   */

  return <CanvasContainer ref={ref}></CanvasContainer>;
}
