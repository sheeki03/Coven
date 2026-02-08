import { useEffect, useState, useCallback } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { WaxSeal } from './icons/RuneSymbols.js';

export default function AccusationSequence() {
  const { state, dispatch } = useGame();
  const { theme } = useThemeStrict();
  const [step, setStep] = useState(0); // 0=convening, 1=seal, 2=verdict

  const finish = useCallback(() => {
    dispatch({ type: 'FINISH_ACCUSATION' });
  }, [dispatch]);

  useEffect(() => {
    if (state.phase !== 'accusing') return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 1200));
    timers.push(setTimeout(() => setStep(2), 2400));
    timers.push(setTimeout(finish, 3500));

    return () => timers.forEach(clearTimeout);
  }, [state.phase, finish]);

  if (state.phase !== 'accusing') return null;

  const won = state.won;

  // Generate particles for seal slam
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    return {
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      delay: Math.random() * 200,
      size: 2 + Math.random() * 4,
    };
  });

  const glowColor = won ? 'rgba(46,125,74,' : 'rgba(198,40,40,';

  return (
    <div
      onClick={finish}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      style={{
        background: step >= 1
          ? `radial-gradient(circle at center, ${glowColor}0.08) 0%, rgba(33,28,48,0.97) 60%)`
          : 'rgba(33,28,48,0.95)',
        transition: 'background 0.5s ease',
      }}
    >
      {/* Step 0: Convening text */}
      {step === 0 && (
        <p className="font-cinzel text-parchment/60 text-xl tracking-[0.3em] animate-fade-in">
          The Council convenes...
        </p>
      )}

      {/* Step 1: Seal slam with particles */}
      {step >= 1 && step < 2 && (
        <div className="relative">
          {/* Glow behind seal */}
          <div
            className="absolute inset-[-30px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${glowColor}0.25) 0%, transparent 70%)`,
              filter: 'blur(10px)',
            }}
          />
          <div className="animate-seal-stamp relative">
            <WaxSeal size={120} className={won ? 'text-forest' : 'text-crimson'} />
          </div>
          {/* Particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: won ? '#2e7d4a' : '#c62828',
                animation: `particleBurst 0.6s ${p.delay}ms ease-out forwards`,
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Step 2: Verdict */}
      {step >= 2 && (
        <div className="text-center">
          <h2 className={`${theme.visuals.headingDecFontClass} text-5xl md:text-6xl font-bold tracking-[0.25em] animate-verdict ${
            won ? 'text-forest-bright' : 'text-crimson-bright'
          }`} style={{
            textShadow: won
              ? '0 0 40px rgba(46,125,74,0.4), 0 0 80px rgba(46,125,74,0.15)'
              : '0 0 40px rgba(198,40,40,0.4), 0 0 80px rgba(198,40,40,0.15)',
          }}>
            {won ? theme.copy.verdictWin : theme.copy.verdictLose}
          </h2>
        </div>
      )}

      <p className="absolute bottom-8 font-body text-iron/30 text-xs italic animate-fade-in" style={{ animationDelay: '500ms' }}>
        Tap to skip
      </p>
    </div>
  );
}
