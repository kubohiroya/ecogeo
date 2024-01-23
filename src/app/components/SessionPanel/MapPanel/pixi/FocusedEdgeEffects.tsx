import React from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { fontStyle } from './FontStyles';
import * as PIXI from 'pixi.js';
import { Edge, Vertex } from '../../../../models/Graph';
import { getById } from '../../../../utils/arrayUtil';
import { DashLine } from 'pixi-dashed-line';
import { isInfinity } from '../../../../utils/mathUtil';

type EdgesProps = {
  edges: Edge[];
  locations: Vertex[];
  focusedIndices: number[];
  adjacencyMatrix: number[][] | null;
  distanceMatrix: number[][] | null;
  predecessorMatrix: number[][] | null;
  width: number;
  height: number;
  color?: number;
};

export const FocusedEdgeEffects = (props: EdgesProps) => {
  if (
    props.focusedIndices.length <= 1 ||
    !props.adjacencyMatrix ||
    !props.distanceMatrix ||
    !props.predecessorMatrix
  )
    return;

  let sourceIndex = props.focusedIndices[0];
  const targetIndex = props.focusedIndices[1];

  let prevIndex = sourceIndex;
  let prevLocation = getById(props.locations, sourceIndex);

  if (!prevLocation) {
    return;
  }

  const path: Vertex[] = [prevLocation];
  const textEffects: {
    text: string;
    x: number;
    y: number;
  }[] = [];

  for (let i = 0; prevIndex != targetIndex && i < props.locations.length; i++) {
    const nextIndex = props.predecessorMatrix[prevIndex][targetIndex];
    if (nextIndex == -1) break;
    const nextLocation = props.locations[nextIndex];
    if (!nextLocation) continue;

    path.push(nextLocation);

    if (!isInfinity(props.distanceMatrix[sourceIndex][targetIndex])) {
      textEffects.push({
        text: props.adjacencyMatrix[prevIndex][nextIndex].toFixed(2),
        x: (prevLocation.point[0] + nextLocation.point[0]) / 2,
        y: (prevLocation.point[1] + nextLocation.point[1]) / 2,
      });
    }

    prevIndex = nextIndex;
    prevLocation = nextLocation;
  }

  const draw = (g: any) => {
    const sourceIndex = props.focusedIndices[0];
    const targetIndex = props.focusedIndices[1];
    let prevIndex = sourceIndex;
    let prevLocation = getById(props.locations, sourceIndex);
    g.clear();
    if (
      prevLocation &&
      props.distanceMatrix &&
      props.predecessorMatrix &&
      props.predecessorMatrix[sourceIndex][targetIndex] != -1 &&
      sourceIndex < props.locations.length &&
      targetIndex < props.locations.length
    ) {
      g.lineStyle({
        width: 2,
        color: props.color || 0xffaa00,
        alpha: 0.25,
        alignment: 0.5,
        cap: PIXI.LINE_CAP.ROUND,
        join: PIXI.LINE_JOIN.ROUND,
      });

      g.moveTo(prevLocation.point[0], prevLocation.point[1]);
      path.forEach((vertex) => g.lineTo(vertex.point[0], vertex.point[1]));

      const dash = new DashLine(g, {
        dash: [1, 15],
        width: 10,
        color: props.color || 0xff0000,
        alpha: 0.25,
        alignment: 0.5,
        cap: PIXI.LINE_CAP.ROUND,
        join: PIXI.LINE_JOIN.ROUND,
      });
      dash.moveTo(
        props.locations[sourceIndex].point[0],
        props.locations[sourceIndex].point[1],
      );
      dash.lineTo(
        props.locations[targetIndex].point[0],
        props.locations[targetIndex].point[1],
      );
    }
  };

  const distance = props.distanceMatrix[sourceIndex][targetIndex];
  return (
    <Container>
      <Graphics draw={draw} />
      <Container>
        {textEffects.map((item, index) => (
          <Text
            key={index}
            text={item.text}
            position={{
              x: item.x,
              y: item.y,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            style={fontStyle({
              fontSize: 11,
              alpha: 1.0,
              dropShadow: true,
              dropShadowAlpha: 0.5,
              dropShadowColor: 0xffff00,
              fill: 0xffff00,
            })}
          />
        ))}
        {!isInfinity(distance) &&
          distance > 0 &&
          sourceIndex < props.locations.length &&
          targetIndex < props.locations.length && (
            <Text
              text={props.distanceMatrix[sourceIndex][targetIndex].toFixed(2)}
              position={{
                x:
                  (props.locations[sourceIndex].point[0] +
                    props.locations[targetIndex].point[0]) /
                  2,
                y:
                  (props.locations[sourceIndex].point[1] +
                    props.locations[targetIndex].point[1]) /
                  2,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              style={fontStyle({
                fontSize: 15,
                fill: 0xff0000,
                dropShadow: false,
                dropShadowAlpha: 0.1,
                dropShadowBlur: 1,
                dropShadowColor: 0x000000,
              })}
            />
          )}
      </Container>
    </Container>
  );
};
