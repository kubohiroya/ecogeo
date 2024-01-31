import seedrandom from 'seedrandom';

export class SeedRandom {
  rng: seedrandom.PRNG;

  constructor(seed?: string | number) {
    if (seed === undefined) {
      seed = Math.random().toString();
    }
    this.rng = seedrandom(seed.toString());
  }

  random() {
    return this.rng.double();
  }
}

export const SEED =
  new URLSearchParams(window.location.search).get('seed') || Math.random();
export const SEED_RANDOM: SeedRandom = new SeedRandom(SEED);

export function random() {
  return SEED_RANDOM.random();
}
