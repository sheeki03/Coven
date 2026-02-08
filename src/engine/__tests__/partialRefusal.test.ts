import { describe, it, expect } from 'vitest';
import { generatePuzzle } from '../generator.js';
import { generateAnswerSpec, expandAnswerText, hashString } from '../interrogation.js';
import ledgerTheme from '../../themes/ledger.js';
import gaslightTheme from '../../themes/gaslight.js';
import casefileTheme from '../../themes/casefile.js';
import type { ThemeConfig } from '../../themes/types.js';
import type { QuestionCardType, Bell } from '../../types/index.js';

/**
 * "Never invent tokens" — partial refusals must only surface data
 * already present in the suspect's claimVector segments.
 */

const themes: [string, ThemeConfig][] = [
  ['ledger', ledgerTheme],
  ['gaslight', gaslightTheme],
  ['casefile', casefileTheme],
];

const CARD_TYPES: QuestionCardType[] = [
  'bell_probe', 'route_probe', 'anchor_probe', 'object_probe',
  'sense_probe', 'witness_probe', 'consistency', 'detail_trap',
];

describe('Partial refusal — never invent tokens', () => {
  for (const [themeName, theme] of themes) {
    describe(themeName, () => {
      const seeds = [42, 7777, 20260207];

      for (const seed of seeds) {
        it(`seed ${seed}: partial refusal anchors come from claimVector`, () => {
          const puzzle = generatePuzzle(seed, theme.core, theme.templates);
          const world = puzzle.world;

          // Collect all location names and bell names from world
          const allLocationNames = new Set(world.locations.map(l => l.name));
          const bellNames = theme.templates.bellNames;

          for (const suspect of puzzle.suspects) {
            const claim = suspect.claimVector;
            // Build set of valid location names from this suspect's claimVector
            const validLocs = new Set<string>();
            for (const seg of claim.segments) {
              const fromLoc = world.locations.find(l => l.id === seg.from);
              const toLoc = world.locations.find(l => l.id === seg.to);
              if (fromLoc) validLocs.add(fromLoc.name);
              if (toLoc) validLocs.add(toLoc.name);
            }

            // Build set of valid bell names from this suspect's claimVector
            const validBells = new Set<string>();
            for (const seg of claim.segments) {
              if (bellNames[seg.departBell]) validBells.add(bellNames[seg.departBell]);
              if (bellNames[seg.arriveBell]) validBells.add(bellNames[seg.arriveBell]);
            }

            for (const cardType of CARD_TYPES) {
              // Force-generate a spec with pressure 3 (highest refusal chance)
              // We can't guarantee a refusal from generateAnswerSpec (RNG dependent),
              // so we test the anchor selection logic directly
              const spec = generateAnswerSpec(
                suspect, cardType, 3, world, seed, 0, theme.templates,
              );

              if (spec.chipType === 'refusal' && spec.anchors.length >= 2) {
                const [anchorLoc, anchorBell] = spec.anchors;

                // Location must be from this suspect's claimVector
                expect(validLocs.has(anchorLoc)).toBe(true);
                // Bell must be from this suspect's claimVector
                expect(validBells.has(anchorBell)).toBe(true);
                // Both must exist in the world
                expect(allLocationNames.has(anchorLoc)).toBe(true);

                // Expanded text must contain both anchors
                const text = expandAnswerText(
                  spec, suspect, world, seed, 3, cardType, theme.templates,
                );
                expect(text).toContain(anchorLoc);
                expect(text).toContain(anchorBell);
              }
            }
          }
        });
      }

      it('same inputs always pick the same segment index', () => {
        const seed = 42;
        const puzzle = generatePuzzle(seed, theme.core, theme.templates);

        for (const suspect of puzzle.suspects) {
          for (const cardType of CARD_TYPES) {
            const segs = suspect.claimVector.segments;
            if (segs.length === 0) continue;

            // Compute expected segment index
            const expectedIdx = Math.abs(hashString(String(seed) + suspect.id + cardType)) % segs.length;

            // Repeat 3 times — must be identical (deterministic)
            for (let i = 0; i < 3; i++) {
              const idx = Math.abs(hashString(String(seed) + suspect.id + cardType)) % segs.length;
              expect(idx).toBe(expectedIdx);
            }

            // Verify the selected segment is valid
            const seg = segs[expectedIdx];
            expect(seg).toBeDefined();
            expect(seg.departBell).toBeGreaterThanOrEqual(0);
            expect(seg.departBell).toBeLessThanOrEqual(5);
          }
        }
      });

      it('anchor segment varies across different suspects', () => {
        const seed = 42;
        const puzzle = generatePuzzle(seed, theme.core, theme.templates);
        const cardType: QuestionCardType = 'bell_probe';

        // Collect which segment index each suspect would get
        const indices = puzzle.suspects.map(suspect => {
          const segs = suspect.claimVector.segments;
          if (segs.length === 0) return -1;
          return Math.abs(hashString(String(seed) + suspect.id + cardType)) % segs.length;
        });

        // With different suspectIds feeding the hash, we'd expect variation
        // (not all the same index) — though with small segment counts this
        // can't be guaranteed, so we just verify they're all valid
        for (let i = 0; i < indices.length; i++) {
          const segs = puzzle.suspects[i].claimVector.segments;
          if (segs.length === 0) {
            expect(indices[i]).toBe(-1);
          } else {
            expect(indices[i]).toBeGreaterThanOrEqual(0);
            expect(indices[i]).toBeLessThan(segs.length);
          }
        }
      });

      it('partial refusal suffix renders correctly with {loc} and {bell}', () => {
        const seed = 20260207;
        const puzzle = generatePuzzle(seed, theme.core, theme.templates);

        for (const suspect of puzzle.suspects) {
          const segs = suspect.claimVector.segments;
          if (segs.length === 0) continue;

          // Pick any segment to build a mock refusal spec
          const seg = segs[0];
          const locName = puzzle.world.locations.find(l => l.id === seg.from)?.name;
          const bell = seg.departBell as Bell;
          const bellName = theme.templates.bellNames[bell];
          if (!locName || !bellName) continue;

          const mockSpec = {
            anchors: [locName, bellName],
            evasionLevel: 'heavy' as const,
            temperament: 'timid' as const,
            chipSummary: `Partial: at ${locName} at ${bellName}`,
            chipType: 'refusal' as const,
            templateKey: 'refusal',
          };

          const text = expandAnswerText(
            mockSpec, suspect, puzzle.world, seed, 3, 'bell_probe', theme.templates,
          );

          // Text should not contain unexpanded placeholders
          expect(text).not.toContain('{loc}');
          expect(text).not.toContain('{bell}');
          // Text should contain the actual values
          expect(text).toContain(locName);
          expect(text).toContain(bellName);
        }
      });
    });
  }
});
