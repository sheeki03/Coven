import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/ThemeContext.js';
import type { GameMode, ThemeConfig } from '../themes/types.js';
import { ALL_THEMES } from '../themes/index.js';

const MODE_ORDER: GameMode[] = ['ledger', 'gaslight', 'casefile'];

function getThemeForMode(mode: GameMode): ThemeConfig {
  return ALL_THEMES.find(t => t.id === mode)!;
}

// Color preview — uses theme cssVars
function ColorBar({ theme }: { theme: ThemeConfig }) {
  const vars = theme.visuals.cssVars;
  return (
    <div className="flex gap-0.5 h-1 rounded-full overflow-hidden opacity-80">
      <div className="flex-1" style={{ background: vars['--coven-gold'] }} />
      <div className="flex-1" style={{ background: vars['--coven-crimson'] }} />
      <div className="flex-1" style={{ background: vars['--coven-surface'] }} />
    </div>
  );
}

// Mode emblem icons
function ModeEmblem({ mode }: { mode: GameMode }) {
  const size = 48;
  switch (mode) {
    case 'ledger':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} className="mx-auto">
          {/* Rune circle */}
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          {/* Inner cross */}
          <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          {/* Center eye */}
          <path d="M 18 24 Q 24 18 30 24 Q 24 30 18 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
        </svg>
      );
    case 'gaslight':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} className="mx-auto">
          {/* Gas lamp */}
          <path d="M 22 38 L 26 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 24 38 L 24 30" stroke="currentColor" strokeWidth="1.5" />
          {/* Lamp body */}
          <path d="M 18 30 L 30 30 L 28 20 Q 24 12 20 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Flame */}
          <path d="M 24 16 Q 22 19 24 22 Q 26 19 24 16" fill="currentColor" opacity="0.7" />
          {/* Glow lines */}
          <line x1="14" y1="20" x2="16" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="34" y1="20" x2="32" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="24" y1="8" x2="24" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case 'casefile':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} className="mx-auto">
          {/* File folder */}
          <rect x="10" y="14" width="28" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 10 14 L 10 12 Q 10 10 12 10 L 22 10 L 24 14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Zero stamp */}
          <circle cx="24" cy="26" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
          {/* Crosshair */}
          <line x1="24" y1="18" x2="24" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="24" y1="32" x2="24" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="16" y1="26" x2="18" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="30" y1="26" x2="32" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      );
  }
}

export default function WelcomeScreen() {
  const { setMode } = useTheme();
  const [selected, setSelected] = useState<GameMode | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('coven:mode');
    if (saved === 'ledger' || saved === 'gaslight' || saved === 'casefile') return saved;
    return null;
  });
  const [transitioning, setTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  function handleEnter() {
    if (!selected) return;
    const theme = getThemeForMode(selected);
    setTransitionText(theme.copy.modeTransitionText);
    setTransitioning(true);

    setTimeout(() => {
      setMode(selected);
    }, 400);
  }

  function handleCardClick(mode: GameMode) {
    setSelected(mode);
  }

  if (transitioning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 mx-auto mb-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <p className="font-body text-white/50 text-lg tracking-wider">{transitionText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f] overflow-auto">
      {/* Atmospheric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(100,80,140,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(60,50,80,0.05),transparent)]" />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-lg px-6 py-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Title */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-[0.25em] text-white/90 mb-2"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            COVEN
          </h1>
          <p className="text-white/25 text-sm tracking-[0.15em] font-body uppercase">
            A daily mystery
          </p>
        </div>

        {/* Mode cards */}
        <div className="space-y-3 mb-8">
          {MODE_ORDER.map((mode, i) => {
            const theme = getThemeForMode(mode);
            const isSelected = selected === mode;
            return (
              <button
                key={mode}
                onClick={() => handleCardClick(mode)}
                className={`
                  w-full text-left rounded-xl p-4 sm:p-5
                  border transition-all duration-300 cursor-pointer
                  ${isSelected
                    ? 'border-white/25 bg-white/[0.04] shadow-[0_0_30px_rgba(255,255,255,0.03)]'
                    : 'border-white/[0.06] bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.02]'
                  }
                `}
                style={{
                  transitionDelay: `${i * 80}ms`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, border-color 0.3s, background 0.3s, box-shadow 0.3s`,
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Emblem */}
                  <div className={`shrink-0 transition-colors duration-300 ${isSelected ? 'text-white/70' : 'text-white/25'}`}>
                    <ModeEmblem mode={mode} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`text-sm sm:text-base tracking-[0.12em] uppercase transition-colors duration-300 ${isSelected ? 'text-white/80' : 'text-white/40'}`}
                      style={{ fontFamily: theme.visuals.headingFont }}
                    >
                      {theme.copy.gameTitle}
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 font-body tracking-wider transition-colors duration-300 ${isSelected ? 'text-white/35' : 'text-white/20'}`}>
                      {theme.copy.tagline}
                    </p>
                    <div className="mt-2.5">
                      <ColorBar theme={theme} />
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div className={`shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-300 ${isSelected ? 'border-white/50 bg-white/20' : 'border-white/10'}`}>
                    {isSelected && <div className="w-full h-full rounded-full bg-white/60 scale-50" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Enter button */}
        <div className="text-center" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 300ms' }}>
          <button
            onClick={handleEnter}
            disabled={!selected}
            className={`
              px-10 py-3.5 rounded-xl text-sm tracking-[0.2em] uppercase
              transition-all duration-300 cursor-pointer
              ${selected
                ? 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                : 'bg-white/[0.03] text-white/20 border border-white/[0.06] cursor-not-allowed'
              }
            `}
            style={{ fontFamily: selected ? getThemeForMode(selected).visuals.headingFont : '"Cinzel", serif' }}
          >
            {selected ? 'Enter' : 'Choose a mode'}
          </button>
        </div>
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-4 text-center">
        <p className="text-white/10 text-xs font-body tracking-wider">
          COVEN v2 &mdash; Three modes, one truth
        </p>
      </div>
    </div>
  );
}
