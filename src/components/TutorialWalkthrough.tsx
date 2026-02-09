import { useState, useEffect, useCallback, useRef } from 'react';
import { useThemeStrict } from '../hooks/ThemeContext.js';

interface Props {
  onClose: () => void;
  onDismissForever: () => void;
}

interface TutorialStep {
  title: string;
  target: string | null;
  content: React.ReactNode;
  scrollBlock?: ScrollLogicalPosition;
}

function useSteps(): TutorialStep[] {
  const { theme } = useThemeStrict();
  const c = theme.copy;

  return [
    {
      title: c.tutorialWelcomeTitle,
      target: null,
      content: (
        <div className="space-y-2.5">
          <p className="font-body text-parchment/85 text-base leading-relaxed">
            {c.tutorialWelcomeBody.split(c.liarLabel)[0]}
            <span className="text-crimson-bright font-bold"> {c.liarLabel}</span>
            {c.tutorialWelcomeBody.split(c.liarLabel).slice(1).join(c.liarLabel)}
          </p>
          <p className="font-body text-parchment/65 text-sm leading-relaxed">
            Use the {c.drawNounPlural} to uncover contradictions and name the liar. A new puzzle every day &mdash; same for everyone.
          </p>
        </div>
      ),
    },
    {
      title: 'The Map',
      target: '#tutorial-map',
      scrollBlock: 'center',
      content: (
        <div className="space-y-2">
          <p className="font-body text-parchment/85 text-sm leading-relaxed">
            <span className="text-gold font-bold">{c.mapLabel}</span> shows every location and the routes between them.
            Numbers on edges show travel time in <span className="text-gold/80 font-bold">{c.timePeriodLabel}</span>.
          </p>
          <p className="font-body text-iron/55 text-sm italic leading-relaxed">
            If a suspect claims a route that takes more {c.timePeriodLabel} than they had, that&apos;s a contradiction.
          </p>
        </div>
      ),
    },
    {
      title: c.drawSectionTitle,
      target: '#tutorial-draw',
      scrollBlock: 'center',
      content: (
        <div className="space-y-2">
          <p className="font-body text-parchment/85 text-sm leading-relaxed">
            {c.drawVerb} <span className="text-gold font-bold">2 of 4 {c.drawNounPlural}</span> to reveal true world facts.
            Each type uncovers different evidence &mdash; time, travel, objects, or senses.
          </p>
          <p className="font-body text-iron/55 text-sm italic leading-relaxed">
            You can risk a 3rd or 4th at a heavier point cost.
          </p>
        </div>
      ),
    },
    {
      title: 'Suspect Cards',
      target: '[id^="suspect-"]',
      scrollBlock: 'center',
      content: (
        <div className="space-y-2">
          <p className="font-body text-parchment/85 text-sm leading-relaxed">
            Each card shows a suspect&apos;s <span className="text-gold font-bold">alibi</span>,
            <span className="text-gold font-bold"> timeline</span>, and
            <span className="text-gold font-bold"> claims</span>.
            Tap to expand their full testimony.
          </p>
          <p className="font-body text-parchment/70 text-sm leading-relaxed">
            Some claim details are <span className="text-gold/80 font-bold">visible upfront</span> (morning timings, locations, horn). Others show &ldquo;?&rdquo; until you <span className="text-gold/80 font-bold">interrogate</span> for specifics.
          </p>
          <p className="font-body text-iron/55 text-sm italic leading-relaxed">
            Use the &#x2606; star to mark suspects you find suspicious.
          </p>
        </div>
      ),
    },
    {
      title: 'Action Bar',
      target: '#tutorial-sticky',
      scrollBlock: 'end',
      content: (
        <div className="space-y-2">
          <p className="font-body text-parchment/85 text-sm leading-relaxed">
            Quick access to <span className="text-gold font-bold">{c.drawNounPlural}</span>,
            the <span className="text-gold font-bold">{c.hintLabel}</span>, and the
            <span className="text-crimson-bright font-bold"> Accuse</span> button (appears after 2 draws).
          </p>
        </div>
      ),
    },
    {
      title: c.interrogateLabel,
      target: null,
      content: (
        <div className="space-y-2.5">
          <p className="font-body text-parchment/85 text-sm leading-relaxed">
            Tap <span className="text-gold font-bold">&ldquo;{c.interrogateLabel}&rdquo;</span> on any suspect &mdash; <span className="text-gold/80 font-bold">available from the start</span>, no draws needed.
          </p>
          <div className="flex items-center gap-2.5 py-1">
            <div className="flex gap-1">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < 4 ? 'bg-gold/60' : 'bg-iron/20'}`} />
              ))}
            </div>
            <span className="font-body text-parchment/60 text-xs">6 Favors &mdash; opening defense is free, probes cost 1 each (&minus;25 pts)</span>
          </div>
          <p className="font-body text-parchment/70 text-sm leading-relaxed">
            Each probe <span className="text-gold/80 font-bold">reveals hidden claim details</span> &mdash; exact timings, relics, scents. Suspects may blame others under pressure.
          </p>
        </div>
      ),
    },
    {
      title: 'Scoring',
      target: null,
      content: (
        <div className="space-y-2.5">
          <p className="font-body text-parchment/85 text-sm leading-relaxed">
            Start with <span className="text-gold font-bold">1000 points</span>. Be fast and decisive:
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-body">
            <span className="text-parchment/60">Each {c.drawNounPlural.slice(0, -1)}</span>
            <span className="text-gold/70 text-right">-80</span>
            <span className="text-parchment/60">{c.hintLabel}</span>
            <span className="text-gold/70 text-right">-160</span>
            <span className="text-parchment/60">Each probe</span>
            <span className="text-gold/70 text-right">-25</span>
            <span className="text-parchment/60">Time</span>
            <span className="text-gold/70 text-right">-3/sec</span>
            <span className="text-parchment/60">Wrong accusation</span>
            <span className="text-crimson-bright font-bold text-right">0 total</span>
          </div>
        </div>
      ),
    },
  ];
}

export default function TutorialWalkthrough({ onClose, onDismissForever }: Props) {
  const steps = useSteps();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [dismissChecked, setDismissChecked] = useState(false);
  const rafRef = useRef(0);

  const current = steps[step];

  // Find and measure the target element
  const measureTarget = useCallback(() => {
    if (!current.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(current.target);
    if (!el) {
      setRect(null);
      return;
    }
    setRect(el.getBoundingClientRect());
  }, [current.target]);

  // On step change: scroll target into view, then measure
  useEffect(() => {
    setTransitioning(true);

    if (!current.target) {
      setRect(null);
      const t = setTimeout(() => setTransitioning(false), 50);
      return () => clearTimeout(t);
    }

    const el = document.querySelector(current.target);
    if (!el) {
      setRect(null);
      const t = setTimeout(() => setTransitioning(false), 50);
      return () => clearTimeout(t);
    }

    el.scrollIntoView({ behavior: 'smooth', block: current.scrollBlock ?? 'center' });

    // Wait for scroll to settle, then measure
    const timer = setTimeout(() => {
      setRect(el.getBoundingClientRect());
      setTransitioning(false);
    }, 420);

    return () => clearTimeout(timer);
  }, [step, current.target, current.scrollBlock]);

  // Keep rect fresh on scroll/resize
  useEffect(() => {
    if (!current.target) return;

    const update = () => {
      rafRef.current = requestAnimationFrame(() => {
        measureTarget();
      });
    };

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(rafRef.current);
    };
  }, [current.target, measureTarget]);

  const goNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else {
      if (dismissChecked) onDismissForever();
      else onClose();
    }
  };
  const goBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const isFirst = step === 0;
  const isLast = step === steps.length - 1;
  const isSpotlight = rect !== null && !transitioning;

  // Card positioning for spotlight mode
  const PAD = 14;
  let cardStyle: React.CSSProperties = {};
  let arrowSide: 'top' | 'bottom' = 'top';

  if (isSpotlight && rect) {
    const vh = window.innerHeight;
    const targetMid = rect.top + rect.height / 2;
    const spaceBelow = vh - (rect.bottom + PAD);
    const spaceAbove = rect.top - PAD;

    if (targetMid < vh * 0.45 || spaceBelow > 220) {
      // Card below the spotlight
      cardStyle = { top: rect.bottom + PAD + 14 };
      arrowSide = 'top';
    } else if (spaceAbove > 220) {
      // Card above the spotlight
      cardStyle = { bottom: vh - rect.top + PAD + 14 };
      arrowSide = 'bottom';
    } else {
      // Fallback: overlay at bottom
      cardStyle = { bottom: 24 };
      arrowSide = 'bottom';
    }
  }

  // Centered mode (welcome, interrogation, scoring — or target not found)
  if (!isSpotlight) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-deep/90 backdrop-blur-sm animate-fade-in">
        <div className="max-w-md w-full mx-4 animate-tooltip-enter">
          <TutorialCard
            step={step}
            totalSteps={steps.length}
            title={current.title}
            content={current.content}
            isFirst={isFirst}
            isLast={isLast}
            onNext={goNext}
            onBack={goBack}
            onSetStep={setStep}
            dismissChecked={dismissChecked}
            onToggleDismiss={() => setDismissChecked(c => !c)}
            centered
          />
        </div>
      </div>
    );
  }

  // Spotlight mode
  return (
    <>
      {/* Click-blocking transparent overlay */}
      <div className="fixed inset-0 z-[60]" onClick={goNext} />

      {/* Spotlight cutout with pulsing gold ring */}
      <div
        className="fixed z-[61] rounded-xl animate-spotlight pointer-events-none"
        style={{
          top: rect!.top - PAD,
          left: rect!.left - PAD,
          width: rect!.width + PAD * 2,
          height: rect!.height + PAD * 2,
          transition: 'top 0.35s ease, left 0.35s ease, width 0.35s ease, height 0.35s ease',
        }}
      />

      {/* Tooltip card */}
      <div
        className="fixed z-[62] left-0 right-0 flex justify-center px-3 sm:px-4 animate-tooltip-enter"
        style={cardStyle}
        key={step}
      >
        <div className="max-w-sm w-full relative">
          {/* Connecting arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#2a2440] border-gold/20 ${
              arrowSide === 'top'
                ? '-top-1.5 border-t border-l'
                : '-bottom-1.5 border-b border-r'
            }`}
          />

          <TutorialCard
            step={step}
            totalSteps={steps.length}
            title={current.title}
            content={current.content}
            isFirst={isFirst}
            isLast={isLast}
            onNext={goNext}
            onBack={goBack}
            onSetStep={setStep}
            dismissChecked={dismissChecked}
            onToggleDismiss={() => setDismissChecked(c => !c)}
          />
        </div>
      </div>
    </>
  );
}

