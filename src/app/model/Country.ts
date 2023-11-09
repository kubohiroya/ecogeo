export interface Country {
  /* a country has her regions in this vector */
  id: string;
  title: string;
  description: string;

  type: string;
  numLocations: number;

  /*  ratio of workers */
  shareManufacturing: number;

  /* maximum transport cost between ach pair of cities */
  transportationCost: number;

  /* elasticity of substitution */
  elasticitySubstitution: number;

  //locations: GeoLocation[];

  /*
  constructor(
    numRegions: number,
    pi: number,
    transportCost: number,
    sigma: number
  ) {
    this.numLocations = numRegions;
    this.pi = pi;
    this.transportCost = transportCost;
    this.sigma = sigma;
    this.avgRealWage = 1.0;
    this.locations = [];
    // this.matrices = new Matrices(0);

    Timer.getSimulationTimer().addTimeEventListener((event: TimerEvent) => {
      switch (event.type) {
        case 'tick':
          this.tick();
          break;
        case 'start':
          break;
        case 'stop':
          break;
        case 'reset':
          this.resetRegions();
          break;
      }
    });
  }

  setNumRegions(numRegions: number) {
    this.numLocations = numRegions;
  }

  setSigma(d: number): void {
    this.sigma = d + 0.1;
  }

  setTransportCost(d: number): void {
    this.transportCost = d;
  }

  setPi(mu: number): void {
    this.pi = mu;
  }

  resetRegions() {
    for (let region of this.locations) {
      region.manufacturingShare = 1 / this.locations.length;
      region.agricultureShare = 1 / this.locations.length;
      region.reset();
    }
    this.disturb();
  }

  disturb(): void {
    const numCities = this.locations.length;
    if (numCities > 0) {
      const dd = (1.0 / numCities) * 0.05;
      for (let i = 0; i < numCities; i++) {
        const from = Math.floor(random() * numCities);
        const to = Math.floor(random() * numCities);
        this.locations[from].changeManufacturingShare(dd);
        this.locations[to].changeManufacturingShare(-1 * dd);
      }
    }
    this.rescale();
  }

  rescale(): void {
    let m = 0,
      a = 0;
    this.locations.forEach((region) => {
      m += region.manufacturingShare;
      a += region.agricultureShare;
    });
    this.locations.forEach((region) => {
      region.setManufacturingShare(region.manufacturingShare / m);
      region.setAgricultureShare(region.agricultureShare / a);
    });
  }

  backupPreviousValues(): void {
    this.locations.forEach((region) => {
      region.backupPreviousValues();
    });
  }

  calcIncome(): void {
    this.locations.forEach((region) => {
      region.calcIncome(this);
    });
  }

  calcPriceIndex(): void {
    this.locations.forEach((region) => {
      region.calcPriceIndex(this);
    });
  }

  calcNominalWage(): void {
    this.locations.forEach((region) => {
      region.calcNominalWage(this);
    });
  }

  calcRealWage(): void {
    this.locations.forEach((region) => {
      region.calcRealWage(this);
    });
  }

  calcAvgRealWage(): void {
    let avgRealWage = 0;
    this.locations.forEach((region) => {
      avgRealWage += region.realWage * region.manufacturingShare;
    });
    this.avgRealWage = avgRealWage;
  }

  calcDynamics(): void {
    this.locations.forEach((region) => {
      region.calcDynamics(this);
    });
  }

  applyDynamics(): void {
    this.locations.forEach((region) => {
      region.applyDynamics(this);
    });
    this.rescale();
  }

  tick(): void {
    for (let i = 0; i < 50; i++) {
      this.backupPreviousValues();
      this.calcIncome();
      this.calcPriceIndex();
      this.calcNominalWage();
    }
    this.calcRealWage();
    this.calcAvgRealWage();
    this.calcDynamics();
    this.applyDynamics();
  }
   */
}
