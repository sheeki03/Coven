import React, { useState, useEffect, useRef } from 'react';
import type { Suspect, RevealedClaimDetail } from '../types/index.js';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { useHighlight } from '../hooks/useHighlight.js';
import { getVisibility } from '../utils/uiVisibility.js';
import { SkullIcon, WaxSeal, RuneOaths, RuneRoads, RuneRelics, RuneSkies } from './icons/RuneSymbols.js';
import SuspectPortrait from './icons/SuspectPortraits.js';
import TimelineStrip from './TimelineStrip.js';
import OathChips from './OathChips.js';
import AnswerChipBar from './AnswerChipBar.js';
import { useInterrogation } from '../hooks/useInterrogation.js';

interface Props {
  suspect: Suspect;
  onAccuse?: (id: string, name: string) => void;
}

const EVIDENCE_ICONS: Record<string, { Icon: typeof RuneOaths; label: string }> = {
  time: { Icon: RuneOaths, label: 'Bell contradiction' },
  movement: { Icon: RuneRoads, label: 'Travel impossible' },
  object: { Icon: RuneRelics, label: 'Relic mismatch' },
  environment: { Icon: RuneSkies, label: 'Sense contradiction' },
};

function KnownMeter({ rc }: { rc: RevealedClaimDetail | undefined }) {
  if (!rc) return null;
  const bellCount = rc.route ? 6 : rc.bells.length;
  const probes: { icon: string; label: string; done: boolean }[] = [
    { icon: '⚓', label: 'Horn', done: rc.anchor },
    { icon: '◈', label: 'Relic', done: rc.object },
    { icon: '≈', label: 'Scent', done: rc.sense },
  ];

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface/30 border border-iron/8">
      {/* Bell dots — 6 dots, filled for revealed */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-body text-iron/30 uppercase tracking-wider mr-0.5">Bells</span>
        <div className="flex gap-[3px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-[7px] h-[7px] rounded-full transition-all duration-500 ${
                i < bellCount
                  ? 'bg-gold/80 shadow-[0_0_4px_rgba(196,163,90,0.4)]'
                  : 'bg-iron/15 border border-iron/10'
              }`}
              style={i < bellCount ? { animationDelay: `${i * 60}ms` } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-iron/10" />

      {/* Route indicator */}
      <div className="flex items-center gap-1">
        <span className={`text-xs transition-all duration-300 ${rc.route ? 'text-gold/80' : 'text-iron/20'}`}>
          ↝
        </span>
        <span className={`text-[10px] font-body transition-colors duration-300 ${rc.route ? 'text-gold/60' : 'text-iron/25'}`}>
          Route
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-iron/10" />

      {/* Probe icons */}
      <div className="flex items-center gap-2">
        {probes.map(p => (
          <span
            key={p.label}
            className={`text-xs transition-all duration-300 ${
              p.done ? 'text-gold/80 scale-110' : 'text-iron/20'
            }`}
            title={`${p.label}: ${p.done ? 'Revealed' : 'Unknown'}`}
          >
            {p.icon}
          </span>
        ))}
      </div>
    </div>
  );
}

function SuspectCard({ suspect, onAccuse }: Props) {
  const { state, canAccuse, dispatch } = useGame();
  const { theme } = useThemeStrict();
  const { highlight, highlightDispatch } = useHighlight();
  const { openChamber } = useInterrogation();
  const [expanded, setExpanded] = useState(false);
  const [inkStamp, setInkStamp] = useState(false);
  const prevStrikes = useRef(suspect.strikes);
  const vis = getVisibility(state.drawnCards.length, state.phase);

  const isEnded = state.phase === 'ended';
  const isAccusing = state.phase === 'accusing';

  // Seal state
  const isSealed = highlight.sealedSuspectId === suspect.id;

  // revealedClaims for this suspect — undefined in ended phase (unmask everything)
  // During investigating, ensure we always have a RevealedClaimDetail (default = nothing revealed)
  // so OathChips/TimelineStrip properly mask unknown claims
  const defaultRc: RevealedClaimDetail = { bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false };
  const rc: RevealedClaimDetail | undefined = isEnded ? undefined : (state.revealedClaims[suspect.id] ?? defaultRc);

  // Player marks
  const isMarked = state.markedSuspects.includes(suspect.id);

  // Ink stamp animation when strikes increase (only matters at end)
  useEffect(() => {
    if (suspect.strikes > prevStrikes.current) {
      setInkStamp(true);
      const timer = setTimeout(() => setInkStamp(false), 500);
      prevStrikes.current = suspect.strikes;
      return () => clearTimeout(timer);
    }
    prevStrikes.current = suspect.strikes;
  }, [suspect.strikes]);

  const isAccused = state.accusation === suspect.id;
  const wasLiar = isEnded && suspect.isLiar;

  // Strike-based states only visible at end
  const isCondemned = isEnded && suspect.strikes >= 2;
  const isSuspectStatus = isEnded && suspect.strikes === 1;

  // Highlight state
  const isPinned = highlight.pinnedSuspects.includes(suspect.id);

  // Is this suspect targeted by the hovered/pinned fact?
  const activeFactIndex = highlight.pinnedFactIndex ?? highlight.hoveredFactIndex;
  const isTargetedByFact = activeFactIndex != null &&
    state.revealedFacts[activeFactIndex]?.targetsSuspects?.includes(suspect.id);

  const handleAccuse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canAccuse && !isEnded) {
      if (onAccuse) {
        onAccuse(suspect.id, suspect.name);
      }
    }
  };

  const handleHover = () => {
    highlightDispatch({ type: 'HOVER_SUSPECT', id: suspect.id });
  };
  const handleLeave = () => {
    highlightDispatch({ type: 'HOVER_SUSPECT', id: null });
  };
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    highlightDispatch({ type: 'TOGGLE_PIN_SUSPECT', id: suspect.id });
  };

  const handleToggleMark = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_MARK_SUSPECT', suspectId: suspect.id });
  };

  // Visual state — neutral during investigating
  let cardStyle = 'border-gold/10 hover:border-gold/25';
  let glowClass = '';

  if (isEnded) {
    if (isCondemned) {
      cardStyle = 'border-crimson/40 hover:border-crimson/60';
      glowClass = 'animate-crimson-pulse';
    } else if (isSuspectStatus) {
      cardStyle = 'border-gold/30 hover:border-gold/50';
      glowClass = 'animate-rune-glow';
    }
    if (wasLiar) {
      cardStyle = 'border-crimson/60';
      glowClass = 'animate-crimson-pulse';
    }
    if (isAccused && !wasLiar) {
      cardStyle = 'border-iron/30';
      glowClass = '';
    }
  }

  // Player-marked highlight during investigating
  if (!isEnded && isMarked) {
    cardStyle += ' ring-1 ring-gold/40';
  }

  if (isTargetedByFact) {
    cardStyle += ' ring-1 ring-gold/40';
  }
  if (isPinned) {
    cardStyle += ' ring-1 ring-gold/30';
  }
  if (isSealed && isEnded) {
    cardStyle += ' ring-2 ring-crimson/30';
    glowClass = 'animate-seal-glow';
  }

  // Compute revealedBells for TimelineStrip
  const revealedBells = rc ? (rc.route ? [0, 1, 2, 3, 4, 5] : rc.bells) : undefined;
  const openingHeard = rc ? rc.openingHeard : undefined;

  return (
    <div
      id={`suspect-${suspect.id}`}
      className={`relative group rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${glowClass} ${inkStamp ? 'animate-ink-stamp' : ''} animate-fade-in-up`}
      onClick={() => {
        if (!expanded) sessionStorage.setItem('coven:expandedTestimony', '1');
        setExpanded(!expanded);
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onTouchStart={handleHover}
    >
      <div className={`surface-parchment border ${cardStyle} rounded-xl p-5 sm:p-6 transition-all duration-300 relative`}>
        {/* Shimmer */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(196,163,90,0.04) 45%, rgba(196,163,90,0.07) 50%, rgba(196,163,90,0.04) 55%, transparent 60%)',
            backgroundSize: '200% 100%', animation: 'cardShimmer 3s ease-in-out infinite',
          }} />
        </div>

        {/* Badges — only at ended phase */}
        {isEnded && isCondemned && (
          <div className="absolute -top-px -right-px">
            <div className="relative animate-seal-stamp">
              <WaxSeal size={44} className="text-crimson/90" />
              <span className="absolute inset-0 flex items-center justify-center font-cinzel text-[9px] text-parchment/90 tracking-widest font-bold pt-0.5">II+</span>
            </div>
          </div>
        )}
        {isEnded && wasLiar && (
          <div className="absolute -top-px -right-px animate-seal-stamp">
            <div className="relative">
              <WaxSeal size={52} className="text-crimson" />
              <SkullIcon size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-parchment/80" />
            </div>
          </div>
        )}
        {isEnded && isAccused && !wasLiar && (
          <span className="absolute -top-2 right-3 px-2.5 py-1 rounded-md text-xs font-cinzel font-bold tracking-[0.15em] bg-iron/20 text-iron/80 border border-iron/25">
            INNOCENT
          </span>
        )}

        {/* Header row */}
        <div className="flex items-start gap-4 mb-4 relative z-10">
          <div className={`shrink-0 rounded-lg overflow-hidden ${
            isEnded && isCondemned ? 'ring-2 ring-crimson/40' : isEnded && isSuspectStatus ? 'ring-2 ring-gold/30' : 'ring-1 ring-iron/15'
          }`}>
            <SuspectPortrait name={suspect.name} size={64} portraitStyle={theme.visuals.portraitStyle} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-cinzel font-bold text-lg sm:text-xl tracking-wide leading-tight ${
                  isEnded && wasLiar ? 'text-crimson-bright' : 'text-parchment'
                }`}>
                  {suspect.name}
                </h3>
                <p className="font-body text-gold-dim text-base mt-0.5 italic">{suspect.role}</p>
              </div>

              {/* Strike dots (only at end) + Pin + Mark */}
              <div className="flex items-center gap-1.5 ml-2 shrink-0">
                {isEnded && suspect.strikes > 0 && Array.from({ length: suspect.strikes }).map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${
                    isCondemned ? 'bg-crimson shadow-[0_0_6px_rgba(139,26,26,0.5)]' : 'bg-gold/70'
                  }`} />
                ))}
                {!isEnded && !isAccusing && (
                  <>
                    {/* Mark suspect star */}
                    <button
                      onClick={handleToggleMark}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-base transition-all duration-300
                        ${isMarked
                          ? 'bg-gold/20 text-gold scale-110 shadow-[0_0_8px_rgba(196,163,90,0.25)]'
                          : 'text-iron/25 hover:text-gold/50 hover:scale-105 active:scale-125'}
                      `}
                      title={isMarked ? 'Unmark suspect' : 'Mark as suspicious'}
                    >
                      {isMarked ? '★' : '☆'}
                    </button>
                    <button
                      onClick={handlePin}
                      className={`ml-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all
                        ${isPinned ? 'bg-gold/20 text-gold' : 'text-iron/30 hover:text-gold/60'}
                      `}
                      title={isPinned ? 'Unpin' : 'Pin for comparison'}
                    >
                      ⊞
                    </button>
                  </>
                )}
                {/* Seal button only at ended */}
                {isEnded && isCondemned && !isSealed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      highlightDispatch({ type: 'SEAL_SUSPECT', id: suspect.id });
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-sm text-crimson/40 hover:text-crimson/70 transition-all"
                    title="Seal this suspect"
                  >
                    ⊛
                  </button>
                )}
                {isEnded && isSealed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      highlightDispatch({ type: 'UNSEAL_SUSPECT' });
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-sm bg-crimson/15 text-crimson/70 hover:text-crimson transition-all"
                    title="Unseal"
                  >
                    ⊗
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline — pass masking props */}
        {vis.showTimeline && (
          <div className="mb-3">
            <TimelineStrip
              segments={suspect.claimVector.segments}
              evidence={isEnded ? suspect.evidence : []}
              hintUsed={state.hintUsed}
              revealedBells={revealedBells}
              openingHeard={openingHeard}
            />
          </div>
        )}

        {/* Oath chips — pass revealedClaims for masking */}
        {vis.showSegmentChips && (
          <div className="mb-3">
            <OathChips
              claim={suspect.claimVector}
              drawnCount={state.drawnCards.length}
              revealedClaims={rc}
            />
          </div>
        )}

        {/* Evidence icon chips — only at ended phase */}
        {vis.showEvidenceChips && suspect.evidence.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suspect.evidence.map((e, i) => {
              const config = EVIDENCE_ICONS[e.type] ?? EVIDENCE_ICONS.time;
              const severity = suspect.strikes >= 2 ? '\u2022\u2022' : '\u2022';
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-body bg-crimson/8 text-crimson-bright/75 border border-crimson/15 animate-ink-reveal"
                  style={{ animationDelay: `${i * 100}ms` }}
                  title={e.description}
                >
                  <config.Icon size={14} className="text-crimson/50" />
                  <span>{config.label}</span>
                  <span className="text-crimson/40">{severity}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Answer chips from interrogation */}
        {state.answerChips.some(c => c.suspectId === suspect.id) && (
          <div className="mb-3">
            <AnswerChipBar chips={state.answerChips} suspectId={suspect.id} />
          </div>
        )}

        {/* Known meter — shows progress of revealed claims */}
        {!isEnded && !isAccusing && rc && rc.openingHeard && (
          <div className="mb-3">
            <KnownMeter rc={rc} />
          </div>
        )}

        {/* Interrogate button — always available during investigating */}
        {!isEnded && !isAccusing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openChamber(suspect);
            }}
            className={`w-full mb-3 py-3 rounded-xl font-cinzel text-sm tracking-[0.14em] uppercase
              bg-gradient-to-r from-gold/6 via-gold/10 to-gold/6 border border-gold/20 text-gold/60
              hover:from-gold/10 hover:via-gold/15 hover:to-gold/10 hover:border-gold/35 hover:text-gold/80
              hover:shadow-[0_0_20px_rgba(196,163,90,0.1)]
              active:scale-[0.98]
              transition-all duration-300 cursor-pointer flex items-center justify-center gap-2
              ${!rc?.openingHeard ? 'animate-gold-pulse' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold/50">
              <path d="M8 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11a1 1 0 01-1 1H7a1 1 0 01-1-1V9.5C4.8 8.8 4 7.5 4 6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6.5 13h3M7 14.5h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {theme.copy.interrogateLabel}
            {state.interrogationTokens > 0 && (
              <span className="text-iron/40 font-body text-xs normal-case">({state.interrogationTokens})</span>
            )}
          </button>
        )}

        {/* Expanded: Full testimony accordion */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gold/10 animate-ink-reveal relative z-10">
            <p className="font-body text-parchment/75 text-lg leading-relaxed">
              {suspect.narrativeAlibi || (
                <span className="italic text-iron/50">No testimony offered.</span>
              )}
            </p>

            {/* Evidence details only at ended */}
            {isEnded && suspect.evidence.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gold/10">
                <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-2.5">
                  Marks in the Chronicle
                </p>
                <div className="space-y-2">
                  {suspect.evidence.map((e, i) => (
                    <p key={i} className="font-body text-ember text-sm leading-relaxed italic pl-3 border-l-2 border-ember/25">
                      {e.description}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expand hint */}
        {!expanded && (
          <div className="text-center mt-2">
            <span className="font-body text-base text-iron/45 italic">
              Tap for full testimony
            </span>
          </div>
        )}

        {/* Accuse in expanded */}
        {canAccuse && !isEnded && expanded && (
          <button
            onClick={handleAccuse}
            className="mt-4 w-full py-3 rounded-xl font-cinzel text-sm font-bold tracking-[0.15em] uppercase
              bg-crimson/10 border border-crimson/30 text-crimson-bright
              hover:bg-crimson/20 hover:border-crimson/50
              transition-all duration-300 cursor-pointer relative overflow-hidden group/btn"
          >
            <span className="relative z-10">{theme.copy.accuseVerb}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(SuspectCard);
