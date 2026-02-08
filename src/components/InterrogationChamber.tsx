import { useState, useRef, useCallback } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { useInterrogation } from '../hooks/useInterrogation.js';
import SuspectPortrait from './icons/SuspectPortraits.js';
import ComposureMeter from './ComposureMeter.js';
import AnswerChipBar from './AnswerChipBar.js';
import QuestionCards from './QuestionCards.js';
import CelticBorder from './CelticBorder.js';
import VoiceButton from './VoiceButton.js';

export default function InterrogationChamber() {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const {
    interrogation,
    closeChamber,
    playDefense,
    submitQuestion,
    submitVoice,
    skipAudio,
    suspectPressure,
    voiceOff,
    isTranscribing,
  } = useInterrogation();

  const [typedInput, setTypedInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // All hooks MUST be before any conditional returns
  const handleTypedSubmit = useCallback(() => {
    if (typedInput.trim().length < 3) return;
    submitQuestion(typedInput.trim());
    setTypedInput('');
  }, [typedInput, submitQuestion]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTypedSubmit();
    }
  }, [handleTypedSubmit]);

  const suspect = interrogation.activeSuspect;
  if (!suspect || interrogation.phase === 'idle') return null;

  const pressure = suspectPressure(suspect.id);
  const tokensLeft = state.interrogationTokens;

  // Wax droplets for Council Favors (6 tokens total per redesign)
  const totalTokens = 6;
  const waxDroplets = Array.from({ length: totalTokens }, (_, i) => i < tokensLeft);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in overflow-hidden"
      onClick={closeChamber}
    >
      {/* Deep background with layered radial gradients */}
      <div className="absolute inset-0 bg-bg-deep/98 backdrop-blur-md" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(37,32,64,0.8),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(196,163,90,0.04),transparent_70%)]" />

      {/* Content panel — scrollable sheet from bottom on mobile, centered card on desktop */}
      <div
        className="
          relative z-10 w-full sm:max-w-xl
          max-h-[95vh] overflow-y-auto overscroll-contain
          bg-gradient-to-b from-surface/95 via-bg-deep/98 to-bg-deep
          sm:rounded-2xl sm:border sm:border-gold/10
          sm:shadow-[0_0_60px_rgba(196,163,90,0.06),0_0_120px_rgba(0,0,0,0.5)]
          animate-scale-in
          pb-safe
        "
        onClick={e => e.stopPropagation()}
      >
        {/* Top edge ornament line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="px-5 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10">

          {/* === HEADER: Portrait + Name + Role + Composure === */}
          <div className="text-center mb-6">
            {/* Portrait with layered glow */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-2xl bg-gold/5 blur-xl scale-125" />
              <div className="relative rounded-2xl overflow-hidden ring-2 ring-gold/25 shadow-[0_4px_32px_rgba(196,163,90,0.12)]">
                <SuspectPortrait name={suspect.name} size={96} portraitStyle={theme.visuals.portraitStyle} />
              </div>
            </div>

            <h2 className="font-cinzel-dec text-gold text-2xl sm:text-3xl tracking-[0.18em] font-bold mb-1">
              {suspect.name}
            </h2>
            <p className="font-body text-gold-dim text-sm sm:text-base italic tracking-wide">
              {suspect.role}
            </p>

            {/* Composure meter */}
            <div className="max-w-[240px] mx-auto mt-4">
              <ComposureMeter pressure={pressure} />
            </div>
          </div>

          <CelticBorder className="mb-5 opacity-25" />

          {/* === COUNCIL FAVORS === */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <span className="font-cinzel text-iron/50 text-xs sm:text-sm tracking-[0.18em] uppercase">
              Council Favors
            </span>
            <div className="flex gap-2">
              {waxDroplets.map((active, i) => (
                <div
                  key={i}
                  className={`
                    w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-700
                    ${active
                      ? 'bg-gradient-to-br from-crimson to-crimson-bright shadow-[0_0_10px_rgba(139,26,26,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)]'
                      : 'bg-iron/15 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]'
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* === ANSWER AREA === */}
          <div className="surface-parchment rounded-xl p-5 sm:p-6 mb-5 min-h-[100px]">
            {interrogation.phase === 'processing' && (
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold/50 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-gold/40 animate-pulse delay-200" />
                  <div className="w-2 h-2 rounded-full bg-gold/30 animate-pulse delay-400" />
                </div>
                <span className="font-cinzel text-gold/60 text-sm tracking-[0.2em] animate-pulse">
                  The Council listens...
                </span>
              </div>
            )}

            {interrogation.phase === 'answering' && interrogation.currentAnswer && (
              <div className="animate-ink-reveal">
                <p className="font-body text-parchment/85 text-base sm:text-lg leading-relaxed italic">
                  &ldquo;{interrogation.currentAnswer}&rdquo;
                </p>

                {interrogation.isPlaying && (
                  <button
                    onClick={skipAudio}
                    className="
                      mt-3 px-4 py-1.5 rounded-lg
                      text-iron/50 hover:text-iron/70 text-sm font-body
                      border border-iron/15 hover:border-iron/25
                      cursor-pointer transition-all
                    "
                  >
                    Skip audio
                  </button>
                )}
              </div>
            )}

            {interrogation.phase === 'chamber' && !interrogation.currentAnswer && (
              <div className="text-center py-4">
                <button
                  onClick={playDefense}
                  className="
                    group relative px-8 py-3.5 rounded-xl font-cinzel text-sm sm:text-base tracking-[0.15em]
                    border-2 border-gold/25 text-gold/70
                    hover:border-gold/50 hover:text-gold hover:bg-gold/5
                    hover:shadow-[0_0_24px_rgba(196,163,90,0.1)]
                    cursor-pointer transition-all duration-300
                  "
                >
                  <span className="relative z-10">
                    {voiceOff ? 'Read their defense' : 'Hear their defense'}
                  </span>
                </button>
                <p className="font-body text-iron/40 text-xs sm:text-sm italic mt-3 tracking-wide">
                  Free — no Favor spent
                </p>
              </div>
            )}

            {interrogation.error && (
              <p className="text-center font-body text-crimson-bright/80 text-sm italic mt-3">
                {interrogation.error}
              </p>
            )}
          </div>

          {/* === ANSWER CHIPS === */}
          <AnswerChipBar chips={state.answerChips} suspectId={suspect.id} />

          {/* === VOICE BUTTON — Primary interaction === */}
          {!voiceOff && interrogation.phase !== 'processing' && (
            <div className="mt-6 mb-2">
              <VoiceButton
                onRecordingComplete={submitVoice}
                disabled={tokensLeft <= 0}
                isProcessing={isTranscribing}
              />
            </div>
          )}

          {/* === QUESTION CARDS === */}
          {interrogation.phase !== 'processing' && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/15" />
                <span className="font-cinzel text-gold/50 text-xs sm:text-sm tracking-[0.25em] uppercase">
                  Question Cards
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/15" />
              </div>
              <QuestionCards suspect={suspect} tokensLeft={tokensLeft} />
            </div>
          )}

          {/* === TYPED INPUT — Secondary fallback === */}
          {interrogation.phase !== 'processing' && (
            <div className="mt-6">
              <div className="flex gap-2.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={e => setTypedInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a question..."
                  className="
                    flex-1 bg-bg-deep/70 border border-iron/20 rounded-xl px-4 py-3
                    font-body text-parchment/80 text-sm sm:text-base placeholder-iron/30
                    focus:outline-none focus:border-gold/30 focus:shadow-[0_0_12px_rgba(196,163,90,0.06)]
                    transition-all
                  "
                />
                <button
                  onClick={handleTypedSubmit}
                  disabled={typedInput.trim().length < 3}
                  className="
                    px-5 py-3 rounded-xl font-cinzel text-sm tracking-wider
                    bg-gold/8 border border-gold/20 text-gold/60
                    hover:bg-gold/15 hover:border-gold/35 hover:text-gold
                    disabled:opacity-25 disabled:cursor-not-allowed
                    cursor-pointer transition-all
                  "
                >
                  Ask
                </button>
              </div>
              <p className="font-body text-iron/30 text-xs italic mt-2 tracking-wide">
                Type freely — classified automatically
              </p>
            </div>
          )}

          {/* === CLOSE BUTTON === */}
          <div className="text-center mt-8">
            <button
              onClick={closeChamber}
              className="
                font-cinzel text-iron/40 text-sm tracking-[0.15em]
                hover:text-gold/50 cursor-pointer transition-colors duration-300
                uppercase
              "
            >
              Leave the Chamber
            </button>
          </div>
        </div>

        {/* Bottom edge ornament */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>
    </div>
  );
}
