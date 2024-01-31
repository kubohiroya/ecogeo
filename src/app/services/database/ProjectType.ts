export const ProjectTypes = {
  racetrack: 'Racetrack',
  graph: 'Graph',
  realWorld: 'RealWorld',
} as const;

export type ProjectType = (typeof ProjectTypes)[keyof typeof ProjectTypes];

export const DatabaseItemTypes = {
  resource: 'Resource',
} as const;

export type DatabaseItemType =
  (typeof DatabaseItemTypes)[keyof typeof DatabaseItemTypes];
