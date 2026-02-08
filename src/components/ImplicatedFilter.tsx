import { useState, useEffect } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useHighlight } from '../hooks/useHighlight.js';

export default function ImplicatedFilter() {
  const { state } = useGame();
  const { highlightDispatch } = useHighlight();
  const [lastDrawCount, setLastDrawCount] = useState(state.drawnCards.length);
  const [showButton, setShowButton] = useState(false);
  const [autoPinTimer, setAutoPinTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state.drawnCards.length > lastDrawCount && state.drawnCards.length >= 1) {
      setShowButton(true);
      // Auto-hide after 8 seconds if not clicked
      const timer = setTimeout(() => setShowButton(false), 8000);
      setLastDrawCount(state.drawnCards.length);
      return () => clearTimeout(timer);
    }
    setLastDrawCount(state.drawnCards.length);
  }, [state.drawnCards.length, lastDrawCount]);

  if (!showButton || state.phase !== 'investigating') return null;

  // Find suspects impacted by the last drawn rune
  const lastCardId = state.drawnCards[state.drawnCards.length - 1];
  const lastCard = state.runeDeck.find(c => c.id === lastCardId);
  if (!lastCard) return null;

  const implicatedIds = new Set([
    ...lastCard.headline.targetsSuspects,
    ...lastCard.secondary.targetsSuspects,
  ]);

  const implicatedSuspects = state.suspects.filter(s => implicatedIds.has(s.id));
  if (implicatedSuspects.length === 0) return null;

  const handleClick = () => {
    // Auto-pin top 2 implicated suspects for 5s
    const topTwo = implicatedSuspects
      .sort((a, b) => b.strikes - a.strikes)
      .slice(0, 2);

    for (const s of topTwo) {
      highlightDispatch({ type: 'TOGGLE_PIN_SUSPECT', id: s.id });
    }

    // Filter to condemned/suspect view
    if (implicatedSuspects.some(s => s.strikes >= 2)) {
      highlightDispatch({ type: 'SET_SUSPICION_FILTER', filter: 'condemned' });
    } else if (implicatedSuspects.some(s => s.strikes >= 1)) {
      highlightDispatch({ type: 'SET_SUSPICION_FILTER', filter: 'suspect' });
    }

    // Auto-unpin after 5 seconds unless user pins differently
    if (autoPinTimer) clearTimeout(autoPinTimer);
    const timer = setTimeout(() => {
      for (const s of topTwo) {
        highlightDispatch({ type: 'TOGGLE_PIN_SUSPECT', id: s.id });
      }
      highlightDispatch({ type: 'SET_SUSPICION_FILTER', filter: 'all' });
    }, 5000);
    setAutoPinTimer(timer);

    setShowButton(false);
  };

  return (
    <div className="flex justify-center animate-fade-in-up">
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-lg font-cinzel text-xs tracking-wider
          bg-gold/10 border border-gold/20 text-gold/80
          hover:bg-gold/15 hover:border-gold/35 cursor-pointer transition-all duration-300"
      >
        Show who this implicates ({implicatedSuspects.length})
      </button>
    </div>
  );
}
