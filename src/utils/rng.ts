export interface RNG {
  next(): number;           // [0, 1)
  intBetween(min: number, max: number): number;  // inclusive
  pick<T>(arr: readonly T[]): T;
  shuffle<T>(arr: T[]): T[];
  pickN<T>(arr: readonly T[], n: number): T[];
}

export function mulberry32(seed: number): RNG {
  let state = seed | 0;

  function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function intBetween(min: number, max: number): number {
    return min + Math.floor(next() * (max - min + 1));
  }

  function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(next() * arr.length)];
  }

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickN<T>(arr: readonly T[], n: number): T[] {
    return shuffle([...arr]).slice(0, n);
  }

  return { next, intBetween, pick, shuffle, pickN };
}

export function getSeed(): number {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed');
    if (seedParam) {
      const parsed = parseInt(seedParam, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  return y * 10000 + m * 100 + d;
}
