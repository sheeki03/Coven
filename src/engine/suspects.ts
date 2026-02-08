import type { Bell, ClaimVector, Location, Segment, Suspect, WorldModel } from '../types/index.js';
import type { RNG } from '../utils/rng.js';
import { getTravelTime } from './worldgen.js';

function makeHonestSegments(
  rng: RNG,
  world: WorldModel,
  startLoc: Location,
  startBell: Bell,
): Segment[] {
  const segments: Segment[] = [];
  let currentLoc = startLoc;
  let currentBell = startBell;

  const numSegments = rng.intBetween(1, 2);

  for (let i = 0; i < numSegments; i++) {
    if (currentBell >= 5) break;

    const shouldMove = rng.next() > 0.3;

    if (shouldMove) {
      const reachable = world.locations.filter(loc => {
        if (loc.id === currentLoc.id) return false;
        const edge = getTravelTime(world, currentLoc.id, loc.id);
        if (!edge) return false;
        return currentBell + edge.bellsRequired <= 5;
      });

      if (reachable.length > 0) {
        const dest = rng.pick(reachable);
        const edge = getTravelTime(world, currentLoc.id, dest.id)!;
        const arriveBell = Math.min(5, currentBell + edge.bellsRequired) as Bell;
        segments.push({
          from: currentLoc.id,
          to: dest.id,
          departBell: currentBell,
          arriveBell,
        });
        currentLoc = dest;
        currentBell = arriveBell;
      } else {
        const stayUntil = Math.min(5, currentBell + rng.intBetween(1, 2)) as Bell;
        segments.push({
          from: currentLoc.id,
          to: currentLoc.id,
          departBell: currentBell,
          arriveBell: stayUntil,
        });
        currentBell = stayUntil;
      }
    } else {
      const stayUntil = Math.min(5, currentBell + rng.intBetween(1, 2)) as Bell;
      segments.push({
        from: currentLoc.id,
        to: currentLoc.id,
        departBell: currentBell,
        arriveBell: stayUntil,
      });
      currentBell = stayUntil;
    }
  }

  if (segments.length === 0) {
    segments.push({
      from: currentLoc.id,
      to: currentLoc.id,
      departBell: startBell,
      arriveBell: Math.min(5, startBell + 2) as Bell,
    });
  }

  return segments;
}

export function generateHonestClaims(
  rng: RNG,
  world: WorldModel,
  count: number,
): ClaimVector[] {
  const claims: ClaimVector[] = [];
  const usedStartLocations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let startLoc: Location;
    const available = world.locations.filter(l => !usedStartLocations.has(l.id));
    if (available.length > 0) {
      startLoc = rng.pick(available);
    } else {
      startLoc = rng.pick(world.locations);
    }
    usedStartLocations.add(startLoc.id);

    const startBell = rng.intBetween(0, 2) as Bell;
    const segments = makeHonestSegments(rng, world, startLoc, startBell);

    let heardHornAt: ClaimVector['heardHornAt'] | undefined;
    const suspectLocAtAnchor = getLocationAtBell(segments, world.anchor.bell);
    if (suspectLocAtAnchor) {
      if (rng.next() > 0.4) {
        heardHornAt = { bell: world.anchor.bell, where: suspectLocAtAnchor };
      }
    }

    let carriedRelic: string | undefined;
    if (i === 0 && world.relicTruth.relic) {
      carriedRelic = world.relicTruth.relic;
    }

    let sensed: ClaimVector['sensed'] | undefined;
    const lastSeg = segments[segments.length - 1];
    const envFact = world.environmentFacts.find(ef => ef.location === lastSeg.to && ef.scent);
    if (envFact && rng.next() > 0.5) {
      sensed = { scent: envFact.scent!, where: envFact.location };
    }

    claims.push({
      suspectId: `suspect-${i}`,
      segments,
      heardHornAt,
      carriedRelic,
      sensed,
    });
  }

  return claims;
}

function getLocationAtBell(segments: Segment[], bell: Bell): string | null {
  for (const seg of segments) {
    if (bell >= seg.departBell && bell <= seg.arriveBell) {
      return seg.to;
    }
  }
  if (segments.length > 0) {
    if (bell < segments[0].departBell) return segments[0].from;
    return segments[segments.length - 1].to;
  }
  return null;
}

