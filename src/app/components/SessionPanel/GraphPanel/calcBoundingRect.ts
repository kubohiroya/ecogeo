import { City } from '../../../model/City';

export function calcBoundingRect(locations: City[]) {
  if (locations.length == 0) {
    return {
      top: Number.NEGATIVE_INFINITY,
      left: Number.NEGATIVE_INFINITY,
      bottom: Number.POSITIVE_INFINITY,
      right: Number.POSITIVE_INFINITY,
    };
  }
  let minX = locations[0].x;
  let maxX = locations[0].x;
  let minY = locations[0].y;
  let maxY = locations[0].y;
  for (let index = 1; index < locations.length; index++) {
    minX = Math.min(minX, locations[index].x);
    maxX = Math.max(maxX, locations[index].x);
    minY = Math.min(minY, locations[index].y);
    maxY = Math.max(maxY, locations[index].y);
  }
  return {
    top: minY,
    left: minX,
    bottom: maxY,
    right: maxX,
  };
}
