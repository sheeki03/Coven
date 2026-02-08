import { describe, it, expect } from 'vitest';
import { generateWorld, getTravelTime } from '../worldgen.js';
import { mulberry32 } from '../../utils/rng.js';
import ledgerTheme from '../../themes/ledger.js';

const core = ledgerTheme.core;
const templates = ledgerTheme.templates;

describe('World Generation', () => {
  it('generates 4 locations', () => {
    const rng = mulberry32(12345);
    const world = generateWorld(rng, core.locations, core.scents, core.relics, templates.environmentDescriptors, templates.bellNames, templates.anchorDescription);
    expect(world.locations).toHaveLength(4);
  });

  it('generates bidirectional edges for all pairs', () => {
    const rng = mulberry32(12345);
    const world = generateWorld(rng, core.locations, core.scents, core.relics, templates.environmentDescriptors, templates.bellNames, templates.anchorDescription);
    // 4 locations => C(4,2)=6 pairs => 12 directed edges
    expect(world.edges).toHaveLength(12);
  });

  it('has symmetric travel times', () => {
    const rng = mulberry32(12345);
    const world = generateWorld(rng, core.locations, core.scents, core.relics, templates.environmentDescriptors, templates.bellNames, templates.anchorDescription);
    for (const edge of world.edges) {
      const reverse = getTravelTime(world, edge.to, edge.from);
      expect(reverse).toBeDefined();
      expect(reverse!.minutes).toBe(edge.minutes);
    }
  });

  it('triangle inequality holds for all triplets across 100 seeds', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const rng = mulberry32(seed);
      const world = generateWorld(rng, core.locations, core.scents, core.relics, templates.environmentDescriptors, templates.bellNames, templates.anchorDescription);
      const locs = world.locations;

      for (let i = 0; i < locs.length; i++) {
        for (let j = 0; j < locs.length; j++) {
          if (i === j) continue;
          for (let k = 0; k < locs.length; k++) {
            if (k === i || k === j) continue;
            const ab = getTravelTime(world, locs[i].id, locs[j].id);
            const bc = getTravelTime(world, locs[j].id, locs[k].id);
            const ac = getTravelTime(world, locs[i].id, locs[k].id);

            if (ab && bc && ac) {
              expect(ac.minutes).toBeLessThanOrEqual(ab.minutes + bc.minutes + 1);
            }
          }
        }
      }
    }
  });

  it('has a valid anchor', () => {
    const rng = mulberry32(12345);
    const world = generateWorld(rng, core.locations, core.scents, core.relics, templates.environmentDescriptors, templates.bellNames, templates.anchorDescription);
    expect(world.anchor.bell).toBeGreaterThanOrEqual(1);
    expect(world.anchor.bell).toBeLessThanOrEqual(4);
    expect(world.locations.some(l => l.id === world.anchor.location)).toBe(true);
  });

  it('generates environment facts for each location', () => {
    const rng = mulberry32(12345);
    const world = generateWorld(rng, core.locations, core.scents, core.relics, templates.environmentDescriptors, templates.bellNames, templates.anchorDescription);
    expect(world.environmentFacts.length).toBe(world.locations.length);
  });
});
