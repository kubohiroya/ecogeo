import { Container, Graphics } from '@pixi/react';
import { Vertex } from '../../../../model/Graph';

type FocusedLocationEffectsProps = {
  focusedIndices: number[];
  locations: Vertex[];
  width: number;
  height: number;
};
export const FocusedLocationEffects = (props: FocusedLocationEffectsProps) => {
  return (
    <Container>
      <Graphics
        draw={(g) => {
          g.clear();
          props.focusedIndices.map((focusedIndex) => {
            const location = props.locations[focusedIndex];
            if (location) {
              g.beginFill(0xffff00, 0.2);
              g.drawCircle(location.x, location.y, 35);
              g.endFill();
            }
          });
        }}
      />
    </Container>
  );
};
