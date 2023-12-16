import { City } from './City';
import * as uuid from 'uuid';
import { SEED_RANDOM, SeedRandom } from '../util/random';
import { Edge } from './Graph';
import {
  calculateDistanceByLocations,
  DISTANCE_SCALE_FACTOR,
} from '../core/calculateDistanceByLocations';
import { loop, shuffleArray } from '../util/arrayUtil';
import { SessionState } from './SessionState';

const RANDOM_FACTOR = 0.05;
const randomizedOf = (seedRandom: SeedRandom, value: number) =>
  value * (1 + (seedRandom.random() - 0.5) * RANDOM_FACTOR);

const createCity = ({
  id,
  label,
  x,
  y,
  share,
  randomize,
}: {
  id: number;
  label: string;
  x: number;
  y: number;
  share: number;
  randomize: boolean;
}): City => {
  const manufacturingShare = randomize
    ? randomizedOf(SEED_RANDOM, share)
    : share;
  const agricultureShare = randomize ? randomizedOf(SEED_RANDOM, share) : share;
  return {
    id,
    label,
    x,
    y,

    dx: 0,
    dy: 0,
    manufacturingShare,
    manufacturingShare0: 0,
    agricultureShare,
    priceIndex: 0,
    priceIndex0: 0,
    nominalWage: 0,
    nominalWage0: 0,
    realWage: 0,
    income: 0,
    income0: 0,
    deltaManufacturingShare: 0,
  };
};

function updateRaceTrackSubGraph(
  sessionState: SessionState,
  numLocations: number
) {
  const ratio = sessionState.locations.length / numLocations;
  let locationSerialNumber = sessionState.locationSerialNumber;
  const newLocations = loop(numLocations).map((index) => {
    const radius =
      1 / DISTANCE_SCALE_FACTOR / (2 * Math.sin(Math.PI / numLocations));
    const radian = (-1 * (2 * Math.PI * index)) / numLocations - Math.PI / 2;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    if (index == 0 && numLocations == 1) {
      const city = sessionState.locations[0];
      return {
        ...city,
        x: 0,
        y: 0,
        manufacturingShare: 1,
        agricultureShare: 1,
      };
    } else if (index < sessionState.locations.length) {
      const city = sessionState.locations[index];
      return {
        ...city,
        x,
        y,
        manufacturingShare: ratio * city.manufacturingShare,
        agricultureShare: ratio * city.agricultureShare,
      };
    } else {
      return createCity({
        id: locationSerialNumber++,
        label: uuid.v4(),
        x,
        y,
        share: 1 / numLocations,
        randomize: true,
      });
    }
  });

  const edges =
    numLocations == 1
      ? []
      : loop(numLocations).map((index) => {
          const [source, target] =
            index != numLocations - 1
              ? [newLocations[index], newLocations[index + 1]]
              : [newLocations[0], newLocations[numLocations - 1]];
          return {
            source: source.id,
            target: target.id,
            distance: calculateDistanceByLocations(source, target),
          };
        });

  return {
    locations: newLocations,
    edges,
    locationSerialNumber,
  };
}

function addEdges(locations: City[], edges: Edge[], selectedIndices: number[]) {
  const newLocation = locations[locations.length - 1];
  const newEdges = selectedIndices.map((selectedIndex) => ({
    source: locations[selectedIndex].id,
    target: newLocation.id,
    distance: calculateDistanceByLocations(
      locations[selectedIndex],
      newLocation
    ),
  }));

  return edges.concat(newEdges);
}

const maxDensity = 0.5;

function createRandomEdges(locations: City[], edges: Edge[]) {
  const SEPARATOR = '_';
  const set = new Set(
    edges.map((edge) => `${edge.source}${SEPARATOR}${edge.target}`)
  );
  const negativeEdges: string[] = [];
  for (let source = 0; source < locations.length; source++) {
    for (let target = source + 1; target < locations.length; target++) {
      if (!set.has(`${source}${SEPARATOR}${target}`)) {
        negativeEdges.push(source + SEPARATOR + target);
      }
    }
  }

  const negativeVerticesIdSet: Set<number> = new Set(
    locations.map((location) => location.id)
  );

  const newEdges: Edge[] = shuffleArray(negativeEdges)
    .filter(
      (key: string, index: number) => index < locations.length * maxDensity
    )
    .map((key) => {
      const [source, target] = key
        .split(SEPARATOR)
        .map((item) => parseInt(item));
      const distance = calculateDistanceByLocations(
        locations[source],
        locations[target]
      );
      return {
        source: locations[source].id,
        target: locations[target].id,
        distance,
      };
    });

  newEdges.forEach((edge) => {
    negativeVerticesIdSet.delete(edge.source);
    negativeVerticesIdSet.delete(edge.target);
  });

  if (negativeVerticesIdSet.size == 0) {
    throw new Error();
  }

  const supportedEdges = [...negativeVerticesIdSet]
    .map((id: number) => {
      const nearest = locations
        .filter((location) => location.id != id)
        .map((location) => ({
          location,
          distance: calculateDistanceByLocations(location, locations[id]),
        }))
        .reduce(
          (
            acc: null | {
              location: City;
              distance: number;
            },
            entry
          ) => {
            if (acc === null || acc.distance > entry.distance) return entry;
            return acc;
          },
          null
        );
      if (nearest) {
        if (id < nearest?.location.id) {
          return {
            source: id,
            target: nearest?.location.id,
            id,
            distance: nearest?.distance,
          };
        } else {
          return {
            source: nearest?.location.id,
            id,
            target: id,
            distance: nearest?.distance,
          };
        }
      } else {
        return null;
      }
    })
    .filter((item: null | Edge) => item !== null) as Edge[];

  return edges.concat(newEdges).concat(supportedEdges);
}

