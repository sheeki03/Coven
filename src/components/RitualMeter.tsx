import HelpTip from './HelpTip.js';

interface Props {
  score: number;
  phase: string;
}

export default function RitualMeter({ score, phase }: Props) {
  if (phase === 'ended' || phase === 'accusing') return null;

  const rank = score >= 700 ? 'clean' : score >= 400 ? 'mercy' : 'fallen';

  const config = {
    clean: { label: 'Clean', color: 'text-gold', glow: 'shadow-[0_0_8px_rgba(196,163,90,0.15)]', bg: 'bg-gold/10 border-gold/20' },
    mercy: { label: 'Mercy', color: 'text-ember', glow: '', bg: 'bg-ember/10 border-ember/20' },
    fallen: { label: 'Fallen', color: 'text-crimson', glow: '', bg: 'bg-crimson/10 border-crimson/20' },
  }[rank];

  return (
    <div className="inline-flex items-center">
      <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-sm font-cinzel tracking-wider ${config.bg} ${config.glow}`}>
        <div className={`w-2.5 h-2.5 rounded-full ${rank === 'clean' ? 'bg-gold' : rank === 'mercy' ? 'bg-ember' : 'bg-crimson'}`} />
        <span className={config.color}>{config.label}</span>
      </div>
      <HelpTip position="bottom" align="right" text="Your verdict rank — wrong accusations lower it. Clean = perfect, Mercy = some mistakes, Fallen = too many errors." />
    </div>
  );
}
