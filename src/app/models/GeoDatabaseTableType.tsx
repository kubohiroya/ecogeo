export const GeoDatabaseTableTypes = {
  resources: 'resources',
  projects: 'projects',
};
export type GeoDatabaseTableType =
  (typeof GeoDatabaseTableTypes)[keyof typeof GeoDatabaseTableTypes];
