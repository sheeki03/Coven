import { useState, useEffect } from 'react';
import CelticBorder from './CelticBorder.js';

const CODEX_ENTRIES = [
  {
    id: 'law-of-roads',
    title: 'Law of Roads',
    text: 'The Watch measures distance in bells. If a road spans 2 bells, no traveler — sworn or otherwise — may cross it faster. The stones remember every footfall.',
    unlocksAfter: 1,
  },
  {
    id: 'law-of-bells',
    title: 'Law of Bells',
    text: 'The watch-horn sounds once per day, always from the same tower. Those who claim to hear it from elsewhere speak false. The bell never lies.',
    unlocksAfter: 2,
  },
  {
    id: 'relics-of-the-watch',
    title: 'Relics of the Watch',
    text: 'Each relic belongs to one sworn member. If two claim the same relic, one speaks an oath already broken. The relic knows its keeper.',
    unlocksAfter: 3,
  },
  {
    id: 'the-elder-scents',
    title: 'The Elder Scents',
    text: 'Each grove and gate carries its own scent through the bells. Those who claim a scent not of their location betray themselves to the runes.',
    unlocksAfter: 4,
  },
];

const STORAGE_KEY = 'coven:codexUnlocks';

function getUnlockCount(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  } catch { return 0; }
}

function setUnlockCount(n: number) {
  localStorage.setItem(STORAGE_KEY, String(n));
}

export function useCodexUnlock() {
  const [count, setCount] = useState(getUnlockCount);

  const unlock = () => {
    const next = Math.min(count + 1, CODEX_ENTRIES.length);
    if (next > count) {
      setCount(next);
      setUnlockCount(next);
      return CODEX_ENTRIES[next - 1];
    }
    return null;
  };

  return { unlockedCount: count, unlock, entries: CODEX_ENTRIES };
}

interface Props {
  newUnlock?: typeof CODEX_ENTRIES[0] | null;
}

export default function CodexPages({ newUnlock }: Props) {
  const [showNew, setShowNew] = useState(false);
  const unlockCount = getUnlockCount();
  const unlockedEntries = CODEX_ENTRIES.filter(e => e.unlocksAfter <= unlockCount);

  useEffect(() => {
    if (newUnlock) {
      const timer = setTimeout(() => setShowNew(true), 500);
      return () => clearTimeout(timer);
    }
  }, [newUnlock]);

  if (unlockedEntries.length === 0) return null;

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        Codex of the Watch ({unlockedEntries.length}/{CODEX_ENTRIES.length})
      </p>

      {/* New unlock flash */}
      {showNew && newUnlock && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-gold/8 border border-gold/20 animate-scale-in">
          <p className="font-cinzel text-gold text-xs tracking-wider mb-1">New Page Unlocked</p>
          <p className="font-cinzel text-parchment/80 text-sm font-bold">{newUnlock.title}</p>
        </div>
      )}

      <CelticBorder className="mb-3 opacity-30" />

      <div className="space-y-3">
        {unlockedEntries.map(entry => (
          <div key={entry.id}>
            <p className="font-cinzel text-gold/80 text-xs tracking-wider mb-0.5">{entry.title}</p>
            <p className="font-body text-parchment/60 text-sm leading-relaxed italic">{entry.text}</p>
          </div>
        ))}
      </div>

      {/* Locked entries */}
      {CODEX_ENTRIES.length > unlockedEntries.length && (
        <div className="mt-3 pt-2 border-t border-gold/8">
          {CODEX_ENTRIES.filter(e => e.unlocksAfter > unlockCount).map(entry => (
            <div key={entry.id} className="flex items-center gap-2 py-1">
              <span className="text-iron/25 text-xs">🔒</span>
              <span className="font-cinzel text-iron/30 text-xs tracking-wider">{entry.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
