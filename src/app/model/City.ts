import { Country } from './Country';
import { isInfinity } from '../util/mathUtil';

export interface City {
  id: number;
  label: string;
  x: number;
  y: number;

  dx: number;
  dy: number;

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

export function resetCity(target: City, numLocations?: number) {
  target.priceIndex = 1.0;
  target.priceIndex0 = 1.0;
  target.nominalWage = 1.0;
  target.nominalWage0 = 1.0;
  target.realWage = 1.0;
  target.income = 1.0;
  target.income0 = 1.0;

  if (numLocations && 0 < numLocations) {
    target.manufactureShare =
      (1.0 / numLocations) * (1 + 0.1 * (Math.random() - 0.5));
    target.agricultureShare = 1.0 / numLocations;
  }
  return target;
}

export function backupPreviousValues(target: City): void {
  target.income0 = target.income;
  target.nominalWage0 = target.nominalWage;
  target.priceIndex0 = target.priceIndex;
  target.manufactureShare0 = target.manufactureShare;
}

export function calcIncome(country: Country, target: City): number {
  return (
    country.manufactureShare * target.manufactureShare * target.nominalWage +
    (1 - country.manufactureShare) * target.agricultureShare
  );
}

export function calcPriceIndex(
  locations: City[],
  country: Country,
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
              1 - country.elasticitySubstitution
            );
    })
    .reduce((a, b) => a + b, 0.0);
  return Math.pow(priceIndex, 1 / (1 - country.elasticitySubstitution));
}

export function calcNominalWage(
  locations: City[],
  country: Country,
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
            Math.pow(transportationCost, 1 - country.elasticitySubstitution) *
            Math.pow(location.priceIndex0, country.elasticitySubstitution - 1);
    })
    .reduce((a, b) => a + b, 0.0);
  return Math.pow(nominalWage, 1 / country.elasticitySubstitution);
}

export function calcRealWage(country: Country, target: City): number {
  return (
    target.nominalWage * Math.pow(target.priceIndex, -country.manufactureShare)
  );
}

export function calcDynamics(
  country: Country,
  avgRealWage: number,
  target: City
): number {
  if (target.manufactureShare > 1.0 / country.numLocations / 10.0) {
    //return target.manufacturingShare + target.deltaManufacturingShare;
    return (
      country.elasticitySubstitution *
      (target.realWage - avgRealWage) *
      target.manufactureShare
    );
  } else {
    return 1.0 / country.numLocations / 10.0;
  }
}
