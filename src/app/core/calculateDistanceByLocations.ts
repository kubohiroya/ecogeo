import { City } from '../model/City';
import { getById } from '../util/arrayUtil';

export const DISTANCE_SCALE_FACTOR = 0.01;

export function calculateDistanceByLocations(
  loc0: { x: number; y: number } | null,
  loc1: { x: number; y: number } | null
) {
  if (loc0 && loc1) {
    return Math.sqrt(
      ((loc0.x - loc1.x) * DISTANCE_SCALE_FACTOR) ** 2 +
        ((loc0.y - loc1.y) * DISTANCE_SCALE_FACTOR) ** 2
    );
  } else {
    return Number.NaN;
  }
}

export function calculateDistanceByIds(
  locations: City[],
  sourceId: number,
  targetId: number
) {
  const location0 = getById(locations, sourceId);
  const location1 = getById(locations, targetId);
  return calculateDistanceByLocations(location0, location1);
}
