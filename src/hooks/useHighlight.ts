import { createContext, useContext, useReducer, type ReactNode } from 'react';
import React from 'react';

export interface HighlightState {
  hoveredFactIndex: number | null;
  hoveredSuspectId: string | null;
  pinnedFactIndex: number | null;
  pinnedSuspects: string[];
  sealedSuspectId: string | null;
  suspicionFilter: 'all' | 'unmarked' | 'suspect' | 'condemned';
  mapFilter: { type: 'node' | 'edge'; id: string } | null;
}

type HighlightAction =
  | { type: 'HOVER_FACT'; index: number | null }
  | { type: 'HOVER_SUSPECT'; id: string | null }
  | { type: 'PIN_FACT'; index: number | null }
  | { type: 'TOGGLE_PIN_SUSPECT'; id: string }
  | { type: 'SEAL_SUSPECT'; id: string }
  | { type: 'UNSEAL_SUSPECT' }
  | { type: 'SET_SUSPICION_FILTER'; filter: HighlightState['suspicionFilter'] }
  | { type: 'SET_MAP_FILTER'; filter: HighlightState['mapFilter'] }
  | { type: 'CLEAR_ALL' };

const initialState: HighlightState = {
  hoveredFactIndex: null,
  hoveredSuspectId: null,
  pinnedFactIndex: null,
  pinnedSuspects: [],
  sealedSuspectId: null,
  suspicionFilter: 'all',
  mapFilter: null,
};

function highlightReducer(state: HighlightState, action: HighlightAction): HighlightState {
  switch (action.type) {
    case 'HOVER_FACT':
      return { ...state, hoveredFactIndex: action.index };
    case 'HOVER_SUSPECT':
      return { ...state, hoveredSuspectId: action.id };
    case 'PIN_FACT':
      return { ...state, pinnedFactIndex: state.pinnedFactIndex === action.index ? null : action.index };
    case 'TOGGLE_PIN_SUSPECT': {
      const already = state.pinnedSuspects.includes(action.id);
      if (already) {
        return { ...state, pinnedSuspects: state.pinnedSuspects.filter(id => id !== action.id) };
      }
      if (state.pinnedSuspects.length >= 2) {
        return { ...state, pinnedSuspects: [state.pinnedSuspects[1], action.id] };
      }
      return { ...state, pinnedSuspects: [...state.pinnedSuspects, action.id] };
    }
    case 'SEAL_SUSPECT': {
      // Seal a suspect — also auto-pin them
      const pinned = state.pinnedSuspects.includes(action.id)
        ? state.pinnedSuspects
        : [...state.pinnedSuspects.slice(-1), action.id];
      return { ...state, sealedSuspectId: action.id, pinnedSuspects: pinned };
    }
    case 'UNSEAL_SUSPECT':
      return { ...state, sealedSuspectId: null };
    case 'SET_SUSPICION_FILTER':
      return { ...state, suspicionFilter: action.filter };
    case 'SET_MAP_FILTER':
      if (state.mapFilter?.type === action.filter?.type && state.mapFilter?.id === action.filter?.id) {
        return { ...state, mapFilter: null };
      }
      return { ...state, mapFilter: action.filter };
    case 'CLEAR_ALL':
      return initialState;
    default:
      return state;
  }
}

interface HighlightContextValue {
  highlight: HighlightState;
  highlightDispatch: React.Dispatch<HighlightAction>;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [highlight, highlightDispatch] = useReducer(highlightReducer, initialState);

  return React.createElement(
    HighlightContext.Provider,
    { value: { highlight, highlightDispatch } },
    children
  );
}

export function useHighlight(): HighlightContextValue {
  const ctx = useContext(HighlightContext);
  if (!ctx) throw new Error('useHighlight must be used within HighlightProvider');
  return ctx;
}
