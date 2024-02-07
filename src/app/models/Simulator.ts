import { SessionState } from './SessionState';
import {
  backupPreviousValues,
  calcDynamics,
  calcIncome,
  calcNominalWage,
  calcPriceIndex,
  calcRealWage,
  City,
} from './City';

// import { loop } from '../utils/arrayUtil';

function equalize(locations: City[]) {
  const sum = locations
    .map((target) => target.manufactureShare)
    .reduce((a, b) => {
      return a + b;
    }, 0);
  locations.forEach((target) => {
    target.manufactureShare = target.manufactureShare / sum;
  });
}

const NUM_CALIBRATION_LOOP = 50;

export function tickSimulator(
  sessionState: SessionState,
  transportationCostMatrix: number[][],
) {
  for (let i = 0; i < NUM_CALIBRATION_LOOP; i++) {
    sessionState.locations.forEach((location, index) => {
      backupPreviousValues(location);
    });
    sessionState.locations.forEach((location, index) => {
      location.income = calcIncome(
        sessionState.parameterSet.manufactureShare,
        location,
      );
    });
    sessionState.locations.forEach((location, index) => {
      location.priceIndex = calcPriceIndex(
        sessionState.locations,
        sessionState.parameterSet.elasticitySubstitution,
        transportationCostMatrix,
        location,
        index,
      );
    });

    sessionState.locations.forEach((location, index) => {
      location.nominalWage = calcNominalWage(
        sessionState.locations,
        sessionState.parameterSet.elasticitySubstitution,
        transportationCostMatrix,
        index,
      );
    });

    sessionState.locations.forEach((location, index) => {
      location.realWage = calcRealWage(
        sessionState.parameterSet.manufactureShare,
        location,
      );
    });
  }
  const avgRealWage = sessionState.locations
    .map((location) => location.realWage * location.manufactureShare)
    .reduce((a, b) => a + b, 0);

  sessionState.locations.forEach((location, index) => {
    location.manufactureShare += calcDynamics(
      sessionState.parameterSet.numLocations,
      sessionState.parameterSet.elasticitySubstitution,
      avgRealWage,
      location,
    );
  });

  equalize(sessionState.locations);
}
