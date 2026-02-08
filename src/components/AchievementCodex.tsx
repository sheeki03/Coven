import { WaxSeal } from './icons/RuneSymbols.js';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'clean-hands', title: 'Clean Hands', description: 'Won without using the hint', icon: '🧤' },
  { id: 'swift-verdict', title: 'Swift Verdict', description: 'Named the Oathbreaker in under 60s', icon: '⚡' },
  { id: 'two-runes', title: 'Two Runes, No Mercy', description: 'Won with exactly 2 draws, no hint', icon: '⚂' },
  { id: 'archivist', title: 'Archivist', description: 'Studied the Chronicle after verdict', icon: '📜' },
  { id: 'stone-scholar', title: 'Stone Scholar', description: 'Used study mode to find the liar after a loss', icon: '🔍' },
  { id: 'silent-witness', title: 'Silent Witness', description: 'Won without expanding any testimony', icon: '🤫' },
  { id: 'no-mercy', title: 'No Mercy', description: 'Won without hint or extra draws', icon: '🗡️' },
  { id: 'risk-taker', title: 'Risk Taker', description: 'Won after drawing 3 or more runes', icon: '🎲' },
  { id: 'iron-nerve', title: 'Iron Nerve', description: 'Won in under 30 seconds', icon: '🔥' },
  { id: 'three-day-streak', title: 'Watchful Eye', description: 'Won 3 days in a row', icon: '👁️' },
  { id: 'gold-seal', title: 'Gold Standard', description: 'Earned a Gold Seal', icon: '🥇' },
  { id: 'all-runes', title: 'Rune Master', description: 'Won with all 4 rune archetypes (weekly)', icon: '✦' },
];

const STORAGE_KEY = 'coven:achievementCodex';

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveUnlocked(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function recordAchievements(newIds: string[]) {
  const current = loadUnlocked();
  let changed = false;
  for (const id of newIds) {
    if (!current.has(id)) {
      current.add(id);
      changed = true;
    }
  }
  if (changed) saveUnlocked(current);
  return current;
}

export default function AchievementCodex() {
  const unlocked = loadUnlocked();

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        Seals of the Watch ({unlocked.size}/{ALL_ACHIEVEMENTS.length})
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {ALL_ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlocked.has(ach.id);
          return (
            <div
              key={ach.id}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border transition-all ${
                isUnlocked
                  ? 'bg-gold/8 border-gold/20'
                  : 'bg-surface/15 border-iron/8 opacity-30'
              }`}
              title={isUnlocked ? `${ach.title}: ${ach.description}` : '???'}
            >
              {isUnlocked ? (
                <span className="text-lg">{ach.icon}</span>
              ) : (
                <WaxSeal size={22} className="text-iron/20" />
              )}
              <span className={`font-cinzel text-xs tracking-wider text-center leading-tight ${
                isUnlocked ? 'text-gold/80' : 'text-iron/25'
              }`}>
                {isUnlocked ? ach.title : '???'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
