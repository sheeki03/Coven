import type { ClaimVector, Evidence, RevealedClaimDetail, Segment, StrikeDelta, WorldModel, WorldReveal } from '../types/index.js';
import { getTravelTime } from './worldgen.js';

// --- Stable fact ID helper (single source of truth) ---

export function stableFactId(cardId: string, slot: 'headline' | 'secondary'): string {
  return `${cardId}:${slot}`;
}

export function hintFactId(type: string): string {
  return `hint:${type}`;
}

// --- Claim knowledge guards (centralized) ---

export function isSegmentTimingKnown(seg: Segment, rc: RevealedClaimDetail): boolean {
  return rc.route || (rc.bells.includes(seg.departBell) && rc.bells.includes(seg.arriveBell));
}

export function isHornKnown(rc: RevealedClaimDetail): boolean {
  return rc.anchor;
}

export function isRelicKnown(rc: RevealedClaimDetail): boolean {
  return rc.object;
}

export function isScentKnown(rc: RevealedClaimDetail): boolean {
  return rc.sense;
}

function ensureRevealed(revealedClaims: Record<string, RevealedClaimDetail> | undefined, suspectId: string): RevealedClaimDetail | undefined {
  if (!revealedClaims) return undefined; // undefined = show everything (study mode / backwards compat)
  return revealedClaims[suspectId] ?? {
    bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false,
  };
}

// --- Fact ID map builder ---

function buildFactIdMap(revealedFacts: WorldReveal[], cardId: string): string[] {
  // Each revealed fact gets a stable ID. We use the cardId parameter as a base.
  // In practice, facts come from rune cards (headline/secondary) or hints.
  // The caller should provide pre-built IDs, but for backwards compat we generate from index.
  return revealedFacts.map((_f, i) => `${cardId}:fact:${i}`);
}

function checkTimeContradictions(
  claim: ClaimVector,
  revealedFacts: WorldReveal[],
  world: WorldModel,
  cardId: string,
  rc?: RevealedClaimDetail,
  factIds?: string[],
): Evidence[] {
  const evidence: Evidence[] = [];

  for (let segIdx = 0; segIdx < claim.segments.length; segIdx++) {
    const seg = claim.segments[segIdx];
    if (seg.from === seg.to) continue; // stayed put, no travel

    // Guard: if revealedClaims provided, skip if segment timing unknown
    if (rc && !isSegmentTimingKnown(seg, rc)) continue;

    const edge = getTravelTime(world, seg.from, seg.to);
    if (!edge) continue;

    const claimedBells = seg.arriveBell - seg.departBell;
    const requiredBells = edge.bellsRequired;

    // Only flag if we have a road/time reveal that covers this route
    const matchingFacts = revealedFacts
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => f.type === 'movement' || f.type === 'time');

    if (matchingFacts.length > 0 && claimedBells < requiredBells) {
      const fromName = world.locations.find(l => l.id === seg.from)?.name ?? seg.from;
      const toName = world.locations.find(l => l.id === seg.to)?.name ?? seg.to;
      const sourceIds = factIds
        ? matchingFacts.map(({ i }) => factIds[i]).filter(Boolean)
        : undefined;
      evidence.push({
        type: 'time',
        description: `No road reaches ${toName} in ${claimedBells} bell${claimedBells === 1 ? '' : 's'} from ${fromName}. The shortest path requires ${requiredBells}.`,
        cardId,
        relatedSegmentIndex: segIdx,
        sourceFactIds: sourceIds,
      });
    }
  }

  return evidence;
}

function checkMovementContradictions(
  claim: ClaimVector,
  revealedFacts: WorldReveal[],
  world: WorldModel,
  cardId: string,
  rc?: RevealedClaimDetail,
  factIds?: string[],
): Evidence[] {
  const evidence: Evidence[] = [];

  for (let segIdx = 0; segIdx < claim.segments.length; segIdx++) {
    const seg = claim.segments[segIdx];
    if (seg.from === seg.to) continue;

    // Guard: if revealedClaims provided, skip if segment timing unknown
    if (rc && !isSegmentTimingKnown(seg, rc)) continue;

    if (seg.departBell === seg.arriveBell) {
      const matchingFacts = revealedFacts
        .map((f, i) => ({ f, i }))
        .filter(({ f }) => f.type === 'movement');

      if (matchingFacts.length > 0) {
        const fromName = world.locations.find(l => l.id === seg.from)?.name ?? seg.from;
        const toName = world.locations.find(l => l.id === seg.to)?.name ?? seg.to;
        const sourceIds = factIds
          ? matchingFacts.map(({ i }) => factIds[i]).filter(Boolean)
          : undefined;
        evidence.push({
          type: 'movement',
          description: `Claims to have traveled from ${fromName} to ${toName} instantly. No gate nor passage permits such a crossing.`,
          cardId,
          relatedSegmentIndex: segIdx,
          sourceFactIds: sourceIds,
        });
      }
    }
  }

  return evidence;
}

