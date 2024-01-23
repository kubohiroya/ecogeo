import { SessionState } from './SessionState';
import {
  backupPreviousValues,
  calcDynamics,
  calcIncome,
  calcNominalWage,
  calcPriceIndex,
  calcRealWage,
  City,
  resetCity,
} from './City';
import { loop } from '../utils/arrayUtil';

export function startSimulation(sessionState: SessionState) {
  sessionState.locations.map((target) => {
    const city = resetCity(target);
  });
}

export function equalize(locations: City[]) {
  const sum = locations
    .map((target) => target.manufactureShare)
    .reduce((a, b) => {
      return a + b;
    }, 0);
  locations.forEach((target) => {
    target.manufactureShare = target.manufactureShare / sum;
  });
}

export function tickSimulator(
  sessionState: SessionState,
  transportationCostMatrix: number[][],
) {
  loop(50).forEach(() => {
    sessionState.locations.forEach((location, index) => {
      backupPreviousValues(location);
    });
    sessionState.locations.forEach((location, index) => {
      location.income = calcIncome(
        sessionState.country.manufactureShare,
        location,
      );
    });
    sessionState.locations.forEach((location, index) => {
      location.priceIndex = calcPriceIndex(
        sessionState.locations,
        sessionState.country.elasticitySubstitution,
        transportationCostMatrix,
        location,
        index,
      );
    });

    sessionState.locations.forEach((location, index) => {
      location.nominalWage = calcNominalWage(
        sessionState.locations,
        sessionState.country.elasticitySubstitution,
        transportationCostMatrix,
        index,
      );
    });

    sessionState.locations.forEach((location, index) => {
      location.realWage = calcRealWage(
        sessionState.country.manufactureShare,
        location,
      );
    });
  });

  const avgRealWage = sessionState.locations
    .map((location) => location.realWage * location.manufactureShare)
    .reduce((a, b) => a + b, 0);

  sessionState.locations.forEach((location, index) => {
    location.manufactureShare += calcDynamics(
      sessionState.country.numLocations,
      sessionState.country.elasticitySubstitution,
      avgRealWage,
      location,
    );
  });

  equalize(sessionState.locations);
}
