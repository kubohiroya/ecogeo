import { City } from '../models/City';
import { Edge } from '../models/Graph';
import { AbstractMatrixEngine } from './MatrixEngine';
import { create2DArray } from '../utils/arrayUtil';
import { calculateDistanceByIds } from './calculateDistanceByLocations';
import { computeShortestPaths } from './floydWarshall';

export function createAdjacencyMatrix(locations: City[], edges: Edge[]) {
  const matrix = create2DArray(locations.length, (i, j) =>
    i !== j ? Number.POSITIVE_INFINITY : 0.0,
  );

  const locationMap = new Map<number, number>(
    locations.map((location, index) => [location.id, index]),
  );

  edges.forEach((edge) => {
    const distance =
      edge.distance ||
      (edge.distance = calculateDistanceByIds(
        locations,
        edge.source,
        edge.target,
      ));
    const sourceIndex = locationMap.get(edge.source);
    const targetIndex = locationMap.get(edge.target);
    if (sourceIndex !== undefined && targetIndex !== undefined) {
      matrix[sourceIndex][targetIndex] = distance;
      matrix[targetIndex][sourceIndex] = distance;
    }
  });

  return matrix;
}

export function createTransportationCostMatrix(
  distanceMatrix: number[][],
  transportationCost: number,
): number[][] {
  const numLocations = distanceMatrix.length;
  let max = 0;
  for (let i = 0; i < numLocations; i++) {
    if (distanceMatrix && i < distanceMatrix.length) {
      for (let j = 0; j < numLocations; j++) {
        if (j < distanceMatrix[i].length) {
          if (distanceMatrix[i][j] !== Number.POSITIVE_INFINITY) {
            max = Math.max(distanceMatrix[i][j], max);
          }
        }
      }
    }
  }

  const matrix = create2DArray(numLocations, (i, j) =>
    i !== j ? Number.POSITIVE_INFINITY : 0.0,
  );

  if (max === 0) {
    return matrix;
  }

  const logTransportationCost = Math.log(transportationCost);

  for (let i = 0; i < numLocations; i++) {
    if (distanceMatrix && i < distanceMatrix.length) {
      for (let j = i; j < numLocations; j++) {
        if (j < distanceMatrix[i].length) {
          if (distanceMatrix[i][j] !== Number.POSITIVE_INFINITY) {
            const dist = distanceMatrix[i][j] / max;
            matrix[j][i] = matrix[i][j] = Math.exp(
              logTransportationCost * dist,
            );
          } else {
            matrix[j][i] = matrix[i][j] = Number.POSITIVE_INFINITY;
          }
        }
      }
    }
  }
  return matrix;
}

export class CPUMatrixEngine extends AbstractMatrixEngine {
  createAdjacencyMatrix(locations: City[], edges: Edge[]) {
    return Promise.resolve(
      (this.adjacencyMatrix = createAdjacencyMatrix(locations, edges)),
    );
  }

  async createDistanceAndPredecessorMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<[number[][], number[][]]> {
    const [distanceMatrix, predecessorMatrix] = computeShortestPaths(
      await this.getAdjacencyMatrix(locations, edges, transportationCost),
    );
    this.distanceMatrix = distanceMatrix;
    this.predecessorMatrix = predecessorMatrix;
    return Promise.resolve([this.distanceMatrix, this.predecessorMatrix]);
  }

  async createTransportationCostMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) {
    const transportationCostMatrix = createTransportationCostMatrix(
      await this.getDistanceMatrix(locations, edges, transportationCost),
      transportationCost,
    );
    this.transportationCostMatrix = transportationCostMatrix;
    return Promise.resolve(transportationCostMatrix);
  }

  async createMatrices(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) {
    const adjacencyMatrix = createAdjacencyMatrix(locations, edges);
    const [distanceMatrix, predecessorMatrix] =
      computeShortestPaths(adjacencyMatrix);
    const transportationCostMatrix = createTransportationCostMatrix(
      distanceMatrix,
      transportationCost,
    );
    this.adjacencyMatrix = adjacencyMatrix;
    this.distanceMatrix = distanceMatrix;
    this.predecessorMatrix = predecessorMatrix;
    this.transportationCostMatrix = transportationCostMatrix;

    return Promise.resolve({
      adjacencyMatrix,
      distanceMatrix,
      predecessorMatrix,
      transportationCostMatrix,
    });
  }
}
