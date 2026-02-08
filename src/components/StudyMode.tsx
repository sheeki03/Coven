import { useState, useMemo, useRef } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { usePersonalBests } from '../hooks/usePersonalBests.js';
import { evaluateAllStrikes } from '../engine/contradictions.js';
import type { StrikeDelta } from '../types/index.js';
import TimelineStrip from './TimelineStrip.js';
import OathChips from './OathChips.js';

export default function StudyMode() {
  const { state, puzzle } = useGame();
  const { recordStudyLiarFound } = usePersonalBests();
  const [step, setStep] = useState(0); // 0=clean, 1=rune1, 2=rune2, 3=bestPair
  const [open, setOpen] = useState(false);
  const recordedStudy = useRef(false);

  const locNames = useMemo(() => {
    if (!state.world) return {};
    const m: Record<string, string> = {};
    for (const l of state.world.locations) m[l.id] = l.name;
    return m;
  }, [state.world]);

  const handleToggle = () => {
    if (!open) {
      sessionStorage.setItem('coven:studyOpened', '1');
      // Record study-mode liar found (loss only, once per session)
      if (!state.won && !recordedStudy.current) {
        recordStudyLiarFound();
        recordedStudy.current = true;
      }
    }
    setOpen(!open);
  };

  const maxStep = 3;

  // Compute strikes for each step
  const stepsData = useMemo(() => {
    if (!puzzle || !state.world) return [];

    const deck = state.runeDeck;
    const steps: { label: string; deltas: StrikeDelta[] }[] = [];

    // Step 0: Clean
    steps.push({
      label: 'No runes drawn',
      deltas: state.suspects.map(s => ({ suspectId: s.id, strikes: 0, evidence: [] })),
    });

    // Step 1: First rune
    if (deck.length > 0 && state.drawnCards.length >= 1) {
      const card1 = deck.find(c => c.id === state.drawnCards[0]);
      if (card1) {
        const facts1 = [card1.headline, card1.secondary];
        steps.push({
          label: `After ${card1.name}`,
          deltas: evaluateAllStrikes(
            state.suspects.map(s => ({ id: s.id, claimVector: s.claimVector })),
            facts1, state.world, 'study',
          ),
        });
      }
    }

    // Step 2: Both runes
    if (deck.length > 1 && state.drawnCards.length >= 2) {
      steps.push({
        label: 'After both runes',
        deltas: evaluateAllStrikes(
          state.suspects.map(s => ({ id: s.id, claimVector: s.claimVector })),
          state.revealedFacts, state.world, 'study',
        ),
      });
    }

    // Step 3: Best pair (full picture)
    if (puzzle.solvabilityProof) {
      const bestKey = [...puzzle.solvabilityProof.bestPair].sort().join('+');
      const bestDeltas = puzzle.solvabilityProof.pairRankings[bestKey];
      if (bestDeltas) {
        steps.push({ label: 'Optimal pair revealed', deltas: bestDeltas });
      }
    }

    return steps;
  }, [puzzle, state]);

  if (state.phase !== 'ended') return null;

  const currentDeltas = stepsData[step] ?? stepsData[0];
  if (!currentDeltas) return null;

  const deltaMap = new Map(currentDeltas.deltas.map(d => [d.suspectId, d]));

  return (
    <div className="animate-fade-in-up">
      <button
        onClick={handleToggle}
        className="w-full text-center py-2 font-cinzel text-gold/60 text-xs tracking-[0.15em] uppercase hover:text-gold/80 cursor-pointer transition-colors"
      >
        {open ? 'Hide Study Mode' : 'Study the Chronicle'}
      </button>

      {open && (
        <div className="surface-parchment rounded-xl p-5 mt-2">
          {/* Step controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              disabled={step === 0}
              onClick={() => setStep(s => s - 1)}
              className="px-3 py-1 rounded text-xs font-cinzel text-gold/60 disabled:opacity-30 cursor-pointer hover:text-gold transition-colors"
            >
              ← Prev
            </button>
            <span className="font-cinzel text-parchment/70 text-xs tracking-wider">
              {currentDeltas.label}
            </span>
            <button
              disabled={step >= Math.min(maxStep, stepsData.length - 1)}
              onClick={() => setStep(s => s + 1)}
              className="px-3 py-1 rounded text-xs font-cinzel text-gold/60 disabled:opacity-30 cursor-pointer hover:text-gold transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Reveal All shortcut */}
          {step < stepsData.length - 1 && (
            <button
              onClick={() => setStep(stepsData.length - 1)}
              className="w-full mb-4 py-1.5 rounded-lg text-xs font-cinzel text-gold/50 border border-gold/10 hover:border-gold/25 cursor-pointer transition-colors"
            >
              Reveal All
            </button>
          )}

          {/* Suspect summary */}
          <div className="space-y-3">
            {state.suspects.map(s => {
              const delta = deltaMap.get(s.id);
              const strikes = delta?.strikes ?? 0;
              return (
                <div key={s.id} className={`rounded-lg p-3 border ${
                  strikes >= 2 ? 'border-crimson/25 bg-crimson/5' : strikes === 1 ? 'border-gold/20 bg-gold/5' : 'border-iron/10 bg-surface/20'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-cinzel text-sm font-bold ${
                      s.isLiar ? 'text-crimson-bright' : 'text-parchment/75'
                    }`}>
                      {s.name}
                      {s.isLiar && <span className="ml-1 text-xs text-crimson/60">(LIAR)</span>}
                    </span>
                    <span className={`text-xs font-cinzel ${
                      strikes >= 2 ? 'text-crimson/75' : strikes === 1 ? 'text-gold/65' : 'text-iron/45'
                    }`}>
                      {strikes} strike{strikes !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <TimelineStrip
                    segments={s.claimVector.segments}
                    evidence={delta?.evidence ?? []}
                    hintUsed={state.hintUsed}
                    locationNames={locNames}
                  />

                  <div className="mt-1.5">
                    <OathChips claim={s.claimVector} drawnCount={2} locationNames={locNames} />
                  </div>

                  {(delta?.evidence ?? []).map((e, i) => (
                    <p key={i} className="font-body text-ember/70 text-xs italic mt-1 leading-snug">
                      {e.description}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Score breakdown */}
          <div className="mt-4 pt-3 border-t border-gold/10 text-center">
            <p className="font-cinzel text-gold/50 text-xs tracking-wider mb-1">Final Score</p>
            <p className="font-cinzel-dec text-gold text-3xl font-bold">{state.score}</p>
          </div>
        </div>
      )}
    </div>
  );
}
