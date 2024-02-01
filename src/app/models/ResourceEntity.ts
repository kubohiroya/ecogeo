export type ResourceEntity = {
  uuid: string;
  name: string;
  type: ResourceType;
  description: string;
  url: string;
  updatedAt: number;
};

export const ResourceTypes = {
  gadmShapes: 'gadmShapes',
  idegsmCities: 'idegsmCities',
  idegsmRoutes: 'idegsmRoutes',
};
export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];
