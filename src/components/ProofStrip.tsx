import type { GameState, SolvabilityProof, RuneCard } from '../types/index.js';
import { RuneOaths, RuneRoads, RuneRelics, RuneSkies } from './icons/RuneSymbols.js';
import TimelineStrip from './TimelineStrip.js';

const RUNE_ICONS: Record<string, typeof RuneOaths> = {
  oaths: RuneOaths,
  roads: RuneRoads,
  relics: RuneRelics,
  skies: RuneSkies,
};

interface Props {
  state: GameState;
  proof: SolvabilityProof;
}

export default function ProofStrip({ state, proof }: Props) {
  const bestPairKey = [...proof.bestPair].sort().join('+');
  const bestExplanation = proof.pairExplanations[bestPairKey];
  const bestDeltas = proof.pairRankings[bestPairKey];
  const drawnCards = state.drawnCards
    .map(id => state.runeDeck.find(c => c.id === id))
    .filter((c): c is RuneCard => !!c);

  const liar = state.suspects.find(s => s.isLiar);
  const won = state.won;

  // Build one-line explanation from triggered checks
  const checkLabels: Record<string, string> = {
    time: 'Bell contradiction',
    movement: 'Road time impossible',
    object: 'Relic mismatch',
    environment: 'Sense contradiction',
  };

  const triggerLine = bestExplanation
    ? bestExplanation.triggeredChecks.map(c => checkLabels[c] || c).join(' + ')
    : '';

  // For losses: find what evidence the player missed from bestPair
  const liarDelta = bestDeltas?.find(d => d.suspectId === liar?.id);
  const missedEvidence = !won && liarDelta?.evidence?.[0];

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        {won ? 'Proof of Fairness' : 'What You Missed'}
      </p>

      {/* Rune cards drawn → arrow → contradiction */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {drawnCards.map((card, i) => {
          const Icon = RUNE_ICONS[card.archetype] ?? RuneOaths;
          return (
            <div key={card.id} className="flex items-center gap-2">
              {i > 0 && <span className="text-iron/30 text-xs">+</span>}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gold/8 border border-gold/15">
                <Icon size={14} className="text-gold/60" />
                <span className="font-cinzel text-parchment/70 text-xs tracking-wider">{card.name.replace('Rune of ', '')}</span>
              </div>
            </div>
          );
        })}
        <span className="text-gold/40 text-xs">→</span>
        <span className="font-cinzel text-parchment/60 text-xs tracking-wider">
          {triggerLine || 'Multiple contradictions'}
        </span>
      </div>

      {/* On loss: show the liar's timeline with red stamp on missed segment */}
      {!won && liar && (
        <div className="mb-3 p-2.5 rounded-lg bg-crimson/5 border border-crimson/15">
          <p className="font-cinzel text-crimson-bright/80 text-xs tracking-wider mb-1.5">
            The one thing you missed:
          </p>
          <div className="mb-1.5">
            <TimelineStrip
              segments={liar.claimVector.segments}
              evidence={liarDelta?.evidence ?? liar.evidence}
              hintUsed={state.hintUsed}
            />
          </div>
          {missedEvidence && (
            <p className="font-body text-ember/80 text-xs italic leading-snug">
              {missedEvidence.description}
            </p>
          )}
        </div>
      )}

      {/* Win: show proof chain */}
      {won && liar && (
        <div className="mb-2 p-2.5 rounded-lg bg-forest/5 border border-forest/15">
          <p className="font-body text-parchment/65 text-sm leading-relaxed">
            <span className="text-forest-bright font-bold">{liar.name}</span> had{' '}
            <span className="text-gold font-bold">{bestExplanation?.liarStrikes ?? liar.strikes}</span> strikes
            {bestExplanation && bestExplanation.runnerUpStrikes > 0 && (
              <>, runner-up had {bestExplanation.runnerUpStrikes}</>
            )}
          </p>
        </div>
      )}

      {bestExplanation && bestExplanation.separationMargin > 0 && (
        <p className="font-body text-iron/35 text-xs mt-1 italic">
          Separation margin: +{bestExplanation.separationMargin} — unambiguously solvable
        </p>
      )}
    </div>
  );
}
