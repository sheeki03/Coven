import { useState } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useTheme, useThemeStrict } from '../hooks/ThemeContext.js';
import SettingsModal from './SettingsModal.js';
import RitualMeter from './RitualMeter.js';

interface Props {
  onShowHowToPlay: () => void;
}

export default function Header({ onShowHowToPlay }: Props) {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const { setMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const handleSwitchMode = () => {
    if (window.confirm(theme.copy.switchModeConfirm)) {
      setMode(null);
    }
  };

  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });

  const oathTexts = theme.copy.oathTexts;
  const oathText = oathTexts[state.seed % oathTexts.length];
  const isDemo = new URLSearchParams(window.location.search).has('demo');
  const isPractice = new URLSearchParams(window.location.search).has('seed') && !isDemo;

  return (
    <>
      <header className="w-full pt-5 pb-3 px-4 relative animate-fade-in-down">
        {/* Top-left: How to Play */}
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onShowHowToPlay}
            className="flex items-center gap-1.5 text-gold-dim hover:text-gold transition-colors p-2 cursor-pointer rounded-lg hover:bg-gold/5" title="How to Play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="font-cinzel text-sm tracking-wider hidden sm:inline">Guide</span>
          </button>
        </div>

        {/* Top-right: Score + Settings */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <RitualMeter score={state.score} phase={state.phase} />

          <button onClick={handleSwitchMode}
            className="text-gold-dim hover:text-gold transition-colors p-2 cursor-pointer rounded-lg hover:bg-gold/5" title="Switch Mode">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v5h5M20 20v-5h-5" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L4 4M3.51 15A9 9 0 0 0 18.36 18.36L20 20" />
            </svg>
          </button>

          <button onClick={() => setShowSettings(true)}
            className="text-gold-dim hover:text-gold transition-colors p-2 cursor-pointer rounded-lg hover:bg-gold/5" title="Settings">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          {/* Title */}
          <h1 className={`${theme.visuals.headingDecFontClass} text-3xl md:text-4xl font-bold tracking-[0.1em] text-shimmer leading-tight`}>
            {theme.copy.gameTitle}
          </h1>

          {/* Date + badges */}
          <div className="flex items-center justify-center gap-2.5 mt-2">
            <p className={`${theme.visuals.headingFontClass} text-gold-dim/80 text-sm md:text-base tracking-[0.3em] uppercase`}>
              {dateStr} &mdash; #{state.seed}
            </p>
            {isDemo && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${theme.visuals.headingFontClass} tracking-wider bg-ember/15 text-ember border border-ember/25`}>
                Demo
              </span>
            )}
            {isPractice && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${theme.visuals.headingFontClass} tracking-wider bg-iron/15 text-iron/70 border border-iron/20`}>
                Practice
              </span>
            )}
          </div>

          {/* Oath subtitle */}
          <p className="font-body text-parchment/50 text-base italic mt-2 max-w-xl mx-auto leading-relaxed">
            {oathText}
          </p>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
