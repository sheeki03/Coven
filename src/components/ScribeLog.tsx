import { useState } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import SuspectPortrait from './icons/SuspectPortraits.js';

type FilterType = 'all' | 'time' | 'movement' | 'object' | 'environment';

const TYPE_LABELS: Record<string, string> = {
  time: 'Bell',
  movement: 'Road',
  object: 'Relic',
  environment: 'Sense',
};

export default function ScribeLog() {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Collect all marks by suspect
  const entries = state.suspects
    .filter(s => s.evidence.length > 0)
    .map(s => ({
      suspect: s,
      evidence: filter === 'all' ? s.evidence : s.evidence.filter(e => e.type === filter),
    }))
    .filter(e => e.evidence.length > 0)
    .sort((a, b) => b.evidence.length - a.evidence.length);

  if (entries.length === 0) return null;

  const totalMarks = state.suspects.reduce((sum, s) => sum + s.evidence.length, 0);

  return (
    <div className="surface-parchment rounded-xl p-3 animate-fade-in-up">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <h3 className="font-cinzel text-gold/80 text-xs tracking-[0.2em] uppercase">
          Scribe Log
        </h3>
        <span className="font-body text-iron/50 text-xs italic">
          {totalMarks} mark{totalMarks !== 1 ? 's' : ''} {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div className="mt-3 animate-ink-reveal">
          {/* Filter pills */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {(['all', 'time', 'movement', 'object', 'environment'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded-md text-xs font-cinzel tracking-wider border cursor-pointer transition-all
                  ${filter === f
                    ? 'bg-gold/15 text-gold border-gold/30'
                    : 'text-iron/50 border-iron/15 hover:border-gold/20'
                  }`}
              >
                {f === 'all' ? 'All' : TYPE_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Entries by suspect */}
          <div className="space-y-3">
            {entries.map(({ suspect, evidence }) => (
              <div key={suspect.id} className="flex gap-2.5">
                <div className="shrink-0 mt-0.5">
                  <SuspectPortrait name={suspect.name} size={28} portraitStyle={theme.visuals.portraitStyle} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-parchment/80 text-xs font-bold mb-1">
                    {suspect.name}
                    <span className={`ml-1.5 font-body font-normal italic ${
                      suspect.strikes >= 2 ? 'text-crimson/70' : 'text-gold/50'
                    }`}>
                      {suspect.strikes} strike{suspect.strikes !== 1 ? 's' : ''}
                    </span>
                  </p>
                  <div className="space-y-1">
                    {evidence.map((e, i) => (
                      <p key={i} className="font-body text-parchment/60 text-sm leading-snug italic pl-2 border-l-2 border-gold/15">
                        {e.description}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
