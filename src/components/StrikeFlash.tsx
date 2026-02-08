import { useState, useEffect } from 'react';
import { useGame } from '../hooks/GameContext.js';

export default function StrikeFlash() {
  const { state } = useGame();
  const [flashes, setFlashes] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    // No strike flashes during gameplay
    if (state.phase !== 'ended') return;
    if (!state.newStrikes || state.newStrikes.length === 0) return;

    const newFlashes = state.newStrikes.map((s, i) => ({
      id: `${s.suspectId}-${Date.now()}-${i}`,
      text: s.evidence.description,
    }));

    setFlashes(prev => [...prev, ...newFlashes]);

    const timer = setTimeout(() => {
      setFlashes(prev => prev.filter(f => !newFlashes.some(n => n.id === f.id)));
    }, 3000);

    if (navigator.vibrate) navigator.vibrate(15);

    return () => clearTimeout(timer);
  }, [state.newStrikes, state.phase]);

  if (state.phase !== 'ended' || flashes.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {flashes.map(flash => (
        <div
          key={flash.id}
          className="px-4 py-2 rounded-lg bg-crimson/90 border border-crimson-bright/40
            backdrop-blur-sm shadow-[0_0_20px_rgba(139,26,26,0.4)]
            animate-strike-flash max-w-sm text-center"
        >
          <p className="font-cinzel text-parchment/90 text-xs tracking-wider leading-snug">
            {flash.text}
          </p>
        </div>
      ))}
    </div>
  );
}
