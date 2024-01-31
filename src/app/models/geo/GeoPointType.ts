export const GeoPointTypes = {
  RegionCentroid: 1,
  RoadWaypoint: 2,
  Airport: 3,
  AirwayWaypoint: 4,
  Seaport: 5,
  SeawayWaypoint: 6,
  RailwayStation: 7,
  RailwayWaypoint: 8,
} as const;

export type GeoPointType = (typeof GeoPointTypes)[keyof typeof GeoPointTypes];
