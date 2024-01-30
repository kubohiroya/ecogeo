import { GPUMatrixEngine } from './GPUMatrixEngine';
import { CPUMatrixEngine } from './CPUMatrixEngine';
import { Edge } from '../models/Graph';
import { City } from '../models/City';
import { AbstractMatrixEngine } from './MatrixEngine';

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

export async function updateAdjacencyMatrix(
  matrixEngine: AbstractMatrixEngine,
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
  } = await matrixEngine.updateAdjacencyMatrix(
    locations,
    edges,
    transportationCost,
  );

  return {
    adjacencyMatrix,
    distanceMatrix,
    predecessorMatrix,
    transportationCostMatrix,
  };
}

export async function updateDistanceMatrix(
  matrixEngine: AbstractMatrixEngine,
  locations: City[],
  edges: Edge[],
  transportationCost: number,
): Promise<{
  distanceMatrix: number[][];
  predecessorMatrix: number[][];
  transportationCostMatrix: number[][];
}> {
  const { distanceMatrix, predecessorMatrix, transportationCostMatrix } =
    await matrixEngine.updateDistanceAndPredecessorMatrix(
      locations,
      edges,
      transportationCost,
    );

  return {
    distanceMatrix,
    predecessorMatrix,
    transportationCostMatrix,
  };
}

export async function updateTransportationMatrix(
  matrixEngine: AbstractMatrixEngine,
  locations: City[],
  edges: Edge[],
  transportationCost: number,
): Promise<{
  transportationCostMatrix: number[][];
}> {
  const { transportationCostMatrix } =
    await matrixEngine.updateTransportationCostMatrix(
      locations,
      edges,
      transportationCost,
    );

  return {
    transportationCostMatrix,
  };
}
