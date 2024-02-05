export const ResourceTypes = {
  gadmShapes: 'gadmShapes',
  idegsmCities: 'idegsmCities',
  idegsmRoutes: 'idegsmRoutes',
};
export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];
