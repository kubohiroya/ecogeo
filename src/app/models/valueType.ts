export const ValueTypes = {
  passThrough: 0,
  priceIndex: 1,
  ratioToMax: 2,
  multiply100aroundOne: 3,
  multiply1000aroundOne: 3,
} as const;

export type ValueType = (typeof ValueTypes)[keyof typeof ValueTypes];
