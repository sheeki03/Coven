import { describe, it, expect } from 'vitest';
import { evaluateStrikes } from '../contradictions.js';
import type { Bell, ClaimVector, WorldModel, WorldReveal } from '../../types/index.js';

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
      { from: 'ford', to: 'grove', minutes: 20, bellsRequired: 2 },
      { from: 'grove', to: 'ford', minutes: 20, bellsRequired: 2 },
      { from: 'gate', to: 'hall', minutes: 15, bellsRequired: 2 },
      { from: 'hall', to: 'gate', minutes: 15, bellsRequired: 2 },
      { from: 'hall', to: 'grove', minutes: 10, bellsRequired: 1 },
      { from: 'grove', to: 'hall', minutes: 10, bellsRequired: 1 },
    ],
    anchor: {
      bell: 2 as Bell,
      location: 'ford',
      description: 'The watch-horn sounded at Third Bell from The Ford',
    },
    environmentFacts: [
      { location: 'grove', fact: 'Mist in grove', scent: 'pine smoke', fromBell: 0 as Bell, toBell: 3 as Bell },
    ],
    relicTruth: { holder: 'suspect-0', relic: 'the iron key', location: 'hall' },
  };
}

describe('Contradictions', () => {
  it('detects time contradiction: too-fast travel', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'liar',
      segments: [{ from: 'ford', to: 'gate', departBell: 0 as Bell, arriveBell: 0 as Bell }],
    };
    const reveals: WorldReveal[] = [
      { type: 'movement', fact: 'Road from Ford to Gate requires 2 bells.', targetsSuspects: ['liar'] },
    ];

    const result = evaluateStrikes(claim, reveals, world, [claim], 'test');
    expect(result.strikes).toBeGreaterThanOrEqual(1);
    expect(result.evidence.some(e => e.type === 'movement')).toBe(true);
  });

  it('detects horn contradiction: wrong location', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'liar',
      segments: [{ from: 'gate', to: 'gate', departBell: 0 as Bell, arriveBell: 3 as Bell }],
      heardHornAt: { bell: 2 as Bell, where: 'gate' },
    };
    const reveals: WorldReveal[] = [
      { type: 'time', fact: 'The watch-horn sounded at Third Bell from The Ford.', targetsSuspects: ['liar'] },
    ];

    const result = evaluateStrikes(claim, reveals, world, [claim], 'test');
    expect(result.strikes).toBeGreaterThanOrEqual(1);
    expect(result.evidence.some(e => e.description.includes('signal sounded from'))).toBe(true);
  });

  it('detects object contradiction: false relic claim', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'liar',
      segments: [{ from: 'hall', to: 'hall', departBell: 0 as Bell, arriveBell: 3 as Bell }],
      carriedRelic: 'the iron key',
    };
    const honestClaim: ClaimVector = {
      suspectId: 'suspect-0',
      segments: [{ from: 'ford', to: 'ford', departBell: 0 as Bell, arriveBell: 3 as Bell }],
      carriedRelic: 'the iron key',
    };
    const reveals: WorldReveal[] = [
      { type: 'object', fact: 'The iron key was borne by one alone.', targetsSuspects: ['liar'] },
    ];

    const result = evaluateStrikes(claim, reveals, world, [claim, honestClaim], 'test');
    expect(result.strikes).toBeGreaterThanOrEqual(1);
    expect(result.evidence.some(e => e.type === 'object')).toBe(true);
  });

  it('detects environment contradiction: wrong scent', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'liar',
      segments: [{ from: 'grove', to: 'grove', departBell: 0 as Bell, arriveBell: 3 as Bell }],
      sensed: { scent: 'iron rust', where: 'grove' },
    };
    const reveals: WorldReveal[] = [
      { type: 'environment', fact: 'Pine smoke hung over Ash Grove.', targetsSuspects: ['liar'] },
    ];

    const result = evaluateStrikes(claim, reveals, world, [claim], 'test');
    expect(result.strikes).toBeGreaterThanOrEqual(1);
    expect(result.evidence.some(e => e.type === 'environment')).toBe(true);
  });

  it('no false positives for honest claims', () => {
    const world = makeMinimalWorld();
    const claim: ClaimVector = {
      suspectId: 'honest',
      segments: [{ from: 'ford', to: 'gate', departBell: 0 as Bell, arriveBell: 2 as Bell }],
      heardHornAt: { bell: 2 as Bell, where: 'ford' },
    };
    const reveals: WorldReveal[] = [
      { type: 'time', fact: 'The watch-horn sounded at Third Bell from The Ford.', targetsSuspects: [] },
      { type: 'movement', fact: 'Road from Ford to Gate requires 2 bells.', targetsSuspects: [] },
    ];

    const result = evaluateStrikes(claim, reveals, world, [claim], 'test');
    // Honest claim with correct travel time and correct horn location
    // heardHornAt.where is 'ford' but they departed from ford at bell 0 and arrived gate at bell 2
    // At bell 2 they'd be at gate (arriveBell), but they claimed horn at ford
    // Actually the horn location check is about anchor location, not suspect's location
    // The anchor is at 'ford', and the claim says heard horn from 'ford' — that's correct!
    expect(result.evidence.filter(e => e.description.includes('signal sounded from'))).toHaveLength(0);
  });
});
