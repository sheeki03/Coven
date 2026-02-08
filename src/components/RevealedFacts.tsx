import { useGame } from '../hooks/GameContext.js';
import { useHighlight } from '../hooks/useHighlight.js';
import { ScrollIcon } from './icons/RuneSymbols.js';
import ScratchReveal from './ScratchReveal.js';

const TYPE_STYLES: Record<string, string> = {
  time: 'bg-gold/10 text-gold-bright border-gold/20',
  movement: 'bg-forest/20 text-parchment/85 border-forest/30',
  object: 'bg-ember/10 text-ember border-ember/20',
  environment: 'bg-surface-light text-iron/80 border-iron/20',
};

const TYPE_LABELS: Record<string, string> = {
  time: 'Oath',
  movement: 'Road',
  object: 'Relic',
  environment: 'Sky',
};

export default function RevealedFacts() {
  const { state } = useGame();
  const { highlight, highlightDispatch } = useHighlight();

  if (state.revealedFacts.length === 0) return null;

  const handleFactHover = (index: number | null) => {
    highlightDispatch({ type: 'HOVER_FACT', index });
  };

  const handleFactClick = (index: number) => {
    highlightDispatch({ type: 'PIN_FACT', index });
    // Auto-scroll to first contradicting suspect
    const fact = state.revealedFacts[index];
    if (fact?.targetsSuspects?.length > 0) {
      const targetId = fact.targetsSuspects[0];
      const el = document.getElementById(`suspect-${targetId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="surface-parchment rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <ScrollIcon size={22} className="text-gold/50" />
          <h3 className="font-cinzel text-gold/80 text-base tracking-[0.2em] uppercase">
            Rune Utterances
          </h3>
        </div>

        <div className="space-y-2">
          {state.revealedFacts.map((fact, i) => {
            const style = TYPE_STYLES[fact.type] ?? TYPE_STYLES.environment;
            const label = TYPE_LABELS[fact.type] ?? 'Lore';
            const isPinned = highlight.pinnedFactIndex === i;
            const isHovered = highlight.hoveredFactIndex === i;

            return (
              <ScratchReveal key={i} delay={i * 150}>
                <div
                  className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border cursor-pointer transition-all duration-200
                    ${style}
                    ${isPinned ? 'ring-1 ring-gold/40 shadow-[0_0_8px_rgba(196,163,90,0.1)]' : ''}
                    ${isHovered ? 'brightness-110' : ''}
                  `}
                  onMouseEnter={() => handleFactHover(i)}
                  onMouseLeave={() => handleFactHover(null)}
                  onTouchStart={() => handleFactClick(i)}
                  onClick={() => handleFactClick(i)}
                >
                  <span className="font-cinzel text-xs font-bold tracking-[0.1em] uppercase opacity-70 mt-0.5 shrink-0 w-11">
                    {label}
                  </span>
                  <p className="font-body text-sm sm:text-base leading-relaxed italic">
                    {fact.fact}
                  </p>
                </div>
              </ScratchReveal>
            );
          })}
        </div>

        {/* Clear highlight */}
        {highlight.pinnedFactIndex != null && (
          <button
            onClick={() => highlightDispatch({ type: 'PIN_FACT', index: null })}
            className="mt-2 text-sm font-body text-iron/50 hover:text-gold/70 cursor-pointer transition-colors"
          >
            ✕ Clear highlight
          </button>
        )}
      </div>
    </div>
  );
}
