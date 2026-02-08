import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { HighlightProvider } from '../hooks/useHighlight.js';
import { getVisibility } from '../utils/uiVisibility.js';
import Header from './Header.js';
import DrawSlots from './DrawSlots.js';
import RevealedFacts from './RevealedFacts.js';
import MapPanel from './MapPanel.js';
import SuspicionFilter from './SuspicionFilter.js';
import SuspectGrid from './SuspectGrid.js';
import FinalDeliberation from './FinalDeliberation.js';
import Pinboard from './Pinboard.js';
import StickyBar from './StickyBar.js';
import EndScreen from './EndScreen.js';
import AccusationSequence from './AccusationSequence.js';
import FinalOath from './FinalOath.js';
import StrikeFlash from './StrikeFlash.js';
import LoadingScreen from './LoadingScreen.js';
import Atmosphere from './Atmosphere.js';
import HowToPlayModal from './HowToPlayModal.js';
import WelcomeToast from './WelcomeToast.js';
import MissionBrief from './MissionBrief.js';
import DemoMode, { TUTORIAL_SEED } from './DemoMode.js';
import TutorialCallout from './TutorialCallout.js';
import DailyObjectives from './DailyObjectives.js';
import ScribeLog from './ScribeLog.js';
import DebugOverlay from './DebugOverlay.js';
import CaseNotes from './CaseNotes.js';
import { InterrogationProvider } from '../hooks/useInterrogation.js';
import InterrogationChamber from './InterrogationChamber.js';

export default function GameBoard() {
  const { state, suspectsByStrikes, dispatch } = useGame();
  const { theme, mode } = useThemeStrict();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [pendingAccuse, setPendingAccuse] = useState<{ id: string; name: string } | null>(null);
  const vis = getVisibility(state.drawnCards.length);

  // First visit check (mode-scoped)
  const hasPlayedKey = `coven:hasPlayed:${mode}`;
  const hasPlayed = typeof window !== 'undefined' && localStorage.getItem(hasPlayedKey);
  const isDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');

  // Mark as played on first visit once game loads
  useEffect(() => {
    if (!hasPlayed && state.phase !== 'loading') {
      localStorage.setItem(hasPlayedKey, '1');
    }
  }, [state.phase, hasPlayed, hasPlayedKey]);

  const handleAccuseTop = useCallback(() => {
    const top = suspectsByStrikes[0];
    if (top) setPendingAccuse({ id: top.id, name: top.name });
  }, [suspectsByStrikes]);

  const handleChooseAnyone = useCallback(() => {
    const el = document.getElementById('suspect-grid');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleConfirmAccuse = useCallback(() => {
    if (pendingAccuse) {
      dispatch({ type: 'ACCUSE', suspectId: pendingAccuse.id });
      setPendingAccuse(null);
    }
  }, [pendingAccuse, dispatch]);

  if (state.phase === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <HighlightProvider>
      <InterrogationProvider>
      <div className="min-h-screen bg-bg flex flex-col relative">
        <Atmosphere />

        {/* Strike flash notifications */}
        <StrikeFlash />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onShowHowToPlay={() => setShowHowToPlay(true)} />

          {/* Daily objectives icons */}
          {state.phase === 'investigating' && (
            <div className="flex justify-center -mt-1 mb-1">
              <DailyObjectives mode="header" />
            </div>
          )}

          {/* First-time inline mission brief */}
          {!hasPlayed && <MissionBrief drawnCount={state.drawnCards.length} />}

          {/* Return visitor toast */}
          {hasPlayed && state.drawnCards.length === 0 && <WelcomeToast />}

          {/* Accusation animation overlay */}
          {state.phase === 'accusing' && <AccusationSequence />}

          {state.phase === 'ended' ? (
            <main className="flex-1 py-4">
              <EndScreen />
            </main>
          ) : state.phase === 'investigating' && (
            <main className="flex-1 pb-20">
              {/* Desktop: Two-column grid. Mobile: stacked */}
              <div className="max-w-[1440px] mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-5">
                  {/* Left column: Map + Draw + Facts + Pinboard */}
                  <div className="space-y-4">
                    <MapPanel world={state.world} drawnCount={state.drawnCards.length} />

                    {/* Draw slots in left panel on desktop, hidden on mobile (shown in sticky bar) */}
                    <div className="hidden md:block">
                      <DrawSlots />
                    </div>

                    <RevealedFacts />

                    {/* Case Notes — drawn facts, pins, marked suspects */}
                    <CaseNotes />

                    {/* Pinboard for pinned suspects */}
                    <Pinboard />

                    {/* Scribe Log — detective notebook */}
                    <ScribeLog />

                    {vis.showCompare && <FinalDeliberation />}
                  </div>

                  {/* Right column: Filter + Suspect Grid */}
                  <div className="space-y-4" id="suspect-grid">
                    <SuspicionFilter />
                    <SuspectGrid onAccuse={(id, name) => setPendingAccuse({ id, name })} />
                  </div>
                </div>
              </div>

              {/* Tutorial callout — adapted for player-driven deduction */}
              {state.seed === TUTORIAL_SEED && state.drawnCards.length >= 1 && (
                <TutorialCallout
                  targetSelector="[id^='suspect-']"
                  text="Use interrogation to reveal each suspect's claims, then cross-reference with your rune facts."
                />
              )}

              {/* Demo mode panel */}
              {isDemo && (
                <div className="max-w-md mx-auto px-4 mt-4">
                  <DemoMode />
                </div>
              )}
            </main>
          )}

          {/* Footer */}
          <footer className="text-center pb-16 md:pb-6 pt-2">
            <p className="font-body text-iron/35 text-sm tracking-wider">
              {theme.copy.footerText}
            </p>
          </footer>
        </div>

        {/* Sticky bottom bar */}
        <StickyBar onAccuseTop={handleAccuseTop} onChooseAnyone={handleChooseAnyone} />

        {/* Modals */}
        {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}

        {/* Final Oath ceremony */}
        {pendingAccuse && (
          <FinalOath
            suspectName={pendingAccuse.name}
            onConfirm={handleConfirmAccuse}
            onCancel={() => setPendingAccuse(null)}
          />
        )}

        {/* Interrogation Chamber overlay */}
        <InterrogationChamber />

        {/* Debug overlay */}
        <DebugOverlay />
      </div>
      </InterrogationProvider>
    </HighlightProvider>
  );
}
