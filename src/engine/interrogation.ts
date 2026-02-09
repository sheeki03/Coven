/**
 * Deterministic interrogation engine.
 * generateAnswerSpec() is PURE: seeded RNG, no LLM, no revealedFacts.
 * Only references suspect.claimVector + world public info.
 */

import type {
  Temperament, QuestionCardType, AnswerSpec,
  TemperamentBands, ClaimVector, WorldModel, Suspect,
  Bell,
} from '../types/index.js';
import type { ThemeTemplates } from '../themes/types.js';
import { createBellFormatter } from '../utils/bells.js';

// --- Temperament assignment (independent of guilt) ---

const TEMPERAMENTS: Temperament[] = ['timid', 'arrogant', 'annoyed', 'talkative', 'clipped', 'poetic'];

export function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return hash;
}

export function getTemperament(seed: number, suspectId: string): Temperament {
  return TEMPERAMENTS[Math.abs(hashString(String(seed) + suspectId)) % TEMPERAMENTS.length];
}

// --- Temperament bands (word count + refusal probability per pressure) ---

const BANDS: Record<Temperament, Record<number, TemperamentBands>> = {
  timid:     { 0: { wordRange: { min: 20, max: 35 }, refusalProb: 0.00 }, 1: { wordRange: { min: 15, max: 30 }, refusalProb: 0.00 }, 2: { wordRange: { min: 12, max: 25 }, refusalProb: 0.03 }, 3: { wordRange: { min: 10, max: 20 }, refusalProb: 0.05 } },
  arrogant:  { 0: { wordRange: { min: 15, max: 30 }, refusalProb: 0.00 }, 1: { wordRange: { min: 12, max: 25 }, refusalProb: 0.00 }, 2: { wordRange: { min: 10, max: 22 }, refusalProb: 0.05 }, 3: { wordRange: { min: 8, max: 18 }, refusalProb: 0.08 } },
  annoyed:   { 0: { wordRange: { min: 12, max: 25 }, refusalProb: 0.00 }, 1: { wordRange: { min: 10, max: 22 }, refusalProb: 0.00 }, 2: { wordRange: { min: 8, max: 18 }, refusalProb: 0.04 }, 3: { wordRange: { min: 6, max: 15 }, refusalProb: 0.07 } },
  talkative: { 0: { wordRange: { min: 30, max: 50 }, refusalProb: 0.00 }, 1: { wordRange: { min: 25, max: 45 }, refusalProb: 0.00 }, 2: { wordRange: { min: 20, max: 38 }, refusalProb: 0.02 }, 3: { wordRange: { min: 15, max: 30 }, refusalProb: 0.03 } },
  clipped:   { 0: { wordRange: { min: 8, max: 18 }, refusalProb: 0.00 }, 1: { wordRange: { min: 6, max: 15 }, refusalProb: 0.00 }, 2: { wordRange: { min: 5, max: 12 }, refusalProb: 0.04 }, 3: { wordRange: { min: 4, max: 10 }, refusalProb: 0.06 } },
  poetic:    { 0: { wordRange: { min: 25, max: 45 }, refusalProb: 0.00 }, 1: { wordRange: { min: 20, max: 38 }, refusalProb: 0.00 }, 2: { wordRange: { min: 15, max: 30 }, refusalProb: 0.03 }, 3: { wordRange: { min: 12, max: 25 }, refusalProb: 0.05 } },
};

export function getBands(temperament: Temperament, pressure: number): TemperamentBands {
  return BANDS[temperament][Math.min(3, pressure)] ?? BANDS[temperament][0];
}

// --- Per-answer seeded RNG (order-independent) ---

function answerSeed(seed: number, suspectId: string, cardType: string, pressure: number, targetKey: string): number {
  return Math.abs(hashString(`${seed}:${suspectId}:${cardType}:${pressure}:${targetKey}`));
}

