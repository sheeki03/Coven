import { describe, it, expect } from 'vitest';
import ledgerTheme from '../../themes/ledger.js';
import gaslightTheme from '../../themes/gaslight.js';
import casefileTheme from '../../themes/casefile.js';
import type { ThemeTemplates } from '../../themes/types.js';

/**
 * Template lint — ensures interrogation template banks never contain
 * evidence-shaped content that violates the Prime Directive:
 * "Interrogation is persuasion and vibe, never new evidence."
 */

// Banned tokens: word-boundary matches to prevent false positives
const BANNED_PATTERN = /\bcamera\b|\bcctv\b|\blog\b|\bbadge\b|\bkeycard\b|\bfootprint\b|\bstain\b|\bscratch\b|\bmissing\b|\bwarm\b|\bshredder\b|\bajar\b|\bblood\b|\bknife\b|\brope\b|\bbroken\b|disconnected|taped over/i;

function checkTemplates(name: string, templates: readonly string[]) {
  for (const tpl of templates) {
    const match = tpl.match(BANNED_PATTERN);
    if (match) {
      return { pass: false, template: tpl, matched: match[0], bank: name };
    }
  }
  return { pass: true };
}

function checkRefusals(name: string, refusals: Record<string, string>) {
  for (const [_key, text] of Object.entries(refusals)) {
    const match = text.match(BANNED_PATTERN);
    if (match) {
      return { pass: false, template: text, matched: match[0], bank: name };
    }
  }
  return { pass: true };
}

const themes: [string, ThemeTemplates][] = [
  ['ledger', ledgerTheme.templates],
  ['gaslight', gaslightTheme.templates],
  ['casefile', casefileTheme.templates],
];

describe('Template lint — no evidence-shaped content', () => {
  for (const [themeName, tpl] of themes) {
    describe(themeName, () => {
      it('fillerNeutral has no banned tokens', () => {
        const result = checkTemplates('fillerNeutral', tpl.fillerNeutral);
        if (!result.pass) {
          expect.fail(`Banned token "${result.matched}" found in ${result.bank}: "${result.template}"`);
        }
      });

      it('detailPublicFlavor has no banned tokens', () => {
        const result = checkTemplates('detailPublicFlavor', tpl.detailPublicFlavor);
        if (!result.pass) {
          expect.fail(`Banned token "${result.matched}" found in ${result.bank}: "${result.template}"`);
        }
      });

      it('consistencyTemplates has no banned tokens', () => {
        const result = checkTemplates('consistencyTemplates', tpl.consistencyTemplates);
        if (!result.pass) {
          expect.fail(`Banned token "${result.matched}" found in ${result.bank}: "${result.template}"`);
        }
      });

      it('refusals has no banned tokens', () => {
        const result = checkRefusals('refusals', tpl.refusals);
        if (!result.pass) {
          expect.fail(`Banned token "${result.matched}" found in ${result.bank}: "${result.template}"`);
        }
      });
    });
  }
});
