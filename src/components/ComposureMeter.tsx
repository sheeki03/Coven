interface Props {
  pressure: number;
  maxPressure?: number;
}

export default function ComposureMeter({ pressure, maxPressure = 3 }: Props) {
  const pct = Math.min(1, pressure / maxPressure) * 100;

  const barColor = pressure <= 1
    ? 'bg-gold/60'
    : pressure === 2
      ? 'bg-amber-500/70'
      : 'bg-crimson/80';

  const glowColor = pressure >= 3 ? 'shadow-[0_0_12px_rgba(139,26,26,0.3)]' : '';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-cinzel text-iron/50 text-xs tracking-[0.2em] uppercase">Composure</span>
        <span className="font-body text-iron/45 text-xs">{pressure}/{maxPressure}</span>
      </div>
      <div className="h-2 rounded-full bg-bg-deep/60 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} ${glowColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