function seededFloat(s: number): number {
  let state = s | 0;
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// --- Targeting ---

export interface TargetSlot {
  label: string;
  slotIndex: number;
}

/**
 * Always returns constant-shape picker.
 * Bell: 6 slots (all bells, always enabled).
 * Route/Sense: 3 slots with wrapping.
 */
export function getAllowedTargets(
  _suspect: Suspect,
  cardType: QuestionCardType,
  templates?: ThemeTemplates,
): TargetSlot[] {
  const bellNames = templates?.bellNames;
  switch (cardType) {
    case 'bell_probe':
      return [
        { label: bellNames?.[0] ?? 'First Bell', slotIndex: 0 },
        { label: bellNames?.[1] ?? 'Second Bell', slotIndex: 1 },
        { label: bellNames?.[2] ?? 'Third Bell', slotIndex: 2 },
        { label: bellNames?.[3] ?? 'Fourth Bell', slotIndex: 3 },
        { label: bellNames?.[4] ?? 'Fifth Bell', slotIndex: 4 },
        { label: bellNames?.[5] ?? 'Sixth Bell', slotIndex: 5 },
      ];
    case 'route_probe':
      return [
        { label: 'Route 1', slotIndex: 0 },
        { label: 'Route 2', slotIndex: 1 },
        { label: 'Route 3', slotIndex: 2 },
      ];
    case 'sense_probe':
    case 'detail_trap':
      return [
        { label: 'Stop 1', slotIndex: 0 },
        { label: 'Stop 2', slotIndex: 1 },
        { label: 'Stop 3', slotIndex: 2 },
      ];
    default:
      return [];
  }
}

/** Build canonical target key for cache/seed: e.g. "b:2", "r:0", "s:1" */
export function canonicalTargetKey(cardType: QuestionCardType, slotIndex?: number): string {
  if (slotIndex == null) return cardType;
  switch (cardType) {
    case 'bell_probe': return `b:${slotIndex}`;
    case 'route_probe': return `r:${slotIndex}`;
    case 'sense_probe':
    case 'detail_trap': return `s:${slotIndex}`;
    default: return cardType;
  }
}

/** Resolve abstract slot index to real claim data using wrapping. */
function resolveSlotToSegment(claim: ClaimVector, slotIndex: number): { from: string; to: string; departBell: Bell; arriveBell: Bell } | null {
  const segs = claim.segments;
  if (segs.length === 0) return null;
  const wrapped = slotIndex % segs.length;
  return segs[wrapped];
}

function resolveSlotToLocation(claim: ClaimVector, slotIndex: number, world: WorldModel): string | null {
  const locs: string[] = [];
  for (const seg of claim.segments) {
    if (!locs.includes(seg.from)) locs.push(seg.from);
    if (!locs.includes(seg.to)) locs.push(seg.to);
  }
  if (locs.length === 0) return null;
  const wrapped = slotIndex % locs.length;
  const locId = locs[wrapped];
  return world.locations.find(l => l.id === locId)?.name ?? locId;
}

// --- Filler library (seed excludes isLiar) ---

function pickFiller(fillerSeed: number, fillerBank: readonly string[]): string {
  return fillerBank[Math.abs(fillerSeed) % fillerBank.length];
}

// --- Core generator ---

export function generateOpeningDefense(
  suspect: Suspect,
  world: WorldModel,
  seed: number,
  templates?: ThemeTemplates,
): { text: string; chipSummary: string } {
  const openingBank = templates?.openingTemplates ?? [
    'I went about my duties as always. I was near {loc} for much of the day.',
    'The day was uneventful. I spent my time around {loc}.',
    'I tended to matters at {loc}. Nothing unusual occurred.',
    'My oath holds. I was at {loc} and did what was asked of me.',
  ];

  const s = answerSeed(seed, suspect.id, 'opening', 0, 'opening');
  const claim = suspect.claimVector;
  const primaryLoc = claim.segments[0]?.from;
  const locName = world.locations.find(l => l.id === primaryLoc)?.name ?? 'the grounds';

  const template = openingBank[Math.abs(s) % openingBank.length];
  const text = template.replace('{loc}', locName);
  return { text, chipSummary: `Defense: near ${locName}` };
}

export function generateAnswerSpec(
  suspect: Suspect,
  cardType: QuestionCardType,
  pressure: number,
  world: WorldModel,
  seed: number,
  slotIndex?: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const temperament = getTemperament(seed, suspect.id);
  const targetKey = canonicalTargetKey(cardType, slotIndex);
  const s = answerSeed(seed, suspect.id, cardType, pressure, targetKey);
  const rng = seededFloat(s);
  const bands = getBands(temperament, pressure);
  const claim = suspect.claimVector;

  // Check refusal — partial answer: give one anchor from claimVector
  if (rng < bands.refusalProb) {
    const segs = claim.segments;
    const segIdx = segs.length > 0 ? Math.abs(hashString(String(seed) + suspect.id + cardType)) % segs.length : 0;
    const seg = segs[segIdx];
    const locId = seg?.from;
    const bell = seg?.departBell;
    const locName = locId ? (world.locations.find(l => l.id === locId)?.name ?? locId) : undefined;
    const bellName = (bell != null && templates?.bellNames) ? templates.bellNames[bell] : undefined;

    return {
      anchors: locName && bellName ? [locName, bellName] : [],
      evasionLevel: 'heavy',
      temperament,
      chipSummary: locName && bellName ? `Partial: at ${locName} at ${bellName}` : 'Refused to answer.',
      chipType: 'refusal',
      templateKey: 'refusal',
    };
  }

  // Generate based on card type
  switch (cardType) {
    case 'bell_probe':
      return generateBellAnswer(suspect, claim, slotIndex ?? 0, world, temperament, s, bands, templates);
    case 'route_probe':
      return generateRouteAnswer(suspect, claim, slotIndex ?? 0, world, temperament, s, bands, templates);
    case 'anchor_probe':
      return generateAnchorAnswer(claim, world, temperament, s, templates);
    case 'object_probe':
      return generateObjectAnswer(claim, temperament, s, templates);
    case 'sense_probe':
      return generateSenseAnswer(claim, slotIndex ?? 0, world, temperament, s, templates);
    case 'witness_probe':
      return generateWitnessAnswer(claim, world, temperament, s, templates);
    case 'consistency':
      return generateConsistencyAnswer(temperament, s, templates);
    case 'detail_trap':
      return generateDetailAnswer(temperament, s, templates);
  }
}

function generateBellAnswer(
  _suspect: Suspect,
  claim: ClaimVector,
  bellIndex: number,
  world: WorldModel,
  temperament: Temperament,
  s: number,
  _bands: TemperamentBands,
  templates?: ThemeTemplates,
): AnswerSpec {
  const bellBank = templates?.bellTemplates ?? [
    'At {bell}, I was at {loc}. I recall the stones beneath my feet.',
    'When {bell} rang, I stood at {loc}. The hour was not lost on me.',
    '{bell} found me at {loc}, attending to my duties.',
    'I was within {loc} at {bell}. The shadows were long.',
  ];
  const deflection = templates?.bellDeflection ?? 'I have accounted for my bells.';
  const fmtBell = createBellFormatter(templates?.bellNames);

  const bell = bellIndex as Bell;
  const coveredSeg = claim.segments.find(seg => bell >= seg.departBell && bell <= seg.arriveBell);

  if (!coveredSeg) {
    return {
      anchors: [],
      evasionLevel: 'none',
      temperament,
      chipSummary: deflection,
      chipType: 'deflection',
      templateKey: 'bell_deflection',
    };
  }

  const locName = world.locations.find(l => l.id === coveredSeg.to)?.name ?? coveredSeg.to;
  const bellName = fmtBell(bell);
  const template = bellBank[Math.abs(s) % bellBank.length];
  const text = template.replace('{bell}', bellName).replace('{loc}', locName);

  const segIdx = claim.segments.indexOf(coveredSeg);

  return {
    anchors: [locName, bellName],
    evasionLevel: 'none',
    temperament,
    referencedSegmentIndex: segIdx >= 0 ? segIdx : undefined,
    referencedLocationId: coveredSeg.to,
    chipSummary: text.length > 60 ? text.slice(0, 57) + '...' : text,
    chipType: 'claim',
    templateKey: `bell_${Math.abs(s) % bellBank.length}`,
  };
}

function generateRouteAnswer(
  _suspect: Suspect,
  claim: ClaimVector,
  slotIndex: number,
  world: WorldModel,
  temperament: Temperament,
  s: number,
  _bands: TemperamentBands,
  templates?: ThemeTemplates,
): AnswerSpec {
  const routeBank = templates?.routeTemplates ?? [
    'I walked from {loc1} to {loc2}, departing at {bell1} and arriving by {bell2}.',
    'The road from {loc1} to {loc2} — I took it from {bell1} through {bell2}.',
    'Between {loc1} and {loc2}, from {bell1} to {bell2}. The way was clear.',
  ];
  const fmtBell = createBellFormatter(templates?.bellNames);

  const seg = resolveSlotToSegment(claim, slotIndex);
  if (!seg) {
    return {
      anchors: [],
      evasionLevel: 'slight',
      temperament,
      chipSummary: 'I traveled little that day.',
      chipType: 'evasion',
      templateKey: 'route_none',
    };
  }

  const loc1 = world.locations.find(l => l.id === seg.from)?.name ?? seg.from;
  const loc2 = world.locations.find(l => l.id === seg.to)?.name ?? seg.to;
  const bell1 = fmtBell(seg.departBell);
  const bell2 = fmtBell(seg.arriveBell);
  const template = routeBank[Math.abs(s) % routeBank.length];
  const text = template.replace('{loc1}', loc1).replace('{loc2}', loc2).replace('{bell1}', bell1).replace('{bell2}', bell2);

  const segIdx = claim.segments.indexOf(seg);

  return {
    anchors: [loc1, loc2, bell1, bell2],
    evasionLevel: 'none',
    temperament,
    referencedSegmentIndex: segIdx >= 0 ? segIdx : undefined,
    referencedLocationId: seg.to,
    chipSummary: text.length > 60 ? text.slice(0, 57) + '...' : text,
    chipType: 'claim',
    templateKey: `route_${Math.abs(s) % routeBank.length}`,
  };
}

function generateAnchorAnswer(
  claim: ClaimVector,
  world: WorldModel,
  temperament: Temperament,
  s: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const anchorBank = templates?.anchorTemplates ?? [
    'I heard the watch-horn from {loc} at {bell}. It echoed across the valley.',
    'The horn sounded at {bell} from {loc}. I am certain of it.',
    'At {bell}, the horn from {loc} reached my ears.',
  ];
  const anchorNone = templates?.anchorNone ?? 'I did not hear the horn clearly.';
  const fmtBell = createBellFormatter(templates?.bellNames);

  if (!claim.heardHornAt) {
    return {
      anchors: [],
      evasionLevel: 'slight',
      temperament,
      chipSummary: anchorNone,
      chipType: 'evasion',
      templateKey: 'anchor_none',
    };
  }

  const locName = world.locations.find(l => l.id === claim.heardHornAt!.where)?.name ?? claim.heardHornAt.where;
  const bellName = fmtBell(claim.heardHornAt.bell);
  const template = anchorBank[Math.abs(s) % anchorBank.length];
  const text = template.replace('{bell}', bellName).replace('{loc}', locName);

  return {
    anchors: [locName, bellName],
    evasionLevel: 'none',
    temperament,
    referencedLocationId: claim.heardHornAt.where,
    chipSummary: text.length > 60 ? text.slice(0, 57) + '...' : text,
    chipType: 'claim',
    templateKey: `anchor_${Math.abs(s) % anchorBank.length}`,
  };
}

function generateObjectAnswer(
  claim: ClaimVector,
  temperament: Temperament,
  s: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const objectBank = templates?.objectTemplates ?? [
    'I carried {relic} throughout the day. It did not leave my person.',
    '{relic} was in my keeping, as sworn.',
  ];
  const objectNone = templates?.objectNone ?? 'I bore nothing of note.';

  if (!claim.carriedRelic) {
    return {
      anchors: [],
      evasionLevel: 'none',
      temperament,
      chipSummary: objectNone,
      chipType: 'claim',
      templateKey: 'object_none',
    };
  }

  const template = objectBank[Math.abs(s) % objectBank.length];
  const relic = claim.carriedRelic.charAt(0).toUpperCase() + claim.carriedRelic.slice(1);
  const text = template.replace('{relic}', relic);

  return {
    anchors: [claim.carriedRelic],
    evasionLevel: 'none',
    temperament,
    chipSummary: text.length > 60 ? text.slice(0, 57) + '...' : text,
    chipType: 'claim',
    templateKey: `object_${Math.abs(s) % objectBank.length}`,
  };
}

function generateSenseAnswer(
  claim: ClaimVector,
  slotIndex: number,
  world: WorldModel,
  temperament: Temperament,
  s: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const senseBank = templates?.senseTemplates ?? [
    'The air at {loc} carried {scent}. Unmistakable.',
    'I recall {scent} at {loc}. It lingered.',
  ];
  const senseNone = templates?.senseNone ?? 'I noticed nothing unusual.';

  if (!claim.sensed) {
    return {
      anchors: [],
      evasionLevel: 'none',
      temperament,
      chipSummary: senseNone,
      chipType: 'claim',
      templateKey: 'sense_none',
    };
  }

  const locName = resolveSlotToLocation(claim, slotIndex, world) ?? claim.sensed.where;
  const template = senseBank[Math.abs(s) % senseBank.length];
  const text = template.replace('{loc}', locName).replace('{scent}', claim.sensed.scent);

  return {
    anchors: [locName, claim.sensed.scent],
    evasionLevel: 'none',
    temperament,
    referencedLocationId: claim.sensed.where,
    chipSummary: text.length > 60 ? text.slice(0, 57) + '...' : text,
    chipType: 'claim',
    templateKey: `sense_${Math.abs(s) % senseBank.length}`,
  };
}

function generateWitnessAnswer(
  claim: ClaimVector,
  world: WorldModel,
  temperament: Temperament,
  s: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const pool = templates?.witnessPool ?? ['a watchman', 'a ferryman', 'the bridge-keeper', 'a passing monk', 'an ash gatherer', 'a stone-cutter'];
  const witnessBank = templates?.witnessTemplates ?? [
    'I was seen by {witness} near {loc}.',
    '{witness} passed me at {loc}. They can attest.',
  ];

  const witness = pool[Math.abs(s) % pool.length];
  const primaryLoc = claim.segments[0]?.from;
  const locName = world.locations.find(l => l.id === primaryLoc)?.name ?? 'the grounds';
  const template = witnessBank[Math.abs(s) % witnessBank.length];
  const text = template.replace('{witness}', witness).replace('{loc}', locName);

  return {
    anchors: [witness, locName],
    evasionLevel: 'none',
    temperament,
    chipSummary: text.length > 60 ? text.slice(0, 57) + '...' : text,
    chipType: 'claim',
    templateKey: `witness_${Math.abs(s) % witnessBank.length}`,
  };
}

function generateConsistencyAnswer(
  temperament: Temperament,
  s: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const bank = templates?.consistencyTemplates ?? [
    'I have said what I have said. I do not waver.',
    'My account stands. Question it if you must.',
    'I spoke truthfully. I see no reason to amend.',
  ];

  const text = bank[Math.abs(s) % bank.length];
  return {
    anchors: [],
    evasionLevel: 'slight',
    temperament,
    chipSummary: text,
    chipType: 'evasion',
    templateKey: `consistency_${Math.abs(s) % bank.length}`,
  };
}

function generateDetailAnswer(
  temperament: Temperament,
  s: number,
  templates?: ThemeTemplates,
): AnswerSpec {
  const bank = templates?.detailPublicFlavor ?? [
    'The moss-covered stones were as always.',
    'Cold river air. Nothing more.',
    'The old walls stood as they have for ages.',
    'I was not there to sightsee.',
  ];

  const text = bank[Math.abs(s) % bank.length];
  return {
    anchors: [],
    evasionLevel: 'slight',
    temperament,
    chipSummary: text,
    chipType: 'deflection',
    templateKey: `detail_${Math.abs(s) % bank.length}`,
  };
}

// --- Full answer text expansion (for TTS + subtitles) ---

export function expandAnswerText(spec: AnswerSpec, suspect: Suspect, _world: WorldModel, seed: number, pressure: number, targetKey: string, templates?: ThemeTemplates, otherSuspectNames?: string[]): string {
  if (spec.chipType === 'refusal') {
    const refusals = templates?.refusals ?? {
      timid: 'Please... there are things that happened that day I dare not speak of.',
      arrogant: 'You dare press me? Some oaths bind the tongue.',
      annoyed: 'I was there, I did my duty. Ask what I did, not what I know.',
      talkative: 'The thing is, I promised someone I would not \u2014 ask me something else.',
      clipped: 'That question has teeth. Choose another.',
      poetic: 'There are truths that burn. This one would scorch us both.',
    };
    let refusalText = refusals[spec.temperament] ?? 'I will not answer.';

    // Append partial answer suffix if anchors are available
    if (spec.anchors.length >= 2) {
      const suffix = templates?.partialRefusalSuffix ?? 'But I will say this: I was at {loc} at {bell}. That is all.';
      refusalText += ' ' + suffix.replace('{loc}', spec.anchors[0]).replace('{bell}', spec.anchors[1]);
    }

    return refusalText;
  }

  let text = spec.chipSummary;

  const fillerBank = templates?.fillerNeutral ?? [
    'The day was long.',
    'I recall little else.',
    'Such is the way of things.',
    'The cold was sharp.',
    'Nothing more comes to mind.',
    'The wind carried whispers.',
    'Duty weighed heavy.',
    'I kept my own counsel.',
  ];

  const bands = getBands(spec.temperament, pressure);
  const fillerSeed = hashString(`${seed}:${suspect.id}:${spec.templateKey}:${pressure}:${targetKey}`);
  const words = text.split(/\s+/).length;
  if (words < bands.wordRange.min) {
    text += ' ' + pickFiller(fillerSeed, fillerBank);
  }

  // Blame-shifting and innocence protests (more likely under pressure)
  const blameSeed = hashString(`blame:${seed}:${suspect.id}:${pressure}:${targetKey}`);
  const blameRoll = seededFloat(blameSeed);
  // P0: 15% innocence, 10% blame | P1: 25%, 20% | P2+: 30%, 35%
  const innocenceThreshold = pressure === 0 ? 0.15 : pressure === 1 ? 0.25 : 0.30;
  const blameThreshold = innocenceThreshold + (pressure === 0 ? 0.10 : pressure === 1 ? 0.20 : 0.35);

  if (blameRoll < innocenceThreshold) {
    const innocenceBank = templates?.innocenceLines ?? [
      'I speak the truth. Every word.',
      'I have nothing to hide.',
    ];
    text += ' ' + innocenceBank[Math.abs(blameSeed) % innocenceBank.length];
  } else if (blameRoll < blameThreshold && otherSuspectNames && otherSuspectNames.length > 0) {
    const blameBank = templates?.blameTemplates?.[spec.temperament] ?? [
      'Perhaps you should speak with {name}.',
    ];
    const targetIdx = Math.abs(blameSeed + 7) % otherSuspectNames.length;
    const blameLine = blameBank[Math.abs(blameSeed + 3) % blameBank.length]
      .replace('{name}', otherSuspectNames[targetIdx]);
    text += ' ' + blameLine;
  }

  return text;
}

// --- Heuristic question classifier ---

const CARD_KEYWORDS: Record<QuestionCardType, string[]> = {
  bell_probe: [
    // Core time
    'bell', 'time', 'hour', 'clock', 'schedule', 'timeline', 'duration',
    'wristwatch', 'timepiece', 'stopwatch', 'chronometer',
    // Ordinals
    'first', 'second', 'third', 'fourth', 'fifth', 'sixth',
    // Time-of-day
    'morning', 'evening', 'dawn', 'dusk', 'noon', 'midnight',
    'afternoon', 'nightfall', 'daybreak', 'sunrise', 'sunset',
    'early', 'late', 'midday',
    // Duration / temporal
    'minutes', 'moment', 'brief', 'quickly',
    'slowly', 'hurry', 'hurried', 'rush', 'rushed',
    'wait', 'waited', 'waiting', 'linger', 'lingered',
    'delay', 'delayed', 'pause', 'paused',
    'ago', 'prior', 'subsequent', 'afterward', 'afterwards',
    'thereafter', 'meanwhile', 'simultaneously',
    // Phrases (2x weight)
    'what time', 'at what', "o'clock", 'what hour', 'which hour',
    'what bell', 'which bell', 'how long', 'account for your time',
    'at that time', 'at that hour', 'where were you at',
    'how long did', 'how long were', 'how many hours',
    'how many minutes', 'how many bells',
    'what part of the day', 'around what time', 'approximately when',
    'before or after', 'earlier or later',
    'still there at', 'there by', 'there until',
    'from when', 'until when', 'since when',
    'how much time', 'time frame', 'time span', 'time window',
    'at approximately', 'roughly when', 'roughly what time',
    'check your watch', 'on the clock',
    'prior to', 'following that', 'before that', 'after that',
    'during that', 'at that point', 'by that point',
  ],
  route_probe: [
    // Core movement
    'route', 'road', 'path', 'direction', 'destination', 'trip',
    'walk', 'walked', 'walking', 'travel', 'traveled', 'traveling',
    'journey', 'move', 'moved', 'moving', 'headed', 'heading',
    'ran', 'run', 'running', 'sprint', 'sprinted',
    'stroll', 'strolled', 'wander', 'wandered', 'roam', 'roamed',
    'stride', 'strode', 'march', 'marched', 'paced',
    'flee', 'fled', 'fleeing',
    'sneak', 'sneaked', 'snuck', 'creep', 'crept',
    'escape', 'escaped', 'escaping', 'getaway',
    'followed', 'following', 'trail', 'trailed',
    'chase', 'chased', 'chasing', 'pursue', 'pursued',
    'backtrack', 'retrace', 'trespass', 'trespassing',
    // Location nouns
    'location', 'area', 'spot', 'site',
    'room', 'hall', 'corridor', 'hallway', 'passage', 'gateway',
    'tower', 'gate', 'grove', 'ford', 'chapel', 'cellar',
    'garden', 'yard', 'stairs', 'staircase', 'level',
    'wing', 'quarters', 'office', 'lobby', 'basement',
    'garage', 'rooftop', 'balcony', 'terrace', 'attic',
    'library', 'kitchen', 'parlor', 'parlour', 'pantry',
    'door', 'doors', 'doorway', 'entrance', 'window', 'windows',
    'alley', 'alleyway', 'street', 'avenue', 'lane',
    'courtyard', 'compound', 'grounds', 'estate', 'manor', 'mansion',
    'premises', 'vicinity', 'property',
    // Actions
    'stay', 'stayed', 'remain', 'remained', 'left', 'leave', 'leaving',
    'arrive', 'arrived', 'arriving', 'depart', 'departed', 'departing',
    'return', 'returned', 'returning',
    'visit', 'visited', 'visiting', 'enter', 'entered', 'entering',
    'exit', 'exited', 'exiting', 'cross', 'crossed', 'crossing',
    'came', 'went', 'gone', 'going', 'stopped', 'stopping',
    'detour', 'shortcut', 'bypass',
    'locked', 'unlocked', 'sealed', 'barred',
    // Spatial
    'near', 'nearby', 'far', 'distant', 'adjacent',
    'inside', 'outside', 'upstairs', 'downstairs', 'above', 'below',
    'north', 'south', 'east', 'west',
    'through', 'across', 'along', 'toward', 'towards', 'away',
    // Alibi
    'alibi', 'whereabouts', 'located',
    // Phrases
    'where did you go', 'where did you', 'where were you', 'where was',
    'go to', 'went to', 'came from', 'come from',
    'which way', 'how did you get', 'account for',
    'take the path', 'take the road', 'take the route',
    'pass through', 'pass by', 'passed through', 'passed by',
    'on your way', 'on the way', 'headed to', 'headed for',
    'get to', 'get there', 'get back', 'got back',
    'where exactly', 'which room', 'which floor', 'which wing',
    'were you near', 'were you in', 'were you at',
    'did you go', 'did you leave', 'did you stop',
    'did you pass', 'did you visit', 'did you enter',
    'have you been', 'ever been to', 'set foot',
    'coming from', 'going to', 'heading to',
    'break in', 'broke in', 'broken into', 'broke into',
    'get in', 'got in', 'sneak in', 'snuck in',
    'way out', 'way in', 'point of entry',
    'show me where', 'point me to where',
    'the door', 'the window', 'through the window',
    'double back', 'went back', 'came back', 'turned back',
    'close to', 'close by', 'near the', 'far from',
  ],
  anchor_probe: [
    // Core signals
    'horn', 'watchhorn', 'siren', 'alarm', 'announcement',
    'chime', 'gong', 'toll', 'tolled', 'tolling',
    // Perception
    'hear', 'heard', 'hearing', 'overhear', 'overheard',
    'listen', 'listened', 'listening',
    'sound', 'sounded', 'sounding', 'noise', 'noisy',
    'loud', 'faint', 'echo', 'echoed', 'echoing',
    'blown', 'blast', 'blew', 'rang', 'ringing',
    // Human sounds
    'scream', 'screamed', 'screaming', 'shriek', 'shrieked',
    'shout', 'shouted', 'shouting', 'yell', 'yelled', 'yelling',
    'cry', 'cried', 'crying', 'wail', 'wailed', 'wailing',
    'crash', 'crashed', 'crashing', 'bang', 'banged', 'banging',
    'thud', 'thump', 'thumped', 'clatter', 'clattered',
    'explosion', 'shatter', 'shattered', 'breaking',
    'commotion', 'disturbance', 'ruckus', 'racket',
    'whisper', 'whispered', 'whispering', 'murmur', 'murmured',
    'footsteps', 'rustling', 'creaking', 'creak', 'creaked',
    'knock', 'knocked', 'knocking', 'slam', 'slammed', 'slamming',
    'gunshot', 'gunshots',
    'silence', 'silent', 'quiet', 'quieter',
    // Phrases
    'watch-horn', 'did you hear', 'could you hear',
    'hear the horn', 'hear the bell', 'hear the signal',
    'heard a sound', 'heard anything', 'hear anything',
    'what did you hear', 'did you notice any sound',
    'could you tell', 'how far away',
    'hear a scream', 'hear screaming', 'hear any noise',
    'any sounds', 'hear any sounds',
    'was it quiet', 'was it loud', 'was it silent',
    'dead silent', 'any commotion', 'any disturbance',
    'did anyone scream', 'did anyone shout', 'did anyone yell',
    'loud noise', 'strange noise', 'strange sound',
  ],
  object_probe: [
    // Core carrying
    'carry', 'carried', 'carrying', 'relic', 'object', 'item',
    'artifact', 'artefact', 'possession', 'belonging', 'belongings',
    'tool', 'weapon', 'instrument', 'device', 'equipment',
    // Actions
    'bring', 'brought', 'bringing',
    'holding', 'held',
    'take', 'took', 'taken', 'taking',
    'grab', 'grabbed', 'grabbing', 'snatch', 'snatched',
    'pick', 'picked', 'picking',
    'drop', 'dropped', 'dropping', 'discard', 'discarded',
    'placed', 'placing', 'put', 'stash', 'stashed',
    'hid', 'hidden', 'conceal', 'concealed',
    'steal', 'stole', 'stolen', 'theft', 'thief',
    'touch', 'touched', 'handle', 'handled',
    'give', 'gave', 'given', 'receive', 'received',
    'handed', 'tamper', 'tampered', 'tampering',
    'dispose', 'disposed', 'disposing',
    'own', 'owned', 'owns', 'ownership',
    'acquire', 'acquired', 'obtaining', 'obtained',
    'purchase', 'purchased', 'bought',
    'borrow', 'borrowed', 'lend', 'lent',
    'swap', 'swapped', 'trade', 'traded', 'exchange', 'exchanged',
    // Containers / body
    'pocket', 'pockets', 'bag', 'satchel', 'pouch', 'pack',
    'cloak', 'coat', 'jacket', 'sleeve', 'glove', 'gloves',
    'hands', 'backpack', 'briefcase', 'purse', 'wallet',
    'container', 'box', 'chest', 'crate', 'drawer',
    // Clothing
    'wearing', 'wore', 'worn', 'outfit', 'dress', 'dressed',
    'clothes', 'clothing', 'garment', 'garments', 'attire',
    'shirt', 'pants', 'trousers', 'boots', 'shoes', 'hat', 'hood',
    'stained', 'soiled',
    // Object types
    'key', 'keys', 'knife', 'blade', 'sword', 'dagger',
    'book', 'scroll', 'letter', 'document', 'paper',
    'amulet', 'pendant', 'necklace', 'jewel', 'gem',
    'vial', 'bottle', 'flask', 'cup', 'chalice', 'goblet',
    'torch', 'lantern', 'candle', 'lamp',
    'coin', 'coins', 'money', 'gold', 'silver',
    'compass', 'rope', 'chain',
    'phone', 'laptop', 'tablet', 'badge', 'keycard',
    'envelope', 'folder', 'usb',
    'package', 'parcel', 'bundle',
    // Phrases
    'what did you have', 'were you carrying', 'did you have',
    'in your hands', 'with you', 'on your person',
    'in your pocket', 'in your bag',
    'what were you holding', 'what were you carrying',
    'anything on you', 'anything with you',
    'did you bring', 'did you take', 'did you pick up',
    'did you drop', 'did you leave behind',
    'what did you bring', 'what did you take',
    'hand over', 'show me what',
    'got on you', 'got anything on', 'have on you',
    'stuff on you', 'things on you', 'you got',
    'what were you wearing', 'were you wearing',
    'change of clothes', 'changed clothes', 'change clothes',
    'set it down', 'set aside', 'put it down', 'put down',
    'did you hide', 'where did you put', 'what did you do with',
  ],
  sense_probe: [
    // Smell
    'smell', 'smelled', 'smelling', 'smelt', 'scent', 'scented',
    'odor', 'odour', 'aroma', 'stench', 'stink', 'stank', 'stunk',
    'fragrance', 'perfume', 'reek', 'reeked', 'reeking',
    'whiff', 'pungent', 'foul', 'musty', 'acrid',
    'pine', 'cedar', 'earthy', 'floral', 'metallic',
    'burnt', 'burning', 'charred', 'rotten', 'rotting', 'decay',
    'moldy', 'mouldy', 'stale', 'fresh', 'stuffy',
    // Taste
    'taste', 'tasted', 'tasting', 'flavor', 'flavour',
    'bitter', 'sweet', 'sour', 'salty',
    // Touch / feel
    'texture', 'rough', 'smooth',
    'slippery', 'sticky',
    // Temperature
    'cold', 'warm', 'hot', 'chilly', 'freezing', 'icy',
    'heated', 'lukewarm', 'boiling', 'sweltering',
    // Physical sensation
    'sweat', 'sweating', 'sweaty', 'shiver', 'shivering',
    'tremble', 'trembling', 'shook',
    'visibility', 'visible',
    // Atmosphere
    'fog', 'foggy', 'mist', 'misty', 'haze', 'hazy',
    'rain', 'raining', 'rainy', 'wet', 'damp', 'humid',
    'wind', 'windy', 'breeze', 'breezy', 'gust', 'gusty',
    'draft', 'draught', 'gale', 'storm', 'stormy',
    'weather', 'temperature', 'conditions', 'climate',
    'smoke', 'smoky', 'steam', 'steamy', 'vapor', 'vapour',
    'dust', 'dusty', 'ash', 'soot',
    'dark', 'darkness', 'dim', 'bright', 'shadow', 'shadows',
    'eerie', 'creepy', 'unsettling',
    // Phrases
    'what did it smell', 'what did it feel like',
    'what was the air', 'what was the weather',
    'how did it feel', 'how was the weather',
    'could you smell', 'did you smell', 'did you feel',
    'was it cold', 'was it warm', 'was it dark', 'was it raining',
    'what was the temperature', 'what were the conditions',
    'notice any smell', 'notice any scent',
    'anything in the air', 'something in the air',
    'what did it look like', 'how did it look',
    'could you see', 'hard to see', 'difficult to see',
    'smell like', 'taste like', 'feel like',
  ],
  witness_probe: [
    // Core witness
    'witness', 'witnessed', 'witnessing',
    'saw', 'see', 'seen', 'seeing',
    'spotted', 'spotting', 'glimpse', 'glimpsed',
    'observed', 'observing', 'watched', 'watching',
    'recognize', 'recognized', 'recognise', 'recognised',
    'identify', 'identified',
    // People references
    'someone', 'anyone', 'nobody',
    'everybody', 'everyone', 'person', 'people', 'individual',
    'figure', 'stranger', 'visitor', 'guest', 'intruder',
    'companion', 'colleague', 'coworker', 'associate',
    'friend', 'ally', 'partner',
    'neighbor', 'neighbour', 'servant', 'maid', 'guard', 'guards',
    // Relationships
    'relationship', 'relation', 'related', 'connected', 'connection',
    'acquaintance', 'acquainted', 'familiar',
    'lover', 'lovers', 'enemy', 'enemies', 'rival', 'rivals',
    'husband', 'wife', 'spouse', 'boyfriend', 'girlfriend',
    'family', 'brother', 'sister', 'father', 'mother',
    'knew', 'known',
    // Social context
    'together', 'alone', 'solitary', 'isolated',
    'met', 'meet', 'meeting',
    'encounter', 'encountered', 'encountering',
    'vouch', 'corroborate', 'verify', 'confirm', 'confirmed',
    'testify', 'testified', 'attest', 'attested',
    'accompany', 'accompanied', 'escorted',
    'approach', 'approached', 'avoid', 'avoided', 'avoiding',
    'confront', 'confronted',
    'interact', 'interacted', 'interaction',
    'greet', 'greeted', 'nod', 'nodded', 'wave', 'waved',
    'chat', 'chatted', 'chatting',
    'discuss', 'discussed', 'discussion',
    'argue', 'argued', 'argument', 'quarrel', 'confrontation',
    'spy', 'spied', 'spying', 'eavesdrop', 'eavesdropped',
    // Phrases
    'who saw', 'who else', 'was anyone', 'did anyone',
    'were you alone', 'who was with', 'who was there',
    'anyone else', 'someone else', 'by yourself',
    'can anyone', 'will anyone', 'did someone',
    'notice anyone', 'notice someone', 'see anyone',
    'see someone', 'see anybody', 'saw anyone', 'saw somebody',
    'who did you see', 'who did you meet',
    'did you run into', 'did you bump into',
    'anyone with you', 'someone with you',
    'who can confirm', 'who can verify', 'who can vouch',
    'any witnesses', 'were there others', 'was there anyone',
    'did you pass anyone', 'did you encounter',
    'cross paths', 'crossed paths',
    'talk to', 'talked to', 'speak to', 'spoke to',
    'conversation with', 'spoke with', 'talked with',
    'ran into', 'bumped into',
    'how well do you know', 'how did you know',
    'what was your relationship', 'what is your relationship',
    'on good terms', 'on bad terms', 'falling out',
    'involved with', 'associated with',
    'ties to', 'tied to', 'between you',
    'did you have help', 'help from', 'working with',
    'no one', 'did anyone else',
    'who was around', 'was somebody', 'was there somebody',
  ],
  consistency: [
    // Prior statements
    'said', 'claimed', 'stated', 'told', 'mentioned', 'testified',
    'asserted', 'declared', 'insisted', 'maintained', 'alleged',
    'reported', 'recounted',
    // Lying / deception
    'lied', 'lie', 'lying', 'liar', 'lies',
    'deceive', 'deceived', 'deceiving', 'deceit', 'deception',
    'fabricate', 'fabricated', 'fabrication',
    'mislead', 'misleading', 'misleads',
    'dishonest', 'dishonesty', 'untruthful',
    'false', 'falsehood', 'fake', 'faking', 'pretend', 'pretending',
    'fooling', 'fool', 'bluff', 'bluffing',
    // Contradiction
    'contradict', 'contradiction', 'contradicts', 'contradicted',
    'inconsistent', 'inconsistency', 'discrepancy',
    'conflict', 'conflicting', 'conflicts',
    'mismatch', 'mismatched', 'differ', 'differs',
    // Truth
    'honest', 'honesty', 'truth', 'truthful', 'truthfully',
    'sincere', 'sincerely', 'genuine', 'genuinely',
    'swear', 'swore', 'sworn', 'oath', 'promise', 'promised',
    // Challenge
    'explain', 'justify', 'clarify', 'elaborate',
    'prove', 'proof', 'disprove',
    'defend', 'defense', 'defence',
    'certain', 'positive', 'confident',
    // Temporal reference (phrases only for common words)
    'earlier', 'previously', 'originally',
    // Narrative
    'story', 'account', 'version', 'testimony', 'narrative',
    'statement', 'claim', 'allegation',
    // Crime vocabulary
    'kill', 'killed', 'killing',
    'die', 'died', 'dying', 'dead', 'death',
    'victim', 'corpse', 'deceased', 'remains',
    'blood', 'bloody', 'bloodstain',
    'wound', 'wounded', 'injury', 'injured',
    'poison', 'poisoned', 'poisoning',
    'stab', 'stabbed', 'stabbing',
    'strangle', 'strangled', 'suffocate', 'suffocated',
    'drown', 'drowned', 'shoot', 'shot',
    'slain', 'slay',
    // Accusatory — guilt / confrontation
    'guilty', 'innocent', 'killer', 'murderer', 'murder',
    'confess', 'confession', 'admit', 'admission',
    'deny', 'denied', 'denial',
    'blame', 'blamed', 'accuse', 'accused', 'accusation',
    'fault', 'responsible', 'responsibility',
    'hiding', 'coverup',
    'crime', 'criminal', 'offense', 'offence',
    'betray', 'betrayed', 'betrayal', 'traitor',
    'oathbreaker', 'deceiver', 'suspect',
    'nervous', 'scared', 'afraid', 'anxious', 'fidgety',
    'shifty', 'evasive', 'shady', 'sketchy',
    'suspicious', 'suspicion', 'suspicions',
    'secret', 'secrets', 'secretive',
    'accomplice', 'complicit',
    // Motive
    'motive', 'motives', 'incentive',
    'gain', 'gained', 'benefit', 'benefited', 'benefitted',
    'profit', 'profited', 'profiting',
    'inherit', 'inheritance', 'greed', 'greedy',
    'revenge', 'vengeance', 'avenge', 'payback', 'retaliation',
    'grudge', 'resentment', 'resent', 'resented',
    'hate', 'hated', 'hatred', 'despise', 'despised',
    'jealous', 'jealousy', 'envious', 'envy',
    'animosity', 'hostility', 'hostile', 'vendetta', 'feud',
    // Confrontation vocabulary
    'nonsense', 'rubbish', 'ridiculous', 'absurd', 'pathetic',
    'coincidence', 'convenient', 'conveniently', 'supposedly',
    'apparently', 'dubious', 'doubtful', 'fishy', 'phony', 'bogus',
    'credible', 'credibility', 'believable', 'unbelievable',
    'plausible', 'implausible', 'unlikely',
    // Commands
    'talk', 'spill', 'cooperate', 'cooperation',
    'stalling', 'stall', 'dodge', 'dodging', 'dodged',
    'deflect', 'deflecting', 'weasel',
    'excuse', 'excuses',
    // Emotional pressure
    'regret', 'remorse', 'sorry', 'apologize', 'apologise',
    'shame', 'ashamed', 'conscience',
    'worried', 'worry', 'concerned', 'concern',
    'panic', 'panicked', 'panicking',
    'calm', 'composed', 'collected',
    'desperate', 'desperation', 'upset', 'furious', 'angry',
    'smirk', 'smirking', 'grin', 'grinning',
    // Conspiracy / planning
    'plan', 'planned', 'planning', 'plotted', 'plot', 'plotting',
    'scheme', 'scheming', 'conspire', 'conspiracy',
    'blackmail', 'blackmailed',
    'threat', 'threaten', 'threatened', 'threatening',
    'silence', 'silenced', 'eliminate', 'eliminated',
    'fight', 'fighting', 'fought',
    'dispute', 'disputed',
    'premeditated', 'deliberate', 'intentional',
    // Sarcasm markers
    'somehow', 'magically', 'miraculously', 'surprisingly',
    // Colloquial
    'sus', 'cap',
    // Phrases
    'sure about', 'how do you explain', 'you said', 'you told', 'you claimed',
    "that's not what", 'that is not what',
    'change your story', 'changed your story',
    'stick with', 'stick to', 'stand by',
    'did you do it', 'was it you', 'you did it', 'you did this',
    'are you the', 'it was you', 'trust you', 'believe you',
    "don't believe", "don't trust", 'why should i',
    'i think you', 'i know you',
    'you seem nervous', 'you seem scared', 'you seem anxious',
    'you look nervous', 'you look guilty', 'you look scared',
    'are you sure', 'are you certain', 'are you positive',
    'is that true', 'is that right', 'is that so',
    'can you prove', 'how can you prove',
    'tell the truth', 'be honest', 'be truthful',
    'come clean', 'fess up', 'own up',
    'you expect me', 'hard to believe', 'find that hard',
    'not buying', 'not convinced',
    'stop lying', 'quit lying', 'drop the act',
    'cut the act', 'enough with', 'enough of',
    'give it up', 'just admit', 'just confess',
    'we both know', 'we all know', 'everyone knows',
    'what are you hiding', 'what are you afraid of',
    'why are you nervous', 'why are you lying',
    'something to hide', 'got something to hide',
    // Commands / demands
    'answer me', 'answer the question', 'speak up',
    'spill it', 'spill the beans', 'spit it out', 'out with it',
    'quit stalling', 'stop stalling', 'stop playing',
    'enough excuses', 'no more excuses', 'no more lies',
    'straight answer', 'last chance', 'cooperate or',
    "don't dodge", "don't evade", "don't waste my time",
    'waste my time',
    'choose your words', 'think carefully',
    // Confrontational phrases
    'add up', 'adds up', "doesn't add up", "don't add up",
    "doesn't make sense", "don't make sense", 'make sense',
    'hold up', 'holds up', "doesn't hold up",
    'hold water', "doesn't hold water",
    'check out', "doesn't check out",
    'stack up', "doesn't stack up",
    'cut the crap', 'nice try', 'try again',
    'play dumb', 'playing dumb',
    'not an idiot', 'not a fool', 'not stupid',
    "i don't buy", "i'm not buying", "don't buy that",
    'convince me', 'get real', 'be real', 'level with me',
    'just happened to', 'what a coincidence', 'how convenient',
    'born yesterday', "think i'm stupid", "think i'm a fool",
    'let me guess', 'must think',
    'the jig is up', "you're going down", 'going down for',
    'off the record', 'on record', 'have you on',
    'sure sure', 'yeah right', 'oh really',
    'save it', 'spare me',
    'enough games', 'stop playing games', 'games with me',
    'full of it', "you're full of",
    "no way", "that's cap",
    // Motive phrases
    'stand to gain', 'in it for you', 'in the will',
    'want them dead', 'wanted them dead', 'reason to kill',
    'did you kill', 'did you murder', 'owe you', 'owed you',
    'drove you to', 'what drove you', 'paid to',
    'put you up to', 'who put you', 'your angle',
    'bad blood', 'score to settle',
    // Holding back
    'holding back', 'holding something back',
    'know more than', 'not being straight',
    'not being honest', 'not being truthful',
    // Crime phrases
    'cause of death', 'crime scene', 'manner of death',
    'do with the body', 'dispose of', 'clean up after',
    'on your hands', 'blood on your',
    'you said before', 'said earlier', 'told me before',
    'say that again', 'there you go again',
  ],
  detail_trap: [
    // Observation
    'detail', 'details', 'detailed',
    'unusual', 'strange', 'odd', 'weird', 'peculiar', 'bizarre',
    'curious', 'remarkable', 'noteworthy',
    'normal', 'ordinary', 'typical', 'unexpected',
    'describe', 'description', 'recount', 'recap',
    'notice', 'noticed', 'noticing', 'observe', 'observed',
    'remember', 'remembered', 'remembering', 'recall', 'recalled',
    'forget', 'forgot', 'forgotten',
    'interesting', 'significant', 'important',
    'amiss',
    // Activity
    'doing', 'activity', 'activities', 'routine', 'usual',
    'duty', 'duties', 'task', 'tasks', 'job', 'work', 'working',
    'chore', 'chores', 'errand', 'errands', 'assignment',
    'purpose', 'business',
    'role', 'function',
    // General inquiry
    'anything', 'everything', 'something', 'nothing',
    'happen', 'happened', 'happening', 'occurs', 'occurred',
    'event', 'incident', 'occurrence', 'situation',
    'experience', 'experienced',
    // State
    'behave', 'behavior', 'behaviour', 'acted', 'acting',
    'react', 'reacted', 'reaction', 'respond', 'responded',
    'mood', 'demeanor', 'demeanour', 'attitude', 'manner',
    'scene', 'surroundings',
    // Phrases
    'look like', 'what were you doing', 'what did you do',
    'why were you', 'tell me about', 'what happened',
    'tell me everything', 'tell me more', 'tell me what',
    'can you describe', 'walk me through', 'take me through',
    'what did you see', 'what did you notice',
    'anything out of the ordinary', 'anything unusual',
    'anything strange', 'anything odd', 'anything different',
    'what do you remember', 'what can you recall',
    'start from the beginning', 'from the beginning',
    'give me the details', 'go over it again',
    'in your own words', 'step by step',
    'what exactly', 'how exactly',
    'what was going on', 'what went on',
    'what was happening', 'anything at all',
    'anything to add', 'anything else',
    'forget anything', 'leave anything out',
    'miss anything', 'missing anything',
    "what's your take", 'in your opinion',
    'what do you think', 'why do you think',
    'help me understand', 'fill me in',
    'catch your eye', 'stand out', 'stood out',
    'out of place', 'what was up', 'what were you up to',
    'run that by me', 'go through it',
  ],
};

// Pre-compile keyword patterns: word-boundary regex for single words, raw strings for phrases
const CARD_PATTERNS: Record<string, { phrases: string[]; wordPatterns: RegExp[] }> = {};
for (const [type, keywords] of Object.entries(CARD_KEYWORDS)) {
  const phrases: string[] = [];
  const wordPatterns: RegExp[] = [];
  for (const kw of keywords) {
    if (kw.includes(' ')) {
      phrases.push(kw);
    } else {
      wordPatterns.push(new RegExp(`\\b${kw}\\b`));
    }
  }
  CARD_PATTERNS[type] = { phrases, wordPatterns };
}

/** Score text against a card type's keywords. Phrases score 2, single words score 1. */
function keywordScore(text: string, cardType: QuestionCardType): number {
  const { phrases, wordPatterns } = CARD_PATTERNS[cardType];
  let score = 0;
  for (const phrase of phrases) {
    if (text.includes(phrase)) score += 2;
  }
  for (const re of wordPatterns) {
    if (re.test(text)) score += 1;
  }
  return score;
}

export function classifyQuestion(
  text: string,
  world?: WorldModel,
): { cardType: QuestionCardType; isIrrelevant: boolean } {
  const lower = text.toLowerCase().trim();
  if (lower.length < 3) return { cardType: 'consistency', isIrrelevant: true };

  // Phase 1: keyword scoring with word boundaries + phrase bonuses
  let bestType: QuestionCardType = 'consistency';
  let bestScore = 0;

  for (const type of Object.keys(CARD_KEYWORDS) as QuestionCardType[]) {
    const score = keywordScore(lower, type);
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  if (bestScore > 0) {
    return { cardType: bestType, isIrrelevant: false };
  }

  // Phase 2: world-entity matching — if the question names a location, route to route_probe
  if (world) {
    for (const loc of world.locations) {
      if (lower.includes(loc.name.toLowerCase())) {
        return { cardType: 'route_probe', isIrrelevant: false };
      }
    }
  }

  // Phase 3: confrontational "why" or imperative commands → consistency
  const confrontationalWhy = /\bwhy\b.*(lie|lying|lied|hide|hiding|kill|murder|afraid|nervous|run|scared|guilty|deny)/i.test(lower);
  const imperative = /^(talk|spill|confess|answer|speak|cooperate|explain)\b/i.test(lower);
  if (confrontationalWhy || imperative) {
    return { cardType: 'consistency', isIrrelevant: false };
  }

  // Phase 4: investigative-pattern fallback — route to best-fit category
  const hasWhere = /\bwhere\b/.test(lower);
  const startsWithWhen = /^when\b/.test(lower);
  const startsWithWho = /^who\b/.test(lower);
  const startsWithHow = /^how\b/.test(lower);
  const isQuestion = /\?$/.test(lower) || /^(what|where|who|how|why|when|did|were|was|tell|explain|describe)\b/.test(lower);
  const mentionsYou = /\b(you|your|yourself)\b/.test(lower);

  if (isQuestion || mentionsYou) {
    if (hasWhere) return { cardType: 'route_probe', isIrrelevant: false };
    if (startsWithWhen) return { cardType: 'bell_probe', isIrrelevant: false };
    if (startsWithWho) return { cardType: 'witness_probe', isIrrelevant: false };
    if (startsWithHow) return { cardType: 'detail_trap', isIrrelevant: false };
    return { cardType: 'detail_trap', isIrrelevant: false };
  }

  return { cardType: 'consistency', isIrrelevant: true };
}

/** Auto-target resolution for voice/typed questions. */
export function autoResolveTarget(
  cardType: QuestionCardType,
  text: string,
  suspect?: Suspect,
  world?: WorldModel,
): number | undefined {
  const lower = text.toLowerCase();

  if (cardType === 'bell_probe') {
    const bellWords = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
    for (let i = 0; i < bellWords.length; i++) {
      if (lower.includes(bellWords[i])) return i;
    }
    return 0;
  }

  if (cardType === 'route_probe' || cardType === 'sense_probe' || cardType === 'detail_trap') {
    if (suspect && world) {
      const locationNames = world.locations.map(l => l.name.toLowerCase());
      const segments = suspect.claimVector.segments;

      for (let slotIdx = 0; slotIdx < Math.min(segments.length, 3); slotIdx++) {
        const seg = segments[slotIdx];
        const fromName = world.locations.find(l => l.id === seg.from)?.name?.toLowerCase() ?? '';
        const toName = world.locations.find(l => l.id === seg.to)?.name?.toLowerCase() ?? '';

        if ((fromName && lower.includes(fromName)) || (toName && lower.includes(toName))) {
          return slotIdx;
        }
      }

      for (const locName of locationNames) {
        if (locName && lower.includes(locName)) {
          const locId = world.locations.find(l => l.name.toLowerCase() === locName)?.id;
          if (locId) {
            for (let i = 0; i < Math.min(segments.length, 3); i++) {
              if (segments[i].from === locId || segments[i].to === locId) return i;
            }
          }
        }
      }
    }
    return 0;
  }

  return undefined;
}

// --- localStorage key helpers ---

export function localStorageKeyForAnswer(
  seed: number,
  suspectId: string,
  cardType: string,
  pressure: number,
  targetKey: string,
  mode?: string,
): string {
  const modePrefix = mode ? `${mode}:` : '';
  return `coven:interrogation:${modePrefix}${seed}:${suspectId}:${cardType}:${pressure}:${targetKey}`;
}

export function localStorageKeyForOpening(seed: number, suspectId: string, mode?: string): string {
  const modePrefix = mode ? `${mode}:` : '';
  return `coven:interrogation:${modePrefix}${seed}:${suspectId}:opening`;
}

const INDEX_KEY = (seed: number, mode?: string) => {
  const modePrefix = mode ? `${mode}:` : '';
  return `coven:interrogation:${modePrefix}${seed}:_index`;
};
const MAX_ANSWERS_PER_SEED = 60;

export function cacheAnswer(seed: number, key: string, text: string, mode?: string): void {
  try {
    const indexStr = localStorage.getItem(INDEX_KEY(seed, mode));
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];
    while (index.length >= MAX_ANSWERS_PER_SEED) {
      const oldest = index.shift()!;
      localStorage.removeItem(oldest);
    }
    localStorage.setItem(key, text);
    if (!index.includes(key)) index.push(key);
    localStorage.setItem(INDEX_KEY(seed, mode), JSON.stringify(index));
  } catch {
    // localStorage full — silently fail
  }
}

export function getCachedAnswer(key: string): string | null {
  return localStorage.getItem(key);
}
