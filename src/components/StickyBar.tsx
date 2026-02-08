import { useGame } from '../hooks/GameContext.js';
import { getVisibility } from '../utils/uiVisibility.js';
import DrawSlots from './DrawSlots.js';
import HintButton from './HintButton.js';

interface Props {
  onAccuseTop: () => void;
  onChooseAnyone: () => void;
}

export default function StickyBar({ onAccuseTop: _onAccuseTop, onChooseAnyone }: Props) {
  const { state, canDraw } = useGame();
  const vis = getVisibility(state.drawnCards.length, state.phase);

  if (state.phase === 'ended' || state.phase === 'accusing') return null;

  const showExtraDraw = vis.showExtraDrawOption && canDraw;

  return (
    <div id="tutorial-sticky" className="fixed bottom-0 left-0 right-0 z-40 bg-bg-deep/95 backdrop-blur-md border-t border-gold/10 pb-safe">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Draw slots compact */}
        <div className="flex-1 min-w-0">
          <DrawSlots compact />
        </div>

        {/* Hint */}
        <HintButton compact />

        {/* Council Favors indicator — 6 dots */}
        {state.interrogationTokens < 6 && state.phase === 'investigating' && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-cinzel text-iron/40 text-[10px] tracking-wider uppercase">Favors</span>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < state.interrogationTokens ? 'bg-crimson/60 shadow-[0_0_4px_rgba(139,26,26,0.3)]' : 'bg-iron/15'}`} />
            ))}
          </div>
        )}

        {/* Generic "Make Accusation" button */}
        {vis.showAccuse && (
          <button
            onClick={onChooseAnyone}
            className="px-5 py-2.5 rounded-xl font-cinzel text-sm tracking-[0.1em] uppercase
              bg-crimson/15 border border-crimson/30 text-crimson-bright
              hover:bg-crimson/25 hover:border-crimson/50
              hover:shadow-[0_0_16px_rgba(139,26,26,0.15)]
              transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            Make Accusation
          </button>
        )}
      </div>

      {/* Extra draw warning bar */}
      {showExtraDraw && (
        <div className="max-w-5xl mx-auto px-4 pb-1.5">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-ember/8 border border-ember/15">
            <span className="text-ember/80 text-sm font-cinzel tracking-wider uppercase">
              {state.drawnCards.length === 2 ? '3rd rune: -160 pts, Mercy max' : '4th rune: -240 pts'}
            </span>
            <span className="text-iron/35 text-sm font-body italic">Draw above to risk it</span>
          </div>
        </div>
      )}
    </div>
  );
}