function checkHornContradiction(
  claim: ClaimVector,
  revealedFacts: WorldReveal[],
  world: WorldModel,
  cardId: string,
  rc?: RevealedClaimDetail,
  factIds?: string[],
): Evidence[] {
  const evidence: Evidence[] = [];

  if (!claim.heardHornAt) return evidence;

  // Guard: if revealedClaims provided, skip if horn claim unknown
  if (rc && !isHornKnown(rc)) return evidence;

  const matchingFacts = revealedFacts
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.type === 'time' && f.fact.includes(world.anchor.description));

  if (matchingFacts.length > 0) {
    if (claim.heardHornAt.where !== world.anchor.location) {
      const claimedLoc = world.locations.find(l => l.id === claim.heardHornAt!.where)?.name ?? claim.heardHornAt.where;
      const actualLoc = world.locations.find(l => l.id === world.anchor.location)?.name ?? world.anchor.location;
      const sourceIds = factIds
        ? matchingFacts.map(({ i }) => factIds[i]).filter(Boolean)
        : undefined;
      evidence.push({
        type: 'time',
        description: `Claims the signal sounded from ${claimedLoc}, but it was heard from ${actualLoc}.`,
        cardId,
        sourceFactIds: sourceIds,
      });
    }
  }

  return evidence;
}

function checkObjectContradictions(
  claim: ClaimVector,
  revealedFacts: WorldReveal[],
  world: WorldModel,
  allClaims: ClaimVector[],
  cardId: string,
  rc?: RevealedClaimDetail,
  factIds?: string[],
): Evidence[] {
  const evidence: Evidence[] = [];

  if (!claim.carriedRelic) return evidence;

  // Guard: if revealedClaims provided, skip if relic claim unknown
  if (rc && !isRelicKnown(rc)) return evidence;

  const matchingFacts = revealedFacts
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.type === 'object');

  if (matchingFacts.length > 0) {
    const sourceIds = factIds
      ? matchingFacts.map(({ i }) => factIds[i]).filter(Boolean)
      : undefined;

    // Check if multiple suspects claim the same relic
    const otherCarriers = allClaims.filter(
      c => c.suspectId !== claim.suspectId && c.carriedRelic === claim.carriedRelic
    );
    if (otherCarriers.length > 0) {
      evidence.push({
        type: 'object',
        description: `Claims to have carried ${claim.carriedRelic}, but another also makes this claim. Only one may hold it.`,
        cardId,
        sourceFactIds: sourceIds,
      });
    }

    // Check against relic truth if holder is known
    if (world.relicTruth.holder && world.relicTruth.holder !== claim.suspectId) {
      if (claim.carriedRelic === world.relicTruth.relic) {
        evidence.push({
          type: 'object',
          description: `Claims to have carried ${claim.carriedRelic}, yet the rune reveals another bore it that day.`,
          cardId,
          sourceFactIds: sourceIds,
        });
      }
    }
  }

  return evidence;
}

function checkEnvironmentContradictions(
  claim: ClaimVector,
  revealedFacts: WorldReveal[],
  world: WorldModel,
  cardId: string,
  rc?: RevealedClaimDetail,
  factIds?: string[],
): Evidence[] {
  const evidence: Evidence[] = [];

  if (!claim.sensed) return evidence;

  // Guard: if revealedClaims provided, skip if scent claim unknown
  if (rc && !isScentKnown(rc)) return evidence;

  const matchingFacts = revealedFacts
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.type === 'environment');

  if (matchingFacts.length === 0) return evidence;

  const locFact = world.environmentFacts.find(ef => ef.location === claim.sensed!.where);
  if (locFact && locFact.scent && locFact.scent !== claim.sensed.scent) {
    const locName = world.locations.find(l => l.id === claim.sensed!.where)?.name ?? claim.sensed.where;
    const sourceIds = factIds
      ? matchingFacts.map(({ i }) => factIds[i]).filter(Boolean)
      : undefined;
    evidence.push({
      type: 'environment',
      description: `Claims to have sensed ${claim.sensed.scent} at ${locName}, but the rune reveals it was ${locFact.scent} that hung in the air.`,
      cardId,
      sourceFactIds: sourceIds,
    });
  }

  return evidence;
}

export function evaluateStrikes(
  claim: ClaimVector,
  revealedFacts: WorldReveal[],
  world: WorldModel,
  allClaims: ClaimVector[],
  cardId: string = 'eval',
  revealedClaims?: Record<string, RevealedClaimDetail>,
  factIds?: string[],
): StrikeDelta {
  const rc = ensureRevealed(revealedClaims, claim.suspectId);
  const ids = factIds ?? buildFactIdMap(revealedFacts, cardId);

  const allEvidence: Evidence[] = [
    ...checkTimeContradictions(claim, revealedFacts, world, cardId, rc, ids),
    ...checkMovementContradictions(claim, revealedFacts, world, cardId, rc, ids),
    ...checkHornContradiction(claim, revealedFacts, world, cardId, rc, ids),
    ...checkObjectContradictions(claim, revealedFacts, world, allClaims, cardId, rc, ids),
    ...checkEnvironmentContradictions(claim, revealedFacts, world, cardId, rc, ids),
  ];

  return {
    suspectId: claim.suspectId,
    strikes: allEvidence.length,
    evidence: allEvidence,
  };
}

export function evaluateAllStrikes(
  suspects: { id: string; claimVector: ClaimVector }[],
  revealedFacts: WorldReveal[],
  world: WorldModel,
  cardId: string = 'eval',
  revealedClaims?: Record<string, RevealedClaimDetail>,
  factIds?: string[],
): StrikeDelta[] {
  const allClaims = suspects.map(s => s.claimVector);
  const ids = factIds ?? buildFactIdMap(revealedFacts, cardId);
  return suspects.map(s => evaluateStrikes(s.claimVector, revealedFacts, world, allClaims, cardId, revealedClaims, ids));
}
