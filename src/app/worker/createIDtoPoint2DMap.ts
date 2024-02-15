import { CircleSource } from "~/app/worker/convertCirclesToBuffer";

export function createIDtoPoint2DMap(
  circles: CircleSource[],
): Map<string, [number, number]> {
  const map = new Map<string, [number, number]>();

  circles.forEach((circle) => {
    map.set(circle.id.toString(), circle.centerPosition);
  });
  return map;
}
