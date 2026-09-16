/** Uses crypto.randomUUID (CSPRNG-backed, RFC 4122 v4) - never Math.random. */
export function generateUuid(): string {
  return crypto.randomUUID();
}

/** Returns a random integer in [min, max] using crypto.getRandomValues (CSPRNG). */
export function randomInt(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new Error('Enter a valid minimum and maximum whole number.');
  }
  const range = max - min + 1;
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  return min + (randomValues[0] % range);
}

/** Rolls `count` dice with `sides` faces each, e.g. rollDice(6, 2) for 2d6. */
export function rollDice(sides: number, count: number): number[] {
  if (!Number.isInteger(sides) || sides < 2 || sides > 1000) {
    throw new Error('Choose a number of sides between 2 and 1000.');
  }
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    throw new Error('Choose a number of dice between 1 and 20.');
  }
  return Array.from({ length: count }, () => randomInt(1, sides));
}

export type CoinResult = 'Heads' | 'Tails';

/** Flips `count` coins using crypto.getRandomValues (CSPRNG). */
export function flipCoins(count: number): CoinResult[] {
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error('Choose a number of coins between 1 and 50.');
  }
  const randomValues = new Uint32Array(count);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => (v % 2 === 0 ? 'Heads' : 'Tails'));
}
