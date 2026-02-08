import { describe, it, expect } from 'vitest';
import { generatePuzzle } from '../generator.js';
import ledgerTheme from '../../themes/ledger.js';

const core = ledgerTheme.core;
const templates = ledgerTheme.templates;

describe('Validator — multi-seed', () => {
  it('generates valid puzzles for 200 seeds', () => {
    let passCount = 0;
    let _fallbackCount = 0;

    for (let seed = 1; seed <= 200; seed++) {
      const puzzle = generatePuzzle(seed, core, templates);

      // Basic structure
      expect(puzzle.suspects).toHaveLength(6);
      expect(puzzle.runeDeck).toHaveLength(4);
      expect(puzzle.liarId).toBeTruthy();

      // Check that liar exists
      const liar = puzzle.suspects.find(s => s.id === puzzle.liarId);
      expect(liar).toBeDefined();
      expect(liar!.isLiar).toBe(true);

      // Only count as pass if there's a real proof
      if (Object.keys(puzzle.solvabilityProof.pairRankings).length > 0) {
        passCount++;

        // Check best pair has liar as unique top-1
        const bestKey = puzzle.solvabilityProof.bestPair.join('+');
        const altKey = [...puzzle.solvabilityProof.bestPair].reverse().join('+');
        const ranking = puzzle.solvabilityProof.pairRankings[bestKey] ??
          puzzle.solvabilityProof.pairRankings[altKey];

        if (ranking && ranking.length > 0) {
          expect(ranking[0].suspectId).toBe(puzzle.liarId);
          if (ranking.length > 1) {
            expect(ranking[0].strikes).toBeGreaterThan(ranking[1].strikes);
          }
        }
      } else {
        _fallbackCount++;
      }
    }

    // At least 80% should have a real proof
    expect(passCount).toBeGreaterThanOrEqual(160);
  });

  it('golden seed snapshot', () => {
    const puzzle = generatePuzzle(20260207, core, templates);
    expect(puzzle.suspects).toHaveLength(6);
    expect(puzzle.runeDeck).toHaveLength(4);
    expect(typeof puzzle.liarId).toBe('string');

    const liar = puzzle.suspects.find(s => s.id === puzzle.liarId);
    expect(liar).toBeDefined();
    expect(liar!.isLiar).toBe(true);
  });

  it('regeneration log tracks attempts', () => {
    const puzzle = generatePuzzle(99999, core, templates);
    expect(puzzle.regenerationLog.attemptCount).toBeGreaterThanOrEqual(1);
    expect(typeof puzzle.regenerationLog.suffixUsed).toBe('number');
  });
});
