import type { QuestionCardType } from '../types/index.js';
import type { Suspect } from '../types/index.js';
import { getAllowedTargets } from '../engine/interrogation.js';
import { useInterrogation } from '../hooks/useInterrogation.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';

interface Props {
  suspect: Suspect;
  tokensLeft: number;
}

interface CardDef {
  type: QuestionCardType;
  label: string;
  icon: string;
  needsTarget: boolean;
}

const CARDS: CardDef[] = [
  { type: 'bell_probe', label: 'Bell', icon: '\u{1F514}', needsTarget: true },
  { type: 'route_probe', label: 'Route', icon: '\u{1F6E4}', needsTarget: true },
  { type: 'anchor_probe', label: 'Horn', icon: '\u{1F4EF}', needsTarget: false },
  { type: 'object_probe', label: 'Relic', icon: '\u{1F48E}', needsTarget: false },
  { type: 'sense_probe', label: 'Sense', icon: '\u{1F32C}', needsTarget: true },
  { type: 'witness_probe', label: 'Witness', icon: '\u{1F441}', needsTarget: false },
  { type: 'consistency', label: 'Consistency', icon: '\u{1F4DC}', needsTarget: false },
  { type: 'detail_trap', label: 'Detail Trap', icon: '\u{1F50D}', needsTarget: true },
];

export default function QuestionCards({ suspect, tokensLeft }: Props) {
  const { interrogation, selectCard, confirmTarget, clearCard } = useInterrogation();
  const { theme } = useThemeStrict();
  const isPickingTarget = interrogation.phase === 'picking_target';
  const activeCard = interrogation.activeCardType;
  const disabled = tokensLeft <= 0;

  return (
    <div>
      {/* Card grid — 2x4 with generous sizing */}
      {!isPickingTarget && (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {CARDS.map(card => (
            <button
              key={card.type}
              onClick={() => !disabled && selectCard(card.type)}
              disabled={disabled}
              className={`
                flex flex-col items-center justify-center gap-1.5 px-2 py-3 sm:py-4
                rounded-xl border text-center
                transition-all duration-200 cursor-pointer
                ${disabled
                  ? 'border-iron/10 text-iron/30 opacity-40 cursor-not-allowed'
                  : 'border-gold/15 text-gold/70 hover:border-gold/35 hover:bg-gold/5 hover:text-gold hover:shadow-[0_0_12px_rgba(196,163,90,0.06)] active:scale-95'
                }
              `}
            >
              <span className="text-xl sm:text-2xl">{card.icon}</span>
              <span className="font-cinzel text-[10px] sm:text-xs tracking-wider leading-tight">{card.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Targeting sub-picker */}
      {isPickingTarget && activeCard && (
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <span className="font-cinzel text-gold/70 text-sm tracking-wider">
              {CARDS.find(c => c.type === activeCard)?.label} — Choose target
            </span>
            <button
              onClick={clearCard}
              className="
                text-iron/50 hover:text-iron/70 text-sm font-body
                px-3 py-1 rounded-lg border border-iron/15 hover:border-iron/25
                cursor-pointer transition-all
              "
            >
              Back
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {getAllowedTargets(suspect, activeCard, theme.templates).map(slot => (
              <button
                key={slot.slotIndex}
                onClick={() => confirmTarget(slot.slotIndex)}
                className="
                  px-4 py-2.5 rounded-xl border border-gold/20 text-gold/70
                  font-cinzel text-sm tracking-wider
                  hover:border-gold/40 hover:bg-gold/8 hover:text-gold
                  hover:shadow-[0_0_12px_rgba(196,163,90,0.06)]
                  cursor-pointer transition-all active:scale-95
                "
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {disabled && (
        <p className="text-center font-body text-iron/45 text-sm italic mt-3">
          No Council Favors remain.
        </p>
      )}
    </div>
  );
}
