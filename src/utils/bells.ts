import type { Bell } from '../types/index.js';

export const BELL_MINUTES: Record<Bell, number> = {
  0: 0,
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
};

const DEFAULT_BELL_NAMES: Record<Bell, string> = {
  0: 'First Bell',
  1: 'Second Bell',
  2: 'Third Bell',
  3: 'Fourth Bell',
  4: 'Fifth Bell',
  5: 'Sixth Bell',
};

export function bellsRequired(minutes: number): number {
  return Math.ceil(minutes / 10);
}

/** Format a bell using custom names, falling back to default fantasy names. */
export function formatBell(bell: Bell, bellNames?: Record<Bell, string>): string {
  return (bellNames ?? DEFAULT_BELL_NAMES)[bell];
}

/** Create a bell formatter bound to specific bell names. */
export function createBellFormatter(bellNames?: Record<Bell, string>): (bell: Bell) => string {
  const names = bellNames ?? DEFAULT_BELL_NAMES;
  return (bell: Bell) => names[bell];
}

export function bellFromMinutes(minutes: number): Bell {
  const b = Math.floor(minutes / 10);
  return Math.min(5, Math.max(0, b)) as Bell;
}

export function minutesBetweenBells(from: Bell, to: Bell): number {
  return BELL_MINUTES[to] - BELL_MINUTES[from];
}
