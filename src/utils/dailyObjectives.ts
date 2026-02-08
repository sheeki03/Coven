import type { GameState } from '../types/index.js';

export interface DailyObjective {
  id: string;
  title: string;
  icon: string;
  description: string;
  check: (state: GameState) => boolean;
}

const ALL_OBJECTIVES: DailyObjective[] = [
  {
    id: 'clean-hands',
    title: 'Clean Hands',
    icon: '🧤',
    description: 'Win without using a hint',
    check: (s) => !!s.won && !s.hintUsed,
  },
  {
    id: 'silent-witness',
    title: 'Silent Witness',
    icon: '🤐',
    description: 'Win without opening full testimony',
    check: (s) => !!s.won && !sessionStorage.getItem('coven:expandedTestimony'),
  },
  {
    id: 'swift-seal',
    title: 'Swift Seal',
    icon: '⚡',
    description: 'Win in under 60 seconds',
    check: (s) => !!s.won && Math.floor((Date.now() - s.startTime) / 1000) <= 60,
  },
  {
    id: 'two-runes-only',
    title: 'Two Runes Only',
    icon: '⚂',
    description: 'Win with exactly 2 draws',
    check: (s) => !!s.won && s.drawnCards.length === 2,
  },
  {
    id: 'no-mercy',
    title: 'No Mercy',
    icon: '🏛',
    description: 'Earn a Clean verdict (score ≥ 700)',
    check: (s) => !!s.won && s.score >= 700 && !s.usedExtraDraw,
  },
  {
    id: 'risk-taker',
    title: 'Risk Taker',
    icon: '🎲',
    description: 'Win after drawing 3+ runes',
    check: (s) => !!s.won && s.drawnCards.length >= 3,
  },
];

// Pick 3 objectives for a given seed (deterministic per day)
export function getDailyObjectives(seed: number): DailyObjective[] {
  // Simple seeded shuffle
  let h = seed ^ 0xDEADBEEF;
  const shuffle = () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 0x100000000;
  };

  const indices = ALL_OBJECTIVES.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(shuffle() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, 3).map(i => ALL_OBJECTIVES[i]);
}

export function checkObjectives(objectives: DailyObjective[], state: GameState): { objective: DailyObjective; completed: boolean }[] {
  return objectives.map(obj => ({ objective: obj, completed: obj.check(state) }));
}
