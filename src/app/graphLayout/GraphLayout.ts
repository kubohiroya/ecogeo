import { City } from '../model/City';
import { Edge, Vertex } from '../model/Graph';
import { calculateDistanceByIds } from '../core/calculateDistanceByLocations';

const MINIMUM_VELOCITY_THRESHOLD = 0.01;

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
  ): boolean {
    if (adjacencyMatrix == null) {
      return true;
    }

    let minimumVelocity = Number.POSITIVE_INFINITY;

    // 各ノードについて、他のノードとの斥力と引力を計算
    for (let i = 0; i < locations.length; i++) {
      if (selectedIds.includes(i) || i === draggingId) {
        continue;
      }

      let totalDisplacementX = 0;
      let totalDisplacementY = 0;

      for (let j = 0; j < locations.length; j++) {
        if (i !== j) {
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
          adjacencyMatrix[i] &&
          0 < adjacencyMatrix[i].length &&
          0 < adjacencyMatrix[i][j] &&
          adjacencyMatrix[i][j] < Number.POSITIVE_INFINITY
        ) {
          adjacencyMatrix[i][j] = calculateDistanceByIds(locations, i, j);
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

      locations[i].x += totalDisplacementX;
      locations[i].y += totalDisplacementY;
      minimumVelocity = Math.min(
        Math.max(Math.abs(totalDisplacementX), Math.abs(totalDisplacementY)),
        minimumVelocity
      );
    }

    edges.forEach((edge) => {
      edge.distance = calculateDistanceByIds(
        locations,
        edge.source,
        edge.target
      );
    });

    return minimumVelocity < MINIMUM_VELOCITY_THRESHOLD;
  }
}
