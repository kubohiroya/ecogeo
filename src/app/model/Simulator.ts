/*

function tickSimulator(session: Session) {
  backupPreviousValues(session);
  calcIncome(session);
  calcPriceIndex(session);
  calcNominalWage(session);
  calcRealWage(session);
  calcAvgRealWage(session);
  calcDynamics(session);
  applyDynamics(session);
}


function backupPreviousValues(session: Session): void {
  session.locations.forEach((Location) => {
    Location.backupPreviousValues();
  });
}

function calcIncome(session: Session): void {
  session.locations.forEach((Location) => {
    Location.calcIncome(session);
  });
}

function calcPriceIndex(session: Session): void {
  session.locations.forEach((Location) => {
    Location.calcPriceIndex(session);
  });
}

function calcNominalWage(session: Session): void {
  session.locations.forEach((Location) => {
    Location.calcNominalWage(session);
  });
}

function calcRealWage(session: Session): void {
  session.locations.forEach((Location) => {
    Location.calcRealWage(session);
  });
}

function calcAvgRealWage(session: Session): void {
  let avgRealWage = 0;
  session.locations.forEach((Location) => {
    avgRealWage += location.realWage * location.manufacturingShare;
  });
  session.avgRealWage = avgRealWage;
}

function calcDynamics(session: Session): void {
  session.locations.forEach((location) => {
    location.calcDynamics(session);
  });
}

function applyDynamics(session: Session): void {
  session.locations.forEach((location) => {
    location.applyDynamics(session);
  });
  rescale(session);
}

function rescale(session: Session): void {}
*/
