import { useGame } from '../hooks/GameContext.js';
import { getDailyObjectives, checkObjectives } from '../utils/dailyObjectives.js';
import HelpTip from './HelpTip.js';

interface Props {
  mode?: 'header' | 'endscreen';
}

export default function DailyObjectives({ mode = 'header' }: Props) {
  const { state } = useGame();
  const objectives = getDailyObjectives(state.seed);
  const results = checkObjectives(objectives, state);

  if (mode === 'header') {
    return (
      <div className="flex items-center gap-2">
        {results.map(({ objective, completed }) => (
          <span
            key={objective.id}
            title={`${objective.title}: ${objective.description}`}
            className={`text-lg transition-all duration-300 cursor-help ${
              completed ? 'opacity-100 scale-110' : 'opacity-30 grayscale'
            }`}
          >
            {objective.icon}
          </span>
        ))}
        <HelpTip text="Daily challenges — hover each icon to see its goal. Complete them for bonus recognition!" />
      </div>
    );
  }

  // EndScreen mode — full stamps
  const completedCount = results.filter(r => r.completed).length;

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        Daily Contracts — {completedCount}/{results.length}
      </p>
      <div className="flex gap-3 justify-center">
        {results.map(({ objective, completed }) => (
          <div
            key={objective.id}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
              completed
                ? 'bg-gold/10 border-gold/25'
                : 'bg-surface/20 border-iron/10 opacity-40'
            }`}
          >
            <span className={`text-xl ${completed ? '' : 'grayscale opacity-50'}`}>
              {objective.icon}
            </span>
            <span className={`font-cinzel text-xs tracking-wider text-center leading-tight ${
              completed ? 'text-gold/80' : 'text-iron/40'
            }`}>
              {objective.title}
            </span>
            {completed && <span className="text-xs text-gold/50">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
