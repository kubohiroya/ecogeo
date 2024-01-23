import { Container, Graphics } from '@pixi/react';
import { Vertex } from '../../../../models/Graph';

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
              g.drawCircle(location.point[0], location.point[1], 35);
              g.endFill();
            }
          });
        }}
      />
    </Container>
  );
};
