import { GPUMatrixEngine } from './GPUMatrixEngine';
import { CPUMatrixEngine } from './CPUMatrixEngine';
import { MatrixEngine } from './MatrixEngine';
import { Edge } from '../models/Graph';
import { City } from '../models/City';

export enum MatrixEngineKeyType {
  GPUMatrixEngine = 'GPUFloydWarshall',
  CPUMatrixEngine = 'CPUFloydWarshall',
}

export const defaultMatrixEngineType = MatrixEngineKeyType.CPUMatrixEngine;

const params = new URLSearchParams(location.search);
//const matrixEngineType = params.get('engine') || 'CPU:FloydWarshall';
const matrixEngineType = params.get('engine') || defaultMatrixEngineType;

export const createMatrixEngine = (numLocations: number, numEdges: number) =>
  matrixEngineType === MatrixEngineKeyType.CPUMatrixEngine
    ? new CPUMatrixEngine(numLocations, numEdges)
    : matrixEngineType === MatrixEngineKeyType.GPUMatrixEngine
      ? new GPUMatrixEngine(numLocations, numEdges)
      : new CPUMatrixEngine(numLocations, numEdges);

const map: Map<string, MatrixEngine> = new Map<string, MatrixEngine>();

export function getMatrixEngine(
  sessionId: string,
  numLocations: number,
  numEdges: number,
) {
  let matrixEngine = map.get(sessionId);
  if (
    !matrixEngine ||
    matrixEngine.getNumLocations() !== numLocations ||
    matrixEngine.getNumEdges() !== numEdges
  ) {
    matrixEngine = createMatrixEngine(numLocations, numEdges);
    map.set(sessionId, matrixEngine);
  }
  return matrixEngine;
}

export async function updateAdjacencyMatrix(
  sessionId: string,
  locations: City[],
  edges: Edge[],
  transportationCost: number,
): Promise<{
  adjacencyMatrix: number[][];
  distanceMatrix: number[][];
  predecessorMatrix: number[][];
  transportationCostMatrix: number[][];
}> {
  const {
    adjacencyMatrix,
    distanceMatrix,
    predecessorMatrix,
    transportationCostMatrix,
  } = await getMatrixEngine(
    sessionId,
    locations.length,
    edges.length,
  ).updateAdjacencyMatrix(locations, edges, transportationCost);

  return {
    adjacencyMatrix,
    distanceMatrix,
    predecessorMatrix,
    transportationCostMatrix,
  };
}

export async function updateDistanceMatrix(
  sessionId: string,
  locations: City[],
  edges: Edge[],
  transportationCost: number,
): Promise<{
  distanceMatrix: number[][];
  predecessorMatrix: number[][];
  transportationCostMatrix: number[][];
}> {
  const { distanceMatrix, predecessorMatrix, transportationCostMatrix } =
    await getMatrixEngine(
      sessionId,
      locations.length,
      edges.length,
    ).updateDistanceAndPredecessorMatrix(locations, edges, transportationCost);

  return {
    distanceMatrix,
    predecessorMatrix,
    transportationCostMatrix,
  };
}

export async function updateTransportationMatrix(
  sessionId: string,
  locations: City[],
  edges: Edge[],
  transportationCost: number,
): Promise<{
  transportationCostMatrix: number[][];
}> {
  const { transportationCostMatrix } = await getMatrixEngine(
    sessionId,
    locations.length,
    edges.length,
  ).updateTransportationCostMatrix(locations, edges, transportationCost);

  return {
    transportationCostMatrix,
  };
}