function addRandomSubGraph(
  sessionState: SessionState,
  selectedIndices: number[],
  _numLocations?: number
) {
  const numLocations =
    _numLocations != undefined
      ? _numLocations
      : sessionState.locations.length + 1;
  const ratio = sessionState.locations.length / numLocations;
  const cities = sessionState.locations.map((city) => ({
    ...city,
    manufacturingShare: city.manufacturingShare * ratio,
    agricultureShare: city.agricultureShare * ratio,
  }));

  let direction = SEED_RANDOM.random() * 2 * Math.PI;
  let acceleration = 0;
  let velocity = 1 / DISTANCE_SCALE_FACTOR;
  const addingCities: City[] = [];
  let locationSerialNumber = sessionState.locationSerialNumber;
  for (let i = sessionState.locations.length; i < numLocations; i++) {
    acceleration = 2 * SEED_RANDOM.random() - 0.5;
    direction += (2 * Math.PI * (SEED_RANDOM.random() - 0.5)) / 2;
    velocity = Math.min(50, Math.max(400, velocity + acceleration));
    const { x, y } =
      sessionState.locations.length == 0 && i == 0
        ? { x: 0, y: 0 }
        : i < sessionState.locations.length
        ? {
            x: sessionState.locations[i].x,
            y: sessionState.locations[i].y,
          }
        : i == sessionState.locations.length
        ? {
            x:
              sessionState.locations[sessionState.locations.length - 1].x +
              velocity * Math.cos(direction),
            y:
              sessionState.locations[sessionState.locations.length - 1].y +
              velocity * Math.sin(direction),
          }
        : {
            x: addingCities[i - 1].x + velocity * Math.cos(direction),
            y: addingCities[i - 1].y + velocity * Math.sin(direction),
          };

    const newLocation = createCity({
      id: locationSerialNumber++,
      label: uuid.v4(),
      x,
      y,
      share: 1 / numLocations,
      randomize: true,
    });
    addingCities.push(newLocation);
  }

  const newLocations = [...cities, ...addingCities];

  const newEdges =
    _numLocations == undefined
      ? addEdges(newLocations, sessionState.edges, selectedIndices)
      : createRandomEdges(newLocations, sessionState.edges);

  return {
    locations: newLocations,
    edges: newEdges,
    locationSerialNumber,
  };
}

export const addSubGraph = (
  sessionState: SessionState,
  selectedIndices: number[],
  numLocations?: number
) => {
  if (numLocations != undefined) {
    switch (sessionState.country.type) {
      case 'RaceTrack':
        return updateRaceTrackSubGraph(sessionState, numLocations);
      case 'Graph':
        return addRandomSubGraph(sessionState, selectedIndices, numLocations);
      default:
        throw new Error();
    }
  } else {
    return addRandomSubGraph(sessionState, selectedIndices);
  }
};

export function removeRandomSubGraph(
  numLocations: number,
  sessionState: SessionState
) {
  const removingIdSet = new Set(
    sessionState.locations
      .filter((location, index) => numLocations <= index)
      .map((city) => city.id)
  );

  const ratio = sessionState.locations.length / numLocations;
  const newLocations = sessionState.locations
    .filter((location, index) => index < numLocations)
    .map((location) => ({
      ...location,
      manufacturingShare: location.manufacturingShare * ratio,
      agricultureShare: location.agricultureShare * ratio,
    }));

  const newEdges = sessionState.edges.filter(
    (edge) => !removingIdSet.has(edge.source) && !removingIdSet.has(edge.target)
  );
  return {
    locations: newLocations,
    edges: newEdges,
    locationSerialNumber: sessionState.locationSerialNumber,
  };
}

export const removeSubGraph = (
  numLocations: number,
  sessionState: SessionState
) => {
  switch (sessionState.country.type) {
    case 'RaceTrack':
      return updateRaceTrackSubGraph(sessionState, numLocations);
    case 'Graph':
      return removeRandomSubGraph(numLocations, sessionState);
    default:
      throw new Error();
  }
};
