export function round(value: number, n: number) {
  //return Math.round(value * n) / n;
  return value.toFixed(2).toString();
}

export function isInfinity(value: number) {
  return (
    value === Number.POSITIVE_INFINITY || value >= 1000000000 || isNaN(value)
  );
}

export const expScale = (min: number, max: number, value: number): number => {
  const minLog = Math.log(min); // 10 msec / tick
  const maxLog = Math.log(max); // 3000 msec / tick
  const scale = minLog + (1 - value) * (maxLog - minLog);
  return Math.exp(scale);
};
