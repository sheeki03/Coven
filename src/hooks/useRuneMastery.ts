import { useState, useCallback } from 'react';
import type { RuneArchetype } from '../types/index.js';

const STORAGE_KEY = 'coven:runeMastery';

interface MasteryData {
  weekStart: string; // ISO date of week start (Monday)
  mastered: Record<RuneArchetype, boolean>;
  counts: Record<RuneArchetype, number>; // total wins using each archetype
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1; // Monday=0
  const monday = new Date(now);
  monday.setUTCDate(monday.getUTCDate() - diff);
  return monday.toISOString().split('T')[0];
}

function loadMastery(): MasteryData {
  const weekStart = getWeekStart();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as MasteryData;
      if (data.weekStart === weekStart) {
        // Ensure counts exist (migration)
        if (!data.counts) data.counts = { oaths: 0, roads: 0, relics: 0, skies: 0 };
        return data;
      }
    }
  } catch { /* ignore */ }
  return {
    weekStart,
    mastered: { oaths: false, roads: false, relics: false, skies: false },
    counts: { oaths: 0, roads: 0, relics: 0, skies: 0 },
  };
}

function saveMastery(data: MasteryData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useRuneMastery() {
  const [mastery, setMastery] = useState(loadMastery);

  const recordWin = useCallback((drawnArchetypes: RuneArchetype[]) => {
    setMastery(prev => {
      const next = { ...prev, mastered: { ...prev.mastered }, counts: { ...prev.counts } };
      for (const arch of drawnArchetypes) {
        next.mastered[arch] = true;
        next.counts[arch] = (next.counts[arch] || 0) + 1;
      }
      saveMastery(next);
      return next;
    });
  }, []);

  const masteredCount = Object.values(mastery.mastered).filter(Boolean).length;
  const allMastered = masteredCount === 4;

  return { mastery: mastery.mastered, counts: mastery.counts, masteredCount, allMastered, recordWin };
}
