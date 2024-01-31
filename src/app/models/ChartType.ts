export const ChartTypes = {
  ManufactureShare: 'Share of Manufacturing',
  AgricultureShare: 'Share of Agriculture',
  PriceIndex: 'Price Index',
  NominalWage: 'Nominal Wage',
  RealWage: 'Real Wage',
};
export type ChartType = (typeof ChartTypes)[keyof typeof ChartTypes];

export const chartTypes: ChartType[] = [
  ChartTypes.ManufactureShare,
  ChartTypes.AgricultureShare,
  ChartTypes.PriceIndex,
  ChartTypes.NominalWage,
  ChartTypes.RealWage,
];
