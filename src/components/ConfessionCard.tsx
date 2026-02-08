import type { Suspect, SolvabilityProof } from '../types/index.js';
import TimelineStrip from './TimelineStrip.js';

interface Props {
  liar: Suspect;
  proof: SolvabilityProof;
}

const CONFESSIONS = [
  'I thought one lie would be enough to hide.',
  'The bells betrayed what my words could not.',
  'I swore falsely and the runes knew.',
  'My path was a fiction — the roads remember.',
  'The Watch sees all. I should have known.',
];

export default function ConfessionCard({ liar, proof }: Props) {
  const confessionIdx = liar.name.length % CONFESSIONS.length;
  const confession = CONFESSIONS[confessionIdx];

  // Find the missed segment from best pair evidence
  const bestPairKey = [...proof.bestPair].sort().join('+');
  const pairRanking = proof.pairRankings[bestPairKey];
  const liarDelta = pairRanking?.find(d => d.suspectId === liar.id);
  const missedEvidence = liarDelta?.evidence.find(e => e.relatedSegmentIndex != null);
  const missedSegmentIndex = missedEvidence?.relatedSegmentIndex;

  return (
    <div className="surface-parchment border border-gold/15 rounded-xl p-5 animate-fade-in-up">
      {/* Confession */}
      <div className="text-center mb-4">
        <span className="font-cinzel-dec text-3xl text-gold/20 leading-none">&ldquo;</span>
        <p className="font-body text-parchment/80 text-base italic leading-relaxed px-4">
          {confession}
        </p>
        <span className="font-cinzel-dec text-3xl text-gold/20 leading-none">&rdquo;</span>
        <p className="font-cinzel text-iron/40 text-xs tracking-wider mt-1">— {liar.name}</p>
      </div>

      {/* "You missed this" */}
      {missedSegmentIndex != null && (
        <div className="border-t border-gold/10 pt-3">
          <p className="font-cinzel text-crimson/70 text-xs tracking-[0.15em] uppercase mb-2">
            You missed this
          </p>
          <TimelineStrip
            segments={liar.claimVector.segments}
            showMissed
            missedSegmentIndex={missedSegmentIndex}
          />
          {missedEvidence && (
            <p className="font-body text-ember/80 text-sm italic mt-2 leading-snug">
              {missedEvidence.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
