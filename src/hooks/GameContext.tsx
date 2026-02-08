import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GameState, WorldReveal, Evidence, StrikeDelta, AnswerChip, RevealedClaimDetail, QuestionCardType } from '../types/index.js';
import { loadPuzzleForToday, saveGameState, getHintFact } from '../engine/orchestrator.js';
import { evaluateAllStrikes, stableFactId, hintFactId } from '../engine/contradictions.js';
import type { GeneratedPuzzle } from '../types/index.js';
import { useThemeStrict } from './ThemeContext.js';
import type { GameMode } from '../themes/types.js';

type GameAction =
  | { type: 'INIT_PUZZLE' }
  | { type: 'DRAW_CARD'; cardId: string }
  | { type: 'USE_HINT' }
  | { type: 'ACCUSE'; suspectId: string }
  | { type: 'FINISH_ACCUSATION' }
  | { type: 'RESET'; seed?: number }
  | { type: 'SPEND_INTERROGATION_TOKEN' }
  | { type: 'ADD_ANSWER_CHIP'; chip: AnswerChip }
  | { type: 'INCREMENT_TTS_CALLS'; kind: 'defense' | 'interrogation' }
  | { type: 'INCREMENT_STT_CALLS' }
  | { type: 'REVEAL_CLAIM'; suspectId: string; claimType: QuestionCardType; slotIndex?: number }
  | { type: 'MARK_OPENING_HEARD'; suspectId: string }
  | { type: 'TOGGLE_MARK_SUSPECT'; suspectId: string };

interface GameContextValue {
  state: GameState;
  puzzle: GeneratedPuzzle | null;
  dispatch: React.Dispatch<GameAction>;
  suspectsByStrikes: { id: string; name: string; strikes: number }[];
  canDraw: boolean;
  canAccuse: boolean;
  mode: GameMode;
}

const GameContext = createContext<GameContextValue | null>(null);

let currentPuzzle: GeneratedPuzzle | null = null;

function ensureRevealed(state: GameState, suspectId: string): RevealedClaimDetail {
  return state.revealedClaims[suspectId] ?? {
    bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false,
  };
}

/** Build stable fact IDs from the current revealed facts list. */
function buildRevealedFactIds(state: GameState): string[] {
  const ids: string[] = [];
  // Each drawn card contributes headline + secondary (2 facts per card)
  for (const cardId of state.drawnCards) {
    ids.push(stableFactId(cardId, 'headline'));
    ids.push(stableFactId(cardId, 'secondary'));
  }
  // Hint fact is appended last
  if (state.hintUsed && state.hintFact) {
    ids.push(hintFactId(state.hintFact.type));
  }
  return ids;
}

