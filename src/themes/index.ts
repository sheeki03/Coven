import type { ThemeConfig, GameMode } from './types.js';
import ledgerTheme from './ledger.js';

// Lazy-loaded themes — gaslight and casefile imported on demand but
// we import them eagerly for validation and ALL_THEMES access
import gaslightTheme from './gaslight.js';
import casefileTheme from './casefile.js';

const THEMES: Record<GameMode, ThemeConfig> = {
  ledger: ledgerTheme,
  gaslight: gaslightTheme,
  casefile: casefileTheme,
};

export const ALL_THEMES: ThemeConfig[] = Object.values(THEMES);

export function getTheme(mode: GameMode): ThemeConfig {
  return THEMES[mode];
}

// ─── Dev-only validation ─────────────────────────────────────

function assertLen(label: string, arr: readonly unknown[], expected: number) {
  if (arr.length !== expected) {
    throw new Error(`[COVEN] ${label} has ${arr.length} items, expected ${expected}`);
  }
}

export function validateTheme(t: ThemeConfig) {
  assertLen(`${t.id}.locations`, t.core.locations, 6);
  assertLen(`${t.id}.suspectNames`, t.core.suspectNames, 6);
  assertLen(`${t.id}.suspectRoles`, t.core.suspectRoles, 6);
  assertLen(`${t.id}.relics`, t.core.relics, 6);
  assertLen(`${t.id}.scents`, t.core.scents, 6);
}

if (import.meta.env.DEV) {
  ALL_THEMES.forEach(validateTheme);
}

export type { ThemeConfig, GameMode } from './types.js';
