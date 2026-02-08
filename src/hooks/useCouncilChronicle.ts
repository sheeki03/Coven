import { useCallback } from 'react';

const STORAGE_KEY = 'coven:councilChronicle';

interface CouncilState {
  weekStart: string;  // ISO date of Monday
  sigils: string[];   // dates won (ISO date strings)
}

const WEEKLY_EPILOGUES = [
  { threshold: 4, title: 'Watcher\'s Reprieve', text: 'The Council acknowledges your service. Four oaths upheld this week — the Watch holds.' },
  { threshold: 7, title: 'The Unbowed Week', text: 'Seven days, seven truths. The Watch has never stood stronger. You are named Pillar of the Council.' },
];

function getMonday(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return monday.toISOString().slice(0, 10);
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): CouncilState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Reset if new week
      if (parsed.weekStart !== getMonday()) {
        return { weekStart: getMonday(), sigils: [] };
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return { weekStart: getMonday(), sigils: [] };
}

function save(state: CouncilState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useCouncilChronicle() {
  const council = load();
  const today = getToday();
  const hasTodaySigil = council.sigils.includes(today);

  const recordWin = useCallback(() => {
    const current = load();
    const t = getToday();
    if (!current.sigils.includes(t)) {
      current.sigils.push(t);
      save(current);
    }
  }, []);

  // Which epilogue is unlocked?
  const sigilCount = council.sigils.length;
  const epilogue = [...WEEKLY_EPILOGUES].reverse().find(e => sigilCount >= e.threshold) ?? null;

  // Days of week status
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(council.weekStart);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
    return {
      date: iso,
      label: dayLabel,
      earned: council.sigils.includes(iso),
      isToday: iso === today,
    };
  });

  return {
    sigilCount,
    hasTodaySigil,
    weekDays,
    epilogue,
    recordWin,
  };
}
