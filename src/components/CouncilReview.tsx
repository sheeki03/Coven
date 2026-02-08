import { useGame } from '../hooks/GameContext.js';

export default function CouncilReview() {
  const { state, puzzle } = useGame();

  if (state.phase !== 'ended' || !puzzle) return null;

  const proof = puzzle.solvabilityProof;
  const bestKey = [...proof.bestPair].sort().join('+');
  const bestExplanation = proof.pairExplanations[bestKey];

  const bestCards = proof.bestPair
    .map(id => state.runeDeck.find(c => c.id === id))
    .filter(Boolean);

  const playerCards = state.drawnCards
    .map(id => state.runeDeck.find(c => c.id === id))
    .filter(Boolean);

  const liar = state.suspects.find(s => s.isLiar);

  // Build bullets
  const bullets: string[] = [];

  // Bullet 1: Best pair
  if (bestCards.length === 2) {
    bullets.push(
      `Best pair today: ${bestCards[0]!.name} + ${bestCards[1]!.name}`
    );
  }

  // Bullet 2: Your runes
  if (playerCards.length > 0) {
    bullets.push(
      `Your runes: ${playerCards.map(c => c!.name.replace('Rune of ', '')).join(' + ')}`
    );
  }

  // Bullet 3: Advice
  if (!state.won && liar && bestExplanation) {
    const liarDelta = proof.pairRankings[bestKey]?.find(d => d.suspectId === liar.id);
    if (liarDelta && liarDelta.evidence.length > 0) {
      const firstEvidence = liarDelta.evidence[0];
      const segment = liar.claimVector.segments.find((_s, i) => firstEvidence.relatedSegmentIndex === i);
      if (segment) {
        bullets.push(
          `You could have caught ${liar.name} by checking the ${segment.from}${segment.from !== segment.to ? ` → ${segment.to}` : ''} segment`
        );
      } else {
        bullets.push(
          `${liar.name}'s ${firstEvidence.type} claim was the key contradiction`
        );
      }
    }
  } else if (state.won && bestExplanation) {
    const margin = bestExplanation.separationMargin;
    if (margin >= 2) {
      bullets.push('Clear separation — this was a clean solve');
    } else {
      bullets.push('Tight margins — well spotted');
    }
  }

  if (bullets.length === 0) return null;

  return (
    <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
      <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">
        Council Review
      </p>
      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gold/40 text-xs mt-0.5 shrink-0">&#x2022;</span>
            <span className="font-body text-parchment/70 text-sm leading-relaxed italic">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
