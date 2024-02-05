export const DatabaseTableTypes = {
  resources: 'resources',
  projects: 'projects',
};
export type GeoDatabaseTableType =
  (typeof DatabaseTableTypes)[keyof typeof DatabaseTableTypes];
