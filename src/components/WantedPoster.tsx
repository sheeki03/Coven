import type { Suspect, WorldModel } from '../types/index.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import SuspectPortrait from './icons/SuspectPortraits.js';

interface Props {
  liar: Suspect;
  world: WorldModel;
}

export default function WantedPoster({ liar, world }: Props) {
  const { theme } = useThemeStrict();
  const primaryLocation = liar.claimVector.segments[0]?.from;
  const locName = world.locations.find(l => l.id === primaryLocation)?.name ?? 'the realm';

  const charges = liar.evidence.slice(0, 2);

  return (
    <div className="relative bg-crimson/8 border border-crimson/30 rounded-xl overflow-hidden animate-fade-in-up">
      {/* Torn edge effect via clip-path */}
      <div
        className="absolute top-0 left-0 right-0 h-3 bg-crimson/15"
        style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)' }}
      />

      <div className="pt-6 pb-5 px-5 text-center">
        {/* Header */}
        <p className="font-cinzel text-crimson-bright text-xs tracking-[0.3em] uppercase mb-3">
          Wanted by the Watch
        </p>

        {/* Portrait with crimson overlay */}
        <div className="relative inline-block mb-3">
          <div className="rounded-xl overflow-hidden ring-2 ring-crimson/50 shadow-[0_0_20px_rgba(139,26,26,0.3)]">
            <SuspectPortrait name={liar.name} size={90} portraitStyle={theme.visuals.portraitStyle} />
          </div>
          <div className="absolute inset-0 rounded-xl bg-crimson/10 pointer-events-none" />
        </div>

        {/* Name & location */}
        <h3 className="font-cinzel-dec text-crimson-bright text-xl font-bold tracking-wider mb-1">
          {liar.name}
        </h3>
        <p className="font-body text-crimson/60 text-sm italic mb-3">
          {theme.copy.liarLabel} of {locName}
        </p>

        {/* Charges */}
        {charges.length > 0 && (
          <div className="space-y-1.5 text-left max-w-xs mx-auto">
            {charges.map((e, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-crimson/50 mt-0.5 shrink-0">&#x2022;</span>
                <p className="font-body text-parchment/70 italic leading-snug">{e.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
