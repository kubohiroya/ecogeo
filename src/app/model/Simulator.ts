import { SessionState } from './SessionState';
import {
  backupPreviousValues,
  calcDynamics,
  calcIncome,
  calcNominalWage,
  calcPriceIndex,
  calcRealWage,
  resetCity,
} from './City';

export function startSimulation(sessionState: SessionState) {
  sessionState.locations.map((target) => {
    const city = resetCity(target);
  });
}

export function makeCoherent(sessionState: SessionState) {
  const sum = sessionState.locations
    .map((target) => {
      return [target.manufactureShare, target.agricultureShare];
    })
    .reduce(
      (a, b) => {
        return [a[0] + b[0], a[1] + b[1]];
      },
      [0, 0]
    );
  sessionState.locations.forEach((target) => {
    target.manufactureShare = target.manufactureShare / sum[0];
    target.agricultureShare = target.agricultureShare / sum[1];
  });
}

export function tickSimulator(
  sessionState: SessionState,
  transportationCostMatrix: number[][]
) {
  sessionState.locations.forEach((location, index) => {
    backupPreviousValues(location);
  });
  sessionState.locations.forEach((location, index) => {
    location.income = calcIncome(sessionState.country, location);
  });
  sessionState.locations.forEach((location, index) => {
    location.priceIndex = calcPriceIndex(
      sessionState.locations,
      sessionState.country,
      transportationCostMatrix,
      location,
      index
    );
  });

  sessionState.locations.forEach((location, index) => {
    location.nominalWage = calcNominalWage(
      sessionState.locations,
      sessionState.country,
      transportationCostMatrix,
      index
    );
  });

  sessionState.locations.forEach((location, index) => {
    location.realWage = calcRealWage(sessionState.country, location);
  });

  const avgRealWage = sessionState.locations
    .map((location) => location.realWage * location.manufactureShare)
    .reduce((a, b) => a + b, 0);

  sessionState.locations.forEach((location, index) => {
    location.manufactureShare += calcDynamics(
      sessionState.country,
      avgRealWage,
      location
    );
  });

  makeCoherent(sessionState);
}