export function generateLiarClaims(
  rng: RNG,
  world: WorldModel,
  _honestClaims: ClaimVector[],
  scents: readonly string[],
): { liarClaim: ClaimVector; contradictionTypes: Set<string> } {
  const contradictionTypes = new Set<string>();

  const startLoc = rng.pick(world.locations);
  const startBell = rng.intBetween(0, 2) as Bell;

  const segments: Segment[] = [];

  // Lie 1: TIME — claim impossibly fast travel
  const dest = world.locations.find(l => l.id !== startLoc.id)!;
  const edge = getTravelTime(world, startLoc.id, dest.id);
  if (edge && edge.bellsRequired >= 2) {
    segments.push({
      from: startLoc.id,
      to: dest.id,
      departBell: startBell,
      arriveBell: Math.min(5, startBell + Math.max(1, edge.bellsRequired - 1)) as Bell,
    });
    contradictionTypes.add('time');
  } else {
    const longEdges = world.edges
      .filter(e => e.bellsRequired >= 2)
      .sort((a, b) => b.bellsRequired - a.bellsRequired);

    if (longEdges.length > 0) {
      const longEdge = longEdges[0];
      segments.push({
        from: longEdge.from,
        to: longEdge.to,
        departBell: startBell,
        arriveBell: Math.min(5, startBell + Math.max(1, longEdge.bellsRequired - 1)) as Bell,
      });
      contradictionTypes.add('time');
    } else {
      const farLoc = world.locations.find(l => l.id !== startLoc.id)!;
      segments.push({
        from: startLoc.id,
        to: farLoc.id,
        departBell: startBell,
        arriveBell: startBell,
      });
      contradictionTypes.add('movement');
    }
  }

  const lastSeg = segments[segments.length - 1];

  // Lie 2: HORN — claim hearing horn from wrong location
  let heardHornAt: ClaimVector['heardHornAt'] | undefined;
  const wrongHornLocs = world.locations.filter(l => l.id !== world.anchor.location);
  if (wrongHornLocs.length > 0) {
    heardHornAt = {
      bell: world.anchor.bell,
      where: rng.pick(wrongHornLocs).id,
    };
    contradictionTypes.add('time');
  }

  // Lie 3: RELIC — claim carrying the relic when they don't
  let carriedRelic: string | undefined;
  if (world.relicTruth.relic && rng.next() > 0.3) {
    carriedRelic = world.relicTruth.relic;
    contradictionTypes.add('object');
  }

  // Lie 4: ENVIRONMENT — claim wrong scent at location
  let sensed: ClaimVector['sensed'] | undefined;
  const locEnv = world.environmentFacts.find(ef => ef.location === lastSeg.to);
  if (locEnv && locEnv.scent) {
    const wrongScents = [...scents].filter(s => s !== locEnv.scent);
    sensed = { scent: rng.pick(wrongScents), where: locEnv.location };
    contradictionTypes.add('environment');
  }

  return {
    liarClaim: {
      suspectId: 'liar',
      segments,
      heardHornAt,
      carriedRelic,
      sensed,
    },
    contradictionTypes,
  };
}

export function assembleSuspects(
  rng: RNG,
  honestClaims: ClaimVector[],
  liarClaim: ClaimVector,
  world: WorldModel,
  suspectNames: readonly string[],
  suspectRoles: readonly string[],
): { suspects: Suspect[]; liarId: string } {
  const shuffledNames = rng.shuffle([...suspectNames]);
  const shuffledRoles = rng.shuffle([...suspectRoles]);

  const liarIndex = rng.intBetween(0, 5);
  const allClaims: ClaimVector[] = [];
  let honestIdx = 0;
  let liarId = '';

  for (let i = 0; i < 6; i++) {
    if (i === liarIndex) {
      allClaims.push(liarClaim);
    } else {
      allClaims.push(honestClaims[honestIdx++]);
    }
  }

  const relicCarrier = allClaims.find(
    (c, idx) => idx !== liarIndex && c.carriedRelic === world.relicTruth.relic
  );
  if (relicCarrier) {
    world.relicTruth.holder = relicCarrier.suspectId;
  }

  const suspects: Suspect[] = allClaims.map((claim, i) => {
    const id = `suspect-${i}`;
    claim.suspectId = id;
    const isLiar = i === liarIndex;
    if (isLiar) liarId = id;

    return {
      id,
      name: shuffledNames[i],
      role: shuffledRoles[i],
      claimVector: claim,
      narrativeAlibi: '',
      strikes: 0,
      evidence: [],
      isLiar,
    };
  });

  if (relicCarrier) {
    const holderSuspect = suspects.find(s => s.claimVector === relicCarrier);
    if (holderSuspect) world.relicTruth.holder = holderSuspect.id;
  }

  return { suspects, liarId };
}
