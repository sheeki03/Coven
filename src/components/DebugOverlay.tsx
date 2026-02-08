import { useState, useEffect } from 'react';
import { useGame } from '../hooks/GameContext.js';

export default function DebugOverlay() {
  const { state, puzzle, dispatch, suspectsByStrikes } = useGame();
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasDebug = params.has('debug');
    const isDev = import.meta.env.DEV;

    if (isDev && hasDebug) {
      setEnabled(true);
      setVisible(true);
      return;
    }

    if (hasDebug) {
      const handler = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          setEnabled(true);
          setVisible(v => !v);
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, []);

  if (!enabled) return null;

  const liar = state.suspects.find(s => s.isLiar);
  const bestPair = puzzle?.solvabilityProof.bestPair;

  return (
    <div className={`fixed top-2 right-2 z-[60] transition-all duration-200 ${visible ? '' : 'translate-x-[calc(100%+8px)]'}`}>
      {/* Toggle tab */}
      <button
        onClick={() => setVisible(v => !v)}
        className="absolute -left-8 top-0 w-7 h-7 rounded-l-md bg-surface/90 border border-r-0 border-gold/20 text-gold/60 text-xs cursor-pointer flex items-center justify-center"
      >
        D
      </button>

      <div className="bg-surface/95 backdrop-blur-sm border border-gold/20 rounded-lg p-3 w-64 text-xs max-h-[80vh] overflow-y-auto">
        <p className="font-cinzel text-gold/80 tracking-wider mb-2">Debug Overlay</p>

        <div className="space-y-1.5 font-body text-parchment/70">
          <p>Seed: <span className="text-gold">{state.seed}</span></p>
          <p>Phase: <span className="text-gold">{state.phase}</span></p>
          <p>Liar: <span className="text-crimson-bright">{liar?.name ?? '?'}</span> ({liar?.id})</p>
          <p>Best pair: <span className="text-gold">{bestPair?.join(', ')}</span></p>
          <p>Drawn: <span className="text-gold">{state.drawnCards.length}/2</span></p>

          <div className="border-t border-gold/10 pt-1.5 mt-1.5">
            <p className="font-cinzel text-iron/60 tracking-wider mb-1">Strikes</p>
            {suspectsByStrikes.map(s => (
              <p key={s.id} className={s.id === liar?.id ? 'text-crimson-bright' : ''}>
                {s.name}: {s.strikes}
              </p>
            ))}
          </div>

          <div className="border-t border-gold/10 pt-1.5 mt-1.5 flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                if (liar) dispatch({ type: 'ACCUSE', suspectId: liar.id });
              }}
              className="px-2 py-1 rounded border border-forest/30 text-forest-bright bg-forest/10 cursor-pointer"
            >
              Force Win
            </button>
            <button
              onClick={() => {
                const innocent = state.suspects.find(s => !s.isLiar);
                if (innocent) dispatch({ type: 'ACCUSE', suspectId: innocent.id });
              }}
              className="px-2 py-1 rounded border border-crimson/30 text-crimson-bright bg-crimson/10 cursor-pointer"
            >
              Force Loss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
