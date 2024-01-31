export const VisualizerTypes = {
  radius: 0,
  color: 1,
  gray: 2,
  red: 3,
  dot: 4,
} as const;

export type VisualizerType =
  (typeof VisualizerTypes)[keyof typeof VisualizerTypes];
