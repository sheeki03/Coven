import React from 'react';
import type { Segment, Evidence, Bell } from '../types/index.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import HelpTip from './HelpTip.js';

interface Props {
  segments: Segment[];
  evidence?: Evidence[];
  hintUsed?: boolean;
  showMissed?: boolean;
  missedSegmentIndex?: number;
  revealedBells?: number[];   // undefined = show everything (ended)
  openingHeard?: boolean;     // undefined = show everything (ended)
}

function isSegmentTimingRevealed(seg: Segment, revealedBells: number[] | undefined): boolean {
  if (revealedBells === undefined) return true; // ended — show all
  return revealedBells.includes(seg.departBell) && revealedBells.includes(seg.arriveBell);
}

function TimelineStrip({ segments, evidence = [], hintUsed, showMissed, missedSegmentIndex, revealedBells, openingHeard }: Props) {
  const { theme } = useThemeStrict();
  const bellLabels = theme.templates.bellLabelsShort;

  const isFullyRevealed = revealedBells === undefined; // ended phase
  const hasOpening = openingHeard === undefined ? true : openingHeard;

  // Contradiction markers only when fully revealed (ended phase)
  const contradictedSegments = new Set<number>();
  if (isFullyRevealed) {
    for (const e of evidence) {
      if (e.relatedSegmentIndex != null) {
        contradictedSegments.add(e.relatedSegmentIndex);
      }
    }
  }

  // Bell label resolver
  const getBellLabel = (b: Bell): string => {
    if (isFullyRevealed) return bellLabels[b];
    if (!hasOpening) return '?';
    if (revealedBells && revealedBells.includes(b)) return bellLabels[b];
    return '?';
  };

  return (
    <div className="w-full">
      {/* Bell tick labels */}
      <div className="flex items-center px-0.5 mb-1">
        <div className="flex justify-between flex-1">
          {([0, 1, 2, 3, 4, 5] as Bell[]).map(b => (
            <span key={b} className={`text-sm ${theme.visuals.headingFontClass} text-iron/55 w-8 text-center`}>
              {getBellLabel(b)}
            </span>
          ))}
        </div>
        <HelpTip align="right" text="Timeline \u2014 colored bars show where this suspect claims they were at each hour" />
      </div>

      {/* Timeline bar */}
      <div className="relative h-5 bg-surface/50 rounded-full overflow-hidden border border-iron/10">
        {/* Tier 1: Before opening — empty bar with no segments */}
        {!hasOpening && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-iron/25 text-[10px] font-body italic">Hear opening defense to reveal</span>
          </div>
        )}

        {/* Tier 2 & 3: Render segments */}
        {hasOpening && segments.map((seg, i) => {
          const isTravel = seg.from !== seg.to;
          const isContradicted = contradictedSegments.has(i);
          const isMissed = showMissed && missedSegmentIndex === i;
          const timingKnown = isSegmentTimingRevealed(seg, revealedBells);

          // Position: actual position when revealed, uniform blocks when masked
          let left: number;
          let width: number;

          if (timingKnown) {
            // Tier 3: Real positioned widths
            left = (seg.departBell / 5) * 100;
            width = ((seg.arriveBell - seg.departBell) / 5) * 100;
          } else {
            // Tier 2: Uniform-width blocks stacked left-to-right
            const totalSegs = segments.length;
            const segWidth = 100 / totalSegs;
            left = i * segWidth;
            width = segWidth;
          }

          let bg = isTravel ? 'bg-gold/30' : 'bg-gold/15';
          if (!timingKnown) bg = isTravel ? 'bg-iron/15' : 'bg-iron/8';
          if (isContradicted) bg = 'bg-crimson/40';
          if (isMissed) bg = 'bg-crimson/50';
          if (hintUsed && timingKnown && !isContradicted) bg = isTravel ? 'bg-gold/40' : 'bg-gold/25';

          return (
            <div
              key={i}
              className={`absolute top-0 h-full ${bg} transition-all duration-500 ${
                isTravel && timingKnown ? 'bg-stripes' : ''
              }`}
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 2)}%`,
                backgroundImage: isTravel && timingKnown
                  ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(196,163,90,0.15) 2px, rgba(196,163,90,0.15) 4px)'
                  : undefined,
              }}
            >
              {/* Location label in uniform block */}
              {!timingKnown && hasOpening && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <span className="text-iron/35 text-[9px] font-body truncate px-0.5">
                    {seg.from === seg.to ? seg.from : `${seg.from}\u2192${seg.to}`}
                  </span>
                </div>
              )}
              {/* Red X marker (only at ended) */}
              {isContradicted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-crimson-bright text-xs font-bold leading-none">\u2715</span>
                </div>
              )}
              {/* Missed red stamp */}
              {isMissed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-crimson-bright text-xs font-bold leading-none">!</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Gold underline for hint-clarified */}
        {hintUsed && hasOpening && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold/30" />
        )}
      </div>
    </div>
  );
}

export default React.memo(TimelineStrip);
