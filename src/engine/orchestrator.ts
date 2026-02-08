import type { GameState, GeneratedPuzzle, WorldReveal } from '../types/index.js';
import type { GameMode } from '../themes/types.js';
import type { ThemeCoreArrays, ThemeTemplates } from '../themes/types.js';
import { ENGINE_VERSION } from '../types/index.js';
import { generatePuzzle } from './generator.js';
import { getSeed, mulberry32 } from '../utils/rng.js';
import { fallbackGenerate } from '../services/fallback.js';

function cacheKey(seed: number, mode: GameMode, suffix: string): string {
  return `coven:v${ENGINE_VERSION}:${mode}:${suffix}:${seed}`;
}

export function loadPuzzleForToday(
  mode: GameMode,
  core: ThemeCoreArrays,
  templates: ThemeTemplates,
): { puzzle: GeneratedPuzzle; gameState: GameState } {
  const seed = getSeed();

  // Check cached structural puzzle (mode-scoped)
  const cachedPuzzle = loadFromCache<GeneratedPuzzle>(cacheKey(seed, mode, 'puzzle'));
  const puzzle = cachedPuzzle ?? generatePuzzle(seed, core, templates);

  if (!cachedPuzzle) {
    saveToCache(cacheKey(seed, mode, 'puzzle'), puzzle);
  }

  // Generate fallback narratives
  const rng = mulberry32(seed + 7777);
  const locationNames: Record<string, string> = {};
  for (const loc of puzzle.world.locations) {
    locationNames[loc.id] = loc.name;
  }

  const narrativeSuspects = fallbackGenerate(puzzle.suspects, locationNames, rng, templates);

  // Check for saved game state (mode-scoped)
  const savedState = loadFromCache<GameState>(cacheKey(seed, mode, 'gamestate'));
  if (savedState) {
    // Migration guard: if old save lacks revealedClaims, discard it
    if (!savedState.revealedClaims) {
      console.log('[COVEN] New game version — starting fresh.');
    } else {
      return { puzzle: { ...puzzle, suspects: narrativeSuspects }, gameState: savedState };
    }
  }

  const gameState: GameState = {
    phase: 'investigating',
    seed,
    suspects: narrativeSuspects,
    runeDeck: puzzle.runeDeck,
    drawnCards: [],
    revealedFacts: [],
    hintUsed: false,
    score: 1000,
    startTime: Date.now(),
    world: puzzle.world,
    interrogationTokens: 6,
    answerChips: [],
    interrogationTtsCalls: 0,
    defenseTtsCalls: 0,
    sttCalls: 0,
    revealedClaims: {},
    markedSuspects: [],
  };

  return { puzzle: { ...puzzle, suspects: narrativeSuspects }, gameState };
}

export function getHintFact(puzzle: GeneratedPuzzle, templates: ThemeTemplates): WorldReveal | undefined {
  const world = puzzle.world;
  const longEdges = world.edges
    .filter(e => e.bellsRequired >= 2)
    .sort((a, b) => b.bellsRequired - a.bellsRequired);

  if (longEdges.length > 1) {
    const edge = longEdges[1];
    const fromName = world.locations.find(l => l.id === edge.from)?.name ?? edge.from;
    const toName = world.locations.find(l => l.id === edge.to)?.name ?? edge.to;
    return {
      type: 'movement',
      fact: `${templates.hintPrefix} the crossing from ${fromName} to ${toName} demands ${edge.bellsRequired} bell${edge.bellsRequired === 1 ? '' : 's'}, no fewer.`,
      targetsSuspects: [],
    };
  }

  return {
    type: 'time',
    fact: `${templates.hintPrefix} ${world.anchor.description}.`,
    targetsSuspects: [],
  };
}

function loadFromCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveToCache(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function saveGameState(seed: number, mode: GameMode, state: GameState): void {
  saveToCache(cacheKey(seed, mode, 'gamestate'), state);
}

export function getLocationNames(puzzle: GeneratedPuzzle): Record<string, string> {
  const names: Record<string, string> = {};
  for (const loc of puzzle.world.locations) {
    names[loc.id] = loc.name;
  }
  return names;
}