function toRoman(n: number): string {
  const numerals: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let result = '';
  let remaining = n;
  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

function computeStrikesOnAccuse(state: GameState): GameState {
  if (!state.world || state.suspects.length === 0) return state;

  const factIds = buildRevealedFactIds(state);

  const deltas = evaluateAllStrikes(
    state.suspects.map(s => ({ id: s.id, claimVector: s.claimVector })),
    state.revealedFacts,
    state.world,
    'accusation',
    state.revealedClaims,
    factIds,
  );

  const deltaMap = new Map<string, StrikeDelta>();
  for (const d of deltas) deltaMap.set(d.suspectId, d);

  const updatedSuspects = state.suspects.map(s => {
    const delta = deltaMap.get(s.id);
    if (!delta) return s;

    const formattedEvidence: Evidence[] = delta.evidence.map((e, i) => ({
      ...e,
      description: `Mark ${toRoman(i + 1)}: ${e.description}`,
    }));

    return { ...s, strikes: delta.strikes, evidence: formattedEvidence };
  });

  return { ...state, suspects: updatedSuspects };
}

function createGameReducer(mode: GameMode, templates: import('../themes/types.js').ThemeTemplates, core: import('../themes/types.js').ThemeCoreArrays) {
  return function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case 'INIT_PUZZLE': {
        const { puzzle, gameState } = loadPuzzleForToday(mode, core, templates);
        currentPuzzle = puzzle;
        // No recomputeStrikes — all suspects start with 0 strikes
        // Auto-reveal opening defense for all suspects so locations are visible from the start
        const autoRevealedClaims: Record<string, RevealedClaimDetail> = {};
        for (const s of gameState.suspects) {
          const existing = gameState.revealedClaims[s.id] ?? {
            bells: [], route: false, anchor: false, object: false, sense: false, openingHeard: false,
          };
          autoRevealedClaims[s.id] = { ...existing, openingHeard: true };
        }
        return {
          ...gameState,
          phase: gameState.phase === 'loading' ? 'investigating' : gameState.phase,
          revealedClaims: { ...gameState.revealedClaims, ...autoRevealedClaims },
        };
      }

      case 'DRAW_CARD': {
        if (state.drawnCards.length >= 4) return state;
        if (state.drawnCards.includes(action.cardId)) return state;

        const card = state.runeDeck.find(c => c.id === action.cardId);
        if (!card) return state;

        const drawNum = state.drawnCards.length + 1;
        const cost = drawNum <= 2 ? 80 : drawNum === 3 ? 160 : 240;

        const newDrawn = [...state.drawnCards, action.cardId];
        const newReveals: WorldReveal[] = [...state.revealedFacts, card.headline, card.secondary];
        const newScore = state.score - cost;
        const extraDraw = drawNum > 2;

        // No recomputeStrikes — facts accumulate, strikes computed at ACCUSE
        return {
          ...state,
          drawnCards: newDrawn,
          revealedFacts: newReveals,
          score: newScore,
          phase: state.phase,
          usedExtraDraw: state.usedExtraDraw || extraDraw,
        };
      }

      case 'USE_HINT': {
        if (state.hintUsed || !currentPuzzle) return state;

        const hintFact = getHintFact(currentPuzzle, templates);
        if (!hintFact) return state;

        // No recomputeStrikes
        return {
          ...state,
          hintUsed: true,
          hintFact,
          revealedFacts: [...state.revealedFacts, hintFact],
          score: state.score - 160,
        };
      }

      case 'ACCUSE': {
        if (state.phase === 'ended' || state.phase === 'accusing') return state;

        const liar = state.suspects.find(s => s.isLiar);
        const won = liar?.id === action.suspectId;

        // Compute strikes NOW using only revealed facts + revealed claims
        const stateWithStrikes = computeStrikesOnAccuse(state);

        return {
          ...stateWithStrikes,
          phase: 'accusing',
          accusation: action.suspectId,
          won,
        };
      }

      case 'FINISH_ACCUSATION': {
        if (state.phase !== 'accusing') return state;

        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const timePenalty = Math.min(elapsed * 3, 300);

        return {
          ...state,
          phase: 'ended',
          elapsedSeconds: elapsed,
          score: state.won ? Math.max(0, state.score - timePenalty) : 0,
        };
      }

      case 'RESET': {
        if (typeof window !== 'undefined') {
          const modePrefix = `coven:v`;
          const keys = Object.keys(localStorage).filter(k =>
            k.startsWith(modePrefix) && k.includes(`:${mode}:`)
          );
          keys.forEach(k => localStorage.removeItem(k));
          if (action.seed != null) {
            const url = new URL(window.location.href);
            url.searchParams.set('seed', String(action.seed));
            window.history.replaceState({}, '', url.toString());
          }
        }
        const { puzzle, gameState } = loadPuzzleForToday(mode, core, templates);
        currentPuzzle = puzzle;
        // No recomputeStrikes — clean slate
        return { ...gameState, phase: 'investigating', startTime: Date.now() };
      }

      case 'SPEND_INTERROGATION_TOKEN': {
        if (state.interrogationTokens <= 0) return state;
        return { ...state, interrogationTokens: state.interrogationTokens - 1, score: state.score - 25 };
      }

      case 'ADD_ANSWER_CHIP': {
        return { ...state, answerChips: [...state.answerChips, action.chip] };
      }

      case 'INCREMENT_TTS_CALLS': {
        if (action.kind === 'defense') {
          return { ...state, defenseTtsCalls: state.defenseTtsCalls + 1 };
        }
        return { ...state, interrogationTtsCalls: state.interrogationTtsCalls + 1 };
      }

      case 'INCREMENT_STT_CALLS': {
        return { ...state, sttCalls: state.sttCalls + 1 };
      }

      case 'REVEAL_CLAIM': {
        const current = ensureRevealed(state, action.suspectId);
        let next: RevealedClaimDetail;

        switch (action.claimType) {
          case 'bell_probe':
            if (action.slotIndex != null) {
              next = { ...current, bells: [...new Set([...current.bells, action.slotIndex])] };
            } else {
              next = current;
            }
            break;
          case 'route_probe':
            next = { ...current, route: true };
            break;
          case 'anchor_probe':
            next = { ...current, anchor: true };
            break;
          case 'object_probe':
            next = { ...current, object: true };
            break;
          case 'sense_probe':
            next = { ...current, sense: true };
            break;
          default:
            next = current;
        }

        return {
          ...state,
          revealedClaims: { ...state.revealedClaims, [action.suspectId]: next },
        };
      }

      case 'MARK_OPENING_HEARD': {
        const current = ensureRevealed(state, action.suspectId);
        const next = { ...current, openingHeard: true };
        return {
          ...state,
          revealedClaims: { ...state.revealedClaims, [action.suspectId]: next },
        };
      }

      case 'TOGGLE_MARK_SUSPECT': {
        const exists = state.markedSuspects.includes(action.suspectId);
        return {
          ...state,
          markedSuspects: exists
            ? state.markedSuspects.filter(id => id !== action.suspectId)
            : [...state.markedSuspects, action.suspectId],
        };
      }

      default:
        return state;
    }
  };
}

