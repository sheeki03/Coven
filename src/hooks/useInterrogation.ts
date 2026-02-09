/**
 * Interrogation state machine + context provider.
 * Manages chamber open/close, question flow, TTS playback, answer generation.
 */

import { createContext, useContext, useReducer, useCallback, useRef, useState, type ReactNode } from 'react';
import { createElement } from 'react';
import type { Suspect, QuestionCardType, AnswerChip, AnswerSpec } from '../types/index.js';
import { useGame } from './GameContext.js';
import { useThemeStrict } from './ThemeContext.js';
import {
  generateAnswerSpec, generateOpeningDefense, expandAnswerText,
  classifyQuestion, autoResolveTarget, canonicalTargetKey,
  localStorageKeyForAnswer, localStorageKeyForOpening,
  cacheAnswer, getCachedAnswer, getTemperament,
} from '../engine/interrogation.js';
import { textToSpeech, speechToText, getSpeaker, getTtsPace } from '../services/sarvam.js';

// --- State ---

type ChamberPhase = 'idle' | 'chamber' | 'picking_target' | 'processing' | 'answering';

interface InterrogationState {
  phase: ChamberPhase;
  activeSuspect: Suspect | null;
  activeCardType: QuestionCardType | null;
  activeSlotIndex: number | null;
  currentAnswer: string | null;
  currentSpec: AnswerSpec | null;
  isPlaying: boolean;
  error: string | null;
}

type InterrogationAction =
  | { type: 'OPEN_CHAMBER'; suspect: Suspect }
  | { type: 'CLOSE_CHAMBER' }
  | { type: 'SELECT_CARD'; cardType: QuestionCardType }
  | { type: 'SELECT_TARGET'; slotIndex: number }
  | { type: 'CLEAR_CARD' }
  | { type: 'START_PROCESSING' }
  | { type: 'SET_ANSWER'; answer: string; spec: AnswerSpec }
  | { type: 'UPDATE_ANSWER_TEXT'; answer: string }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_ERROR'; error: string };

function interrogationReducer(state: InterrogationState, action: InterrogationAction): InterrogationState {
  switch (action.type) {
    case 'OPEN_CHAMBER':
      return { ...state, phase: 'chamber', activeSuspect: action.suspect, activeCardType: null, activeSlotIndex: null, currentAnswer: null, currentSpec: null, isPlaying: false, error: null };
    case 'CLOSE_CHAMBER':
      return { ...state, phase: 'idle', activeSuspect: null, activeCardType: null, activeSlotIndex: null, currentAnswer: null, currentSpec: null, isPlaying: false, error: null };
    case 'SELECT_CARD':
      return { ...state, phase: 'picking_target', activeCardType: action.cardType, activeSlotIndex: null };
    case 'SELECT_TARGET':
      return { ...state, activeSlotIndex: action.slotIndex };
    case 'CLEAR_CARD':
      return { ...state, phase: 'chamber', activeCardType: null, activeSlotIndex: null };
    case 'START_PROCESSING':
      return { ...state, phase: 'processing', currentAnswer: null, currentSpec: null };
    case 'SET_ANSWER':
      return { ...state, phase: 'answering', currentAnswer: action.answer, currentSpec: action.spec };
    case 'UPDATE_ANSWER_TEXT':
      return { ...state, currentAnswer: action.answer };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.playing };
    case 'SET_ERROR':
      return { ...state, error: action.error, phase: 'chamber' };
    default:
      return state;
  }
}

const initialInterrogationState: InterrogationState = {
  phase: 'idle',
  activeSuspect: null,
  activeCardType: null,
  activeSlotIndex: null,
  currentAnswer: null,
  currentSpec: null,
  isPlaying: false,
  error: null,
};

// --- Context ---

