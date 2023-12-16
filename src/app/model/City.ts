export interface City {
  // index: number;
  id: number;
  label: string;
  x: number;
  y: number;

  dx: number;
  dy: number;

  manufacturingShare: number;
  manufacturingShare0: number;
  agricultureShare: number;
  priceIndex: number;
  priceIndex0: number;
  nominalWage: number;
  nominalWage0: number;
  realWage: number;
  income: number;
  income0: number;
  deltaManufacturingShare: number;
}

/*
  constructor(
    index: number,
    name: string,
    manufacturingShare: number,
    agricultureShare: number
  ) {
    city.index = index;
    city.name = name;
    city.x = 0;
    city.y = 0;
    city.dx = 0;
    city.dy = 0;
    city.manufacturingShare = manufacturingShare;
    city.manufacturingShare0 = manufacturingShare;
    city.agricultureShare = agricultureShare;
  }
 */
/*
function reset(city: City) {
  city.priceIndex = 1.0;
  city.priceIndex0 = 1.0;
  city.nominalWage = 1.0;
  city.nominalWage0 = 1.0;
  city.realWage = 1.0;
  city.income = 1.0;
  city.income0 = 1.0;
  city.deltaManufacturingShare = 0.0;
}

function setManufacturingShare(d: number, city: City): void {
  city.manufacturingShare = d;
}

function setAgricultureShare(d: number, city: City): void {
  city.agricultureShare = d;
}

function changeManufacturingShare(d: number, city: City): void {
  city.deltaManufacturingShare = d;
  city.manufacturingShare += city.deltaManufacturingShare;
}

function backupPreviousValues(city: City): void {
  city.income0 = city.income;
  city.nominalWage0 = city.nominalWage;
  city.priceIndex0 = city.priceIndex;
  city.manufacturingShare0 = city.manufacturingShare;
}

function calcIncome(city: City, country: Country): void {
  city.income =
    country.pi * city.manufacturingShare * city.nominalWage +
    (1 - country.pi) * city.agricultureShare;
}

function calcPriceIndex(session: Session, city: City, country: Country): void {
  let priceIndex = 0;
  session.locations.forEach((location: City) => {
    if (
      session.transportationCostMatrix &&
      session.transportationCostMatrix[city.index]
    ) {
      priceIndex +=
        location.manufacturingShare *
        Math.pow(
          location.nominalWage0 *
            session.transportationCostMatrix[city.index][location.index],
          1 - country.sigma
        );
    }
  });
  city.priceIndex = Math.pow(priceIndex, 1 / (1 - country.sigma));
}

function calcRealWage(country: Country, city: City): void {
  city.realWage = city.nominalWage * Math.pow(city.priceIndex, -country.pi);
}

function calcNominalWage(session: Session, country: Country, city: City): void {
  let nominalWage = 0;
  session.locations.forEach((location: City) => {
    if (
      session.transportationCostMatrix &&
      session.transportationCostMatrix[city.index]
    ) {
      nominalWage +=
        location.income0 *
        Math.pow(
          session.transportationCostMatrix[city.index][location.index],
          1 - city.sigma
        ) *
        Math.pow(location.priceIndex0, city.sigma - 1);
    }
  });
  city.nominalWage = Math.pow(nominalWage, 1 / city.sigma);
}

function calcDynamics(country: Country, city: City): void {
  city.deltaManufacturingShare =
    city.gamma *
    (city.realWage - country.avgRealWage) *
    city.manufacturingShare;
}

function applyDynamics(session: Session, city: City): void {
  if (city.manufacturingShare > 1.0 / session.locations.length / 10.0) {
    city.manufacturingShare += city.deltaManufacturingShare;
  } else {
    city.manufacturingShare = 1.0 / session.locations.length / 10.0;
  }
}
*/
