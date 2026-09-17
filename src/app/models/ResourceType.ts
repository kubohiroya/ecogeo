export const ResourceTypes = {
  gadmGeoJson: 'gadmGeoJsonFiles',
  genericGeoJson: 'genericGeoJsonFiles',
  idegsmCities: 'idegsmCities',
  idegsmRoutes: 'idegsmRoutes',
  mapTiles: 'MapTiles',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];
