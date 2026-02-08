import type { ClaimVector, Suspect } from '../types/index.js';
import type { RNG } from '../utils/rng.js';
import type { ThemeTemplates } from '../themes/types.js';
import { createBellFormatter } from '../utils/bells.js';

function resolveTemplate(
  template: string,
  claim: ClaimVector,
  locationNames: Record<string, string>,
  fmtBell: (b: import('../types/index.js').Bell) => string,
): string {
  const seg = claim.segments[0];
  if (!seg) return 'I have nothing to say.';

  const loc1 = locationNames[seg.from] ?? seg.from;
  const loc2 = locationNames[seg.to] ?? seg.to;
  const bell1 = fmtBell(seg.departBell);
  const bell2 = fmtBell(seg.arriveBell);

  return template
    .replace('{loc1}', loc1)
    .replace('{loc2}', loc2)
    .replace('{bell1}', bell1)
    .replace('{bell2}', bell2);
}

export function fallbackGenerate(
  suspects: Suspect[],
  locationNames: Record<string, string>,
  rng: RNG,
  templates: ThemeTemplates,
): Suspect[] {
  const fmtBell = createBellFormatter(templates.bellNames);
  const alibiTemplates = templates.alibiTemplates;
  const hornTemplates = templates.hornTemplates;
  const relicTemplates = templates.relicTemplates;
  const scentTemplates = templates.scentTemplates;

  return suspects.map(suspect => {
    const claim = suspect.claimVector;
    const template = alibiTemplates[Math.abs(hashString(suspect.id + rng.next().toString())) % alibiTemplates.length];
    let alibi = resolveTemplate(template, claim, locationNames, fmtBell);

    // Add horn claim
    if (claim.heardHornAt) {
      const hornTemplate = hornTemplates[Math.abs(hashString(suspect.id + 'horn')) % hornTemplates.length];
      alibi += ' ' + hornTemplate
        .replace('{loc}', locationNames[claim.heardHornAt.where] ?? claim.heardHornAt.where)
        .replace('{bell}', fmtBell(claim.heardHornAt.bell));
    }

    // Add relic claim
    if (claim.carriedRelic) {
      const relicTemplate = relicTemplates[Math.abs(hashString(suspect.id + 'relic')) % relicTemplates.length];
      const capitalizedRelic = claim.carriedRelic.charAt(0).toUpperCase() + claim.carriedRelic.slice(1);
      alibi += ' ' + relicTemplate
        .replace('{Relic}', capitalizedRelic)
        .replace('{relic}', claim.carriedRelic);
    }

    // Add scent claim
    if (claim.sensed) {
      const scentTemplate = scentTemplates[Math.abs(hashString(suspect.id + 'scent')) % scentTemplates.length];
      alibi += ' ' + scentTemplate
        .replace('{loc}', locationNames[claim.sensed.where] ?? claim.sensed.where)
        .replace('{scent}', claim.sensed.scent);
    }

    return { ...suspect, narrativeAlibi: alibi };
  });
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return hash;
}
