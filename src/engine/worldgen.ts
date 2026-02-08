import type { Bell, Coords, EnvironmentFact, Location, TimestampAnchor, TravelEdge, WorldModel } from '../types/index.js';
import type { RNG } from '../utils/rng.js';
import { bellsRequired } from '../utils/bells.js';

/**
 * POOL_SIZE is the engine structural constant.
 * worldgen picks indices from [0, POOL_SIZE). Theme arrays provide labels.
 * This function accepts ZERO theme parameters — it is purely structural.
 */
export const POOL_SIZE = 6;

function euclideanDistance(a: Coords, b: Coords): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function distanceToMinutes(dist: number): number {
  const minMinutes = 5;
  const maxMinutes = 20;
  const maxDist = 141.4;
  return minMinutes + (dist / maxDist) * (maxMinutes - minMinutes);
}

/**
 * Generate a world using ONLY indices.
 * Location names, scents, relics — all come from theme AFTER this returns.
 *
 * @param rng - seeded RNG
 * @param locationNames - display names for the 6 locations (theme-provided)
 * @param scents - display names for the 6 scents (theme-provided)
 * @param relics - display names for the 6 relics (theme-provided)
 * @param envDescriptors - environment descriptor templates (theme-provided)
 * @param bellNames - bell display names (theme-provided)
 * @param anchorDescTemplate - template for anchor description (theme-provided)
 */
export function generateWorld(
  rng: RNG,
  locationNames: readonly string[],
  scents: readonly string[],
  relics: readonly string[],
  envDescriptors: readonly string[],
  bellNames: Record<Bell, string>,
  anchorDescTemplate: string,
): WorldModel {
  // Pick 4 location indices from pool of 6
  const chosenIndices = rng.pickN([0, 1, 2, 3, 4, 5], 4);
  const chosenNames = chosenIndices.map(i => locationNames[i]);

  const locations: Location[] = chosenNames.map(name => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
    name,
    coords: { x: rng.intBetween(5, 95), y: rng.intBetween(5, 95) },
  }));

  // Build edges from coordinates (all pairs)
  const edges: TravelEdge[] = [];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const dist = euclideanDistance(locations[i].coords, locations[j].coords);
      const minutes = Math.round(distanceToMinutes(dist));
      const bells = bellsRequired(minutes);
      edges.push(
        { from: locations[i].id, to: locations[j].id, minutes, bellsRequired: bells },
        { from: locations[j].id, to: locations[i].id, minutes, bellsRequired: bells },
      );
    }
  }

  // Anchor: watch-horn at a random bell (1-4) from a random location
  const anchorBell = rng.intBetween(1, 4) as Bell;
  const anchorLoc = rng.pick(locations);
  const anchor: TimestampAnchor = {
    bell: anchorBell,
    location: anchorLoc.id,
    description: anchorDescTemplate
      .replace('{bell}', bellNames[anchorBell])
      .replace('{loc}', anchorLoc.name),
  };

  // Environment facts: one per location
  const environmentFacts: EnvironmentFact[] = locations.map(loc => {
    const scent = rng.pick([...scents]);
    const template = rng.pick([...envDescriptors]);
    const fact = template.replace('{loc}', loc.name).replace('{scent}', scent);
    const fromBell = rng.intBetween(0, 2) as Bell;
    const toBell = rng.intBetween(3, 5) as Bell;
    return { location: loc.id, fact, scent, fromBell, toBell };
  });

  // Relic truth
  const relicHolder = ''; // Will be set by suspect gen
  const relic = rng.pick([...relics]);
  const relicLoc = rng.pick(locations);

  return {
    locations,
    edges,
    anchor,
    environmentFacts,
    relicTruth: { holder: relicHolder, relic, location: relicLoc.id },
  };
}

export function getTravelTime(world: WorldModel, from: string, to: string): TravelEdge | undefined {
  return world.edges.find(e => e.from === from && e.to === to);
}
