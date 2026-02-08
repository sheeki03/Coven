import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';

interface Props {
  compact?: boolean;
}

export default function HintButton({ compact }: Props) {
  const { state, dispatch } = useGame();
  const { theme } = useThemeStrict();
  const hintLabel = theme.copy.hintLabel;

  if (state.phase === 'ended' || state.phase === 'accusing') return null;
  if (state.drawnCards.length < 2) return null;

  if (compact) {
    return (
      <button
        disabled={state.hintUsed}
        onClick={() => dispatch({ type: 'USE_HINT' })}
        className={`px-3 py-2 rounded-lg ${theme.visuals.headingFontClass} text-xs tracking-wider cursor-pointer transition-all duration-300 whitespace-nowrap
          ${state.hintUsed
            ? 'text-iron/40 cursor-not-allowed'
            : 'border border-gold/20 text-gold/80 hover:border-gold/40 hover:text-gold'
          }
        `}
        title={state.hintUsed ? `${hintLabel} already used` : `Use ${hintLabel} (-160 pts)`}
      >
        {state.hintUsed ? 'Used' : 'Hint'}
      </button>
    );
  }

  return (
    <div className="flex justify-center animate-fade-in-up">
      <button
        disabled={state.hintUsed}
        onClick={() => dispatch({ type: 'USE_HINT' })}
        className={`
          relative px-8 py-3.5 rounded-xl ${theme.visuals.headingFontClass} text-base tracking-[0.15em] uppercase transition-all duration-500 cursor-pointer group overflow-hidden
          ${state.hintUsed
            ? 'bg-surface/20 border border-iron/15 text-iron/50 cursor-not-allowed'
            : 'surface-parchment border border-gold/25 text-gold hover:border-gold/50 hover:shadow-[0_0_30px_rgba(196,163,90,0.1)]'
          }
        `}
      >
        {!state.hintUsed && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(196,163,90,0.08) 45%, rgba(196,163,90,0.12) 50%, rgba(196,163,90,0.08) 55%, transparent 65%)',
                backgroundSize: '200% 100%',
                animation: 'cardShimmer 2.5s ease-in-out infinite',
              }}
            />
          </div>
        )}

        <span className="relative z-10 flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 12 12" className="opacity-50">
            <path d="M6 0L7.5 4.5H12L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5H4.5Z" fill="currentColor" />
          </svg>
          <span>{state.hintUsed ? `${hintLabel} Used` : `Use ${hintLabel}`}</span>
          <svg width="14" height="14" viewBox="0 0 12 12" className="opacity-50">
            <path d="M6 0L7.5 4.5H12L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5H4.5Z" fill="currentColor" />
          </svg>
        </span>
      </button>
    </div>
  );
}
