import type { GameState } from '../types/index.js';
import { getSealTier } from '../hooks/usePersonalBests.js';

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

const SWIFT_VERDICT_THRESHOLD = 60; // seconds

export function getAchievements(state: GameState): Achievement[] {
  if (state.phase !== 'ended') return [];

  const achievements: Achievement[] = [];
  const elapsed = state.elapsedSeconds ?? Math.floor((Date.now() - state.startTime) / 1000);
  const studyOpened = typeof window !== 'undefined' && sessionStorage.getItem('coven:studyOpened') === '1';
  const expandedTestimony = typeof window !== 'undefined' && sessionStorage.getItem('coven:expandedTestimony') === '1';

  if (state.won) {
    if (!state.hintUsed) {
      achievements.push({ id: 'clean-hands', title: 'Clean Hands', description: 'Won without using the hint' });
    }

    if (elapsed <= SWIFT_VERDICT_THRESHOLD) {
      achievements.push({ id: 'swift-verdict', title: 'Swift Verdict', description: `Named the Oathbreaker in ${elapsed}s` });
    }

    if (elapsed <= 30) {
      achievements.push({ id: 'iron-nerve', title: 'Iron Nerve', description: `Won in ${elapsed}s` });
    }

    if (state.drawnCards.length === 2 && !state.hintUsed) {
      achievements.push({ id: 'two-runes', title: 'Two Runes, No Mercy', description: 'Won with exactly 2 draws, no hint' });
    }

    if (!state.hintUsed && !state.usedExtraDraw) {
      achievements.push({ id: 'no-mercy', title: 'No Mercy', description: 'Won without hint or extra draws' });
    }

    if (!expandedTestimony) {
      achievements.push({ id: 'silent-witness', title: 'Silent Witness', description: 'Won without opening any testimony' });
    }

    if (state.drawnCards.length >= 3) {
      achievements.push({ id: 'risk-taker', title: 'Risk Taker', description: 'Won after drawing 3+ runes' });
    }

    if (getSealTier(state) === 'gold') {
      achievements.push({ id: 'gold-seal', title: 'Gold Standard', description: 'Earned a Gold Seal' });
    }
  }

  if (studyOpened) {
    achievements.push({ id: 'archivist', title: 'Archivist', description: 'Studied the Chronicle' });

    // Stone Scholar: used study mode after a loss and the liar was found
    if (!state.won) {
      achievements.push({ id: 'stone-scholar', title: 'Stone Scholar', description: 'Studied the Chronicle after a loss' });
    }
  }

  return achievements;
}

export function getPlaystyleGlyphs(state: GameState): string {
  if (state.phase !== 'ended') return '';

  const dc = state.drawnCards.length;
  const runes = dc === 2 ? '⚂' : dc === 3 ? '⚃' : dc >= 4 ? '⚄' : '⚁';
  const hint = state.hintUsed ? '◈' : '◇';
  const elapsed = state.elapsedSeconds ?? Math.floor((Date.now() - state.startTime) / 1000);
  const speed = elapsed <= 30 ? '⚡' : elapsed <= 60 ? '⏱' : elapsed <= 120 ? '⏳' : '🕰';
  const result = state.won ? '✓' : '✗';

  return `${result}${runes}${hint}${speed}`;
}
