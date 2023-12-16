import { Container, Graphics } from '@pixi/react';
import { Vertex } from '../../../model/Graph';

type SelectedLocationEffectsProps = {
  selectedIndices: number[];
  focusedIndices: number[];
  locations: Vertex[];
  width: number;
  height: number;
};

export const SelectedLocationEffects = (
  props: SelectedLocationEffectsProps
) => {
  return (
    <Container>
      <Graphics
        draw={(g) => {
          g.clear();
          props.selectedIndices.map((selectedIndex) => {
            const location = props.locations[selectedIndex];
            if (location) {
              g.beginFill(0xffff00, 0.8);
              if (props.focusedIndices.includes(selectedIndex)) {
                g.lineStyle(2, 0xff0000, 0.6);
              } else {
                g.lineStyle(2, 0xff0000, 0.2);
              }
              g.drawCircle(location.x, location.y, 35);
              g.endFill();
            }
          });
        }}
      />
    </Container>
  );
};