const initialState: GameState = {
  phase: 'loading',
  seed: 0,
  suspects: [],
  runeDeck: [],
  drawnCards: [],
  revealedFacts: [],
  hintUsed: false,
  score: 1000,
  startTime: Date.now(),
  world: {
    locations: [],
    edges: [],
    anchor: { bell: 0 as never, location: '', description: '' },
    environmentFacts: [],
    relicTruth: { holder: '', relic: '', location: '' },
  },
  interrogationTokens: 6,
  answerChips: [],
  interrogationTtsCalls: 0,
  defenseTtsCalls: 0,
  sttCalls: 0,
  revealedClaims: {},
  markedSuspects: [],
};

export function GameProvider({ children }: { children: ReactNode }) {
  const { theme, mode } = useThemeStrict();
  const { core, templates } = theme;

  const [state, dispatch] = useReducer(createGameReducer(mode, templates, core), initialState);

  useEffect(() => {
    dispatch({ type: 'INIT_PUZZLE' });
  }, []);

  // Auto-save on state changes
  useEffect(() => {
    if (state.phase !== 'loading' && state.seed) {
      saveGameState(state.seed, mode, state);
    }
  }, [state, mode]);

  // During investigating, all suspects have 0 strikes (not computed yet)
  // During ended, show actual computed values
  const suspectsByStrikes = [...state.suspects]
    .map(s => ({ id: s.id, name: s.name, strikes: s.strikes }))
    .sort((a, b) => b.strikes - a.strikes);

  const canDraw = state.drawnCards.length < 4 && state.phase !== 'ended' && state.phase !== 'accusing';
  const canAccuse = state.drawnCards.length >= 2 && state.phase !== 'ended' && state.phase !== 'accusing';

  return (
    <GameContext.Provider value={{ state, puzzle: currentPuzzle, dispatch, suspectsByStrikes, canDraw, canAccuse, mode }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
