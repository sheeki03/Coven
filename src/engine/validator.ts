import type { PairExplanation, SolvabilityProof, StrikeDelta, Suspect, WorldModel, WorldReveal } from '../types/index.js';
import { evaluateAllStrikes } from './contradictions.js';
import type { RuneCard } from '../types/index.js';

function pairKey(cardA: string, cardB: string): string {
  return [cardA, cardB].sort().join('+');
}

function getRevealsForCards(cards: RuneCard[]): WorldReveal[] {
  const reveals: WorldReveal[] = [];
  for (const card of cards) {
    reveals.push(card.headline, card.secondary);
  }
  return reveals;
}

export function validateSolvability(
  suspects: Suspect[],
  runeDeck: RuneCard[],
  liarId: string,
  world: WorldModel,
  hintFact?: WorldReveal,
): SolvabilityProof | null {
  const pairRankings: Record<string, StrikeDelta[]> = {};
  const pairExplanations: Record<string, PairExplanation> = {};
  const tiePairs: string[] = [];
  let bestPair: [string, string] | null = null;
  let bestMargin = -Infinity;

  // Enumerate all C(4,2) = 6 pairs
  for (let i = 0; i < runeDeck.length; i++) {
    for (let j = i + 1; j < runeDeck.length; j++) {
      const cards = [runeDeck[i], runeDeck[j]];
      const key = pairKey(cards[0].id, cards[1].id);
      const reveals = getRevealsForCards(cards);

      const deltas = evaluateAllStrikes(suspects, reveals, world, key);
      const sorted = [...deltas].sort((a, b) => b.strikes - a.strikes);
      pairRankings[key] = sorted;

      const liarDelta = sorted.find(d => d.suspectId === liarId);
      const topDelta = sorted[0];
      const runnerUp = sorted[1];

      if (!liarDelta) return null; // Should never happen

      const liarStrikes = liarDelta.strikes;
      const runnerUpStrikes = runnerUp?.strikes ?? 0;
      const margin = liarStrikes === topDelta.strikes
        ? liarStrikes - runnerUpStrikes
        : -(topDelta.strikes - liarStrikes); // Liar is not top

      const triggeredChecks = new Set(liarDelta.evidence.map(e => e.type));

      pairExplanations[key] = {
        liarStrikes,
        runnerUpStrikes,
        separationMargin: margin,
        triggeredChecks: [...triggeredChecks] as PairExplanation['triggeredChecks'],
      };

      // Check if liar is unique top-1
      if (liarDelta.suspectId === topDelta.suspectId && liarStrikes > runnerUpStrikes) {
        if (margin > bestMargin) {
          bestMargin = margin;
          bestPair = [cards[0].id, cards[1].id];
        }
      } else if (liarDelta.strikes === topDelta.strikes && liarStrikes === runnerUpStrikes) {
        tiePairs.push(key);
      }
    }
  }

  // Invariant 1: At least one pair must have liar as unique top-1
  if (!bestPair) return null;

  // Invariant 2: Liar must have ≥1 strike in every pair
  for (const key of Object.keys(pairRankings)) {
    const liarDelta = pairRankings[key].find(d => d.suspectId === liarId);
    if (!liarDelta || liarDelta.strikes < 1) return null;
  }

  // Compute hint effect for tie pairs
  const hintEffect: Record<string, StrikeDelta[]> = {};
  if (hintFact) {
    for (const key of tiePairs) {
      const cardIds = key.split('+');
      const cards = cardIds.map(id => runeDeck.find(c => c.id === id)!);
      const reveals = [...getRevealsForCards(cards), hintFact];
      const deltas = evaluateAllStrikes(suspects, reveals, world, key);
      hintEffect[key] = [...deltas].sort((a, b) => b.strikes - a.strikes);
    }
  }

  return {
    bestPair,
    pairRankings,
    pairExplanations,
    tiePairs,
    hintEffect,
  };
}
