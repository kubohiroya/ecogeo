export type Point2D = {
  x: number;
  y: number;
};

export function calculateCentroid(points: Point2D[]): Point2D {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  const total = points.reduce(
    (accumulator, currentPoint) => {
      return {
        x: accumulator.x + currentPoint.x,
        y: accumulator.y + currentPoint.y,
      };
    },
    { x: 0, y: 0 }
  );

  return { x: total.x / points.length, y: total.y / points.length };
}
