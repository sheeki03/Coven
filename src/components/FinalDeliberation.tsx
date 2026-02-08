import { useMemo } from 'react';
import type { RevealedClaimDetail } from '../types/index.js';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { useHighlight } from '../hooks/useHighlight.js';
import SuspectPortrait from './icons/SuspectPortraits.js';
import TimelineStrip from './TimelineStrip.js';
import OathChips from './OathChips.js';

const defaultRc: RevealedClaimDetail = { bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false };

export default function FinalDeliberation() {
  const { state, suspectsByStrikes } = useGame();
  const { theme } = useThemeStrict();
  const { highlight } = useHighlight();
  const locNames = useMemo(() => {
    if (!state.world) return {};
    const m: Record<string, string> = {};
    for (const l of state.world.locations) m[l.id] = l.name;
    return m;
  }, [state.world]);

  const isEnded = state.phase === 'ended';

  if (state.phase !== 'investigating' && !isEnded) return null;
  if (state.phase === 'investigating' && state.drawnCards.length < 2) return null;

  // Use pinned suspects or fall back to top 2 by strikes
  const compareIds = highlight.pinnedSuspects.length >= 2
    ? highlight.pinnedSuspects.slice(0, 2)
    : suspectsByStrikes.slice(0, 2).map(s => s.id);

  const suspects = compareIds.map(id => state.suspects.find(s => s.id === id)).filter(Boolean) as typeof state.suspects;

  if (suspects.length < 2) return null;

  return (
    <div className="animate-fade-in-up">
      <div className="surface-parchment rounded-xl p-4">
        <h3 className="font-cinzel text-gold/80 text-xs tracking-[0.2em] uppercase mb-3 text-center">
          Final Deliberation
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {suspects.map(s => {
            const rc: RevealedClaimDetail | undefined = isEnded ? undefined : (state.revealedClaims[s.id] ?? defaultRc);
            const revealedBells = rc ? (rc.route ? [0, 1, 2, 3, 4, 5] : rc.bells) : undefined;
            const openingHeard = rc ? rc.openingHeard : undefined;

            return (
              <div key={s.id} className={`rounded-lg p-3 border ${
                isEnded && s.strikes >= 2 ? 'border-crimson/25 bg-crimson/5' : isEnded && s.strikes === 1 ? 'border-gold/20 bg-gold/5' : 'border-iron/15 bg-surface/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="shrink-0 rounded-lg overflow-hidden ring-1 ring-gold/15">
                    <SuspectPortrait name={s.name} size={40} portraitStyle={theme.visuals.portraitStyle} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-cinzel text-parchment/90 text-sm font-bold truncate">{s.name}</p>
                    {isEnded && (
                      <p className="font-body text-gold-dim/60 text-xs italic">{s.strikes} strike{s.strikes !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>

                <TimelineStrip
                  segments={s.claimVector.segments}
                  evidence={isEnded ? s.evidence : []}
                  hintUsed={state.hintUsed}
                  revealedBells={revealedBells}
                  openingHeard={openingHeard}
                  locationNames={locNames}
                />

                <div className="mt-2">
                  <OathChips claim={s.claimVector} drawnCount={state.drawnCards.length} revealedClaims={rc} locationNames={locNames} />
                </div>

                {isEnded && s.evidence.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {s.evidence.slice(0, 2).map((e, i) => (
                      <p key={i} className="font-body text-ember/70 text-sm italic leading-snug truncate">
                        {e.description}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center mt-3 font-body text-iron/40 text-xs italic">
          Name {theme.copy.liarLabel} below
        </p>
      </div>
    </div>
  );
}
