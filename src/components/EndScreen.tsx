import { useState, useEffect, useRef, useMemo } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import { generateShareText, generateShareCanvas } from '../utils/shareCard.js';
import { getAchievements, getPlaystyleGlyphs } from '../utils/achievements.js';
import { getCommunityStats } from '../utils/communityStats.js';
import { useRuneMastery } from '../hooks/useRuneMastery.js';
import { useCodexUnlock } from './CodexPages.js';
import { usePersonalBests, getSealTier, getSealLabel } from '../hooks/usePersonalBests.js';
import { useCouncilChronicle } from '../hooks/useCouncilChronicle.js';
import { useShards } from '../hooks/useShards.js';
import type { RuneArchetype } from '../types/index.js';
import { evaluateAllStrikes } from '../engine/contradictions.js';
import WantedPoster from './WantedPoster.js';
import ConfessionCard from './ConfessionCard.js';
import ProofStrip from './ProofStrip.js';
import StudyMode from './StudyMode.js';
import CodexPages from './CodexPages.js';
import DailyObjectives from './DailyObjectives.js';
import CouncilChronicle from './CouncilChronicle.js';
import { RuneOaths, RuneRoads, RuneRelics, RuneSkies } from './icons/RuneSymbols.js';
import CouncilReview from './CouncilReview.js';
import AchievementCodex, { recordAchievements } from './AchievementCodex.js';
import DareShare from './DareShare.js';
import { getVerdictEpitaph } from '../utils/councilVerdict.js';

const RUNE_ICONS: Record<RuneArchetype, typeof RuneOaths> = {
  oaths: RuneOaths,
  roads: RuneRoads,
  relics: RuneRelics,
  skies: RuneSkies,
};

