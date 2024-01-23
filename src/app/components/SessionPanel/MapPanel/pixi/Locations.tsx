import React, { useCallback } from 'react';
import { Container, Graphics, Sprite, Text } from '@pixi/react';
import { FederatedPointerEvent, Resource, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { StyleSize14, StyleSize14Focused } from './FontStyles';
import { City } from '../../../../models/City';

type LocationsProps = {
  locations: City[];
  selectedIndices: number[];
  draggingIndex: number | null;
  width: number;
  height: number;
  cityTexture: Texture<Resource>;
  onDragStart: (x: number, y: number, index: number) => void;
  onDragEnd: (x: number, y: number, index: number) => void;
  onDrag: (diffX: number, diffY: number, index: number) => void;
  onPointerEnter: (event: FederatedPointerEvent, index: number) => void;
  onPointerLeave: (event: FederatedPointerEvent, index: number) => void;
  onPointerDown: (event: FederatedPointerEvent, index: number) => void;
  onPointerUp: (event: FederatedPointerEvent, index: number) => void;
  onPointerMove: (event: FederatedPointerEvent, index: number) => void;
};

export const Locations = (props: LocationsProps) => {
  return (
    <Container>
      {props.locations.map((location, index) => (
        <Location index={index} key={location.id} {...props} />
      ))}
    </Container>
  );
};

const Location = (props: { index: number } & LocationsProps) => {
  const [focusingIndex, setFocusingIndex] = React.useState<number | null>(null);
  const location = props.locations[props.index];

  const onDragStart = useCallback(
    (event: FederatedPointerEvent) => {
      event.preventDefault();
      props.onDragStart(event.clientX, event.clientY, props.index);
    },
    [props.index],
  );

  const onPointerMove = useCallback(
    (event: FederatedPointerEvent) => {
      event.preventDefault();
      if (props.draggingIndex == props.index) {
        event.currentTarget.cursor = 'grabbing';
        const viewport = event.currentTarget.parent!.parent as Viewport;
        const localPosition = event.getLocalPosition(viewport);
        const city = props.locations[props.index];
        const diffX = localPosition.x - city.point[0];
        const diffY = localPosition.y - city.point[1];
        props.onDrag(diffX, diffY, props.index);
      }
    },
    [props.draggingIndex, props.locations, props.onDrag, props.index],
  );

  const onPointerUp = useCallback(
    (event: FederatedPointerEvent) => {
      event.preventDefault();
      event.currentTarget.cursor = 'pointer';
      props.onPointerUp(event, props.index);
      props.onDragEnd(event.clientX, event.clientY, props.index);
    },
    [props.onPointerUp, props.onDragEnd, props.index, focusingIndex],
  );

  const onPointerEnter = useCallback(
    (event: FederatedPointerEvent) => {
      event.preventDefault();
      props.onPointerEnter(event, props.index);
      setFocusingIndex(props.index);
    },
    [props.onPointerEnter, props.index],
  );

  const onPointerLeave = useCallback(
    (event: FederatedPointerEvent) => {
      event.preventDefault();
      props.onPointerLeave(event, props.index);
      setFocusingIndex(null);
    },
    [props.onPointerLeave, props.index],
  );

  return (
    <Container
      key={props.index}
      position={{ x: location.point[0], y: location.point[1] }}
      interactive={true}
      eventMode={'static'}
    >
      <Graphics
        draw={(g) => {
          const city = props.locations[props.index];
          g.clear();
          if (city.manufactureShare0 < city.manufactureShare) {
            g.lineStyle(1, 0x0000ff, 0.5);
          } else {
            g.lineStyle(0, 0x000000, 0.1);
          }
          g.beginFill(0x1976d2, 0.25);
          g.drawCircle(0, 0, 100 * city.manufactureShare);
          g.endFill();
        }}
      ></Graphics>
      <Sprite
        texture={props.cityTexture}
        width={20}
        height={20}
        anchor={{ x: 0.5, y: 0.5 }}
        alpha={props.draggingIndex == props.index ? 0.3 : 1.0}
        interactive={true}
        eventMode={'static'}
        onpointerdown={onDragStart}
        onpointerupoutside={onPointerUp}
        onmouseup={onPointerUp}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        onglobalpointermove={onPointerMove}
      />
      <Text
        text={`#${props.index}`}
        position={{ x: 0, y: 20 }}
        anchor={{ x: 0.5, y: 0.5 }}
        style={StyleSize14}
      />
      {focusingIndex == props.index && (
        <Text
          text={location.label}
          position={{ x: -10, y: 45 }}
          anchor={{ x: 0, y: 0.5 }}
          style={StyleSize14Focused}
        />
      )}
    </Container>
  );
};
