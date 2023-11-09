import { GeoLocation } from '../model/GeoLocation';
import { random } from '../util/random';

export function createRandomEdges(
  locations: GeoLocation[],
  adjacencyMatrix: number[][],
  numAddingEdges: number
) {
  const numLocations = locations.length;

  let candidates = [] as number[][];

  for (let i = 0; i < numLocations; i++) {
    for (let j = i + 1; j < numLocations; j++) {
      const distance = adjacencyMatrix[i][j];
      if (distance == Number.POSITIVE_INFINITY) {
        const distance = Math.sqrt(
          (locations[i].x - locations[1].x) ** 2 +
            (locations[0].y - locations[1].y) ** 2
        );
        candidates.push([i, j, distance]);
      }
    }
  }

  candidates.sort((a, b) => b[2] - a[2]);

  if (candidates.length == 0) return;

  for (
    let i = 0;
    i < numAddingEdges && numAddingEdges < candidates.length;
    i++
  ) {
    const index = Math.floor(Math.sqrt(random()) * candidates.length);
    const c = candidates[i];
    candidates[i] = candidates[index];
    candidates[index] = c;
  }

  //const numRequiredEdges = numNodes * (numNodes - 1) / 2 - candidates.length;

  for (let i = 0; i < numAddingEdges; i++) {
    const selected = candidates[i];

    const y = selected[0];
    const x = selected[1];
    const distance = Math.sqrt(selected[2]);
    adjacencyMatrix[y][x] = distance;
    adjacencyMatrix[x][y] = distance;
    i++;
  }
}

export function createEdgesBetweenSelectedNodes(
  source: GeoLocation,
  added: GeoLocation,
  adjacencyMatrix: number[][]
): number[][] {
  const distance = Math.sqrt(
    (source.x - added.x) ** 2 + (source.y - added.y) ** 2
  );
  adjacencyMatrix[source.index][added.index] = distance;
  adjacencyMatrix[added.index][source.index] = distance;
  return adjacencyMatrix;
}

export function removeEdgesBetweenSelectedNodes(
  source: GeoLocation,
  added: GeoLocation,
  adjacencyMatrix: number[][]
): number[][] {
  adjacencyMatrix[source.index][added.index] = Number.POSITIVE_INFINITY;
  adjacencyMatrix[added.index][source.index] = Number.POSITIVE_INFINITY;
  return adjacencyMatrix;
}
