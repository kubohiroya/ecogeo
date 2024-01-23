import { Container, Graphics } from '@pixi/react';
import { Vertex } from '../../../../models/Graph';

type SelectedLocationEffectsProps = {
  selectedIndices: number[];
  focusedIndices: number[];
  locations: Vertex[];
  width: number;
  height: number;
};

export const SelectedLocationEffects = (
  props: SelectedLocationEffectsProps,
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
              g.drawCircle(location.point[0], location.point[1], 35);
              g.endFill();
            }
          });
        }}
      />
    </Container>
  );
};
