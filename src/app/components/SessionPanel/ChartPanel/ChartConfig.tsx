import { City } from '../../../model/City';

export const chartConfig: Record<
  string,
  {
    min: number;
    max: number;
    oy: number;
    ticks: Array<{
      min: number;
      max: number;
      step: number;
    }>;
    bar?: (location: City) => number;
    line?: (location: City) => number;
    toFixed: number;
  }
> = {
  'Share of Manufacturing': {
    min: 0,
    max: 1,
    oy: 0,
    ticks: [
      { min: 0, max: 1, step: 0.1 },
      { min: 0, max: 0.2, step: 0.05 },
      { min: 0, max: 0.1, step: 0.01 },
    ],
    bar: (location: City) => location.manufacturingShare,
    toFixed: 2,
  },
  'Share of Agriculture': {
    min: 0,
    max: 1,
    oy: 0,
    ticks: [
      { min: 0, max: 1, step: 0.1 },
      { min: 0, max: 0.25, step: 0.05 },
      { min: 0, max: 0.1, step: 0.02 },
    ],
    bar: (location: City) => location.agricultureShare,
    toFixed: 2,
  },
  'Price Index': {
    min: 0,
    max: 4,
    oy: 0,
    ticks: [
      { min: 0, max: 4, step: 0.2 },
      { min: 0, max: 0.2, step: 0.05 },
    ],
    line: (location: City) => location.priceIndex,
    toFixed: 2,
  },
  'Nominal Wage': {
    min: 0.8,
    max: 1.2,
    oy: 1,
    ticks: [
      { min: 0.8, max: 1.2, step: 0.05 },
      { min: 0.95, max: 1.05, step: 0.005 },
    ],
    line: (location: City) => location.nominalWage,
    toFixed: 3,
  },
  'Real Wage': {
    min: 0.8,
    max: 1.2,
    oy: 1,
    ticks: [
      { min: 0.8, max: 1.2, step: 0.05 },
      { min: 0.9, max: 1.1, step: 0.01 },
      { min: 0.95, max: 1.05, step: 0.005 },
    ],
    line: (location: City) => location.realWage,
    toFixed: 3,
  },
};
