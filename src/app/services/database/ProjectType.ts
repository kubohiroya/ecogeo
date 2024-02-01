export const ProjectTypes = {
  Racetrack: 'Racetrack',
  Graph: 'Graph',
  RealWorld: 'RealWorld',
} as const;

export type ProjectType = (typeof ProjectTypes)[keyof typeof ProjectTypes];

export const DatabaseItemTypes = {
  Resource: 'Resource',
} as const;

export type DatabaseItemType =
  (typeof DatabaseItemTypes)[keyof typeof DatabaseItemTypes];
