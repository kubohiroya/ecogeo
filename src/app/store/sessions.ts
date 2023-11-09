import { Session } from '../model/Session';
import { loop } from '../util/arrayUtil';
import { createGeoLocation, GeoLocation } from '../model/GeoLocation';
import { createDiagonalMatrix } from '../model/matrices';
import { FloydWarshall } from '../apsp/floydWarshall';
import { countryDefaults } from './countryDefaults';
import { random } from '../util/random';
import { Atom, atom, WritableAtom } from 'jotai';
import { Country } from '../model/Country';
import { createTimerAtoms, TimerAtoms } from './timer';
import { atomWithReset } from 'jotai/utils';

function createTransportCostMatrix(
  distanceMatrix: number[][],
  transportationCost: number
): number[][] {
  const numRegions = distanceMatrix.length;
  let max = 0;
  for (let i = 0; i < numRegions; i++) {
    if (distanceMatrix && i < distanceMatrix.length) {
      for (let j = 0; j < numRegions; j++) {
        if (j < distanceMatrix[i].length) {
          if (distanceMatrix[i][j] != Number.POSITIVE_INFINITY) {
            max = Math.max(distanceMatrix[i][j], max);
          }
        }
      }
    }
  }

  const matrix: number[][] = new Array<number[]>(numRegions);
  for (let i = 0; i < numRegions; i++) {
    matrix[i] = new Array<number>(numRegions);
  }

  if (max == 0) {
    return matrix;
  }

  const logTransportationCost = Math.log(transportationCost);

  for (let i = 0; i < numRegions; i++) {
    if (distanceMatrix && i < distanceMatrix.length) {
      for (let j = i; j < numRegions; j++) {
        if (j < distanceMatrix[i].length) {
          if (distanceMatrix[i][j] != Number.POSITIVE_INFINITY) {
            const dist = distanceMatrix[i][j] / max;
            matrix[j][i] = matrix[i][j] = Math.exp(
              logTransportationCost * dist
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

function createRaceTrackLocations(numLocations: number) {
  return loop(numLocations).map((index) => {
    //const radius = numLocations / (2 * Math.PI);
    const radius = 1 / (2 * Math.sin(Math.PI / numLocations));
    const radian = (2 * Math.PI * index) / numLocations;
    return createGeoLocation({
      index,
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
    });
  });
}

function createRaceTrackAdjacencyMatrix(locations: GeoLocation[]) {
  const adjacencyMatrix = createDiagonalMatrix(locations.length);
  loop(locations.length).forEach((index) => {
    adjacencyMatrix[index][index] = 0;
  });
  loop(locations.length)
    .filter((index) => index > 0)
    .forEach((index) => {
      const loc0 = locations[index - 1];
      const loc1 = locations[index];
      const distance = Math.sqrt(
        (loc0.x - loc1.x) ** 2 + (loc0.y - loc1.y) ** 2
      );
      adjacencyMatrix[index - 1][index] = distance;
      adjacencyMatrix[index][index - 1] = distance;
    });
  return adjacencyMatrix;
}

function createRandomAdjacencyMatrix(locations: GeoLocation[]) {
  const adjacencyMatrix = createDiagonalMatrix(locations.length);
  for (let i = 0; i < locations.length; i++) {
    adjacencyMatrix[i][i] = 0;
  }
  loop(locations.length).forEach((index) => {
    const start = Math.floor(locations.length * random());
    const end = Math.floor(locations.length * random());
    if (start == end) {
      return;
    }
    const loc0 = locations[start];
    const loc1 = locations[end];
    const distance = Math.sqrt((loc0.x - loc1.x) ** 2 + (loc0.y - loc1.y) ** 2);
    adjacencyMatrix[start][end] = distance;
    adjacencyMatrix[end][start] = distance;
  });
  return adjacencyMatrix;
}

export const Sessions = {
  Query: {
    getSession: (sessions: Session[], id: string) =>
      sessions.find((session) => session.country.id === id),
  },
  Mutation: {
    importSession: (sessions: Session[], dummy: string) => {},
    exportSession: (sessions: Session[], name: string) => {
      sessions.push();
    },
  },
};

function createLocations(type: string, numLocations: number) {
  switch (type) {
    case 'RaceTrack':
      return createRaceTrackLocations(numLocations);
    case 'Graph':
      return createRaceTrackLocations(numLocations); // FIXME
    default:
      throw new Error();
  }
}

function createAdjacencyMatrix(type: string, locations: GeoLocation[]) {
  switch (type) {
    case 'RaceTrack':
      return createRaceTrackAdjacencyMatrix(locations);
    case 'Graph':
      return createRandomAdjacencyMatrix(locations); // FIXME
    default:
      throw new Error();
  }
}

const floydWarshall = new FloydWarshall();

export type SessionAtoms = {
  id: string;
  countryAtom: WritableAtom<Country, [Country], void>;
  numLocationsAtom: WritableAtom<number, [update: number], void>;
  shareManufacturingAtom: WritableAtom<number, [update: number], void>;
  transportationCostAtom: WritableAtom<number, [update: number], void>;
  elasticitySubstitutionAtom: WritableAtom<number, [update: number], void>;
  locationsAtom: Atom<GeoLocation[]>;
  adjacencyMatrixAtom: Atom<number[][]>;
  distancePredecessorMatrixAtom: Atom<number[][][]>;
  transportationCostMatrixAtom: Atom<number[][]>;
  maxRowColLengthAtom: Atom<number>;
  chartScaleAtom: WritableAtom<number, [update: number], void>;
  focusedIdsAtom: WritableAtom<number[], [update: number[]], void>;
  selectedIdsAtom: WritableAtom<number[], [update: number[]], void>;
  timerAtoms: TimerAtoms;
};

const createSessionAtom = (country: Country): SessionAtoms => {
  const countryBaseAtom = atom<Country>(country);
  const countryAtom = atom<Country>(country);
  const numLocationsAtom = atom(
    (get) => get(countryAtom).numLocations,
    (get, set, numLocations: number) => {
      set(countryAtom, { ...get(countryAtom), numLocations });
    }
  );
  const numLocationsResettableAtom = atomWithReset<number>(
    country.numLocations
  );

  const shareManufacturingAtom = atom(
    (get) => get(countryAtom).shareManufacturing,
    (get, set, shareManufacturing: number) => {
      set(countryAtom, { ...get(countryAtom), shareManufacturing });
    }
  );

  const transportationCostAtom = atom(
    (get) => get(countryAtom).transportationCost,
    (get, set, transportationCost: number) => {
      set(countryAtom, { ...get(countryAtom), transportationCost });
    }
  );

  const elasticitySubstitutionAtom = atom(
    (get) => get(countryAtom).elasticitySubstitution,
    (get, set, elasticitySubstitution: number) => {
      set(countryAtom, { ...get(countryAtom), elasticitySubstitution });
    }
  );

  const typeAtom = atom<string>((get) => get(countryAtom).type);

  const locationsAtom = atom<GeoLocation[]>((get) =>
    createLocations(get(typeAtom), get(numLocationsAtom))
  );

  const adjacencyMatrixAtom = atom<number[][]>((get) =>
    createAdjacencyMatrix(get(typeAtom), get(locationsAtom))
  );

  const distancePredecessorMatrixAtom = atom<number[][][]>((get) =>
    floydWarshall.computeShortestPaths(get(adjacencyMatrixAtom))
  );

  const transportationCostMatrixAtom = atom<number[][]>((get) =>
    createTransportCostMatrix(
      get(distancePredecessorMatrixAtom)[0],
      get(transportationCostAtom)
    )
  );

  const maxRowColLengthAtom = atom<number>((get) =>
    Math.min(get(numLocationsAtom), 20)
  );
  const chartScaleBaseAtom = atom<number>(1);
  const chartScaleAtom = atom(
    (get) => get(chartScaleBaseAtom),
    (_get, set, update: number) => {
      set(chartScaleBaseAtom, (prev) => update);
    }
  );
  const focusedIdsAtom = atom<number[]>([]);
  const selectedIdsAtom = atom<number[]>([]);

  const timerAtoms = createTimerAtoms();

  return {
    id: country.id,
    countryAtom,
    numLocationsAtom,
    shareManufacturingAtom,
    transportationCostAtom,
    elasticitySubstitutionAtom,
    locationsAtom,
    adjacencyMatrixAtom,
    distancePredecessorMatrixAtom,
    transportationCostMatrixAtom,
    maxRowColLengthAtom,
    chartScaleAtom: chartScaleAtom,
    focusedIdsAtom,
    selectedIdsAtom,
    timerAtoms,
  };
};

export const sessionAtomsArrayAtom = atom(
  countryDefaults.map((country) => createSessionAtom(country))
);
