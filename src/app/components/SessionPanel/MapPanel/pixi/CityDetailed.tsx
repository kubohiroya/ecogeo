import { City } from '../../../../models/City';
import { Container, Graphics, Sprite, Text } from '@pixi/react';
import React from 'react';
import { CITY_SVGDATA_URL } from '../CitySvgUrl';
import { fontStyle } from './FontStyles';
import { BACKGROUND_COLOR } from '../Constatns';
import * as PIXI from 'pixi.js';

type CityDetailedProps = {
  index: number;
  x: number;
  y: number;
  city: City | null;
};

export const CityDetailed = (props: CityDetailedProps) => {
  if (!props.city) {
    return null;
  }
  const drawBackground = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(BACKGROUND_COLOR, 0.7);
    g.lineStyle(2, 0x0000aa, 1);
    g.drawRoundedRect(-90, -50, 170, 195, 20);
    g.endFill();
  };
  return (
    <Container position={{ x: props.x, y: props.y }}>
      <Graphics draw={drawBackground} />
      <Text
        x={0}
        y={-30}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 14, fill: 0x0000aa })}
        text={`(${props.city.point[0].toFixed(
          2,
        )}, ${props.city.point[1].toFixed(2)})`}
      />
      <Sprite
        image={CITY_SVGDATA_URL}
        x={0}
        y={0}
        scale={{ x: 0.3, y: 0.3 }}
        anchor={{ x: 0.5, y: 0.5 }}
      />
      <Text
        x={0}
        y={28}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 18, fill: 0x0000aa })}
        text={`#${props.index}`}
      />
      <Text
        x={0}
        y={45}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 10, fill: 0x0000aa })}
        text={
          props.city.label.length < 28
            ? props.city.label
            : props.city.label.substring(0, 28) + '...'
        }
      />
      <Text
        x={0}
        y={60}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 11, fill: 0x000088 })}
        text={`share of manufacturing = ${props.city.manufactureShare.toFixed(
          3,
        )} `}
      />
      <Text
        x={0}
        y={75}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 11, fill: 0x000088 })}
        text={`      share of agriculture = ${props.city.agricultureShare.toFixed(
          3,
        )} `}
      />
      <Text
        x={0}
        y={90}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 11, fill: 0x000088 })}
        text={`        price index = ${props.city.priceIndex.toFixed(3)} `}
      />
      <Text
        x={0}
        y={105}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 11, fill: 0x000088 })}
        text={`    nominal wage = ${props.city.nominalWage.toFixed(3)} `}
      />
      <Text
        x={0}
        y={120}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 11, fill: 0x000088 })}
        text={`          real wage = ${props.city.realWage.toFixed(3)} `}
      />
      <Text
        x={0}
        y={135}
        anchor={{ x: 0.5, y: 0.5 }}
        style={fontStyle({ fontSize: 11, fill: 0x000088 })}
        text={`    GDP = ${props.city.priceIndex.toFixed(3)} `}
      />
    </Container>
  );
};
