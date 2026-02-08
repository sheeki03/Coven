import { describe, it, expect } from 'vitest';
import { generatePuzzle } from '../generator.js';
import ledgerTheme from '../../themes/ledger.js';
import gaslightTheme from '../../themes/gaslight.js';
import casefileTheme from '../../themes/casefile.js';
import type { ThemeConfig } from '../../themes/types.js';
import type { GeneratedPuzzle } from '../../types/index.js';

/**
 * Extract a PURELY STRUCTURAL signature from a puzzle.
 * Uses positional indices instead of string IDs since location IDs
 * are derived from theme location names (and thus differ per mode).
 *
 * What's structural: RNG-derived topology, liar position, claim shape.
 * What's flavor: strings (location names, suspect names, rune display names).
 */
function structureSignature(puzzle: GeneratedPuzzle) {
  const world = puzzle.world;

  // Build a location-ID-to-index map for this puzzle's locations
  const locIndex = new Map<string, number>();
  world.locations.forEach((l, i) => locIndex.set(l.id, i));

  // Location coordinates (RNG-determined, theme-independent)
  const locCoords = world.locations.map(l => ({ x: l.coords.x, y: l.coords.y }));

  // Edge topology by index: sorted (fromIdx, toIdx, bells)
  const edges = world.edges
    .map(e => {
      const fi = locIndex.get(e.from) ?? -1;
      const ti = locIndex.get(e.to) ?? -1;
      return `${fi}->${ti}:${e.bellsRequired}`;
    })
    .sort();

  // Anchor: bell + location index
  const anchorLocIdx = locIndex.get(world.anchor.location) ?? -1;
  const anchor = `${world.anchor.bell}@${anchorLocIdx}`;

  // Liar index (position in suspects array)
  const liarIndex = puzzle.suspects.findIndex(s => s.isLiar);

  // Claim vectors: structural shape only (use location indices, not IDs)
  const claims = puzzle.suspects.map(s => {
    const cv = s.claimVector;
    return {
      segmentCount: cv.segments.length,
      segments: cv.segments.map(seg => ({
        from: locIndex.get(seg.from) ?? -1,
        to: locIndex.get(seg.to) ?? -1,
        departBell: seg.departBell,
        arriveBell: seg.arriveBell,
      })),
      heardHornAt: cv.heardHornAt
        ? { bell: cv.heardHornAt.bell, where: locIndex.get(cv.heardHornAt.where) ?? -1 }
        : null,
      hasRelic: !!cv.carriedRelic,
      sensedAt: cv.sensed
        ? { where: locIndex.get(cv.sensed.where) ?? -1 }
        : null,
    };
  });

  // Rune deck: archetype order (structural constant IDs)
  const runeArchetypes = puzzle.runeDeck.map(r => r.archetype);

  // Environment facts: location index + bell range
  const envFacts = world.environmentFacts.map(ef => ({
    locIdx: locIndex.get(ef.location) ?? -1,
    fromBell: ef.fromBell,
    toBell: ef.toBell,
  }));

  // Relic truth: location index
  const relicLocIdx = locIndex.get(world.relicTruth.location) ?? -1;

  return {
    locCoords,
    edges,
    anchor,
    liarIndex,
    claims,
    runeArchetypes,
    envFacts,
    relicLocIdx,
  };
}

function generateForTheme(seed: number, theme: ThemeConfig) {
  return generatePuzzle(seed, theme.core, theme.templates);
}

describe('Determinism', () => {
  it('same seed + same theme produces identical puzzles', () => {
    const seed = 20260207;
    const a = generateForTheme(seed, ledgerTheme);
    const b = generateForTheme(seed, ledgerTheme);

    expect(a.seed).toBe(b.seed);
    expect(a.liarId).toBe(b.liarId);
    expect(a.suspects.map(s => s.claimVector)).toEqual(b.suspects.map(s => s.claimVector));
    expect(a.runeDeck.map(r => r.id)).toEqual(b.runeDeck.map(r => r.id));
    expect(a.world.locations.map(l => l.id)).toEqual(b.world.locations.map(l => l.id));
  });

  it('different seeds produce different puzzles', () => {
    const a = generateForTheme(20260207, ledgerTheme);
    const b = generateForTheme(20260208, ledgerTheme);

    const sigA = structureSignature(a);
    const sigB = structureSignature(b);
    // At minimum, the coordinates or liar index should differ
    expect(JSON.stringify(sigA)).not.toEqual(JSON.stringify(sigB));
  });
});

describe('Cross-mode determinism', () => {
  const themes: [string, ThemeConfig][] = [
    ['ledger', ledgerTheme],
    ['gaslight', gaslightTheme],
    ['casefile', casefileTheme],
  ];

  const seeds = [42, 7777, 20260207];

  for (const seed of seeds) {
    it(`seed ${seed}: same structural signature across all 3 modes`, () => {
      const results = themes.map(([name, theme]) => ({
        name,
        puzzle: generateForTheme(seed, theme),
      }));

      const signatures = results.map(r => structureSignature(r.puzzle));

      // All three modes must produce the same structural signature
      for (let i = 1; i < signatures.length; i++) {
        expect(signatures[i].locCoords).toEqual(signatures[0].locCoords);
        expect(signatures[i].edges).toEqual(signatures[0].edges);
        expect(signatures[i].anchor).toEqual(signatures[0].anchor);
        expect(signatures[i].liarIndex).toEqual(signatures[0].liarIndex);
        expect(signatures[i].claims).toEqual(signatures[0].claims);
        expect(signatures[i].runeArchetypes).toEqual(signatures[0].runeArchetypes);
        expect(signatures[i].envFacts).toEqual(signatures[0].envFacts);
        expect(signatures[i].relicLocIdx).toEqual(signatures[0].relicLocIdx);
      }
    });
  }

  it('display names differ between modes for the same seed', () => {
    const seed = 42;
    const ledger = generateForTheme(seed, ledgerTheme);
    const gaslight = generateForTheme(seed, gaslightTheme);
    const casefile = generateForTheme(seed, casefileTheme);

    // Suspect names should be different across modes
    expect(ledger.suspects.map(s => s.name)).not.toEqual(gaslight.suspects.map(s => s.name));
    expect(ledger.suspects.map(s => s.name)).not.toEqual(casefile.suspects.map(s => s.name));

    // Rune display names should be different
    expect(ledger.runeDeck.map(r => r.name)).not.toEqual(gaslight.runeDeck.map(r => r.name));
    expect(ledger.runeDeck.map(r => r.name)).not.toEqual(casefile.runeDeck.map(r => r.name));

    // Location names should be different
    expect(ledger.world.locations.map(l => l.name)).not.toEqual(gaslight.world.locations.map(l => l.name));
    expect(ledger.world.locations.map(l => l.name)).not.toEqual(casefile.world.locations.map(l => l.name));
  });
});
