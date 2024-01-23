function isClockwise(polygon: number[][]): boolean {
  let total = 0;
  for (let i = 0; i < polygon.length - 1; i++) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[i + 1];
    total += (x2 - x1) * (y2 + y1);
  }
  return total > 0;
}

export function correctPolygonOrientation(polygon: number[][]): number[][] {
  if (isClockwise(polygon)) {
    return polygon.reverse(); // Reverse the order if clockwise
  } else {
    return polygon; // Keep as is if counter-clockwise
  }
}
