import { createContext, useContext, useState, useLayoutEffect, useCallback, type ReactNode } from 'react';
import type { ThemeConfig, GameMode } from '../themes/types.js';
import { getTheme } from '../themes/index.js';

interface ThemeContextValue {
  theme: ThemeConfig | null;  // null when on welcome screen (no mode selected)
  mode: GameMode | null;
  setMode: (mode: GameMode | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadSavedMode(): GameMode | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get('mode');
  if (urlMode === 'ledger' || urlMode === 'gaslight' || urlMode === 'casefile') return urlMode;
  const saved = localStorage.getItem('coven:mode');
  if (saved === 'ledger' || saved === 'gaslight' || saved === 'casefile') return saved;
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeRaw] = useState<GameMode | null>(loadSavedMode);

  const setMode = useCallback((m: GameMode | null) => {
    setModeRaw(m);
    if (typeof window !== 'undefined') {
      if (m) {
        localStorage.setItem('coven:mode', m);
      } else {
        localStorage.removeItem('coven:mode');
      }
      // Clear URL mode param so refresh uses localStorage
      const url = new URL(window.location.href);
      if (url.searchParams.has('mode')) {
        url.searchParams.delete('mode');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  const theme = mode ? getTheme(mode) : null;

  // Apply CSS variables and data-theme attribute before paint
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (mode && theme) {
      html.setAttribute('data-theme', mode);
      // Apply CSS variable overrides
      for (const [key, value] of Object.entries(theme.visuals.cssVars)) {
        html.style.setProperty(key, value);
      }
    } else {
      html.removeAttribute('data-theme');
      // Reset to neutral defaults for welcome screen
      html.style.removeProperty('--coven-bg');
      html.style.removeProperty('--coven-bg-deep');
      html.style.removeProperty('--coven-surface');
      html.style.removeProperty('--coven-surface-light');
      html.style.removeProperty('--coven-gold');
      html.style.removeProperty('--coven-gold-bright');
      html.style.removeProperty('--coven-gold-dim');
      html.style.removeProperty('--coven-iron');
      html.style.removeProperty('--coven-crimson');
      html.style.removeProperty('--coven-crimson-bright');
      html.style.removeProperty('--coven-forest');
      html.style.removeProperty('--coven-forest-bright');
      html.style.removeProperty('--coven-ember');
      html.style.removeProperty('--coven-parchment');
      html.style.removeProperty('--coven-text');
      html.style.removeProperty('--coven-ink');
    }
  }, [mode, theme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Use when you KNOW mode is selected (inside GameProvider). */
export function useThemeStrict(): { theme: ThemeConfig; mode: GameMode } {
  const { theme, mode } = useTheme();
  if (!theme || !mode) throw new Error('useThemeStrict called without a selected mode');
  return { theme, mode };
}
