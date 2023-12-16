import React, { useState } from 'react';
import { Container, Graphics } from '@pixi/react';
import { FederatedPointerEvent } from 'pixi.js';

type BackgroundProps = {
  backgroundAlpha: number;
  clearSelection: () => void;
};

export const Background = (props: BackgroundProps) => {
  const [mouseDownPosition, setMouseDownPosition] = useState<number[] | null>(
    null
  );

  //const draw = useCallback(, []);

  return (
    <Container>
      <Graphics
        draw={(g) => {
          g.clear();

          const tileSize = 100; // 市松模様の一つの四角形のサイズ
          const numTilesX = Math.ceil(2000 / tileSize) + 1;
          const numTilesY = Math.ceil(2000 / tileSize) + 1;

          for (let x = -numTilesX; x < numTilesX; x++) {
            for (let y = -numTilesY; y < numTilesY; y++) {
              if ((x + y) % 2 === 0) {
                g.beginFill(0xffffff, 0.001 + props.backgroundAlpha); // 白
              } else {
                g.beginFill(0x0000ff, 0.001 + 0.01 * props.backgroundAlpha); // 黒
              }
              g.drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
              g.endFill();
            }
          }
        }}
        eventMode={'static'}
        onmousedown={(event: FederatedPointerEvent) => {
          setMouseDownPosition([event.clientX, event.clientY]);
        }}
        onmouseup={(event: FederatedPointerEvent) => {
          if (
            mouseDownPosition &&
            event.clientX == mouseDownPosition[0] &&
            event.clientY == mouseDownPosition[1]
          ) {
            setMouseDownPosition(null);
            props.clearSelection();
          }
        }}
      />
    </Container>
  );
};
