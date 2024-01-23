import { City } from '../models/City';
import { getById } from '../utils/arrayUtil';
import { distance } from '@turf/turf';

export const DISTANCE_SCALE_FACTOR = 0.01;

export function calculateDistanceByLocations(
  loc0: number[] | undefined,
  loc1: number[] | undefined,
  spherical: boolean,
) {
  if (loc0 && loc1) {
    if (spherical) {
      return distance(loc0, loc1, { units: 'kilometers' });
    } else {
      return Math.sqrt(
        ((loc0[0] - loc1[0]) * DISTANCE_SCALE_FACTOR) ** 2 +
          ((loc0[1] - loc1[1]) * DISTANCE_SCALE_FACTOR) ** 2,
      );
    }
  } else {
    return Number.NaN;
  }
}

export function calculateDistanceByIds(
  locations: City[],
  sourceId: number,
  targetId: number,
) {
  const location0 = getById(locations, sourceId);
  const location1 = getById(locations, targetId);
  return calculateDistanceByLocations(
    location0?.point,
    location1?.point,
    false,
  );
}
