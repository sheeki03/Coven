import React from 'react';
import type { ClaimVector, RevealedClaimDetail } from '../types/index.js';
import { formatBell } from '../utils/bells.js';
import { getVisibility } from '../utils/uiVisibility.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';

interface Props {
  claim: ClaimVector;
  drawnCount: number;
  revealedClaims?: RevealedClaimDetail;
}

const TYPE_COLORS: Record<string, string> = {
  segment: 'bg-gold/10 text-gold-bright/80 border-gold/15',
  'segment-masked': 'bg-iron/6 text-iron/50 border-iron/10',
  horn: 'bg-gold/8 text-gold/80 border-gold/12',
  relic: 'bg-ember/10 text-ember/90 border-ember/15',
  scent: 'bg-iron/10 text-iron/80 border-iron/15',
};

function isTimingRevealed(departBell: number, arriveBell: number, rc: RevealedClaimDetail): boolean {
  return rc.route || (rc.bells.includes(departBell) && rc.bells.includes(arriveBell));
}

function OathChips({ claim, drawnCount, revealedClaims }: Props) {
  const { theme } = useThemeStrict();
  const bellNames = theme.templates.bellNames;
  const vis = getVisibility(drawnCount);
  const chips: { key: string; label: string; type: string; secondary?: boolean }[] = [];

  const rc = revealedClaims; // undefined = show everything (ended / unmasked)

  // Segment chips
  for (let i = 0; i < claim.segments.length; i++) {
    const seg = claim.segments[i];

    // Tier 1: Before opening defense — hide everything
    if (rc && !rc.openingHeard) {
      chips.push({ key: `seg-${i}`, label: '[Unknown] (?–?)', type: 'segment-masked' });
      continue;
    }

    // Tier 3: Timing revealed (both endpoints or route)
    if (!rc || isTimingRevealed(seg.departBell, seg.arriveBell, rc)) {
      const fromBell = formatBell(seg.departBell, bellNames);
      const toBell = formatBell(seg.arriveBell, bellNames);
      if (seg.from === seg.to) {
        chips.push({ key: `seg-${i}`, label: `At ${seg.from} (${fromBell}–${toBell})`, type: 'segment' });
      } else {
        chips.push({ key: `seg-${i}`, label: `${seg.from} \u2192 ${seg.to} (${fromBell}–${toBell})`, type: 'segment' });
      }
      continue;
    }

    // Tier 2: After opening, timing unknown — show locations, mask timing
    if (seg.from === seg.to) {
      chips.push({ key: `seg-${i}`, label: `At ${seg.from} (?–?)`, type: 'segment-masked' });
    } else {
      chips.push({ key: `seg-${i}`, label: `${seg.from} \u2192 ${seg.to} (?–?)`, type: 'segment-masked' });
    }
  }

  // Secondary chips — gated by specific probe type
  if (claim.carriedRelic) {
    const show = !rc || rc.object;
    if (show) {
      chips.push({ key: 'relic', label: `Carried ${claim.carriedRelic}`, type: 'relic', secondary: true });
    }
  }
  if (claim.sensed) {
    const show = !rc || rc.sense;
    if (show) {
      chips.push({ key: 'scent', label: `Sensed ${claim.sensed.scent}`, type: 'scent', secondary: true });
    }
  }
  if (claim.heardHornAt) {
    const show = !rc || rc.anchor;
    if (show) {
      chips.push({ key: 'horn', label: `Heard horn (${formatBell(claim.heardHornAt.bell, bellNames)})`, type: 'horn', secondary: true });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => {
        if (chip.secondary && !vis.showSecondaryChips && rc !== undefined) return null;
        const color = TYPE_COLORS[chip.type] ?? TYPE_COLORS.segment;
        return (
          <span
            key={chip.key}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-base font-body border ${color} transition-opacity duration-300`}
          >
            {chip.label}
          </span>
        );
      })}
    </div>
  );
}

export default React.memo(OathChips);
