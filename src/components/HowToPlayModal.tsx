import { useThemeStrict } from '../hooks/ThemeContext.js';
import CelticBorder from './CelticBorder.js';
import { RuneOaths, RuneRoads, RuneRelics, RuneSkies } from './icons/RuneSymbols.js';

interface Props {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: Props) {
  const { theme } = useThemeStrict();
  const c = theme.copy;
  const rn = theme.templates.runeNames;

  return (
    <div className="fixed inset-0 z-50 bg-bg-deep overflow-y-auto animate-fade-in">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-bg-deep/95 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/70">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            <h1 className={`${theme.visuals.headingDecFontClass} text-gold text-lg sm:text-xl font-bold tracking-[0.1em]`}>
              {c.howToPlayTitle}
            </h1>
          </div>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.visuals.headingFontClass} text-sm tracking-wider cursor-pointer
              text-iron/60 hover:text-gold border border-iron/15 hover:border-gold/25 transition-all duration-300`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 2L4 8l6 6" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* The Story */}
        <Section title="The Story">
          <p className="font-body text-parchment/85 text-base leading-relaxed">
            {c.storyIntro}
          </p>
          <p className="font-body text-parchment/75 text-base leading-relaxed mt-3">
            {c.storyVillain}
          </p>
          <p className="font-body text-gold/60 text-sm italic mt-3">
            A new puzzle appears every day, the same for everyone worldwide. Practice with custom seeds using ?seed=NUMBER in the URL.
          </p>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* How to Win — Steps */}
        <Section title="How to Win">
          <div className="space-y-4">
            <Step num="1" title="Read the Alibis"
              desc={`Each suspect card shows their claimed movements across 6 ${c.timePeriodLabel}. Tap any card to expand their full written testimony.`} />
            <Step num="2" title={`${c.drawVerb} 2 ${c.drawNounPlural}`}
              desc={`Choose 2 of 4 available ${c.drawNounPlural}. Each reveals true world facts \u2014 things that actually happened. These facts may contradict suspect alibis.`} />
            <Step num="3" title="Spot Contradictions"
              desc="When a fact conflicts with a suspect's alibi, that suspect receives a strike. Strikes accumulate \u2014 the more strikes, the more likely they're the liar." />
            <Step num="4" title={`Name the ${c.liarLabel}`}
              desc={`Once you've drawn 2 ${c.drawNounPlural}, the Accuse button appears. Name the suspect with the most strikes. The ${c.liarLabel} will always have contradictions.`} />
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* The 4 Types */}
        <Section title={`The 4 ${c.drawNounPlural.charAt(0).toUpperCase() + c.drawNounPlural.slice(1)} Types`}>
          <p className="font-body text-parchment/70 text-sm mb-4">
            Each reveals facts about a different aspect of the world. You must {c.drawVerb.toLowerCase()} 2; you can optionally risk more at higher cost.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RuneCard Icon={RuneOaths} name={rn.oaths.name} desc={rn.oaths.description} color="text-gold/80" />
            <RuneCard Icon={RuneRoads} name={rn.roads.name} desc={rn.roads.description} color="text-gold/80" />
            <RuneCard Icon={RuneRelics} name={rn.relics.name} desc={rn.relics.description} color="text-gold/80" />
            <RuneCard Icon={RuneSkies} name={rn.skies.name} desc={rn.skies.description} color="text-gold/80" />
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Suspect Cards Explained */}
        <Section title="Reading Suspect Cards">
          <div className="space-y-4">
            <DetailBlock title="Portrait, Name & Role" icon="&#x1F464;">
              Each suspect has a unique portrait, name, and role. These are for flavor &mdash; guilt is determined only by contradictions.
            </DetailBlock>
            <DetailBlock title="Strike Dots" icon="&#x25CF;">
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gold/70" />
                  <span className="font-body text-gold/80 text-sm">1 strike = Suspect</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-crimson shadow-[0_0_6px_rgba(139,26,26,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-crimson shadow-[0_0_6px_rgba(139,26,26,0.5)]" />
                  <span className="font-body text-crimson-bright text-sm">2+ = Condemned</span>
                </div>
              </div>
            </DetailBlock>
            <DetailBlock title="Timeline Bar" icon="&#x23F1;">
              The colored bar spans 6 {c.timePeriodLabel}. Solid segments mean the suspect claims to have stayed at a location. Striped segments mean travel. A red &#x2715; marks a contradicted segment.
            </DetailBlock>
            <DetailBlock title="Claims" icon="&#x1F4DC;">
              Below the timeline, chips show the suspect&apos;s specific claims: locations visited, items carried, and senses reported.
            </DetailBlock>
            <DetailBlock title="Evidence Chips" icon="&#x26A0;">
              When a contradiction is found, red evidence chips appear showing the type.
            </DetailBlock>
            <DetailBlock title="Full Testimony" icon="&#x1F4D6;">
              Tap any suspect card to expand their full written alibi narrative.
            </DetailBlock>
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Revealed Facts */}
        <Section title="Revealed Facts">
          <p className="font-body text-parchment/75 text-sm mb-3">
            After drawing, facts appear in the left panel. Each fact is <span className="text-gold/80 font-bold">true</span> &mdash; it represents something that actually happened.
          </p>
          <p className="font-body text-parchment/65 text-sm mt-3">
            <span className="text-gold/70 font-bold">Click any fact</span> to highlight which suspects it affects. Click again to pin the highlight for comparison.
          </p>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* The Map */}
        <Section title={`The Map (${c.mapLabel})`}>
          <p className="font-body text-parchment/75 text-sm mb-3">
            The map shows all locations and the routes connecting them. Numbers on edges show how many {c.timePeriodLabel} it takes to travel that route.
          </p>
          <p className="font-body text-parchment/65 text-sm mt-3">
            If a suspect claims to travel a route that takes more {c.timePeriodLabel} than available in their schedule, that&apos;s a <span className="text-crimson-bright font-bold">movement contradiction</span>.
          </p>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Interrogation */}
        <Section title={c.interrogateLabel}>
          <p className="font-body text-parchment/75 text-sm mb-3">
            After drawing, you can question any suspect by tapping the <span className="text-gold/80 font-bold">&ldquo;{c.interrogateLabel}&rdquo;</span> button on their card.
          </p>
          <div className="space-y-3">
            <DetailBlock title="Opening Defense (Free)" icon="&#x1F50A;">
              Every suspect will give a free opening defense when prompted.
            </DetailBlock>
            <DetailBlock title="Follow-up Tokens" icon="&#x1F534;">
              <p>You have <span className="text-crimson-bright font-bold">3 tokens</span> per game. Each follow-up costs 1 token and -50 points.</p>
            </DetailBlock>
            <DetailBlock title="Question Types" icon="&#x2753;">
              Choose from 8 question types covering different aspects of the case.
            </DetailBlock>
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Hint System */}
        <Section title={c.hintLabel}>
          <p className="font-body text-parchment/75 text-sm mb-2">
            If you&apos;re stuck, use the <span className="text-gold/80 font-bold">{c.hintLabel}</span> button. This reveals one guaranteed true fact. It costs <span className="text-gold/80 font-bold">-160 points</span>.
          </p>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Scoring */}
        <Section title="Scoring">
          <div className="bg-surface/40 rounded-lg p-4 border border-gold/10">
            <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2">
              <span className="font-body text-parchment/80 text-sm">Starting points</span>
              <span className="font-body text-gold font-bold text-sm text-right">1000</span>

              <span className="font-body text-parchment/70 text-sm">Each {c.drawNounPlural.slice(0, -1)} (first 2)</span>
              <span className="font-body text-gold/80 text-sm text-right">-80 each</span>

              <span className="font-body text-parchment/70 text-sm">3rd (optional)</span>
              <span className="font-body text-ember text-sm text-right">-160</span>

              <span className="font-body text-parchment/70 text-sm">4th (optional)</span>
              <span className="font-body text-ember text-sm text-right">-240</span>

              <span className="font-body text-parchment/70 text-sm">Using the {c.hintLabel.toLowerCase()}</span>
              <span className="font-body text-gold/80 text-sm text-right">-160</span>

              <span className="font-body text-parchment/70 text-sm">Each follow-up question</span>
              <span className="font-body text-gold/80 text-sm text-right">-50</span>

              <span className="font-body text-parchment/70 text-sm">Time penalty</span>
              <span className="font-body text-gold/80 text-sm text-right">-3/sec (max -300)</span>

              <div className="col-span-2 border-t border-gold/10 my-1" />

              <span className="font-body text-parchment/80 text-sm font-bold">Correct accusation</span>
              <span className="font-body text-gold font-bold text-sm text-right">Keep your score</span>

              <span className="font-body text-parchment/70 text-sm">Wrong accusation</span>
              <span className="font-body text-crimson-bright font-bold text-sm text-right">0 points</span>
            </div>
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Tips */}
        <Section title="Strategy Tips">
          <div className="bg-gold/5 border border-gold/10 rounded-lg p-4">
            <ul className="space-y-2.5 font-body text-parchment/75 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Read all 6 alibis before drawing. Look for stories that seem too specific or oddly vague.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Cross-reference the map with alibis. If two suspects claim to be at the same place at the same {c.timePeriodLabel.replace(/s$/, '')}, a fact might confirm or deny that.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>The {c.liarLabel} <span className="italic">always</span> has contradictions if you draw the right {c.drawNounPlural}. No strikes doesn&apos;t mean innocent.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Questioning never reveals hard evidence. Use it to compare how suspects respond under pressure.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Accuse quickly for a higher score. Time ticks away &mdash; being decisive pays off.</span>
              </li>
            </ul>
          </div>
        </Section>

        {/* Bottom return */}
        <div className="text-center pt-6 pb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/20" />
            <div className="w-2 h-2 rounded-full bg-gold/20" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/20" />
          </div>
          <button
            onClick={onClose}
            className={`px-10 py-3.5 rounded-xl ${theme.visuals.headingFontClass} text-base font-bold tracking-[0.15em] uppercase cursor-pointer
              bg-gold/10 border border-gold/25 text-gold
              hover:bg-gold/18 hover:border-gold/45 hover:shadow-[0_0_24px_rgba(196,163,90,0.12)]
              transition-all duration-300`}
          >
            {c.howToPlayReturnButton}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/15" />
        <h2 className="font-cinzel text-gold/80 text-sm tracking-[0.25em] uppercase shrink-0">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/15" />
      </div>
      {children}
    </section>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gold/10 border border-gold/20 shrink-0 mt-0.5">
        <span className="font-cinzel text-gold text-sm font-bold">{num}</span>
      </div>
      <div>
        <p className="font-cinzel text-parchment/90 text-sm font-bold">{title}</p>
        <p className="font-body text-iron/65 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function RuneCard({ Icon, name, desc, color }: { Icon: typeof RuneOaths; name: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface/40 border border-gold/10">
      <Icon size={24} className={`${color} shrink-0 mt-0.5`} />
      <div>
        <p className="font-cinzel text-parchment/85 text-xs font-bold tracking-wider">{name}</p>
        <p className="font-body text-iron/60 text-xs leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function DetailBlock({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg shrink-0 mt-0.5 w-7 text-center">{icon}</span>
      <div>
        <p className="font-cinzel text-parchment/85 text-sm font-bold">{title}</p>
        <div className="font-body text-iron/65 text-sm leading-relaxed mt-0.5">{children}</div>
      </div>
    </div>
  );
}