interface InterrogationContextValue {
  interrogation: InterrogationState;
  openChamber: (suspect: Suspect) => void;
  closeChamber: () => void;
  selectCard: (cardType: QuestionCardType) => void;
  confirmTarget: (slotIndex: number) => void;
  clearCard: () => void;
  playDefense: () => Promise<void>;
  submitQuestion: (text: string) => void;
  submitVoice: (blob: Blob) => void;
  skipAudio: () => void;
  suspectPressure: (suspectId: string) => number;
  voiceOff: boolean;
  isTranscribing: boolean;
}

const InterrogationContext = createContext<InterrogationContextValue | null>(null);

// Caps
const MAX_DEFENSE_TTS = 12;
const MAX_INTERROGATION_TTS = 8;

export function InterrogationProvider({ children }: { children: ReactNode }) {
  const { state: gameState, dispatch: gameDispatch, mode } = useGame();
  const { theme } = useThemeStrict();
  const templates = theme.templates;
  const [interrogation, localDispatch] = useReducer(interrogationReducer, initialInterrogationState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const voiceOff = typeof window !== 'undefined' && localStorage.getItem('coven:voiceOff') === '1';
  const [isTranscribing, setIsTranscribing] = useState(false);

  const suspectPressure = useCallback((suspectId: string): number => {
    return gameState.answerChips.filter(
      c => c.suspectId === suspectId && c.chipType !== 'deflection'
    ).length;
  }, [gameState.answerChips]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    localDispatch({ type: 'SET_PLAYING', playing: false });
  }, []);

  const playTts = useCallback(async (text: string, suspectName: string, temperament: string, pressure: number, kind: 'defense' | 'interrogation'): Promise<void> => {
    if (voiceOff) return;

    // Check caps
    if (kind === 'defense' && gameState.defenseTtsCalls >= MAX_DEFENSE_TTS) return;
    if (kind === 'interrogation' && gameState.interrogationTtsCalls >= MAX_INTERROGATION_TTS) return;

    const controller = new AbortController();
    abortRef.current = controller;
    localDispatch({ type: 'SET_PLAYING', playing: true });

    const speaker = getSpeaker(suspectName, templates.speakerMap);
    const pace = getTtsPace(temperament, pressure);

    const url = await textToSpeech({ text, speaker, pace, signal: controller.signal });

    if (url && !controller.signal.aborted) {
      gameDispatch({ type: 'INCREMENT_TTS_CALLS', kind });
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => localDispatch({ type: 'SET_PLAYING', playing: false });
      try {
        await audio.play();
      } catch {
        // Autoplay blocked — user will see text
        localDispatch({ type: 'SET_PLAYING', playing: false });
      }
    } else {
      localDispatch({ type: 'SET_PLAYING', playing: false });
    }
  }, [voiceOff, gameState.defenseTtsCalls, gameState.interrogationTtsCalls, gameDispatch]);

  const openChamber = useCallback((suspect: Suspect) => {
    localDispatch({ type: 'OPEN_CHAMBER', suspect });

    // Prefetch defense TTS in background so it's cached when user clicks play
    if (!voiceOff && gameState.defenseTtsCalls < MAX_DEFENSE_TTS) {
      const cKey = localStorageKeyForOpening(gameState.seed, suspect.id, mode);
      const cached = getCachedAnswer(cKey);
      const { text } = generateOpeningDefense(suspect, gameState.world, gameState.seed, templates);
      const defenseText = cached ?? text;
      const temperament = getTemperament(gameState.seed, suspect.id);
      const speaker = getSpeaker(suspect.name, templates.speakerMap);
      const pace = getTtsPace(temperament, 0);
      // Fire-and-forget — just warms the cache
      textToSpeech({ text: defenseText, speaker, pace }).catch(() => {});
    }
  }, [voiceOff, gameState.defenseTtsCalls, gameState.seed, gameState.world, mode, templates]);

  const closeChamber = useCallback(() => {
    stopAudio();
    localDispatch({ type: 'CLOSE_CHAMBER' });
  }, [stopAudio]);

  const selectCard = useCallback((cardType: QuestionCardType) => {
    // Cards that don't need targeting
    const noTarget: QuestionCardType[] = ['anchor_probe', 'object_probe', 'witness_probe', 'consistency'];
    if (noTarget.includes(cardType)) {
      localDispatch({ type: 'SELECT_CARD', cardType });
      // Auto-confirm with no slot
      localDispatch({ type: 'SELECT_TARGET', slotIndex: -1 });
    } else {
      localDispatch({ type: 'SELECT_CARD', cardType });
    }
  }, []);

  const processAnswer = useCallback(async (suspect: Suspect, cardType: QuestionCardType, slotIndex: number | undefined, isIrrelevant: boolean) => {
    localDispatch({ type: 'START_PROCESSING' });

    const pressure = suspectPressure(suspect.id);
    const targetKey = canonicalTargetKey(cardType, slotIndex != null && slotIndex >= 0 ? slotIndex : undefined);

    // Check cache first
    const cKey = localStorageKeyForAnswer(gameState.seed, suspect.id, cardType, pressure, targetKey, mode);
    const cached = getCachedAnswer(cKey);

    const spec = generateAnswerSpec(suspect, cardType, pressure, gameState.world, gameState.seed, slotIndex != null && slotIndex >= 0 ? slotIndex : undefined, templates);
    const templateText = cached ?? expandAnswerText(spec, suspect, gameState.world, gameState.seed, pressure, targetKey, templates);

    // Build chip
    const chip: AnswerChip = {
      suspectId: suspect.id,
      cardType,
      pressure,
      chipSummary: spec.chipSummary,
      chipType: isIrrelevant ? 'deflection' : spec.chipType,
      referencedSegmentIndex: spec.referencedSegmentIndex,
      referencedLocationId: spec.referencedLocationId,
      target: slotIndex != null && slotIndex >= 0 ? { bellIndex: cardType === 'bell_probe' ? slotIndex : undefined, loc: cardType !== 'bell_probe' ? slotIndex : undefined } : undefined,
      fullTextKey: cKey,
    };

    // Commit chip + spend token IMMEDIATELY (before any async work)
    gameDispatch({ type: 'ADD_ANSWER_CHIP', chip });
    if (!isIrrelevant) {
      gameDispatch({ type: 'SPEND_INTERROGATION_TOKEN' });
    }

    // Reveal claim detail based on probe type
    const revealTypes: QuestionCardType[] = ['bell_probe', 'route_probe', 'anchor_probe', 'object_probe', 'sense_probe'];
    if (revealTypes.includes(cardType)) {
      gameDispatch({ type: 'REVEAL_CLAIM', suspectId: suspect.id, claimType: cardType, slotIndex: slotIndex != null && slotIndex >= 0 ? slotIndex : undefined });
    }

    // Show template answer + start TTS RIGHT AWAY (no waiting for LLM)
    localDispatch({ type: 'SET_ANSWER', answer: templateText, spec });
    if (!cached) cacheAnswer(gameState.seed, cKey, templateText, mode);

    const temperament = getTemperament(gameState.seed, suspect.id);
    playTts(templateText, suspect.name, temperament, pressure, 'interrogation');

  }, [gameState.seed, gameState.world, gameDispatch, suspectPressure, playTts, mode, templates]);

  const confirmTarget = useCallback((slotIndex: number) => {
    const suspect = interrogation.activeSuspect;
    const cardType = interrogation.activeCardType;
    if (!suspect || !cardType) return;

    // Check if we have tokens for billable questions
    if (gameState.interrogationTokens <= 0) {
      localDispatch({ type: 'SET_ERROR', error: 'No Council Favors remain.' });
      return;
    }

    processAnswer(suspect, cardType, slotIndex >= 0 ? slotIndex : undefined, false);
  }, [interrogation.activeSuspect, interrogation.activeCardType, gameState.interrogationTokens, processAnswer]);

  const playDefense = useCallback(async () => {
    const suspect = interrogation.activeSuspect;
    if (!suspect) return;

    localDispatch({ type: 'START_PROCESSING' });

    const cKey = localStorageKeyForOpening(gameState.seed, suspect.id, mode);
    const cached = getCachedAnswer(cKey);

    const { text, chipSummary } = generateOpeningDefense(suspect, gameState.world, gameState.seed, templates);
    const answerText = cached ?? text;

    if (!cached) cacheAnswer(gameState.seed, cKey, answerText, mode);

    const spec: AnswerSpec = {
      anchors: [],
      evasionLevel: 'none',
      temperament: getTemperament(gameState.seed, suspect.id),
      chipSummary,
      chipType: 'claim',
      templateKey: 'opening',
    };

    localDispatch({ type: 'SET_ANSWER', answer: answerText, spec });

    // Mark that the player heard this suspect's opening defense
    gameDispatch({ type: 'MARK_OPENING_HEARD', suspectId: suspect.id });

    const temperament = getTemperament(gameState.seed, suspect.id);
    await playTts(answerText, suspect.name, temperament, 0, 'defense');
  }, [interrogation.activeSuspect, gameState.seed, gameState.world, gameDispatch, playTts, mode, templates]);

  const submitQuestion = useCallback(async (text: string) => {
    const suspect = interrogation.activeSuspect;
    if (!suspect) return;

    // Use heuristic classifier (instant) — LLM classifier removed for speed
    const { cardType, isIrrelevant } = classifyQuestion(text, gameState.world);
    const slotIndex = autoResolveTarget(cardType, text, suspect, gameState.world);

    if (isIrrelevant) {
      // Free deflection — no Favor spent
      processAnswer(suspect, cardType, slotIndex, true);
    } else {
      if (gameState.interrogationTokens <= 0) {
        localDispatch({ type: 'SET_ERROR', error: 'No Council Favors remain.' });
        return;
      }
      processAnswer(suspect, cardType, slotIndex, false);
    }
  }, [interrogation.activeSuspect, gameState.interrogationTokens, gameState.world, processAnswer]);

  const submitVoice = useCallback(async (blob: Blob) => {
    const suspect = interrogation.activeSuspect;
    if (!suspect) return;

    setIsTranscribing(true);

    // Check STT cap
    if (gameState.sttCalls >= 6) {
      setIsTranscribing(false);
      localDispatch({ type: 'SET_ERROR', error: 'Voice transcription limit reached. Type your question instead.' });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    console.log(`[COVEN Voice] Recording blob: ${blob.size} bytes, type: ${blob.type}`);
    const transcript = await speechToText({ audioBlob: blob, signal: controller.signal });
    setIsTranscribing(false);
    console.log(`[COVEN Voice] Transcript: "${transcript}"`);

    if (!transcript || transcript.trim().length < 3) {
      localDispatch({ type: 'SET_ERROR', error: 'Could not understand. Try again or type your question.' });
      return;
    }

    // Only count successful transcriptions against the cap
    gameDispatch({ type: 'INCREMENT_STT_CALLS' });

    // Feed transcript through the same question pipeline
    submitQuestion(transcript.trim());
  }, [interrogation.activeSuspect, gameState.sttCalls, gameDispatch, submitQuestion]);

  const skipAudio = useCallback(() => {
    stopAudio();
  }, [stopAudio]);

  const clearCard = useCallback(() => {
    localDispatch({ type: 'CLEAR_CARD' });
  }, []);

  return createElement(
    InterrogationContext.Provider,
    {
      value: {
        interrogation,
        openChamber,
        closeChamber,
        selectCard,
        confirmTarget,
        clearCard,
        playDefense,
        submitQuestion,
        submitVoice,
        skipAudio,
        suspectPressure,
        voiceOff,
        isTranscribing,
      },
    },
    children,
  );
}

export function useInterrogation(): InterrogationContextValue {
  const ctx = useContext(InterrogationContext);
  if (!ctx) throw new Error('useInterrogation must be used within InterrogationProvider');
  return ctx;
}
