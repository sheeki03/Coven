import { useCallback } from 'react';
import type { GameState } from '../types/index.js';

export type SealTier = 'bronze' | 'silver' | 'gold';

export interface PersonalBests {
  bestTime: number | null;      // seconds
  bestCleanTime: number | null;  // win + no hint
  bestHintTime: number | null;   // win with hint
  gamesWon: number;
  gamesPlayed: number;
  studyModeLiarFound: number;    // times player found liar via study mode after loss
}

const STORAGE_KEY = 'coven:personalBests';

function load(): PersonalBests {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Migration: add new fields
      if (data.bestHintTime === undefined) data.bestHintTime = null;
      if (data.studyModeLiarFound === undefined) data.studyModeLiarFound = 0;
      return data;
    }
  } catch { /* ignore */ }
  return { bestTime: null, bestCleanTime: null, bestHintTime: null, gamesWon: 0, gamesPlayed: 0, studyModeLiarFound: 0 };
}

function save(bests: PersonalBests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bests));
}

export function getSealTier(state: GameState): SealTier | null {
  if (!state.won) return null;
  const elapsed = state.elapsedSeconds ?? Math.floor((Date.now() - state.startTime) / 1000);
  if (!state.hintUsed && elapsed <= 45 && !state.usedExtraDraw) return 'gold';
  if (!state.hintUsed && elapsed <= 90) return 'silver';
  return 'bronze';
}

export function getSealLabel(tier: SealTier): string {
  switch (tier) {
    case 'gold': return 'Gold Seal';
    case 'silver': return 'Silver Seal';
    case 'bronze': return 'Bronze Seal';
  }
}

export function usePersonalBests() {
  const bests = load();

  const recordGame = useCallback((state: GameState) => {
    const current = load();
    const elapsed = state.elapsedSeconds ?? Math.floor((Date.now() - state.startTime) / 1000);

    current.gamesPlayed++;
    if (state.won) {
      current.gamesWon++;
      if (current.bestTime === null || elapsed < current.bestTime) {
        current.bestTime = elapsed;
      }
      if (!state.hintUsed && (current.bestCleanTime === null || elapsed < current.bestCleanTime)) {
        current.bestCleanTime = elapsed;
      }
      if (state.hintUsed && (current.bestHintTime === null || elapsed < current.bestHintTime)) {
        current.bestHintTime = elapsed;
      }
    }

    save(current);
  }, []);

  const recordStudyLiarFound = useCallback(() => {
    const current = load();
    current.studyModeLiarFound++;
    save(current);
  }, []);

  return { bests, recordGame, recordStudyLiarFound };
}
