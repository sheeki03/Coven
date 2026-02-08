export type Bell = 0 | 1 | 2 | 3 | 4 | 5;
export type LocationId = string;
export type ContradictionType = 'time' | 'movement' | 'object' | 'environment';

export interface Coords {
  x: number;
  y: number;
}

export interface Location {
  id: LocationId;
  name: string;
  coords: Coords;
}

export interface TravelEdge {
  from: LocationId;
  to: LocationId;
  minutes: number;
  bellsRequired: number;
}

export interface TimestampAnchor {
  bell: Bell;
  location: LocationId;
  description: string; // "The watch-horn sounded at Second Bell from the Ford"
}

export interface EnvironmentFact {
  location: LocationId;
  fact: string;       // "Mist blanketed Ash Grove all morning"
  scent?: string;     // "pine smoke"
  fromBell: Bell;
  toBell: Bell;
}

export interface WorldModel {
  locations: Location[];
  edges: TravelEdge[];
  anchor: TimestampAnchor;
  environmentFacts: EnvironmentFact[];
  relicTruth: { holder: string; relic: string; location: LocationId };
}

export interface Segment {
  from: LocationId;
  to: LocationId;       // from === to means "stayed put"
  departBell: Bell;
  arriveBell: Bell;
}

export interface ClaimVector {
  suspectId: string;
  segments: Segment[];              // 1-2 segments for MVP
  heardHornAt?: { bell: Bell; where: LocationId };
  carriedRelic?: string;
  sensed?: { scent: string; where: LocationId };
}

export interface Evidence {
  type: ContradictionType;
  description: string;    // "Mark I: No road reaches Ash Grove in one bell from Stone Gate."
  cardId: string;
  relatedSegmentIndex?: number;
  sourceFactIds?: string[];  // stable IDs (card ID or "${cardId}:headline") — NOT array indices
}

export interface StrikeDelta {
  suspectId: string;
  strikes: number;
  evidence: Evidence[];
}

export interface PairExplanation {
  liarStrikes: number;
  runnerUpStrikes: number;
  separationMargin: number;
  triggeredChecks: ContradictionType[];
}

export interface SolvabilityProof {
  bestPair: [string, string];
  pairRankings: Record<string, StrikeDelta[]>;
  pairExplanations: Record<string, PairExplanation>;
  tiePairs: string[];
  hintEffect: Record<string, StrikeDelta[]>;
}

export interface RegenerationLog {
  attemptCount: number;
  suffixUsed: number;
  failReasons: string[];
}

export type RuneArchetype = 'oaths' | 'roads' | 'relics' | 'skies';

export interface WorldReveal {
  type: ContradictionType;
  fact: string;
  targetsSuspects: string[];  // suspect IDs this fact creates contradictions for
}

export interface RuneCard {
  id: string;
  archetype: RuneArchetype;
  name: string;           // "Rune of Oaths"
  headline: WorldReveal;  // always targets liar
  secondary: WorldReveal; // controlled non-liar texture
}

export type GamePhase = 'loading' | 'investigating' | 'accusing' | 'ended';

export interface RevealedClaimDetail {
  bells: number[];          // which bell indices have been probed (0-5)
  route: boolean;           // route timing revealed via route_probe
  anchor: boolean;          // horn claim revealed via anchor_probe
  object: boolean;          // relic claim revealed via object_probe
  sense: boolean;           // scent claim revealed via sense_probe
  openingHeard: boolean;    // heard opening defense (free)
}

// --- Interrogation types ---

export type Temperament = 'timid' | 'arrogant' | 'annoyed' | 'talkative' | 'clipped' | 'poetic';

export type QuestionCardType =
  | 'bell_probe'
  | 'route_probe'
  | 'anchor_probe'
  | 'object_probe'
  | 'sense_probe'
  | 'witness_probe'
  | 'consistency'
  | 'detail_trap';

export type AnswerChipType = 'claim' | 'evasion' | 'refusal' | 'deflection';
export type EvasionLevel = 'none' | 'slight' | 'moderate' | 'heavy';

export interface TemperamentBands {
  wordRange: { min: number; max: number };
  refusalProb: number;
}

export interface AnswerSpec {
  anchors: string[];
  evasionLevel: EvasionLevel;
  temperament: Temperament;
  referencedSegmentIndex?: number;
  referencedLocationId?: string;
  chipSummary: string;
  chipType: AnswerChipType;
  templateKey: string;
}

export interface AnswerChip {
  suspectId: string;
  cardType: QuestionCardType | 'opening';
  pressure: number;
  chipSummary: string;
  chipType: AnswerChipType;
  referencedSegmentIndex?: number;
  referencedLocationId?: string;
  target?: { bellIndex?: number; loc1?: number; loc2?: number; loc?: number };
  fullTextKey: string;
}

export interface InterrogationTarget {
  cardType: QuestionCardType;
  slotIndex: number;  // abstract index (0-2 for route/sense, 0-5 for bell)
}

export type WatchRank = 'Initiate' | 'Warden' | 'Oathkeeper' | 'High Watch';

export interface Suspect {
  id: string;
  name: string;
  role: string;
  claimVector: ClaimVector;
  narrativeAlibi: string;
  strikes: number;
  evidence: Evidence[];
  isLiar: boolean;        // only revealed at end
}

export interface GameState {
  phase: GamePhase;
  seed: number;
  suspects: Suspect[];
  runeDeck: RuneCard[];
  drawnCards: string[];     // card IDs
  revealedFacts: WorldReveal[];
  hintUsed: boolean;
  hintFact?: WorldReveal;
  accusation?: string;     // suspect ID
  won?: boolean;
  score: number;
  startTime: number;
  elapsedSeconds?: number;  // snapshot at game end for stable achievement checks
  world: WorldModel;
  usedExtraDraw?: boolean;  // 3rd/4th draw used — guarantees Mercy stamp
  newStrikes?: { suspectId: string; evidence: Evidence }[];  // flash on new contradictions
  interrogationTokens: number;  // "Council Favors" — starts at 6
  answerChips: AnswerChip[];
  interrogationTtsCalls: number;   // tracks TTS calls for follow-ups (cap: 8)
  defenseTtsCalls: number;         // tracks TTS calls for opening defenses (cap: 12)
  sttCalls: number;                // tracks STT calls (cap: 6)
  revealedClaims: Record<string, RevealedClaimDetail>;
  markedSuspects: string[];  // suspect IDs manually marked by player
}

export interface GeneratedPuzzle {
  seed: number;
  world: WorldModel;
  suspects: Suspect[];
  runeDeck: RuneCard[];
  liarId: string;
  solvabilityProof: SolvabilityProof;
  regenerationLog: RegenerationLog;
}

export const ENGINE_VERSION = 2;
