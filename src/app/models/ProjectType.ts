export const ProjectTypes = {
  Racetrack: 'Racetrack',
  Graph: 'Graph',
  RealWorld: 'RealWorld',
} as const;

export type ProjectType = (typeof ProjectTypes)[keyof typeof ProjectTypes];
