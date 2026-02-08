import { describe, it, expect } from 'vitest';
import { evaluateAllStrikes, evaluateStrikes } from '../contradictions.js';
import type { Bell, ClaimVector, WorldModel, WorldReveal, RevealedClaimDetail } from '../../types/index.js';

function makeMinimalWorld(): WorldModel {
  return {
    locations: [
      { id: 'ford', name: 'The Ford', coords: { x: 0, y: 0 } },
      { id: 'gate', name: 'Stone Gate', coords: { x: 50, y: 50 } },
      { id: 'hall', name: 'Hall of Oaths', coords: { x: 100, y: 0 } },
      { id: 'grove', name: 'Ash Grove', coords: { x: 100, y: 100 } },
    ],
    edges: [
      { from: 'ford', to: 'gate', minutes: 15, bellsRequired: 2 },
      { from: 'gate', to: 'ford', minutes: 15, bellsRequired: 2 },
      { from: 'ford', to: 'hall', minutes: 20, bellsRequired: 2 },
      { from: 'hall', to: 'ford', minutes: 20, bellsRequired: 2 },
      { from: 'gate', to: 'grove', minutes: 15, bellsRequired: 2 },
      { from: 'grove', to: 'gate', minutes: 15, bellsRequired: 2 },
      { from: 'hall', to: 'grove', minutes: 10, bellsRequired: 1 },
      { from: 'grove', to: 'hall', minutes: 10, bellsRequired: 1 },
    ],
    anchor: {
      bell: 2 as Bell,
      location: 'ford',
      description: 'The watch-horn sounded at Third Bell from The Ford',
    },
    environmentFacts: [
      { location: 'grove', fact: 'Pine smoke in grove', scent: 'pine smoke', fromBell: 0 as Bell, toBell: 3 as Bell },
    ],
    relicTruth: { holder: 'honest', relic: 'the iron key', location: 'hall' },
  };
}

function allRevealed(): RevealedClaimDetail {
  return { bells: [0, 1, 2, 3, 4, 5], route: true, anchor: true, object: true, sense: true, openingHeard: true };
}

function noneRevealed(): RevealedClaimDetail {
  return { bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false };
}

describe('Fairness: Deduction-pure strikes', () => {
  const world = makeMinimalWorld();
  const liarClaim: ClaimVector = {
    suspectId: 'liar',
    segments: [
      { from: 'ford', to: 'gate', departBell: 0 as Bell, arriveBell: 0 as Bell }, // instant travel = contradiction
    ],
    heardHornAt: { bell: 2 as Bell, where: 'gate' }, // horn at wrong location
    carriedRelic: 'the iron key', // false relic claim
    sensed: { scent: 'iron rust', where: 'grove' }, // wrong scent
  };
  const honestClaim: ClaimVector = {
    suspectId: 'honest',
    segments: [
      { from: 'hall', to: 'hall', departBell: 0 as Bell, arriveBell: 5 as Bell },
    ],
    carriedRelic: 'the iron key',
  };

  const allFacts: WorldReveal[] = [
    { type: 'movement', fact: 'Road from Ford to Gate requires 2 bells.', targetsSuspects: ['liar'] },
    { type: 'time', fact: 'The watch-horn sounded at Third Bell from The Ford.', targetsSuspects: ['liar'] },
    { type: 'object', fact: 'The iron key was borne by one alone.', targetsSuspects: ['liar'] },
    { type: 'environment', fact: 'Pine smoke hung over Ash Grove.', targetsSuspects: ['liar'] },
  ];
  const factIds = ['card1:headline', 'card2:headline', 'card3:headline', 'card4:headline'];

  it('all facts + all claims revealed = baseline strikes', () => {
    const rc: Record<string, RevealedClaimDetail> = {
      liar: allRevealed(),
      honest: allRevealed(),
    };
    const suspects = [{ id: 'liar', claimVector: liarClaim }, { id: 'honest', claimVector: honestClaim }];
    const results = evaluateAllStrikes(suspects, allFacts, world, 'test', rc, factIds);
    const liarResult = results.find(r => r.suspectId === 'liar')!;

    expect(liarResult.strikes).toBeGreaterThanOrEqual(3); // movement + horn + object at minimum
    // Every evidence item should have sourceFactIds
    for (const e of liarResult.evidence) {
      expect(e.sourceFactIds).toBeDefined();
      expect(e.sourceFactIds!.length).toBeGreaterThan(0);
      // Each sourceFactId must exist in factIds
      for (const id of e.sourceFactIds!) {
        expect(factIds).toContain(id);
      }
    }
  });

  it('partial facts (2 of 4) = subset of strikes', () => {
    const partialFacts = allFacts.slice(0, 2); // movement + time only
    const partialIds = factIds.slice(0, 2);
    const rc: Record<string, RevealedClaimDetail> = {
      liar: allRevealed(),
      honest: allRevealed(),
    };
    const suspects = [{ id: 'liar', claimVector: liarClaim }, { id: 'honest', claimVector: honestClaim }];
    const results = evaluateAllStrikes(suspects, partialFacts, world, 'test', rc, partialIds);
    const liarResult = results.find(r => r.suspectId === 'liar')!;

    // Should have movement + horn strikes, but NOT object or environment
    expect(liarResult.strikes).toBeGreaterThanOrEqual(1);
    expect(liarResult.evidence.some(e => e.type === 'object')).toBe(false);
    expect(liarResult.evidence.some(e => e.type === 'environment')).toBe(false);
  });

  it('all facts but NO claims revealed = 0 strikes (deduction-pure)', () => {
    const rc: Record<string, RevealedClaimDetail> = {
      liar: noneRevealed(),
      honest: noneRevealed(),
    };
    const suspects = [{ id: 'liar', claimVector: liarClaim }, { id: 'honest', claimVector: honestClaim }];
    const results = evaluateAllStrikes(suspects, allFacts, world, 'test', rc, factIds);
    const liarResult = results.find(r => r.suspectId === 'liar')!;

    expect(liarResult.strikes).toBe(0);
  });

  it('0 facts + all claims = 0 strikes', () => {
    const rc: Record<string, RevealedClaimDetail> = {
      liar: allRevealed(),
      honest: allRevealed(),
    };
    const suspects = [{ id: 'liar', claimVector: liarClaim }, { id: 'honest', claimVector: honestClaim }];
    const results = evaluateAllStrikes(suspects, [], world, 'test', rc, []);
    const liarResult = results.find(r => r.suspectId === 'liar')!;

    expect(liarResult.strikes).toBe(0);
  });

  it('no revealedClaims param (study mode) = all checks run', () => {
    const suspects = [{ id: 'liar', claimVector: liarClaim }, { id: 'honest', claimVector: honestClaim }];
    const results = evaluateAllStrikes(suspects, allFacts, world, 'test', undefined, factIds);
    const liarResult = results.find(r => r.suspectId === 'liar')!;

    expect(liarResult.strikes).toBeGreaterThanOrEqual(3);
  });

  it('removing a fact ID removes evidence items that reference it', () => {
    const rc: Record<string, RevealedClaimDetail> = {
      liar: allRevealed(),
      honest: allRevealed(),
    };
    const suspects = [{ id: 'liar', claimVector: liarClaim }, { id: 'honest', claimVector: honestClaim }];

    // With all facts
    const fullResults = evaluateAllStrikes(suspects, allFacts, world, 'test', rc, factIds);
    const fullLiar = fullResults.find(r => r.suspectId === 'liar')!;

    // Remove the object fact (index 2)
    const reducedFacts = allFacts.filter((_, i) => i !== 2);
    const reducedIds = factIds.filter((_, i) => i !== 2);
    const reducedResults = evaluateAllStrikes(suspects, reducedFacts, world, 'test', rc, reducedIds);
    const reducedLiar = reducedResults.find(r => r.suspectId === 'liar')!;

    expect(reducedLiar.strikes).toBeLessThan(fullLiar.strikes);
    expect(reducedLiar.evidence.some(e => e.type === 'object')).toBe(false);
  });
});

