// Seeded pseudo-statistics that feel communal without a backend.
// Deterministic per seed so everyone sees the same "stats" for the same daily puzzle.

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getCommunityStats(seed: number): { survivedPct: number; fallenPct: number; totalPlayers: string } {
  const rng = mulberry32(seed * 7919 + 31337);
  // Survived rate: 45-78% range (most puzzles are solvable but not trivial)
  const survivedPct = Math.round(45 + rng() * 33);
  const fallenPct = 100 - survivedPct;

  // Fake player count: 800-4200
  const players = Math.round(800 + rng() * 3400);
  const totalPlayers = players > 1000
    ? `${(players / 1000).toFixed(1)}k`
    : String(players);

  return { survivedPct, fallenPct, totalPlayers };
}
