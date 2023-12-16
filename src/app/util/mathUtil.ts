export function round(value: number, n: number) {
  //return Math.round(value * n) / n;
  return value.toFixed(2).toString();
}

export function isInfinity(value: number) {
  return (
    value == Number.POSITIVE_INFINITY ||
    value >= 1000000000 ||
    value == Number.NaN
  );
}
