import { City } from '../model/City';
import { Edge, Vertex } from '../model/Graph';
import { isInfinity } from '../util/mathUtil';

export abstract class GraphLayout {
  abstract calculateRepulsion(
    node1: Vertex,
    node2: Vertex
  ): {
    dx: number;
    dy: number;
  };

  abstract calculateAttraction(
    node1: Vertex,
    node2: Vertex
  ): {
    dx: number;
    dy: number;
  };

  calculateFrictionalForce(node: { x: number; y: number }) {
    const m = 0.1; // 比例定数 < 1
    return { dx: -m * node.x, dy: -m * node.y }; // 摩擦力は速度の逆向きに比例
  }

  tick(
    locations: City[],
    edges: Edge[],
    adjacencyMatrix: number[][] | null,
    selectedIds: number[],
    draggingId: number | null
  ): GraphLayoutTickResult {
    let maximumVelocity = Number.POSITIVE_INFINITY;

    if (adjacencyMatrix == null) {
      return {
        locations,
        maximumVelocity: maximumVelocity,
      };
    }

    const newLocations = locations.map((city) => {
      return {
        x: city.x,
        y: city.y,
      };
    });

    // 各ノードについて、他のノードとの斥力と引力を計算
    for (let i = 0; i < locations.length; i++) {
      if (selectedIds.includes(i) || i === draggingId) {
        continue;
      }

      let totalDisplacementX = 0;
      let totalDisplacementY = 0;

      for (let j = 0; j < locations.length; j++) {
        if (i !== j && isInfinity(adjacencyMatrix[i][j])) {
          const repulsionForce = this.calculateRepulsion(
            locations[i],
            locations[j]
          );
          totalDisplacementX += repulsionForce.dx;
          totalDisplacementY += repulsionForce.dy;
        }
      }

      for (let j = 0; j < locations.length; j++) {
        if (
          i < adjacencyMatrix.length &&
          j < adjacencyMatrix[i].length &&
          !isInfinity(adjacencyMatrix[i][j])
        ) {
          const attractionForce = this.calculateAttraction(
            locations[i],
            locations[j]
          );
          totalDisplacementX += attractionForce.dx;
          totalDisplacementY += attractionForce.dy;
        }
      }

      const ff = this.calculateFrictionalForce({
        x: totalDisplacementX,
        y: totalDisplacementY,
      });
      totalDisplacementX += ff.dx;
      totalDisplacementY += ff.dy;

      newLocations[i].x += totalDisplacementX;
      newLocations[i].y += totalDisplacementY;
      maximumVelocity = Math.max(
        Math.max(Math.abs(totalDisplacementX), Math.abs(totalDisplacementY)),
        maximumVelocity
      );
    }

    return {
      locations: newLocations,
      maximumVelocity: maximumVelocity,
    };
  }
}

export type GraphLayoutTickResult = {
  locations: {
    x: number;
    y: number;
  }[];
  maximumVelocity: number;
};
