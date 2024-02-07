import { GPUMatrixEngine } from 'src/app/apsp/GPUMatrixEngine';
import { CPUMatrixEngine } from 'src/app/apsp/CPUMatrixEngine';
import { Edge } from 'src/app/models/Graph';
import { City } from 'src/app/models/City';
import { AbstractMatrixEngine } from 'src/app/apsp/MatrixEngine';
import {
  MatrixEngineKeyTypes,
  matrixEngineType,
} from 'src/app/models/MatrixEngineKeyTypes';

export const createMatrixEngine = (numLocations: number, numEdges: number) =>
  matrixEngineType === MatrixEngineKeyTypes.CPUMatrixEngine
    ? new CPUMatrixEngine(numLocations, numEdges)
    : matrixEngineType === MatrixEngineKeyTypes.GPUMatrixEngine
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
