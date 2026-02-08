import { useState } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { getVisibility } from '../utils/uiVisibility.js';
import { RuneOaths, RuneRoads, RuneRelics, RuneSkies } from './icons/RuneSymbols.js';
import HelpTip from './HelpTip.js';
import type { RuneArchetype } from '../types/index.js';

const RUNE_ICONS: Record<string, typeof RuneOaths> = {
  oaths: RuneOaths,
  roads: RuneRoads,
  relics: RuneRelics,
  skies: RuneSkies,
};

interface Props {
  compact?: boolean;
}

export default function DrawSlots({ compact }: Props) {
  const { state, canDraw, dispatch } = useGame();
  const { theme } = useThemeStrict();
  const [flipping, setFlipping] = useState<string | null>(null);
  const vis = getVisibility(state.drawnCards.length);

  if (state.phase === 'ended' || state.phase === 'accusing') return null;

  const drawn = state.drawnCards.length;
  const remaining = drawn < 2 ? 2 - drawn : 4 - drawn;
  const isExtraDraw = drawn >= 2;

  const handleDraw = (cardId: string) => {
    if (!canDraw) return;
    setFlipping(cardId);
    setTimeout(() => {
      dispatch({ type: 'DRAW_CARD', cardId });
      setFlipping(null);
    }, 200);
  };

  // Compact mode for StickyBar
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${vis.showDrawPulse ? 'animate-gold-pulse rounded-lg' : ''}`}>
        {state.runeDeck.map((card) => {
          const isDrawn = state.drawnCards.includes(card.id);
          const isFlipping = flipping === card.id;
          const Icon = RUNE_ICONS[card.archetype] ?? RuneOaths;

          return (
            <button
              key={card.id}
              disabled={isDrawn || !canDraw}
              onClick={() => handleDraw(card.id)}
              className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer
                ${isFlipping ? 'animate-card-flip' : ''}
                ${isDrawn
                  ? 'opacity-30 bg-surface/30'
                  : canDraw
                    ? 'bg-surface-light/60 border border-gold/15 hover:border-gold/40'
                    : 'opacity-20 cursor-not-allowed'
                }
              `}
              title={card.name}
            >
              <Icon size={22} className={isDrawn ? 'text-gold/30' : 'text-gold/80'} />
            </button>
          );
        })}
        {remaining > 0 && canDraw && (
          <span className={`text-xs font-body italic whitespace-nowrap ${isExtraDraw ? 'text-ember/70' : 'text-gold-dim/70'}`}>
            {vis.showDrawPulse ? 'Draw a rune' : isExtraDraw ? 'Risk it?' : `${remaining} left`}
          </span>
        )}
        {drawn >= 4 && (
          <span className="text-xs font-body text-iron/40 italic whitespace-nowrap">All drawn</span>
        )}
      </div>
    );
  }

  // Full mode (shown in left panel on desktop)
  return (
    <div id="tutorial-draw" className="animate-fade-in-up">
      <div className="surface-parchment rounded-xl p-5 ornate-corners">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`flex items-center ${theme.visuals.headingFontClass} text-gold/80 text-base tracking-[0.2em] uppercase`}>
            {theme.copy.drawSectionTitle}
            <HelpTip size="md" text="Draw cards to reveal evidence about the suspects. Each card uncovers different clues — look for contradictions!" />
          </h3>
          <span className={`font-body text-base italic ${isExtraDraw && remaining > 0 ? 'text-ember/70' : 'text-gold-dim/70'}`}>
            {remaining > 0 && !isExtraDraw ? `Draw ${remaining}` : remaining > 0 && isExtraDraw ? 'Press your luck?' : 'All drawn'}
          </span>
        </div>

        <div className={`grid grid-cols-4 gap-2 ${vis.showDrawPulse ? 'animate-gold-pulse rounded-lg' : ''}`}>
          {state.runeDeck.map((card) => {
            const isDrawn = state.drawnCards.includes(card.id);
            const isFlipping = flipping === card.id;
            const Icon = RUNE_ICONS[card.archetype] ?? RuneOaths;

            return (
              <button
                key={card.id}
                disabled={isDrawn || !canDraw}
                onClick={() => handleDraw(card.id)}
                className={`
                  relative group rounded-lg p-2 flex flex-col items-center gap-1 transition-all duration-500 cursor-pointer overflow-hidden
                  ${isFlipping ? 'animate-card-flip' : ''}
                  ${isDrawn
                    ? 'bg-surface/40 border border-gold/15 opacity-50'
                    : canDraw
                      ? 'bg-gradient-to-b from-surface-light/80 to-surface/60 border border-gold/15 hover:border-gold/40 hover:shadow-[0_0_20px_rgba(196,163,90,0.12)] hover:-translate-y-0.5'
                      : 'bg-surface/30 border border-iron/10 opacity-30 cursor-not-allowed'
                  }
                `}
              >
                {canDraw && !isDrawn && (
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(196,163,90,0.06) 45%, rgba(196,163,90,0.1) 50%, rgba(196,163,90,0.06) 55%, transparent 60%)',
                        backgroundSize: '200% 100%',
                        animation: 'cardShimmer 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}

                <Icon size={36} className={`transition-colors duration-300 ${isDrawn ? 'text-gold/30' : 'text-gold/80 group-hover:text-gold'}`} />

                <span className={`${theme.visuals.headingFontClass} text-[9px] tracking-normal text-parchment/75 uppercase text-center leading-tight break-words line-clamp-2 w-full`}>
                  {card.name.replace('Rune of ', '').replace('Dossier: ', '').replace('File: ', '')}
                </span>

                {!isDrawn && canDraw && (
                  <span className="font-body text-[8px] text-iron/60 italic hidden md:block text-center leading-tight break-words line-clamp-2 w-full">
                    {theme.templates.runeNames[card.archetype as RuneArchetype]?.description ?? ''}
                  </span>
                )}

                {isDrawn && (
                  <span className={`${theme.visuals.headingFontClass} text-xs text-gold/40 tracking-[0.15em] uppercase`}>
                    {theme.copy.drawnLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {vis.showDrawPulse && (
          <p className="text-center mt-3 font-body text-gold/70 text-base italic animate-breathe">
            {theme.copy.drawPrompt}
          </p>
        )}
      </div>
    </div>
  );
}
