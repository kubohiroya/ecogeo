export type ResourceEntity = {
  uuid: string;
  name: string;
  type: ResourceType;
  description: string;
  url: string;
  downloadedAt: number;
};

export const ResourceTypes = {
  gadmShapes: 0,
  idegsmCities: 1,
  idegsmRoutes: 2,
};
export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];
