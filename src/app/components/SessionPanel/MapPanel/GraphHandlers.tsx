import { City, createCity } from '../../../models/City';
import * as uuid from 'uuid';
import { SeedRandom } from '../../../utils/random';
import { Edge } from '../../../models/Graph';
import {
  calculateDistanceByLocations,
  DISTANCE_SCALE_FACTOR,
} from '../../../apsp/calculateDistanceByLocations';
import { loop, shuffleArray } from '../../../utils/arrayUtil';
import { SessionState } from '../../../models/SessionState';

export function updateRaceTrackSubGraph(
  sessionState: SessionState,
  numLocations: number,
) {
  const ratio = sessionState.locations.length / numLocations;
  let locationSerialNumber = sessionState.locationSerialNumber;

  const newLocations = loop(numLocations).map((index) => {
    const radius =
      1 / DISTANCE_SCALE_FACTOR / (2 * Math.sin(Math.PI / numLocations));
    const radian = (-1 * (2 * Math.PI * index)) / numLocations - Math.PI / 2;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    if (index === 0 && numLocations === 1) {
      const city = sessionState.locations[0];
      return {
        ...city,
        point: [0, 0],
        manufactureShare: 1,
        agricultureShare: 1,
      };
    } else if (index < sessionState.locations.length) {
      const city = sessionState.locations[index];
      return {
        ...city,
        point: [x, y],
        manufactureShare: ratio * city.manufactureShare,
        agricultureShare: ratio * city.agricultureShare,
      };
    } else {
      return createCity({
        id: locationSerialNumber++,
        label: uuid.v4(),
        point: [x, y],
        share: 1 / numLocations,
        randomize: true,
      });
    }
  });
  const spherical = sessionState.parameterSet.units === 'degrees';
  const edges =
    numLocations === 1
      ? []
      : loop(numLocations).map((index) => {
          const [source, target] =
            index !== numLocations - 1
              ? [newLocations[index], newLocations[index + 1]]
              : [newLocations[0], newLocations[numLocations - 1]];
          return {
            source: source.id,
            target: target.id,
            distance: calculateDistanceByLocations(
              source.point,
              target.point,
              spherical,
            ),
          };
        });

  return {
    locations: newLocations,
    edges,
    locationSerialNumber,
    addedIndices:
      numLocations > sessionState.locations.length
        ? loop(numLocations - sessionState.locations.length).map(
            (index) => index + sessionState.locations.length,
          )
        : ([] as number[]),
  };
}

function createEdges(
  locations: City[],
  edges: Edge[],
  selectedIndices: number[],
  spherical: boolean,
) {
  const newLocation = locations[locations.length - 1];
  return selectedIndices.map((selectedIndex) => ({
    source: locations[selectedIndex].id,
    target: newLocation.id,
    distance: calculateDistanceByLocations(
      locations[selectedIndex].point,
      newLocation.point,
      spherical,
    ),
  }));
}

const maxDensity = 0.5;

