import { useState } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';

const DARES = [
  { id: 'beat-time', label: 'Beat My Time', template: (seed: number, elapsed: number) =>
    `COVEN #${seed} — I solved it in ${elapsed}s. Beat my time.\nCan you survive?` },
  { id: 'no-hint', label: 'Win With No Hint', template: (seed: number) =>
    `COVEN #${seed} — I won without a single hint.\nDare you try?` },
  { id: 'no-testimony', label: 'Win Without Testimony', template: (seed: number) =>
    `COVEN #${seed} — I never opened a testimony.\nCan you do the same?` },
];

export default function DareShare() {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!state.won) return null;

  const baseUrl = `${window.location.origin}${window.location.pathname}?seed=${state.seed}&mode=${theme.id}`;

  const handleDare = async (dare: typeof DARES[0]) => {
    try {
      const elapsed = state.elapsedSeconds ?? Math.floor((Date.now() - state.startTime) / 1000);
      const text = dare.template(state.seed, elapsed) + `\n${baseUrl}`;
      await navigator.clipboard.writeText(text);
      setCopiedId(dare.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        Dare a Friend
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {DARES.map(dare => (
          <button
            key={dare.id}
            onClick={() => handleDare(dare)}
            className="px-3 py-2 rounded-lg font-cinzel text-xs tracking-wider
              bg-surface/30 border border-gold/15 text-gold/60
              hover:border-gold/30 hover:text-gold/80 cursor-pointer transition-all duration-300"
          >
            {copiedId === dare.id ? 'Copied!' : dare.label}
          </button>
        ))}
      </div>
    </div>
  );
}
