import type { Bell, RuneArchetype, ContradictionType } from '../types/index.js';

// ─── Game Mode ───────────────────────────────────────────────
export type GameMode = 'ledger' | 'gaslight' | 'casefile';

// ─── Core Arrays ─────────────────────────────────────────────
// Index-picked pools. ALL must be length 6.
// worldgen picks indices from N=6, stores indices in WorldStructure.
// Theme arrays are labels applied AFTER generation.
export interface ThemeCoreArrays {
  locations: readonly [string, string, string, string, string, string];
  suspectNames: readonly [string, string, string, string, string, string];
  suspectRoles: readonly [string, string, string, string, string, string];
  relics: readonly [string, string, string, string, string, string];
  scents: readonly [string, string, string, string, string, string];
}

// ─── Templates ───────────────────────────────────────────────
// Narrative flavor — lengths can vary (except display name records).
export interface ThemeTemplates {
  // Display names for engine structural constants
  runeNames: Record<RuneArchetype, { name: string; description: string }>;
  bellNames: Record<Bell, string>;
  bellLabelsShort: Record<Bell, string>;  // compact labels for timeline ticks
  contradictionLabels: Record<ContradictionType, string>;

  // Narrative templates
  environmentDescriptors: readonly string[];
  alibiTemplates: readonly string[];
  hornTemplates: readonly string[];
  relicTemplates: readonly string[];
  scentTemplates: readonly string[];

  // Interrogation templates
  bellTemplates: readonly string[];
  bellDeflection: string;
  routeTemplates: readonly string[];
  anchorTemplates: readonly string[];
  anchorNone: string;
  objectTemplates: readonly string[];
  objectNone: string;
  senseTemplates: readonly string[];
  senseNone: string;
  witnessPool: readonly string[];
  witnessTemplates: readonly string[];
  consistencyTemplates: readonly string[];
  detailPublicFlavor: readonly string[];
  openingTemplates: readonly string[];
  fillerNeutral: readonly string[];

  // Refusal text per temperament
  refusals: Record<string, string>;
  partialRefusalSuffix: string;    // "{loc} {bell}" — appended to refusals to give partial info

  // Rune fact phrasing
  anchorDescription: string;      // "The watch-horn sounded at {bell} from {loc}"
  roadFactTemplate: string;       // "The road from {from} to {to} requires..."
  roadFactNoShorter: string;      // "No shorter crossing exists"
  relicHolderDesc: string;        // "was borne by one alone"
  relicLocationDesc: string;      // "was seen at a single location"
  relicLocationFact: string;      // "The relic was last seen within {loc}"
  envFactTemplate: string;        // "The air at {loc} carried..."
  hintPrefix: string;             // "A Law of Stone:"
  movementFactGate: string;       // "the gate to {to} stands {bells} bell(s) distant"

  // Blame-shifting / innocence lines (appended to answers under pressure)
  blameTemplates: Record<string, readonly string[]>;  // temperament → blame lines with {name}
  innocenceLines: readonly string[];

  // Speaker map for TTS
  speakerMap: Record<string, string>;
}

// ─── Copy ────────────────────────────────────────────────────
// UI strings — game title, prompts, tutorial text, etc.
export interface ThemeCopy {
  gameTitle: string;
  gameSubtitle: string;
  oathTexts: readonly string[];
  liarLabel: string;              // "Oathbreaker" / "The Deceiver" / "Subject Zero"
  drawSectionTitle: string;       // "Runes of the Elders" / "Evidence Dossier"
  drawPrompt: string;             // "Draw your first rune to begin"
  drawVerb: string;               // "Draw" / "Open" / "Access"
  drawNounPlural: string;         // "runes" / "dossiers" / "case files"
  drawnLabel: string;             // "Drawn" / "Opened" / "Accessed"
  accuseVerb: string;             // "Name as Oathbreaker" / "Identify as Deceiver"
  accusePrompt: string;           // "Speak the name." / "Name the suspect."
  accuseHoldText: string;         // "Hold to seal your accusation"
  hintLabel: string;              // "Law of Stone" / "Scotland Yard Tip"
  footerText: string;             // "The Ledger of the Watch — A daily mystery"
  microHookIcon: string;          // "🎺" / "🕯" / "📱"
  microHookText: string;          // "Second Bell. One oath is broken."
  welcomeToastText: string;       // "Draw 2 runes. Name the Oathbreaker."
  verdictWin: string;             // "SURVIVED" / "CASE CLOSED"
  verdictLose: string;            // "FALLEN" / "CASE COLD"
  verdictWinFlavor: string;       // "The covenant endures."
  verdictLoseFlavor: string;      // "The covenant is broken."
  loadingText: string;            // "Consulting the Elder Runes"
  modeTransitionText: string;     // "Rebinding the Case..." / "Loading Case File..."
  switchModeConfirm: string;      // "Resets current case. Continue?"
  interrogateLabel: string;       // "Interrogate" / "Question"
  evidenceLabels: Record<ContradictionType, string>;
  stampWin: string;               // "Watch Record: Clean"
  stampMercy: string;             // "Watch Record: Mercy"
  stampLose: string;              // "Watch Record: Fallen"
  practiceButton: string;         // "Consult Another Chronicle"
  tomorrowTease: string;          // "The next Chronicle opens at 00:00 UTC."
  tagline: string;                // For welcome screen card

  // Tutorial/How-to-play parametrization
  tutorialWelcomeTitle: string;   // "Welcome, Watcher" / "Good Evening" / "Agent Briefing"
  tutorialWelcomeBody: string;    // First tutorial step body text
  groupLabel: string;             // "the Watch" / "the household" / "the team"
  mapLabel: string;               // "The Crossing" / "The Estate" / "The Building"
  timePeriodLabel: string;        // "bells" / "hours" / "time blocks"
  travelUnitShort: string;        // "b" / "hr" / "hr" — shown on map edges
  howToPlayTitle: string;         // "Watcher's Codex" / "Investigator's Guide" / "Field Manual"
  howToPlayReturnButton: string;  // "Return to the Watch" / "Back to the Investigation"
  storyIntro: string;             // Intro paragraph for how-to-play
  storyVillain: string;           // Villain intro paragraph for how-to-play
}

// ─── Visuals ─────────────────────────────────────────────────
export interface ThemeVisuals {
  // CSS variable overrides (applied via data-theme attribute)
  cssVars: Record<string, string>;
  headingFont: string;            // CSS font-family for headings
  headingFontClass: string;       // Tailwind class e.g. "font-cinzel"
  headingDecFont: string;         // Decorative heading font
  headingDecFontClass: string;    // e.g. "font-cinzel-dec"
  portraitStyle: 'fantasy' | 'gaslight' | 'casefile';
}

// ─── Full Theme Config ───────────────────────────────────────
export interface ThemeConfig {
  id: GameMode;
  core: ThemeCoreArrays;
  templates: ThemeTemplates;
  copy: ThemeCopy;
  visuals: ThemeVisuals;
}
