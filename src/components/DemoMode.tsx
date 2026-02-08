import { useGame } from '../hooks/GameContext.js';

export const TUTORIAL_SEED = 99999;

const CURATED_SEEDS = [
  { label: 'Tutorial', seed: TUTORIAL_SEED, desc: 'Guided first puzzle' },
  { label: 'Easy', seed: 20260101, desc: 'Clear contradiction path' },
  { label: 'Close Call', seed: 20260215, desc: 'Multiple suspects, tight' },
  { label: 'Cinematic Loss', seed: 20260307, desc: 'Designed for a dramatic miss' },
];

export default function DemoMode() {
  const { dispatch } = useGame();

  return (
    <div className="surface-parchment rounded-xl p-5 animate-fade-in-up">
      <h3 className="font-cinzel text-gold/80 text-sm tracking-[0.2em] uppercase mb-3 text-center">
        Demo Chronicles
      </h3>
      <p className="font-body text-iron/60 text-sm italic text-center mb-4">
        Curated puzzles for demonstration
      </p>

      <div className="grid grid-cols-2 gap-3">
        {CURATED_SEEDS.map(s => (
          <button
            key={s.seed}
            onClick={() => dispatch({ type: 'RESET', seed: s.seed })}
            className="p-3 rounded-lg border border-gold/15 bg-surface/30
              hover:border-gold/35 hover:bg-surface/50
              transition-all duration-200 cursor-pointer text-center"
          >
            <p className="font-cinzel text-gold/80 text-sm font-bold tracking-wider">{s.label}</p>
            <p className="font-body text-iron/50 text-xs italic mt-1">{s.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
