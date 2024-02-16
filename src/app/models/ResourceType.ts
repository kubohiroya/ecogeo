export const ResourceTypes = {
  gadmGeoJson: 'gadmGeoJsonFiles',
  genericGeoJson: 'genericGeoJsonFiles',
  idegsmCities: 'idegsmCities',
  idegsmRoutes: 'idegsmRoutes',
  mapTiler: 'MapTiler',
};
export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];
