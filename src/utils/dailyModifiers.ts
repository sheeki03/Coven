export type DailyModifier = 'normal' | 'fogwatch' | 'silent-bells' | 'iron-watch';

const MODIFIERS: { id: DailyModifier; name: string; description: string }[] = [
  { id: 'normal', name: 'Standard Watch', description: 'A clear day for the Watch.' },
  { id: 'fogwatch', name: 'Fogwatch', description: 'The map is shrouded until the first rune is drawn.' },
  { id: 'silent-bells', name: 'Silent Bells', description: 'Bell labels appear as glyphs until the second rune.' },
  { id: 'iron-watch', name: 'Iron Watch', description: 'Evidence chips stay hidden until accusation. Hard mode.' },
];

export function getDailyModifier(seed: number): typeof MODIFIERS[0] {
  // Most days are normal; 40% chance of a modifier
  const roll = seed % 10;
  if (roll < 6) return MODIFIERS[0]; // normal
  if (roll < 8) return MODIFIERS[1]; // fogwatch
  if (roll < 9) return MODIFIERS[2]; // silent-bells
  return MODIFIERS[3]; // iron-watch
}

export function getModifierEffects(modifier: DailyModifier, drawnCount: number, phase: string) {
  return {
    hideMap: modifier === 'fogwatch' && drawnCount === 0,
    obscureBells: modifier === 'silent-bells' && drawnCount < 2,
    hideEvidence: modifier === 'iron-watch' && phase === 'investigating',
  };
}
