import { isInfinity } from '../utils/mathUtil';
import { SEED_RANDOM, SeedRandom } from '../utils/random';

export interface City {
  id: number;
  label: string;
  point: number[];
  velocity?: number[];
  manufactureShare: number;
  manufactureShare0: number;
  agricultureShare: number;
  priceIndex: number;
  priceIndex0: number;
  nominalWage: number;
  nominalWage0: number;
  realWage: number;
  income: number;
  income0: number;
}

const RANDOM_FACTOR = 0.05;
const randomizedOf = (seedRandom: SeedRandom, value: number) =>
  value * (1 + (seedRandom.random() - 0.5) * RANDOM_FACTOR);

export const createCity = ({
  id,
  label,
  point,
  share,
  randomize,
}: {
  id: number;
  label: string;
  point: [number, number];
  share: number;
  randomize: boolean;
}): City => {
  const manufactureShare = randomize ? randomizedOf(SEED_RANDOM, share) : share;
  const agricultureShare = randomize ? randomizedOf(SEED_RANDOM, share) : share;
  return {
    id,
    label,
    point,
    velocity: [0, 0],
    manufactureShare,
    manufactureShare0: manufactureShare,
    agricultureShare,
    priceIndex: 1.0,
    priceIndex0: 1.0,
    nominalWage: 1.0,
    nominalWage0: 1.0,
    realWage: 1.0,
    income: 1.0,
    income0: 1.0,
  };
};

export function resetCity(target: City, numLocations?: number) {
  target.priceIndex = 1.0;
  target.priceIndex0 = 1.0;
  target.nominalWage = 1.0;
  target.nominalWage0 = 1.0;
  target.realWage = 1.0;
  target.income = 1.0;
  target.income0 = 1.0;

  if (numLocations && 0 < numLocations) {
    target.manufactureShare = randomizedOf(SEED_RANDOM, 1.0 / numLocations);
    target.agricultureShare = randomizedOf(SEED_RANDOM, 1.0 / numLocations);
    target.manufactureShare0 = target.manufactureShare;
  }
  return target;
}

export function backupPreviousValues(target: City): void {
  target.income0 = target.income;
  target.nominalWage0 = target.nominalWage;
  target.priceIndex0 = target.priceIndex;
  target.manufactureShare0 = target.manufactureShare;
}

export function calcIncome(manufactureShare: number, target: City): number {
  return (
    manufactureShare * target.manufactureShare * target.nominalWage +
    (1 - manufactureShare) * target.agricultureShare
  );
}

export function calcPriceIndex(
  locations: City[],
  elasticitySubstitution: number,
  transportationCostMatrix: number[][],
  target: City,
  targetLocationIndex: number
): number {
  const priceIndex = locations
    .map((location: City, index) => {
      const transportationCost =
        transportationCostMatrix[targetLocationIndex][index];
      return isInfinity(transportationCost)
        ? 0
        : location.manufactureShare *
            Math.pow(
              location.nominalWage0 * transportationCost,
              1 - elasticitySubstitution
            );
    })
    .reduce((a, b) => a + b, 0.0);
  return Math.pow(priceIndex, 1 / (1 - elasticitySubstitution));
}

export function calcNominalWage(
  locations: City[],
  elasticitySubstitution: number,
  transportationCostMatrix: number[][],
  targetLocationIndex: number
): number {
  const nominalWage = locations
    .map((location: City, index: number) => {
      const transportationCost =
        transportationCostMatrix[targetLocationIndex][index];
      return isInfinity(transportationCost)
        ? 0
        : location.income0 *
            Math.pow(transportationCost, 1 - elasticitySubstitution) *
            Math.pow(location.priceIndex0, elasticitySubstitution - 1);
    })
    .reduce((a, b) => a + b, 0.0);
  return Math.pow(nominalWage, 1 / elasticitySubstitution);
}

export function calcRealWage(manufactureShare: number, target: City): number {
  return (
    target.nominalWage * Math.pow(target.priceIndex, -1.0 * manufactureShare)
  );
}

export function calcDynamics(
  numLocations: number,
  elasticitySubstitution: number,
  avgRealWage: number,
  target: City
): number {
  if (target.manufactureShare > 1.0 / numLocations / 10.0) {
    //return target.manufacturingShare + target.deltaManufacturingShare;
    return (
      elasticitySubstitution *
      (target.realWage - avgRealWage) *
      target.manufactureShare
    );
  } else {
    return 1.0 / numLocations / 10.0;
  }
}
