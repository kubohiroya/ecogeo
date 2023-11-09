import { Country } from './Country';

export interface Session {
  // timer: Timer,

  country: Country;

  adjacencyMatrix: number[][];
  distanceMatrix: number[][];
  predecessorMatrix: number[][];
  transportationCostMatrix: number[][];

  maxRowColLength: number;

  chartScale: number;
  focusedIds: number[];
  selectedIds: number[];
}

// [[0, 1, 2, 3], [3, 4, 5, 6], [6, 7, 8, 9], [9, 10, 11, 12]];
// [[0, 1, 2, 3], [3, 4, 5, 6], [6, 7, 8, 9], [9, 10, 11, 12]];
// [[0, 1, 2, 3], [3, 4, 5, 6], [6, 7, 8, 9], [9, 10, 11, 12]]
/*
const matrixData = {
  maxRowColLength: 2,
  adjacencyData: [
    [0, 1, 2, 3],
    [3, 4, 5, 6],
    [6, 7, 8, 9],
    [9, 10, 11, 12],
  ],
  distanceData: [
    [0, 1, 2, 3],
    [3, 4, 5, 6],
    [6, 7, 8, 9],
    [9, 10, 11, 12],
  ],
  transportCostData: [
    [0, 1, 2, 3],
    [3, 4, 5, 6],
    [6, 7, 8, 9],
    [9, 10, 11, 12],
  ],
};

const locations = [
  new GeoLocation(0, '0', 0.5, 0.5),
  new GeoLocation(1, '1', 0.5, 0.5),
];
 */
