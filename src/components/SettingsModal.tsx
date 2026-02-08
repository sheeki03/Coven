import { useState } from 'react';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import CelticBorder from './CelticBorder.js';

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const { theme } = useThemeStrict();
  const [voiceOff, setVoiceOff] = useState(() => localStorage.getItem('coven:voiceOff') === '1');

  const handleSave = () => {
    localStorage.setItem('coven:voiceOff', voiceOff ? '1' : '0');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface-parchment border border-gold/20 rounded-xl p-6 max-w-md w-full mx-4 relative animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-iron/50 hover:text-gold transition-colors cursor-pointer p-1 rounded-lg hover:bg-gold/5"
        >
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="font-cinzel-dec text-gold text-2xl font-bold tracking-[0.12em] mb-1">Settings</h2>
        <p className="font-body text-iron/60 text-sm italic mb-5">Configure the chronicle's voice</p>

        <CelticBorder className="mb-5 opacity-40" />

        {/* Voice Off toggle */}
        <div className="border-t border-gold/10 pt-5 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-cinzel text-parchment/80 text-sm tracking-wider">Voice Off</p>
              <p className="font-body text-iron/50 text-sm italic">Text-only interrogation (no TTS audio)</p>
            </div>
            <button
              onClick={() => setVoiceOff(!voiceOff)}
              className={`px-4 py-2 rounded-lg text-sm font-cinzel tracking-wider cursor-pointer transition-all duration-300
                ${voiceOff
                  ? 'bg-ember/15 text-ember border border-ember/30'
                  : 'bg-surface/30 text-iron/55 border border-iron/15 hover:border-iron/30'
                }
              `}
            >
              {voiceOff ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Demo Mode toggle */}
        <div className="border-t border-gold/10 pt-5 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-cinzel text-parchment/80 text-sm tracking-wider">Demo Mode</p>
              <p className="font-body text-iron/50 text-sm italic">Curated seeds for presentation</p>
            </div>
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                if (url.searchParams.has('demo')) {
                  url.searchParams.delete('demo');
                } else {
                  url.searchParams.set('demo', '1');
                }
                window.location.href = url.toString();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-cinzel tracking-wider cursor-pointer transition-all duration-300
                ${new URLSearchParams(window.location.search).has('demo')
                  ? 'bg-ember/15 text-ember border border-ember/30'
                  : 'bg-surface/30 text-iron/55 border border-iron/15 hover:border-iron/30'
                }
              `}
            >
              {new URLSearchParams(window.location.search).has('demo') ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Rules */}
        <div className="border-t border-gold/10 pt-5 mb-6">
          <p className="font-cinzel text-gold/70 text-xs tracking-[0.2em] uppercase mb-3">
            Rules of the Watch
          </p>
          <ul className="space-y-2.5 font-body text-parchment/70 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gold/40 mt-0.5 shrink-0">&#x2022;</span>
              <span>Read all 6 alibis carefully</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold/40 mt-0.5 shrink-0">&#x2022;</span>
              <span>Draw 2 Rune cards to reveal world facts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold/40 mt-0.5 shrink-0">&#x2022;</span>
              <span>Facts may contradict alibis — raising suspicion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold/40 mt-0.5 shrink-0">&#x2022;</span>
              <span>Suspect (1 strike) = <span className="text-gold/80">rune glow</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold/40 mt-0.5 shrink-0">&#x2022;</span>
              <span>Condemned (2+ strikes) = <span className="text-crimson/80">crimson seal</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold/40 mt-0.5 shrink-0">&#x2022;</span>
              <span>Name the {theme.copy.liarLabel} — the most condemned suspect</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 font-body text-iron/55 text-sm hover:text-parchment/75 transition-colors cursor-pointer rounded-lg hover:bg-surface/30"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="
              px-6 py-3 rounded-xl font-cinzel text-sm tracking-wider cursor-pointer
              bg-gold/12 text-gold border border-gold/30
              hover:bg-gold/18 hover:border-gold/45
              hover:shadow-[0_0_16px_rgba(196,163,90,0.1)]
              transition-all duration-300
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
