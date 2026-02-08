import { useState, useRef, useCallback, useEffect } from 'react';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { WaxSeal } from './icons/RuneSymbols.js';

interface Props {
  suspectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function FinalOath({ suspectName, onConfirm, onCancel }: Props) {
  const { theme } = useThemeStrict();
  const [holdProgress, setHoldProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(0);

  const HOLD_DURATION = 600; // ms

  const startHold = useCallback(() => {
    startTime.current = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        if (holdTimer.current) clearInterval(holdTimer.current);
        setConfirmed(true);
        // Vibrate on mobile
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(onConfirm, 300);
      }
    }, 16);
  }, [onConfirm]);

  const endHold = useCallback(() => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    if (!confirmed) setHoldProgress(0);
  }, [confirmed]);

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearInterval(holdTimer.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/90 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="text-center max-w-sm mx-4 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <p className={`${theme.visuals.headingFontClass} text-gold/80 text-lg tracking-[0.2em] mb-2`}>
          {theme.copy.accusePrompt}
        </p>
        <p className="font-body text-parchment/50 text-sm italic mb-6">
          One accusation only.
        </p>

        <p className={`${theme.visuals.headingFontClass} text-crimson-bright text-2xl tracking-wider mb-8 animate-ink-reveal`}>
          {suspectName}
        </p>

        {/* Hold-to-confirm wax seal */}
        <div className="relative inline-block mb-6">
          {/* Outer glow ring that pulses during hold */}
          <div
            className="absolute inset-[-12px] rounded-full transition-all duration-200"
            style={{
              background: holdProgress > 0
                ? `radial-gradient(circle, rgba(198,40,40,${0.12 + holdProgress * 0.15}) 40%, transparent 70%)`
                : 'transparent',
              boxShadow: confirmed
                ? '0 0 40px rgba(198,40,40,0.5), 0 0 80px rgba(198,40,40,0.2)'
                : holdProgress > 0
                  ? `0 0 ${20 + holdProgress * 30}px rgba(198,40,40,${holdProgress * 0.35})`
                  : 'none',
            }}
          />

          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className={`relative cursor-pointer select-none ${!confirmed && holdProgress === 0 ? 'animate-breathe' : ''}`}
          >
            {/* Progress ring — thicker, more dramatic */}
            <svg width="110" height="110" viewBox="0 0 110 110" className="absolute -inset-[5px]">
              {/* Track ring */}
              <circle
                cx="55" cy="55" r="50"
                fill="none"
                stroke="rgba(139,26,26,0.15)"
                strokeWidth="4"
              />
              {/* Progress arc */}
              <circle
                cx="55" cy="55" r="50"
                fill="none"
                stroke={confirmed ? '#c62828' : 'rgba(198,40,40,0.9)'}
                strokeWidth="4"
                strokeDasharray={`${holdProgress * 314} 314`}
                strokeLinecap="round"
                transform="rotate(-90 55 55)"
                style={{ transition: holdProgress === 0 ? 'stroke-dasharray 0.2s ease-out' : 'none' }}
              />
              {/* Glow filter for the arc */}
              {holdProgress > 0.5 && (
                <circle
                  cx="55" cy="55" r="50"
                  fill="none"
                  stroke="rgba(198,40,40,0.3)"
                  strokeWidth="8"
                  strokeDasharray={`${holdProgress * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                  style={{ filter: 'blur(4px)', transition: 'none' }}
                />
              )}
            </svg>

            <div
              className="transition-transform duration-150"
              style={{
                transform: confirmed
                  ? 'scale(1.08)'
                  : holdProgress > 0
                    ? `scale(${0.92 + holdProgress * 0.06}) rotate(${holdProgress * -3}deg)`
                    : 'scale(1)',
              }}
            >
              <WaxSeal size={100} className={confirmed ? 'text-crimson' : holdProgress > 0 ? 'text-crimson/80' : 'text-crimson/50'} />
            </div>
          </button>

          <p className={`font-body text-xs italic mt-3 transition-all duration-300 ${
            confirmed ? 'text-crimson/70 tracking-[0.15em]' : holdProgress > 0 ? 'text-crimson/50' : 'text-iron/40'
          }`}>
            {confirmed ? 'Sealed.' : holdProgress > 0 ? 'Keep holding...' : theme.copy.accuseHoldText}
          </p>
        </div>

        <button
          onClick={onCancel}
          className="block mx-auto font-body text-iron/40 text-xs hover:text-iron/60 cursor-pointer transition-colors"
        >
          Reconsider
        </button>
      </div>
    </div>
  );
}
