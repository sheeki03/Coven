import { useState } from 'react';
import { useThemeStrict } from '../hooks/ThemeContext.js';

interface Props {
  drawnCount: number;
}

export default function MissionBrief({ drawnCount }: Props) {
  const { theme } = useThemeStrict();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || drawnCount > 0) return null;

  return (
    <div className="max-w-md mx-auto px-4 mt-3 mb-1 animate-fade-in-up">
      <div className="relative surface-parchment rounded-lg border border-gold/20 px-4 py-3">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1.5 right-2.5 text-iron/40 hover:text-iron/70 text-sm cursor-pointer leading-none"
          aria-label="Dismiss"
        >
          &times;
        </button>
        <p className={`${theme.visuals.headingFontClass} text-parchment/85 text-sm tracking-wider leading-relaxed pr-4`}>
          Six suspects. One is {/^the\s/i.test(theme.copy.liarLabel) ? '' : 'the '}{theme.copy.liarLabel}.{' '}
          {theme.copy.drawVerb} {theme.copy.drawNounPlural} to reveal facts.{' '}
          Find contradictions. Name the liar.
        </p>
      </div>
    </div>
  );
}