/* ─── Shared card component ─── */

interface CardProps {
  step: number;
  totalSteps: number;
  title: string;
  content: React.ReactNode;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onBack: () => void;
  onSetStep: (i: number) => void;
  dismissChecked: boolean;
  onToggleDismiss: () => void;
  centered?: boolean;
}

function TutorialCard({
  step, totalSteps, title, content,
  isFirst, isLast,
  onNext, onBack, onSetStep, dismissChecked, onToggleDismiss,
  centered,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gold/20 overflow-hidden ${
        centered ? 'shadow-[0_0_60px_rgba(196,163,90,0.08)]' : 'shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
      }`}
      style={{ background: 'linear-gradient(175deg, #2a2440 0%, #211c30 100%)' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className={centered ? 'p-6' : 'px-5 py-4'}>
        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSetStep(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === step
                  ? 'w-5 h-1.5 bg-gold/70'
                  : i < step
                    ? 'w-1.5 h-1.5 bg-gold/35'
                    : 'w-1.5 h-1.5 bg-iron/20'
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className={`font-cinzel-dec text-gold font-bold tracking-[0.08em] text-center ${
          centered ? 'text-xl mb-1' : 'text-base mb-0.5'
        }`}>
          {title}
        </h2>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 my-2.5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/25" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/15" />
        </div>

        {/* Content */}
        <div className="mb-4">
          {content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2">
          {isFirst ? (
            <div className="w-16" />
          ) : (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg font-cinzel text-xs tracking-wider cursor-pointer
                text-iron/50 hover:text-gold/70 border border-iron/12 hover:border-gold/20
                transition-all duration-300"
            >
              Back
            </button>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={dismissChecked}
              onChange={onToggleDismiss}
              className="w-3 h-3 rounded-sm accent-gold/60 cursor-pointer"
            />
            <span className="text-iron/30 group-hover:text-iron/50 text-[11px] font-body transition-colors select-none">
              Don&apos;t show again
            </span>
          </label>

          <button
            onClick={onNext}
            className="px-4 py-1.5 rounded-lg font-cinzel text-xs font-bold tracking-[0.08em] uppercase cursor-pointer
              bg-gold/10 border border-gold/25 text-gold/90
              hover:bg-gold/18 hover:border-gold/40 hover:shadow-[0_0_12px_rgba(196,163,90,0.1)]
              transition-all duration-300"
          >
            {isLast ? 'Begin' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
