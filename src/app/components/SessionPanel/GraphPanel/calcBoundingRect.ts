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
  let minX = locations[0].point[0];
  let maxX = locations[0].point[0];
  let minY = locations[0].point[1];
  let maxY = locations[0].point[1];
  for (let index = 1; index < locations.length; index++) {
    minX = Math.min(minX, locations[index].point[0]);
    maxX = Math.max(maxX, locations[index].point[0]);
    minY = Math.min(minY, locations[index].point[1]);
    maxY = Math.max(maxY, locations[index].point[1]);
  }
  return {
    top: minY,
    left: minX,
    bottom: maxY,
    right: maxX,
  };
}
