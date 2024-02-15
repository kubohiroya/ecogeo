import { City } from "~/app/models/City";
import { Edge } from "~/app/models/Graph";

export interface MatrixEngine {
  getNumLocations: () => number;
  getNumEdges: () => number;

  getAdjacencyMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<number[][]>;

  getDistanceMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<number[][]>;

  getPredecessorMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<number[][]>;

  getTransportationCostMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<number[][]>;

  updateAdjacencyMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<{
    adjacencyMatrix: number[][];
    distanceMatrix: number[][];
    predecessorMatrix: number[][];
    transportationCostMatrix: number[][];
  }>;

  updateDistanceAndPredecessorMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<{
    distanceMatrix: number[][];
    predecessorMatrix: number[][];
    transportationCostMatrix: number[][];
  }>;

  updateTransportationCostMatrix: (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ) => Promise<{
    transportationCostMatrix: number[][];
  }>;
}

export abstract class AbstractMatrixEngine implements MatrixEngine {
  numLocations: number;
  numEdges: number;
  protected adjacencyMatrix?: number[][];
  protected distanceMatrix?: number[][];
  protected predecessorMatrix?: number[][];
  protected transportationCostMatrix?: number[][];

  constructor(numLocations: number, numEdges: number) {
    this.numLocations = numLocations;
    this.numEdges = numEdges;
  }

  getNumLocations() {
    return this.numLocations;
  }

  getNumEdges() {
    return this.numEdges;
  }

  abstract createAdjacencyMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<number[][]>;

  abstract createDistanceAndPredecessorMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<[number[][], number[][]]>;

  abstract createTransportationCostMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<number[][]>;

  getAdjacencyMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<number[][]> {
    if (!this.adjacencyMatrix) {
      return this.createAdjacencyMatrix(locations, edges, transportationCost);
    }
    return Promise.resolve(this.adjacencyMatrix!);
  }

  async getDistanceMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<number[][]> {
    if (!this.distanceMatrix) {
      await this.createDistanceAndPredecessorMatrix(
        locations,
        edges,
        transportationCost,
      );
    }
    return Promise.resolve(this.distanceMatrix!);
  }

  async getPredecessorMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<number[][]> {
    if (!this.predecessorMatrix) {
      await this.createDistanceAndPredecessorMatrix(
        locations,
        edges,
        transportationCost,
      );
    }
    return Promise.resolve(this.predecessorMatrix!);
  }

  getTransportationCostMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<number[][]> {
    if (!this.transportationCostMatrix) {
      return this.createTransportationCostMatrix(
        locations,
        edges,
        transportationCost,
      );
    }
    return Promise.resolve(this.transportationCostMatrix);
  }

  async updateAdjacencyMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<{
    adjacencyMatrix: number[][];
    distanceMatrix: number[][];
    predecessorMatrix: number[][];
    transportationCostMatrix: number[][];
  }> {
    this.adjacencyMatrix = undefined;
    this.distanceMatrix = undefined;
    this.predecessorMatrix = undefined;
    this.transportationCostMatrix = undefined;

    const transportationCostMatrix = await this.getTransportationCostMatrix(
      locations,
      edges,
      transportationCost,
    );

    return {
      transportationCostMatrix,
      distanceMatrix: await this.getDistanceMatrix(
        locations,
        edges,
        transportationCost,
      ),
      predecessorMatrix: await this.getPredecessorMatrix(
        locations,
        edges,
        transportationCost,
      ),
      adjacencyMatrix: await this.getAdjacencyMatrix(
        locations,
        edges,
        transportationCost,
      ),
    };
  }

  async updateDistanceAndPredecessorMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<{
    distanceMatrix: number[][];
    predecessorMatrix: number[][];
    transportationCostMatrix: number[][];
  }> {
    this.distanceMatrix = undefined;
    this.predecessorMatrix = undefined;
    this.transportationCostMatrix = undefined;

    const transportationCostMatrix = await this.getTransportationCostMatrix(
      locations,
      edges,
      transportationCost,
    );

    return {
      transportationCostMatrix,
      distanceMatrix: await this.getDistanceMatrix(
        locations,
        edges,
        transportationCost,
      ),
      predecessorMatrix: await this.getPredecessorMatrix(
        locations,
        edges,
        transportationCost,
      ),
    };
  }

  async updateTransportationCostMatrix(
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<{
    transportationCostMatrix: number[][];
  }> {
    this.transportationCostMatrix = undefined;

    const transportationCostMatrix = await this.getTransportationCostMatrix(
      locations,
      edges,
      transportationCost,
    );

    return {
      transportationCostMatrix,
    };
  }
}