function createRandomEdges(
  locations: City[],
  edges: Edge[],
  spherical: boolean,
) {
  const SEPARATOR = '_';
  const set = new Set(
    edges.map((edge) => `${edge.source}${SEPARATOR}${edge.target}`),
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
    locations.map((location) => location.id),
  );

  const newEdges: Edge[] = shuffleArray(negativeEdges)
    .filter(
      (key: string, index: number) => index < locations.length * maxDensity,
    )
    .map((key) => {
      const [source, target] = key
        .split(SEPARATOR)
        .map((item) => parseInt(item));
      const distance = calculateDistanceByLocations(
        locations[source].point,
        locations[target].point,
        spherical,
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

  if (negativeVerticesIdSet.size === 0) {
    throw new Error();
  }

  const supportedEdges = [...negativeVerticesIdSet]
    .map((id: number) => {
      const nearest = locations
        .filter((location) => location.id !== id)
        .map((location) => ({
          location,
          distance: calculateDistanceByLocations(
            location.point,
            locations[id].point,
            spherical,
          ),
        }))
        .reduce(
          (
            acc: null | {
              location: City;
              distance: number;
            },
            entry,
          ) => {
            if (acc === null || acc.distance > entry.distance) return entry;
            return acc;
          },
          null,
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

export function updateRandomSubGraph(
  sessionState: SessionState,
  selectedIndices: number[],
  _numLocations?: number,
) {
  const numLocations =
    _numLocations !== undefined
      ? _numLocations
      : sessionState.locations.length + 1;
  const seedRandom = new SeedRandom(sessionState.locations.length);
  const ratio = sessionState.locations.length / numLocations;
  const cities = sessionState.locations.map((city) => ({
    ...city,
    manufactureShare: city.manufactureShare * ratio,
    agricultureShare: city.agricultureShare * ratio,
  }));

  let direction = seedRandom.random() * 2 * Math.PI;
  let acceleration = 0;
  let velocity = 1 / DISTANCE_SCALE_FACTOR;
  const addingCities: City[] = [];
  let locationSerialNumber = sessionState.locationSerialNumber;
  for (let i = sessionState.locations.length; i < numLocations; i++) {
    acceleration = 2 * seedRandom.random() - 0.5;
    direction += (2 * Math.PI * (seedRandom.random() - 0.5)) / 2;
    velocity = Math.min(50, Math.max(400, velocity + acceleration));
    const { x, y } =
      sessionState.locations.length === 0 && i === 0
        ? { x: 0, y: 0 }
        : i < sessionState.locations.length
          ? {
              x: sessionState.locations[i].point[0],
              y: sessionState.locations[i].point[1],
            }
          : i == sessionState.locations.length
            ? {
                x:
                  sessionState.locations[sessionState.locations.length - 1]
                    .point[0] +
                  velocity * Math.cos(direction),
                y:
                  sessionState.locations[sessionState.locations.length - 1]
                    .point[1] +
                  velocity * Math.sin(direction),
              }
            : {
                x:
                  addingCities[i - sessionState.locations.length - 1].point[0] +
                  velocity * Math.cos(direction),
                y:
                  addingCities[i - sessionState.locations.length - 1].point[1] +
                  velocity * Math.sin(direction),
              };

    const newLocation = createCity({
      id: locationSerialNumber++,
      label: uuid.v4(),
      point: [x, y],
      share: 1 / numLocations,
      randomize: true,
    });
    addingCities.push(newLocation);
  }

  const newLocations = [...cities, ...addingCities];
  const spherical = sessionState.parameterSet.units === 'degrees';
  const addingEdges =
    _numLocations === undefined
      ? createEdges(
          newLocations,
          sessionState.edges,
          selectedIndices,
          spherical,
        )
      : createRandomEdges(newLocations, sessionState.edges, spherical);

  const newEdges = [...sessionState.edges, ...addingEdges];

  return {
    locations: newLocations,
    edges: newEdges,
    locationSerialNumber,
    addedIndices: loop(addingCities.length).map(
      (index) => index + cities.length,
    ),
  };
}

export const updateAddedSubGraph = (
  //sessionId: string,
  sessionState: SessionState,
  selectedIndices: number[],
  numLocations: number,
) => {
  console.log(sessionState);
  switch (sessionState.parameterSet.type) {
    case 'Racetrack':
      return updateRaceTrackSubGraph(sessionState, numLocations);
    case 'Graph':
      return updateRandomSubGraph(sessionState, selectedIndices, numLocations);
    default:
      return { ...sessionState, addedIndices: [] };
  }
};

export function removeRandomSubGraph(
  numLocations: number,
  sessionState: SessionState,
) {
  const removingIdSet = new Set(
    sessionState.locations
      .filter((location, index) => numLocations <= index)
      .map((city) => city.id),
  );

  const ratio = sessionState.locations.length / numLocations;
  const newLocations = sessionState.locations
    .filter((location, index) => index < numLocations)
    .map((location) => ({
      ...location,
      manufactureShare: location.manufactureShare * ratio,
      agricultureShare: location.agricultureShare * ratio,
    }));

  const newEdges = sessionState.edges.filter(
    (edge) =>
      !removingIdSet.has(edge.source) && !removingIdSet.has(edge.target),
  );
  return {
    locations: newLocations,
    edges: newEdges,
    locationSerialNumber: sessionState.locationSerialNumber,
  };
}

export const removeSubGraph = (
  numLocations: number,
  sessionState: SessionState,
) => {
  switch (sessionState.parameterSet.type) {
    case 'Racetrack':
      return updateRaceTrackSubGraph(sessionState, numLocations);
    case 'Graph':
      return removeRandomSubGraph(numLocations, sessionState);
    default:
      throw new Error();
  }
};
