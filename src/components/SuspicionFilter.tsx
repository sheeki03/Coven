import { useGame } from '../hooks/GameContext.js';
import { useHighlight } from '../hooks/useHighlight.js';

const FILTERS = [
  { key: 'all' as const, label: 'All' },
  { key: 'unmarked' as const, label: 'Unmarked' },
  { key: 'suspect' as const, label: 'Suspect' },
  { key: 'condemned' as const, label: 'Condemned' },
] as const;

export default function SuspicionFilter() {
  const { state } = useGame();
  const { highlight, highlightDispatch } = useHighlight();

  const counts = {
    all: state.suspects.length,
    unmarked: state.suspects.filter(s => s.strikes === 0).length,
    suspect: state.suspects.filter(s => s.strikes === 1).length,
    condemned: state.suspects.filter(s => s.strikes >= 2).length,
  };

  const colorMap: Record<string, string> = {
    all: 'text-parchment/70 border-gold/20 bg-gold/5',
    unmarked: 'text-iron/70 border-iron/20 bg-iron/5',
    suspect: 'text-gold border-gold/30 bg-gold/10',
    condemned: 'text-crimson-bright border-crimson/30 bg-crimson/10',
  };

  const activeMap: Record<string, string> = {
    all: 'text-parchment border-gold/50 bg-gold/15',
    unmarked: 'text-iron border-iron/40 bg-iron/15',
    suspect: 'text-gold-bright border-gold/50 bg-gold/20',
    condemned: 'text-crimson-bright border-crimson/50 bg-crimson/20',
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map(f => {
        const isActive = highlight.suspicionFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => highlightDispatch({ type: 'SET_SUSPICION_FILTER', filter: f.key })}
            className={`px-4 py-1.5 rounded-full text-sm font-cinzel tracking-wider border transition-all duration-200 cursor-pointer
              ${isActive ? activeMap[f.key] : colorMap[f.key]}
            `}
          >
            {f.label} <span className="opacity-60">{counts[f.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
