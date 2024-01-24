export type ResourceEntity = {
  uuid: string;
  name: string;
  type: ResourceType;
  description: string;
  url: string;
  downloadedAt: number;
};

export enum ResourceType {
  gadmShapes,
  idegsmCities,
  idegsmRoutes,
}
