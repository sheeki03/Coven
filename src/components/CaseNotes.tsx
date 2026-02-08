import React, { useState, useCallback } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import type { WorldReveal, ContradictionType } from '../types/index.js';

const TYPE_META: Record<ContradictionType, { tag: string; color: string; icon: string }> = {
  time: { tag: 'TIME', color: 'text-gold/80 bg-gold/8 border-gold/15', icon: '\u23F0' },
  movement: { tag: 'TRAVEL', color: 'text-ember/80 bg-ember/8 border-ember/15', icon: '\u2794' },
  object: { tag: 'RELIC', color: 'text-crimson-bright/70 bg-crimson/8 border-crimson/15', icon: '\u2726' },
  environment: { tag: 'SCENT', color: 'text-iron/70 bg-iron/8 border-iron/12', icon: '\u2248' },
};

const MAX_PINS = 3;

export default function CaseNotes() {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const [collapsed, setCollapsed] = useState(true);
  const [pinnedFacts, setPinnedFacts] = useState<number[]>([]);

  const facts = state.revealedFacts;
  const markedSuspects = state.markedSuspects;
  const suspects = state.suspects;

  const togglePin = useCallback((index: number) => {
    setPinnedFacts(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index);
      if (prev.length >= MAX_PINS) return prev;
      return [...prev, index];
    });
  }, []);

  // Don't show if no facts revealed yet
  if (facts.length === 0 && markedSuspects.length === 0) return null;

  // Auto-expand after first rune draw
  const shouldAutoExpand = facts.length > 0 && collapsed;

  return (
    <div className="rounded-xl border border-gold/10 overflow-hidden transition-all duration-300">
      {/* Header — always visible */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface/30 hover:bg-surface/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          {/* Quill icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold/50 shrink-0">
            <path d="M13 1c-2 1-4 4-5 7l-1 3c-.5 1.5-1 2-2 2.5M7 8c-1-1-3-.5-4.5 1M8 8l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className={`${theme.visuals.headingFontClass} text-sm tracking-[0.12em] uppercase text-gold/60`}>
            Case Notes
          </span>
          {facts.length > 0 && (
            <span className="text-iron/35 font-body text-xs">
              {facts.length} fact{facts.length !== 1 ? 's' : ''}
              {markedSuspects.length > 0 && ` \u00B7 ${markedSuspects.length} marked`}
            </span>
          )}
        </div>
        <span className={`text-iron/30 text-sm transition-transform duration-200 ${collapsed && !shouldAutoExpand ? '' : 'rotate-180'}`}>
          \u25BE
        </span>
      </button>

      {/* Expanded content */}
      {(!collapsed || shouldAutoExpand) && (
        <div className="px-4 pb-4 pt-1 space-y-3 animate-ink-reveal">
          {/* Pinned facts bar */}
          {pinnedFacts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gold/8">
              <span className="text-[10px] font-body text-iron/30 uppercase tracking-wider self-center mr-1">Pinned</span>
              {pinnedFacts.map(idx => {
                const f = facts[idx];
                if (!f) return null;
                const meta = TYPE_META[f.type];
                return (
                  <button
                    key={idx}
                    onClick={() => togglePin(idx)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-body border ${meta.color} cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    <span>{meta.icon}</span>
                    <span className="truncate max-w-[140px]">{f.fact.slice(0, 40)}...</span>
                    <span className="text-iron/25 ml-0.5">\u00D7</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Facts list */}
          {facts.length > 0 && (
            <div className="space-y-1.5">
              {facts.map((fact, i) => (
                <FactRow
                  key={i}
                  fact={fact}
                  index={i}
                  isPinned={pinnedFacts.includes(i)}
                  canPin={pinnedFacts.length < MAX_PINS}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          )}

          {/* Marked suspects */}
          {markedSuspects.length > 0 && (
            <div className="pt-2 border-t border-gold/8">
              <span className="text-[10px] font-body text-iron/30 uppercase tracking-wider">Marked Suspects</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {markedSuspects.map(id => {
                  const s = suspects.find(s => s.id === id);
                  if (!s) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-body bg-gold/8 text-gold/70 border border-gold/15"
                    >
                      <span className="text-gold">{'\u2605'}</span>
                      {s.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FactRow({ fact, index, isPinned, canPin, onTogglePin }: {
  fact: WorldReveal;
  index: number;
  isPinned: boolean;
  canPin: boolean;
  onTogglePin: (i: number) => void;
}) {
  const meta = TYPE_META[fact.type];
  const [justToggled, setJustToggled] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(index);
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 400);
  };

  return (
    <div className={`flex items-start gap-2 px-2.5 py-2 rounded-lg transition-all duration-300 ${
      isPinned ? 'bg-gold/6 border border-gold/15 shadow-[0_0_8px_rgba(196,163,90,0.06)]' : 'border border-transparent hover:bg-surface/30'
    }`}>
      {/* Type tag */}
      <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-body border ${meta.color} uppercase tracking-wider`}>
        {meta.icon} {meta.tag}
      </span>

      {/* Fact text */}
      <p className={`flex-1 font-body text-sm leading-relaxed min-w-0 transition-colors duration-300 ${
        isPinned ? 'text-parchment/80' : 'text-parchment/65'
      }`}>
        {fact.fact}
      </p>

      {/* Pin button */}
      <button
        onClick={handleToggle}
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer
          transition-all duration-300 ${
          isPinned
            ? 'bg-gold/18 text-gold/80 shadow-[0_0_6px_rgba(196,163,90,0.2)] hover:bg-gold/25'
            : canPin
              ? 'text-iron/25 hover:text-gold/60 hover:bg-gold/5'
              : 'text-iron/10 cursor-not-allowed'
        } ${justToggled ? 'scale-125' : 'scale-100'}`}
        title={isPinned ? 'Unpin' : canPin ? 'Pin fact' : 'Max 3 pins'}
        disabled={!isPinned && !canPin}
      >
        {isPinned ? '📌' : '○'}
      </button>
    </div>
  );
}