describe('One-endpoint regression', () => {
  it('revealing only one bell endpoint does NOT produce a strike', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'suspect-x',
      segments: [
        { from: 'ford', to: 'gate', departBell: 1 as Bell, arriveBell: 3 as Bell },
      ],
    };
    const reveals: WorldReveal[] = [
      { type: 'movement', fact: 'Road from Ford to Gate requires 2 bells.', targetsSuspects: ['suspect-x'] },
    ];
    const factIds = ['card1:headline'];

    // Only reveal bell 1 (departBell), NOT bell 3 (arriveBell)
    const rc: Record<string, RevealedClaimDetail> = {
      'suspect-x': { bells: [1], route: false, anchor: false, object: false, sense: false, openingHeard: true },
    };

    const result = evaluateStrikes(claim, reveals, world, [claim], 'test', rc, factIds);
    expect(result.strikes).toBe(0);
  });

  it('revealing both endpoints DOES produce a strike for impossible travel', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'suspect-x',
      segments: [
        { from: 'ford', to: 'gate', departBell: 1 as Bell, arriveBell: 1 as Bell }, // instant = impossible
      ],
    };
    const reveals: WorldReveal[] = [
      { type: 'movement', fact: 'Road from Ford to Gate requires 2 bells.', targetsSuspects: ['suspect-x'] },
    ];
    const factIds = ['card1:headline'];

    // Reveal both bells
    const rc: Record<string, RevealedClaimDetail> = {
      'suspect-x': { bells: [1], route: false, anchor: false, object: false, sense: false, openingHeard: true },
    };
    // Both departBell and arriveBell are 1, so bells: [1] covers both
    const result = evaluateStrikes(claim, reveals, world, [claim], 'test', rc, factIds);
    expect(result.strikes).toBeGreaterThanOrEqual(1);
  });

  it('route_probe reveals all timing (treats all bells as known)', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'suspect-x',
      segments: [
        { from: 'ford', to: 'gate', departBell: 0 as Bell, arriveBell: 0 as Bell }, // instant
      ],
    };
    const reveals: WorldReveal[] = [
      { type: 'movement', fact: 'Road requires 2 bells.', targetsSuspects: ['suspect-x'] },
    ];

    // Only route=true, no individual bells
    const rc: Record<string, RevealedClaimDetail> = {
      'suspect-x': { bells: [], route: true, anchor: false, object: false, sense: false, openingHeard: true },
    };

    const result = evaluateStrikes(claim, reveals, world, [claim], 'test', rc);
    expect(result.strikes).toBeGreaterThanOrEqual(1);
  });
});
