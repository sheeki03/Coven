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

        {/* Core Loop */}
        <Section title="How to Win">
          <div className="space-y-4">
            <Step num="1" title="Study the Suspects"
              desc={`Each suspect card shows their claimed locations. Morning timings and horn claims are visible upfront \u2014 but afternoon timings, carried items, and scent details are hidden until you interrogate.`} />
            <Step num="2" title={`${c.drawVerb} ${c.drawNounPlural}`}
              desc={`Choose 2 of 4 available ${c.drawNounPlural}. Each reveals true world facts \u2014 travel times, relic locations, horn signals, scent reports. These are ground truth.`} />
            <Step num="3" title="Interrogate for Details"
              desc={`Use the ${c.interrogateLabel} button to question suspects. Each probe reveals hidden claim details \u2014 exact timings, relics, scents. Suspects may protest innocence or blame others.`} />
            <Step num="4" title="Cross-Reference & Deduce"
              desc={`Compare what the world facts say (from ${c.drawNounPlural}) with what suspects claim (from their cards + interrogation). Look for contradictions \u2014 the liar's story won't add up.`} />
            <Step num="5" title={`Name the ${c.liarLabel}`}
              desc={`Once you've drawn 2 ${c.drawNounPlural}, the Accuse button appears. Contradictions are computed from the clues YOU uncovered. The ${c.liarLabel} always has contradictions if you dig deep enough.`} />
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Two Sources */}
        <Section title="Two Sources of Truth">
          <p className="font-body text-parchment/75 text-sm mb-4">
            Neither source alone is enough. You need <span className="text-gold/90 font-bold">both</span> to find the liar.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-surface/40 border border-gold/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center text-gold/70 text-sm">&#x2726;</div>
                <p className={`${theme.visuals.headingFontClass} text-parchment/85 text-xs font-bold tracking-wider`}>{c.drawNounPlural.charAt(0).toUpperCase() + c.drawNounPlural.slice(1)} (World Facts)</p>
              </div>
              <p className="font-body text-iron/60 text-xs leading-relaxed">
                Reveal what <span className="text-gold/80 font-bold">actually happened</span> &mdash; travel times between locations, where relics were seen, horn signals, environmental conditions.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface/40 border border-gold/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center text-gold/70 text-sm">&#x1F50D;</div>
                <p className={`${theme.visuals.headingFontClass} text-parchment/85 text-xs font-bold tracking-wider`}>Interrogation (Suspect Claims)</p>
              </div>
              <p className="font-body text-iron/60 text-xs leading-relaxed">
                Reveal what each suspect <span className="text-gold/80 font-bold">claims happened</span> &mdash; exact bell timings, travel routes, objects carried, scents they noticed.
              </p>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-gold/5 border border-gold/8">
            <p className="font-body text-gold/70 text-xs leading-relaxed text-center italic">
              A contradiction only counts if you revealed <span className="font-bold">both</span> the world fact <span className="font-bold">and</span> the suspect&apos;s claim about it.
            </p>
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
            <DetailBlock title="Timeline Bar" icon="&#x23F1;">
              <p>The colored bar spans 6 {c.timePeriodLabel}. <span className="text-gold/80 font-bold">Morning segments</span> (first 3 {c.timePeriodLabel}) show real positioning. <span className="text-iron/80 font-bold">Afternoon segments</span> appear as uniform blocks with &ldquo;?&ndash;?&rdquo; until you probe for exact timings.</p>
              <p className="mt-1 text-iron/50 text-xs italic">Solid bars = staying at a location. Striped bars = traveling between locations.</p>
            </DetailBlock>
            <DetailBlock title="Claim Chips" icon="&#x1F4DC;">
              <p>Below the timeline, chips show the suspect&apos;s claims. Some are <span className="text-gold/80 font-bold">visible immediately</span>:</p>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li className="flex items-center gap-2"><span className="text-gold/50">&#x2713;</span> <span>Locations visited (always shown)</span></li>
                <li className="flex items-center gap-2"><span className="text-gold/50">&#x2713;</span> <span>Morning bell timings (first 3)</span></li>
                <li className="flex items-center gap-2"><span className="text-gold/50">&#x2713;</span> <span>Horn claim (when &amp; where they heard it)</span></li>
              </ul>
              <p className="mt-1.5">Others <span className="text-iron/80 font-bold">require interrogation</span> to reveal:</p>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li className="flex items-center gap-2"><span className="text-iron/40">?</span> <span>Afternoon bell timings (bell probe / route probe)</span></li>
                <li className="flex items-center gap-2"><span className="text-iron/40">?</span> <span>Carried relic (object probe)</span></li>
                <li className="flex items-center gap-2"><span className="text-iron/40">?</span> <span>Scent noticed (sense probe)</span></li>
              </ul>
            </DetailBlock>
            <DetailBlock title="Known Meter" icon="&#x1F4CA;">
              Below the interrogate button, a compact meter tracks what you&apos;ve uncovered for each suspect: bell timings (dots), route detail, horn, relic, and scent status. Use it to plan your next probe.
            </DetailBlock>
            <DetailBlock title="Mark Suspect (&#x2606;)" icon="&#x2B50;">
              Tap the star icon to mark suspects you find suspicious. Marked suspects get a gold ring &mdash; purely for your own tracking.
            </DetailBlock>
            <DetailBlock title="Full Testimony" icon="&#x1F4D6;">
              Tap any suspect card to expand their full written alibi narrative.
            </DetailBlock>
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Interrogation */}
        <Section title={c.interrogateLabel}>
          <p className="font-body text-parchment/75 text-sm mb-3">
            Tap <span className="text-gold/80 font-bold">&ldquo;{c.interrogateLabel}&rdquo;</span> on any suspect card to open their interrogation chamber. <span className="text-gold/70 font-bold">Available from the start</span> &mdash; no draws required.
          </p>
          <div className="space-y-3">
            <DetailBlock title="Opening Defense (Free)" icon="&#x1F50A;">
              Every suspect will give a free opening defense. This doesn&apos;t cost a token and doesn&apos;t reveal new claims, but may contain useful narrative clues.
            </DetailBlock>
            <DetailBlock title="Council Favors" icon="&#x1F534;">
              <p>You have <span className="text-gold font-bold">6 Council Favors</span> per game. Each follow-up probe costs 1 Favor and &minus;25 points.</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex gap-1">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < 4 ? 'bg-gold/60' : 'bg-iron/20'}`} />
                  ))}
                </div>
                <span className="font-body text-iron/40 text-xs">4 of 6 remaining</span>
              </div>
            </DetailBlock>
            <DetailBlock title="Probe Types &mdash; Each Reveals Something" icon="&#x1F50D;">
              <div className="mt-1 space-y-1.5">
                <ProbeRow label="Bell Probe" desc="Reveals exact timing for a specific hour" />
                <ProbeRow label="Route Probe" desc="Reveals full travel timeline at once" />
                <ProbeRow label="Horn Probe" desc="Already visible \u2014 confirms horn claim details" />
                <ProbeRow label="Object Probe" desc="Reveals what relic the suspect carried" />
                <ProbeRow label="Sense Probe" desc="Reveals what scent/condition they noticed" />
              </div>
            </DetailBlock>
            <DetailBlock title="Blame &amp; Deflection" icon="&#x1F5E3;">
              Under pressure, suspects may protest their innocence or point fingers at others. <span className="text-iron/50 italic">Blame is never reliable evidence &mdash; both liars and innocents do it.</span>
            </DetailBlock>
            <DetailBlock title="Voice &amp; Text" icon="&#x1F3A4;">
              Answers are spoken aloud via AI voice and displayed as text. Tap the skip button to jump past audio. Toggle voice off in settings.
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

        {/* Hint System */}
        <Section title={c.hintLabel}>
          <p className="font-body text-parchment/75 text-sm mb-2">
            If you&apos;re stuck, use the <span className="text-gold/80 font-bold">{c.hintLabel}</span> button. This reveals one guaranteed true fact. It costs <span className="text-gold/80 font-bold">&minus;160 points</span>.
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
              <span className="font-body text-gold/80 text-sm text-right">&minus;80 each</span>

              <span className="font-body text-parchment/70 text-sm">3rd (optional)</span>
              <span className="font-body text-ember text-sm text-right">&minus;160</span>

              <span className="font-body text-parchment/70 text-sm">4th (optional)</span>
              <span className="font-body text-ember text-sm text-right">&minus;240</span>

              <span className="font-body text-parchment/70 text-sm">Using the {c.hintLabel.toLowerCase()}</span>
              <span className="font-body text-gold/80 text-sm text-right">&minus;160</span>

              <span className="font-body text-parchment/70 text-sm">Each interrogation probe</span>
              <span className="font-body text-gold/80 text-sm text-right">&minus;25</span>

              <span className="font-body text-parchment/70 text-sm">Time penalty</span>
              <span className="font-body text-gold/80 text-sm text-right">&minus;3/sec (max &minus;300)</span>

              <div className="col-span-2 border-t border-gold/10 my-1" />

              <span className="font-body text-parchment/80 text-sm font-bold">Correct accusation</span>
              <span className="font-body text-gold font-bold text-sm text-right">Keep your score</span>

              <span className="font-body text-parchment/70 text-sm">Wrong accusation</span>
              <span className="font-body text-crimson-bright font-bold text-sm text-right">0 points</span>
            </div>
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* After the Accusation */}
        <Section title="After the Accusation">
          <p className="font-body text-parchment/75 text-sm mb-3">
            Once you accuse, <span className="text-gold/80 font-bold">all hidden information is revealed</span>. Strikes are computed based on the world facts and suspect claims you actually uncovered during the game.
          </p>
          <div className="space-y-3">
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
            <DetailBlock title="Study Mode" icon="&#x1F4D6;">
              After the game ends, all timelines snap to real positions, all claim chips are fully revealed, and contradiction markers appear. Use study mode to understand what you missed.
            </DetailBlock>
          </div>
        </Section>

        <CelticBorder className="opacity-30" />

        {/* Tips */}
        <Section title="Strategy Tips">
          <div className="bg-gold/5 border border-gold/10 rounded-lg p-4">
            <ul className="space-y-2.5 font-body text-parchment/75 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Read all alibis first. Look for suspects who mention the same locations at overlapping times.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Cross-reference the map with alibis. Check if claimed travel routes are even possible in the time available.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Use <span className="text-gold/80 font-bold">route probes</span> for maximum value &mdash; they reveal a suspect&apos;s full timeline in one Favor.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Spend probes on suspects who look suspicious based on {c.drawNounPlural} facts. Don&apos;t waste Favors on suspects who are clearly clean.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Don&apos;t trust blame. Suspects point fingers at each other regardless of guilt &mdash; it&apos;s deflection, not evidence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>The {c.liarLabel} <span className="italic">always</span> has contradictions. If you see no strikes, you haven&apos;t drawn the right {c.drawNounPlural} or probed the right details yet.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-gold/60 mt-0.5 shrink-0">&#x2605;</span>
                <span>Accuse decisively. Time ticks away at &minus;3 points per second &mdash; don&apos;t over-think once you have a strong lead.</span>
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

function ProbeRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gold/40 text-xs mt-0.5 shrink-0">&bull;</span>
      <p className="text-xs"><span className="text-parchment/80 font-bold">{label}</span> &mdash; <span className="text-iron/55">{desc}</span></p>
    </div>
  );
}
