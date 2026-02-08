import { useCouncilChronicle } from '../hooks/useCouncilChronicle.js';

export default function CouncilChronicle() {
  const { sigilCount, weekDays, epilogue } = useCouncilChronicle();

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        Council Chronicle — {sigilCount}/7 Sigils
      </p>

      {/* Week sigils */}
      <div className="flex gap-1.5 justify-center mb-3">
        {weekDays.map(day => (
          <div
            key={day.date}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all ${
              day.earned
                ? 'bg-gold/12 border-gold/25'
                : day.isToday
                  ? 'bg-surface/40 border-gold/15'
                  : 'bg-surface/15 border-iron/8 opacity-35'
            }`}
          >
            <span className={`text-sm ${day.earned ? '' : 'grayscale opacity-40'}`}>
              {day.earned ? '⚜' : '○'}
            </span>
            <span className={`font-cinzel text-[11px] tracking-wider ${
              day.isToday ? 'text-gold/70' : day.earned ? 'text-gold/50' : 'text-iron/30'
            }`}>
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-surface/30 mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold/40 to-gold/70 transition-all duration-500"
          style={{ width: `${(sigilCount / 7) * 100}%` }}
        />
      </div>

      {/* Epilogue */}
      {epilogue ? (
        <div className="mt-3 pt-3 border-t border-gold/10">
          <p className="font-cinzel text-gold/80 text-xs tracking-wider mb-1">{epilogue.title}</p>
          <p className="font-body text-parchment/55 text-xs italic leading-relaxed">{epilogue.text}</p>
        </div>
      ) : (
        <p className="font-body text-iron/35 text-xs italic text-center">
          {sigilCount < 4 ? `${4 - sigilCount} more sigils to unlock the Watcher's Reprieve` : ''}
        </p>
      )}
    </div>
  );
}
