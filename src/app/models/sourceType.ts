export const SourceTypes = {
  manufactureShare: 0,
  priceIndex: 1,
  nominalWage: 2,
  realWage: 3,
  avgRealWage: 4,
} as const;

export type SourceType = (typeof SourceTypes)[keyof typeof SourceTypes];
