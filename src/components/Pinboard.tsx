import React, { useMemo } from 'react';
import type { RevealedClaimDetail } from '../types/index.js';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { useHighlight } from '../hooks/useHighlight.js';
import SuspectPortrait from './icons/SuspectPortraits.js';
import TimelineStrip from './TimelineStrip.js';
import OathChips from './OathChips.js';

const defaultRc: RevealedClaimDetail = { bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false };

function Pinboard() {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const { highlight, highlightDispatch } = useHighlight();
  const locNames = useMemo(() => {
    if (!state.world) return {};
    const m: Record<string, string> = {};
    for (const l of state.world.locations) m[l.id] = l.name;
    return m;
  }, [state.world]);

  const pinnedSuspects = highlight.pinnedSuspects
    .map(id => state.suspects.find(s => s.id === id))
    .filter(Boolean) as typeof state.suspects;

  if (pinnedSuspects.length === 0 || state.phase === 'ended') return null;

  return (
    <div className="surface-parchment rounded-xl border border-gold/15 p-3 animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-cinzel text-gold/70 text-xs tracking-[0.2em] uppercase">
          Deliberation Board
        </h3>
        <button
          onClick={() => highlightDispatch({ type: 'CLEAR_ALL' })}
          className="font-body text-xs text-iron/40 hover:text-gold/60 cursor-pointer transition-colors"
        >
          Clear
        </button>
      </div>

      <div className={`grid gap-3 ${pinnedSuspects.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {pinnedSuspects.map(suspect => {
          const rc: RevealedClaimDetail = state.revealedClaims[suspect.id] ?? defaultRc;
          const revealedBells = rc.route ? [0, 1, 2, 3, 4, 5] : rc.bells;
          const openingHeard = rc.openingHeard;

          return (
            <div
              key={suspect.id}
              className="rounded-lg p-2.5 border transition-all border-iron/10 bg-surface/20"
            >
              {/* Compact header */}
              <div className="flex items-center gap-2 mb-1.5">
                <SuspectPortrait name={suspect.name} size={28} portraitStyle={theme.visuals.portraitStyle} />
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-parchment/85 text-xs font-bold truncate">{suspect.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    highlightDispatch({ type: 'TOGGLE_PIN_SUSPECT', id: suspect.id });
                  }}
                  className="text-iron/30 hover:text-crimson/60 text-xs cursor-pointer transition-colors"
                  title="Unpin"
                >
                  ✕
                </button>
              </div>

              {/* Timeline */}
              <TimelineStrip
                segments={suspect.claimVector.segments}
                evidence={[]}
                hintUsed={state.hintUsed}
                revealedBells={revealedBells}
                openingHeard={openingHeard}
                locationNames={locNames}
              />

              {/* Chips */}
              <div className="mt-1.5">
                <OathChips claim={suspect.claimVector} drawnCount={state.drawnCards.length} revealedClaims={rc} locationNames={locNames} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Slot hints */}
      {pinnedSuspects.length < 2 && (
        <p className="text-center mt-2 font-body text-iron/30 text-xs italic">
          Pin another suspect to compare side-by-side
        </p>
      )}
    </div>
  );
}

export default React.memo(Pinboard);