export default function EndScreen() {
  const { state, puzzle, dispatch } = useGame();
  const { theme } = useThemeStrict();
  const [copied, setCopied] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const { mastery, counts, recordWin } = useRuneMastery();
  const { unlock } = useCodexUnlock();
  const { bests, recordGame } = usePersonalBests();
  const council = useCouncilChronicle();
  const { shards, recordGame: recordShards } = useShards();
  const [shardReward, setShardReward] = useState(0);
  const [newCodexPage, setNewCodexPage] = useState<{ id: string; title: string; text: string; unlocksAfter: number } | null>(null);
  const progressionRecorded = useRef(false);

  // Record all progression on mount (guarded against StrictMode double-fire)
  useEffect(() => {
    if (state.phase !== 'ended') return;
    if (progressionRecorded.current) return;
    progressionRecorded.current = true;

    if (state.won) {
      const archetypes = state.drawnCards
        .map(id => state.runeDeck.find(c => c.id === id)?.archetype)
        .filter((a): a is RuneArchetype => !!a);
      recordWin(archetypes);
      council.recordWin();
    }
    recordGame(state);
    const reward = recordShards(state);
    setShardReward(reward);
    const page = unlock();
    if (page) setNewCodexPage(page);
    // Record achievements persistently
    const achs = getAchievements(state);
    if (achs.length > 0) recordAchievements(achs.map(a => a.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.phase !== 'ended') return null;

  const won = state.won;
  const accused = state.suspects.find(s => s.id === state.accusation);
  const liar = state.suspects.find(s => s.isLiar);
  const achievements = getAchievements(state);
  const communityStats = getCommunityStats(state.seed);
  const playstyleGlyphs = getPlaystyleGlyphs(state);
  const sealTier = getSealTier(state);

  const handleShareText = async () => {
    try {
      const text = generateShareText(state, theme);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleShareImage = () => {
    try {
      const canvas = generateShareCanvas(state, theme);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coven-${state.seed}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch { /* canvas unavailable */ }
  };

  const handleChallenge = async () => {
    try {
      const text = `COVEN #${state.seed}\nCan you survive?\n${window.location.origin}${window.location.pathname}?seed=${state.seed}&mode=${theme.id}`;
      await navigator.clipboard.writeText(text);
      setChallengeCopied(true);
      setTimeout(() => setChallengeCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handlePractice = () => {
    const randomSeed = Math.floor(Math.random() * 99999999);
    dispatch({ type: 'RESET', seed: randomSeed });
  };

  const handleReturnDaily = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('seed');
    url.searchParams.delete('demo');
    window.location.href = url.toString();
  };

  // Codex stamp — extra draws guarantee Mercy at best
  const stamp = won
    ? (state.usedExtraDraw ? theme.copy.stampMercy : state.score >= 700 ? theme.copy.stampWin : theme.copy.stampMercy)
    : theme.copy.stampLose;

  const isPractice = new URLSearchParams(window.location.search).has('seed');

  // Compute full unmasked strikes (no revealedClaims gating) for the glyph row
  // so judges see the actual contradictions, not the player's partial investigation
  const fullStrikes = useMemo(() => {
    if (!state.world) return new Map<string, number>();
    const deltas = evaluateAllStrikes(
      state.suspects.map(s => ({ id: s.id, claimVector: s.claimVector })),
      state.revealedFacts, state.world, 'endscreen',
    );
    return new Map(deltas.map(d => [d.suspectId, d.strikes]));
  }, [state.suspects, state.revealedFacts, state.world]);

  return (
    <div className="px-4 max-w-4xl mx-auto space-y-5 animate-fade-in-up pb-20">
      {/* Verdict */}
      <div className={`surface-parchment rounded-xl overflow-hidden border ${won ? 'border-forest/30' : 'border-crimson/30'}`}>
        <div className={`relative py-8 px-6 text-center ${
          won ? 'bg-gradient-to-b from-forest/20 via-forest/10 to-transparent'
            : 'bg-gradient-to-b from-crimson/15 via-crimson/8 to-transparent'
        }`}>
          <h2 className={`${theme.visuals.headingDecFontClass} text-4xl md:text-5xl font-bold tracking-[0.2em] mb-3 animate-verdict ${
            won ? 'text-forest-bright' : 'text-crimson-bright'
          }`}>
            {won ? theme.copy.verdictWin : theme.copy.verdictLose}
          </h2>

          {won ? (
            <p className="font-body text-parchment/85 text-base">
              You named <span className="text-gold font-bold">{accused?.name}</span> as the {theme.copy.liarLabel}.
              <br /><span className="text-forest-bright/70 italic">{theme.copy.verdictWinFlavor}</span>
            </p>
          ) : (
            <p className="font-body text-parchment/85 text-base">
              You accused <span className="text-iron font-bold">{accused?.name}</span>, but the true {theme.copy.liarLabel} was{' '}
              <span className="text-crimson-bright font-bold">{liar?.name}</span>.
              <br /><span className="text-crimson/60 italic">{theme.copy.verdictLoseFlavor}</span>
            </p>
          )}

          {/* Council Verdict epitaph */}
          <p className="font-body text-iron/50 text-sm italic mt-3">
            &ldquo;{getVerdictEpitaph(state.seed, won ?? false)}&rdquo;
          </p>
        </div>

        {/* Glyph row — uses full unmasked strikes */}
        <div className="flex justify-center gap-2.5 py-3">
          {state.suspects.map((s, i) => {
            const fs = fullStrikes.get(s.id) ?? 0;
            return (
              <div key={s.id} className="animate-glyph-pop" style={{ animationDelay: `${i * 80 + 400}ms` }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  fs >= 2 ? 'bg-crimson/20 text-crimson-bright border border-crimson/30'
                    : fs === 1 ? 'bg-gold/15 text-gold border border-gold/25'
                    : 'bg-surface/40 text-iron/40 border border-iron/12'
                }`} title={`${s.name}: ${fs}`}>
                  {fs >= 2 ? '●' : fs === 1 ? '◑' : '○'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stamp + Seal Tier */}
        <div className="text-center pb-2 flex justify-center gap-2 items-center">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-cinzel tracking-[0.15em] border ${
            won && state.score >= 700 && !state.usedExtraDraw
              ? 'bg-forest/10 text-forest-bright border-forest/25'
              : won
                ? 'bg-ember/10 text-ember border-ember/20'
                : 'bg-crimson/10 text-crimson-bright border-crimson/20'
          }`}>
            {stamp}
          </span>
          {sealTier && (
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-cinzel tracking-[0.1em] border ${
              sealTier === 'gold' ? 'bg-gold/15 text-gold-bright border-gold/30'
                : sealTier === 'silver' ? 'bg-iron/15 text-parchment/70 border-iron/25'
                : 'bg-ember/10 text-ember/80 border-ember/20'
            }`}>
              {getSealLabel(sealTier)}
            </span>
          )}
        </div>

        {/* Playstyle glyphs + Shards earned */}
        <div className="text-center pb-4 flex justify-center items-center gap-3">
          <span className="font-body text-iron/35 text-xs tracking-[0.3em]">{playstyleGlyphs}</span>
          {shardReward > 0 && (
            <span className="font-cinzel text-gold/60 text-xs tracking-wider animate-scale-in">
              +{shardReward} ◆
            </span>
          )}
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="flex gap-2 justify-center flex-wrap animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {achievements.map(ach => (
            <span key={ach.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel tracking-wider
              bg-gold/10 text-gold border border-gold/25 animate-scale-in" title={ach.description}>
              <span className="text-gold/60">★</span> {ach.title}
            </span>
          ))}
        </div>
      )}

      {/* Daily Objectives */}
      <DailyObjectives mode="endscreen" />

      {/* Wanted Poster */}
      {liar && <WantedPoster liar={liar} world={state.world} />}

      {/* Confession + "You missed this" */}
      {liar && puzzle && <ConfessionCard liar={liar} proof={puzzle.solvabilityProof} />}

      {/* Proof Strip */}
      {puzzle && <ProofStrip state={state} proof={puzzle.solvabilityProof} />}

      {/* Council Review — 3-bullet post-mortem */}
      <CouncilReview />

      {/* Community Stats */}
      <div className="text-center py-2 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <p className="font-body text-iron/40 text-xs italic mb-0.5">
          The Watch&rsquo;s omens estimate&hellip;
        </p>
        <p className="font-cinzel text-parchment/60 text-sm tracking-wider">
          <span className={won ? 'text-forest-bright/70' : 'text-iron/50'}>{communityStats.survivedPct}% survived</span>
          {' '}&middot;{' '}
          <span className={!won ? 'text-crimson/70' : 'text-iron/50'}>{communityStats.fallenPct}% fallen</span>
        </p>
        <p className="font-body text-iron/35 text-xs mt-0.5">{communityStats.totalPlayers} watchers today</p>
      </div>

      {/* Personal Bests */}
      <div className="surface-parchment rounded-xl border border-gold/10 p-4 animate-fade-in-up">
        <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-2">
          Your Record — ◆ {shards} Shards
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-cinzel text-gold/70 text-lg font-bold">{bests.gamesWon}</p>
            <p className="font-body text-iron/40 text-xs">Wins</p>
          </div>
          <div>
            <p className="font-cinzel text-gold/70 text-lg font-bold">
              {bests.bestTime != null ? `${bests.bestTime}s` : '—'}
            </p>
            <p className="font-body text-iron/40 text-xs">Best Time</p>
          </div>
          <div>
            <p className="font-cinzel text-gold/70 text-lg font-bold">
              {bests.bestCleanTime != null ? `${bests.bestCleanTime}s` : '—'}
            </p>
            <p className="font-body text-iron/40 text-xs">Best Clean</p>
          </div>
        </div>
        {/* Secondary stats row */}
        <div className="grid grid-cols-3 gap-3 text-center mt-2 pt-2 border-t border-gold/8">
          <div>
            <p className="font-cinzel text-gold/60 text-sm font-bold">
              {bests.bestHintTime != null ? `${bests.bestHintTime}s` : '—'}
            </p>
            <p className="font-body text-iron/35 text-xs">Best w/ Hint</p>
          </div>
          <div>
            <p className="font-cinzel text-gold/60 text-sm font-bold">{bests.gamesPlayed}</p>
            <p className="font-body text-iron/35 text-xs">Played</p>
          </div>
          <div>
            <p className="font-cinzel text-gold/60 text-sm font-bold">{bests.studyModeLiarFound}</p>
            <p className="font-body text-iron/35 text-xs">Study Finds</p>
          </div>
        </div>
      </div>

      {/* Rune Mastery */}
      <div className="surface-parchment rounded-xl border border-gold/10 p-4">
        <p className="font-cinzel text-gold/60 text-xs tracking-[0.2em] uppercase mb-2">
          Runes Mastered This Week
        </p>
        <div className="flex gap-3 justify-center">
          {(['oaths', 'roads', 'relics', 'skies'] as RuneArchetype[]).map(arch => {
            const Icon = RUNE_ICONS[arch];
            const isMastered = mastery[arch];
            return (
              <div key={arch} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isMastered ? 'bg-gold/10 border border-gold/25' : 'bg-surface/20 border border-iron/10 opacity-40'
              }`}>
                <Icon size={20} className={isMastered ? 'text-gold' : 'text-iron/30'} />
                <span className={`font-cinzel text-xs tracking-wider ${
                  isMastered ? 'text-gold/80' : 'text-iron/30'
                }`}>
                  {arch}
                </span>
                {isMastered && (
                  <span className="text-xs text-gold/50">
                    ✓ {counts[arch] > 1 ? `×${counts[arch]}` : ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Council Chronicle */}
      <CouncilChronicle />

      {/* Study Mode */}
      <StudyMode />

      {/* Codex Pages */}
      <CodexPages newUnlock={newCodexPage} />

      {/* Achievement Codex — persistent collection */}
      <AchievementCodex />

      {/* Dare Share — challenge presets (wins only) */}
      <DareShare />

      {/* Share + Challenge buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button onClick={handleShareText}
          className="px-5 py-2.5 rounded-lg font-cinzel text-xs tracking-[0.1em] uppercase cursor-pointer
            bg-gold/12 border border-gold/30 text-gold hover:bg-gold/18 hover:border-gold/45 transition-all duration-300">
          {copied ? 'Copied!' : 'Share Result'}
        </button>
        <button onClick={handleShareImage}
          className="px-5 py-2.5 rounded-lg font-cinzel text-xs tracking-[0.1em] uppercase cursor-pointer
            surface-parchment border border-iron/20 text-iron/75 hover:border-gold/30 hover:text-gold/80 transition-all duration-300">
          Save Image
        </button>
        <button onClick={handleChallenge}
          className="px-5 py-2.5 rounded-lg font-cinzel text-xs tracking-[0.1em] uppercase cursor-pointer
            bg-surface/30 border border-gold/15 text-gold/60 hover:border-gold/30 hover:text-gold/80 transition-all duration-300">
          {challengeCopied ? 'URL Copied!' : 'Challenge a Friend'}
        </button>
      </div>

      {/* Practice + Return */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button onClick={handlePractice}
          className={`px-4 py-2 rounded-lg ${theme.visuals.headingFontClass} text-xs tracking-wider cursor-pointer
            text-iron/60 border border-iron/15 hover:border-gold/25 hover:text-gold/70 transition-all duration-300`}>
          {theme.copy.practiceButton}
        </button>
        {isPractice && (
          <button onClick={handleReturnDaily}
            className="px-4 py-2 rounded-lg font-cinzel text-xs tracking-wider cursor-pointer
              text-gold/60 border border-gold/20 hover:border-gold/40 hover:text-gold transition-all duration-300">
            Return to Daily Chronicle
          </button>
        )}
      </div>

      {/* Tomorrow tease */}
      {!isPractice && (
        <div className="text-center pt-2">
          <p className="font-body text-iron/35 text-xs italic">
            {theme.copy.tomorrowTease}
          </p>
        </div>
      )}
    </div>
  );
}
