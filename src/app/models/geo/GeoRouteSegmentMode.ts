export const GeoRouteSegmentModes = {
  Road: 1,
  Airway: 2,
  Seaway: 3,
  Railway: 4,
  HighSpeedRailway: 5,
} as const;

export type GeoRouteSegmentMode =
  (typeof GeoRouteSegmentModes)[keyof typeof GeoRouteSegmentModes];
