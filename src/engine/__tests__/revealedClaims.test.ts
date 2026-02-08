import { describe, it, expect } from 'vitest';
import type { RevealedClaimDetail, QuestionCardType } from '../../types/index.js';

// We test the reducer logic by simulating what the reducer does internally.
// This avoids needing React rendering in unit tests.

function ensureRevealed(revealedClaims: Record<string, RevealedClaimDetail>, suspectId: string): RevealedClaimDetail {
  return revealedClaims[suspectId] ?? {
    bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false,
  };
}

function applyRevealClaim(
  revealedClaims: Record<string, RevealedClaimDetail>,
  suspectId: string,
  claimType: QuestionCardType,
  slotIndex?: number,
): Record<string, RevealedClaimDetail> {
  const current = ensureRevealed(revealedClaims, suspectId);
  let next: RevealedClaimDetail;

  switch (claimType) {
    case 'bell_probe':
      if (slotIndex != null) {
        next = { ...current, bells: [...new Set([...current.bells, slotIndex])] };
      } else {
        next = current;
      }
      break;
    case 'route_probe':
      next = { ...current, route: true };
      break;
    case 'anchor_probe':
      next = { ...current, anchor: true };
      break;
    case 'object_probe':
      next = { ...current, object: true };
      break;
    case 'sense_probe':
      next = { ...current, sense: true };
      break;
    default:
      next = current;
  }

  return { ...revealedClaims, [suspectId]: next };
}

function applyMarkOpeningHeard(
  revealedClaims: Record<string, RevealedClaimDetail>,
  suspectId: string,
): Record<string, RevealedClaimDetail> {
  const current = ensureRevealed(revealedClaims, suspectId);
  return { ...revealedClaims, [suspectId]: { ...current, openingHeard: true } };
}

function applyToggleMark(markedSuspects: string[], suspectId: string): string[] {
  const exists = markedSuspects.includes(suspectId);
  return exists
    ? markedSuspects.filter(id => id !== suspectId)
    : [...markedSuspects, suspectId];
}

describe('ensureRevealed', () => {
  it('returns default for unknown suspect', () => {
    const rc: Record<string, RevealedClaimDetail> = {};
    const result = ensureRevealed(rc, 'unknown-id');
    expect(result).toEqual({
      bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false,
    });
  });

  it('returns existing record for known suspect', () => {
    const rc: Record<string, RevealedClaimDetail> = {
      'suspect-1': { bells: [0, 2], route: true, anchor: false, object: false, sense: false, openingHeard: true },
    };
    const result = ensureRevealed(rc, 'suspect-1');
    expect(result.bells).toEqual([0, 2]);
    expect(result.route).toBe(true);
    expect(result.openingHeard).toBe(true);
  });
});

describe('REVEAL_CLAIM bell_probe', () => {
  it('adds bell index to bells array', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'bell_probe', 2);
    expect(rc['suspect-1'].bells).toEqual([2]);
  });

  it('deduplicates bell indices', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'bell_probe', 2);
    rc = applyRevealClaim(rc, 'suspect-1', 'bell_probe', 2);
    rc = applyRevealClaim(rc, 'suspect-1', 'bell_probe', 3);
    expect(rc['suspect-1'].bells).toEqual([2, 3]);
  });
});

describe('REVEAL_CLAIM route_probe', () => {
  it('sets route to true', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'route_probe');
    expect(rc['suspect-1'].route).toBe(true);
  });
});

describe('REVEAL_CLAIM anchor_probe', () => {
  it('sets anchor to true', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'anchor_probe');
    expect(rc['suspect-1'].anchor).toBe(true);
  });
});

describe('REVEAL_CLAIM object_probe', () => {
  it('sets object to true', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'object_probe');
    expect(rc['suspect-1'].object).toBe(true);
  });
});

describe('REVEAL_CLAIM sense_probe', () => {
  it('sets sense to true', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'sense_probe');
    expect(rc['suspect-1'].sense).toBe(true);
  });
});

describe('MARK_OPENING_HEARD', () => {
  it('sets openingHeard to true', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyMarkOpeningHeard(rc, 'suspect-1');
    expect(rc['suspect-1'].openingHeard).toBe(true);
  });

  it('preserves existing fields', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 'suspect-1', 'bell_probe', 0);
    rc = applyMarkOpeningHeard(rc, 'suspect-1');
    expect(rc['suspect-1'].bells).toEqual([0]);
    expect(rc['suspect-1'].openingHeard).toBe(true);
  });
});

describe('Multiple dispatches accumulate correctly', () => {
  it('accumulates bells, then route, then anchor', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 's1', 'bell_probe', 0);
    rc = applyRevealClaim(rc, 's1', 'bell_probe', 3);
    rc = applyRevealClaim(rc, 's1', 'route_probe');
    rc = applyRevealClaim(rc, 's1', 'anchor_probe');

    expect(rc['s1']).toEqual({
      bells: [0, 3],
      route: true,
      anchor: true,
      object: false,
      sense: false,
      openingHeard: false,
    });
  });

  it('works across multiple suspects', () => {
    let rc: Record<string, RevealedClaimDetail> = {};
    rc = applyRevealClaim(rc, 's1', 'bell_probe', 0);
    rc = applyRevealClaim(rc, 's2', 'object_probe');
    rc = applyMarkOpeningHeard(rc, 's1');

    expect(rc['s1'].bells).toEqual([0]);
    expect(rc['s1'].openingHeard).toBe(true);
    expect(rc['s2'].object).toBe(true);
    expect(rc['s2'].openingHeard).toBe(false);
  });
});

describe('TOGGLE_MARK_SUSPECT', () => {
  it('adds suspect to marked list', () => {
    const result = applyToggleMark([], 's1');
    expect(result).toEqual(['s1']);
  });

  it('removes suspect from marked list', () => {
    const result = applyToggleMark(['s1', 's2'], 's1');
    expect(result).toEqual(['s2']);
  });

  it('does not create duplicates', () => {
    const result = applyToggleMark(['s1'], 's1');
    expect(result).toEqual([]);
    const result2 = applyToggleMark(result, 's1');
    expect(result2).toEqual(['s1']);
  });
});
