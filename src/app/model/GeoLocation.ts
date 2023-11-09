export interface GeoLocation {
  index: number;
  name: string;
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

export const createGeoLocation = ({
  index,
  x,
  y,
}: {
  index: number;
  x: number;
  y: number;
}): GeoLocation => ({
  index,
  name: `Location #${index}`,
  x,
  y,
  dx: 0,
  dy: 0,
  manufacturingShare: 0,
  manufacturingShare0: 0,
  agricultureShare: 0,
  priceIndex: 0,
  priceIndex0: 0,
  nominalWage: 0,
  nominalWage0: 0,
  realWage: 0,
  income: 0,
  income0: 0,
  deltaManufacturingShare: 0,
});

/*


  constructor(
    index: number,
    name: string,
    manufacturingShare: number,
    agricultureShare: number
  ) {
    this.index = index;
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.manufacturingShare = manufacturingShare;
    this.manufacturingShare0 = manufacturingShare;
    this.agricultureShare = agricultureShare;
  }

  reset() {
    this.priceIndex = 1.0;
    this.priceIndex0 = 1.0;
    this.nominalWage = 1.0;
    this.nominalWage0 = 1.0;
    this.realWage = 1.0;
    this.income = 1.0;
    this.income0 = 1.0;
    this.deltaManufacturingShare = 0.0;
  }

setManufacturingShare(d: number): void {
  this.manufacturingShare = d;
}

setAgricultureShare(d: number): void {
  this.agricultureShare = d;
}

changeManufacturingShare(d: number): void {
  this.deltaManufacturingShare = d;
  this.manufacturingShare += this.deltaManufacturingShare;
}

backupPreviousValues(): void {
  this.income0 = this.income;
  this.nominalWage0 = this.nominalWage;
  this.priceIndex0 = this.priceIndex;
  this.manufacturingShare0 = this.manufacturingShare;
}

calcIncome(country: Country): void {
  this.income =
    country.pi * this.manufacturingShare * this.nominalWage +
    (1 - country.pi) * this.agricultureShare;
}

calcPriceIndex(country: Country): void {
  let priceIndex = 0;
  country.locations.forEach((region) => {
    if (country.transportCostMatrix[this.index]) {
      priceIndex +=
        region.manufacturingShare *
        Math.pow(
          region.nominalWage0 *
          country.matrices.transportCostMatrix[this.index][region.index],
          1 - country.sigma
        );
    }
  });
  this.priceIndex = Math.pow(priceIndex, 1 / (1 - country.sigma));
}

calcRealWage(country: Country): void {
  this.realWage = this.nominalWage * Math.pow(this.priceIndex, -country.pi);
}

calcNominalWage(country: Country): void {
  let nominalWage = 0;
  country.locations.forEach((region) => {
    if (country.matrices.transportCostMatrix[this.index]) {
      nominalWage +=
        region.income0 *
        Math.pow(
          country.matrices.transportCostMatrix[this.index][region.index],
          1 - country.sigma
        ) *
        Math.pow(region.priceIndex0, country.sigma - 1);
    }
  });
  this.nominalWage = Math.pow(nominalWage, 1 / country.sigma);
}

calcDynamics(country: Country): void {
  this.deltaManufacturingShare =
    country.gamma *
    (this.realWage - country.avgRealWage) *
    this.manufacturingShare;
}

applyDynamics(country: Country): void {
  if (this.manufacturingShare > 1.0 / country.locations.length / 10.0) {
  this.manufacturingShare += this.deltaManufacturingShare;
} else {
  this.manufacturingShare = 1.0 / country.locations.length / 10.0;
}
}
}

 */
