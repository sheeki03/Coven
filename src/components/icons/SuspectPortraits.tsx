import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

// Warm fantasy color palette
const SKIN = '#d4a574';
const SKIN_SHADOW = '#b8895c';
const SKIN_HIGHLIGHT = '#e8c097';
const HAIR_DARK = '#3d2b1f';
const HAIR_GREY = '#8a8078';
const HAIR_RED = '#8b3a2a';
const HAIR_BROWN = '#5c3d2e';
const HAIR_BLACK = '#2a1f1a';
const HAIR_AUBURN = '#6b3328';
const EYE_BLUE = '#5d8aa8';
const EYE_GREEN = '#5a8a5c';
const EYE_BROWN = '#6b4e2a';
const EYE_AMBER = '#b8860b';
const GOLD = '#c4a35a';
const CRIMSON = '#8b2a2a';
const CLOTH_DARK = '#2a2540';
const CLOTH_GREEN = '#2a4a35';
const CLOTH_PURPLE = '#3d2d4a';
const CLOTH_BROWN = '#4a3728';
const WHITE = '#f0e6d6';
const LIPS = '#c27a6a';
const LIPS_DARK = '#9a6055';

/** Mordecai — ancient hooded oath-scribe, wise elder, long grey beard */
function Mordecai({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Hood */}
      <path d="M12 55C12 20 25 2 50 2s38 18 38 53" fill={CLOTH_PURPLE} />
      <path d="M14 53C14 22 26 6 50 6s36 16 36 47" fill="#4a3960" />
      {/* Hood rim highlight */}
      <path d="M16 50C16 24 27 8 50 8s34 16 34 42" stroke="#6a5580" strokeWidth="1.5" fill="none" />
      {/* Hood fabric folds */}
      <path d="M18 46c2-8 6-16 12-22" stroke="#5a4570" strokeWidth="1.5" opacity="0.6" />
      <path d="M82 46c-2-8-6-16-12-22" stroke="#5a4570" strokeWidth="1.5" opacity="0.6" />

      {/* Face */}
      <ellipse cx="50" cy="48" rx="19" ry="23" fill={SKIN} />
      <ellipse cx="50" cy="48" rx="19" ry="23" fill={SKIN_SHADOW} opacity="0.3" />
      {/* Cheek highlights */}
      <ellipse cx="40" cy="50" rx="5" ry="3" fill={SKIN_HIGHLIGHT} opacity="0.4" />
      <ellipse cx="60" cy="50" rx="5" ry="3" fill={SKIN_HIGHLIGHT} opacity="0.4" />

      {/* Deep-set eyes */}
      <ellipse cx="42" cy="43" rx="4" ry="2.5" fill={WHITE} opacity="0.9" />
      <ellipse cx="58" cy="43" rx="4" ry="2.5" fill={WHITE} opacity="0.9" />
      <circle cx="42" cy="43" r="2" fill={EYE_BLUE} />
      <circle cx="58" cy="43" r="2" fill={EYE_BLUE} />
      <circle cx="42" cy="43" r="1" fill="#1a1a2a" />
      <circle cx="58" cy="43" r="1" fill="#1a1a2a" />
      <circle cx="43" cy="42.2" r="0.6" fill={WHITE} opacity="0.8" />
      <circle cx="59" cy="42.2" r="0.6" fill={WHITE} opacity="0.8" />
      {/* Eyelids */}
      <path d="M38 42c2-2 5-2 8 0" stroke={SKIN_SHADOW} strokeWidth="1.5" fill="none" />
      <path d="M54 42c2-2 5-2 8 0" stroke={SKIN_SHADOW} strokeWidth="1.5" fill="none" />
      {/* Heavy grey brows */}
      <path d="M36 39c2-2.5 6-3 10-1.5" stroke={HAIR_GREY} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 37.5c4-1.5 8-0.5 10 1.5" stroke={HAIR_GREY} strokeWidth="2.5" strokeLinecap="round" />
      {/* Crow's feet */}
      <path d="M35 44c-1 0.5-2 1.5-2.5 2.5" stroke={SKIN_SHADOW} strokeWidth="0.8" />
      <path d="M65 44c1 0.5 2 1.5 2.5 2.5" stroke={SKIN_SHADOW} strokeWidth="0.8" />

      {/* Nose */}
      <path d="M49 45c0.5 3 1 6 1.5 9" stroke={SKIN_SHADOW} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 54c1.5 1 3.5 1 5 0" stroke={SKIN_SHADOW} strokeWidth="1" />

      {/* Thin mouth */}
      <path d="M44 60c3 0.5 6 0.5 12 0" stroke={LIPS_DARK} strokeWidth="1.5" strokeLinecap="round" />

      {/* Long grey beard */}
      <path d="M36 58c0 6 1 14 4 24" stroke={HAIR_GREY} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M64 58c0 6-1 14-4 24" stroke={HAIR_GREY} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 62c0 8-1 16-2 26" stroke={HAIR_GREY} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Beard fill */}
      <path d="M36 58c0 6 1 14 4 24l10 4 10-4c3-10 4-18 4-24" fill={HAIR_GREY} opacity="0.35" />
      {/* Beard wave details */}
      <path d="M40 64c-0.5 4 0.5 8 0 12" stroke="#9a9490" strokeWidth="1" opacity="0.5" />
      <path d="M46 66c0 4 0.5 8 0 12" stroke="#9a9490" strokeWidth="1" opacity="0.5" />
      <path d="M54 66c0 4-0.5 8 0 12" stroke="#9a9490" strokeWidth="1" opacity="0.5" />
      <path d="M60 64c0.5 4-0.5 8 0 12" stroke="#9a9490" strokeWidth="1" opacity="0.5" />
      {/* Mustache */}
      <path d="M42 58c-3 1.5-5 3-6 5" stroke={HAIR_GREY} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 58c3 1.5 5 3 6 5" stroke={HAIR_GREY} strokeWidth="2" strokeLinecap="round" />

      {/* Hood drape */}
      <path d="M12 55c2 12 6 22 12 30" stroke="#5a4570" strokeWidth="3" strokeLinecap="round" />
      <path d="M88 55c-2 12-6 22-12 30" stroke="#5a4570" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Isolde — stern stone mason, sharp features, braids, jeweled circlet */
function Isolde({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Hair — dark auburn, flowing into braids */}
      <path d="M24 36c2-16 12-26 26-26s22 10 24 26" fill={HAIR_AUBURN} />
      <path d="M28 32c2-12 10-20 22-20s20 8 22 20" fill="#7a3d30" />

      {/* Braids */}
      <path d="M22 38c-2 8-3 18-2 32" stroke={HAIR_AUBURN} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M78 38c2 8 3 18 2 32" stroke={HAIR_AUBURN} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Braid texture */}
      <path d="M20 42c1 3-1 6 0 9s-1 6 0 9" stroke="#5a2a20" strokeWidth="1.5" opacity="0.5" />
      <path d="M80 42c-1 3 1 6 0 9s1 6 0 9" stroke="#5a2a20" strokeWidth="1.5" opacity="0.5" />
      {/* Braid beads */}
      <circle cx="21" cy="72" r="3" fill={GOLD} opacity="0.8" />
      <circle cx="79" cy="72" r="3" fill={GOLD} opacity="0.8" />

      {/* Circlet */}
      <path d="M28 28c5-5 13-8 22-8s17 3 22 8" stroke={GOLD} strokeWidth="2.5" />
      {/* Gems */}
      <path d="M50 18l-3.5 5h7z" fill={GOLD} />
      <circle cx="50" cy="21" r="2" fill="#4a90d9" />
      <circle cx="38" cy="23" r="2.2" fill={GOLD} />
      <circle cx="62" cy="23" r="2.2" fill={GOLD} />
      <circle cx="38" cy="23" r="1.2" fill={CRIMSON} opacity="0.8" />
      <circle cx="62" cy="23" r="1.2" fill={CRIMSON} opacity="0.8" />

      {/* Face — angular */}
      <ellipse cx="50" cy="46" rx="18" ry="23" fill={SKIN} />
      <ellipse cx="50" cy="46" rx="18" ry="23" fill={SKIN_SHADOW} opacity="0.2" />
      {/* Cheekbone definition */}
      <path d="M32 46l7-1.5" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.4" />
      <path d="M68 46l-7-1.5" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.4" />
      <ellipse cx="38" cy="48" rx="4" ry="2.5" fill={SKIN_HIGHLIGHT} opacity="0.35" />
      <ellipse cx="62" cy="48" rx="4" ry="2.5" fill={SKIN_HIGHLIGHT} opacity="0.35" />

      {/* Eyes — stern, almond-shaped */}
      <path d="M36 42c2-2.5 6-2.5 9 0" fill={WHITE} opacity="0.9" />
      <path d="M36 42c2 1.5 6 1.5 9 0" fill={WHITE} opacity="0.9" />
      <path d="M55 42c2-2.5 6-2.5 9 0" fill={WHITE} opacity="0.9" />
      <path d="M55 42c2 1.5 6 1.5 9 0" fill={WHITE} opacity="0.9" />
      <circle cx="41" cy="42" r="2.2" fill={EYE_AMBER} />
      <circle cx="59" cy="42" r="2.2" fill={EYE_AMBER} />
      <circle cx="41" cy="42" r="1.1" fill="#1a1a2a" />
      <circle cx="59" cy="42" r="1.1" fill="#1a1a2a" />
      <circle cx="42" cy="41.3" r="0.6" fill={WHITE} opacity="0.8" />
      <circle cx="60" cy="41.3" r="0.6" fill={WHITE} opacity="0.8" />
      {/* Sharp brows */}
      <path d="M35 38c3-2 6-2.5 10-1" stroke={HAIR_AUBURN} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M55 37c4-1.5 7-1 10 1" stroke={HAIR_AUBURN} strokeWidth="1.8" strokeLinecap="round" />
      {/* Eyeliner / lash line */}
      <path d="M35.5 42c2-2.5 6.5-2.5 10 0" stroke="#3a2a1f" strokeWidth="1.2" fill="none" />
      <path d="M54.5 42c2-2.5 6.5-2.5 10 0" stroke="#3a2a1f" strokeWidth="1.2" fill="none" />

      {/* Nose */}
      <path d="M49 43c0.5 3 0.8 6 1 9" stroke={SKIN_SHADOW} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M48 52c1.5 0.8 3 0.8 4 0" stroke={SKIN_SHADOW} strokeWidth="1" />

      {/* Lips */}
      <path d="M44 58c2-0.5 4 0.5 6 1 2-0.5 4-1.5 6-1" stroke={LIPS} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M44 59c3 1 8 1 12 0" fill={LIPS} opacity="0.4" />

      {/* Chin */}
      <path d="M44 66c3 1 6 1 12 0" stroke={SKIN_SHADOW} strokeWidth="0.8" opacity="0.3" />

      {/* Neck and collar */}
      <rect x="42" y="68" width="16" height="12" fill={SKIN} opacity="0.8" />
      <path d="M34 80c5-3 11-5 16-5s11 2 16 5" fill={CLOTH_BROWN} />
      <path d="M34 80c5-3 11-5 16-5s11 2 16 5" stroke="#5a4332" strokeWidth="1.5" />
    </svg>
  );
}

/** Theron — young warden of leaves, tousled hair, leaf crown, confident */
function Theron({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Tousled brown hair */}
      <path d="M26 34c2-16 11-26 24-26s22 10 24 26" fill={HAIR_BROWN} />
      <path d="M28 32c2-14 10-22 22-22s20 8 22 22" fill="#6a4a38" />
      {/* Hair texture */}
      <path d="M32 26c3-8 8-14 14-16" stroke="#7a5a48" strokeWidth="2" opacity="0.5" />
      <path d="M68 26c-3-8-8-14-14-16" stroke="#7a5a48" strokeWidth="2" opacity="0.5" />
      <path d="M42 10c3-2 8-2 12 0" stroke="#7a5a48" strokeWidth="2" opacity="0.4" />

      {/* Leaf crown — green leaves */}
      <path d="M28 24c-3-6-1-12 4-11 3 2 3 6 0 11" fill="#3a6a3a" opacity="0.8" />
      <path d="M38 18c-2-6 0-12 5-11 2.5 3 2 7-1 11" fill="#3a6a3a" opacity="0.8" />
      <path d="M50 14c-1-6 1-11 5-10 2 4 1 7-2 10" fill="#4a7a4a" opacity="0.8" />
      <path d="M62 18c2-6 0-12-5-11-2.5 3-2 7 1 11" fill="#3a6a3a" opacity="0.8" />
      <path d="M72 24c3-6 1-12-4-11-3 2-3 6 0 11" fill="#3a6a3a" opacity="0.8" />
      {/* Leaf veins */}
      <path d="M30 20l-1-5M40 16l-1-6M51 12l1-5M61 16l1-6M71 20l1-5" stroke="#2a5a2a" strokeWidth="0.8" />

      {/* Face — youthful, strong jaw */}
      <ellipse cx="50" cy="48" rx="18" ry="22" fill={SKIN} />
      <ellipse cx="50" cy="48" rx="18" ry="22" fill={SKIN_HIGHLIGHT} opacity="0.2" />
      {/* Jawline */}
      <path d="M34 50c2 10 8 18 16 20 8-2 14-10 16-20" stroke={SKIN_SHADOW} strokeWidth="1" fill="none" opacity="0.3" />

      {/* Eyes — wide, bright green */}
      <ellipse cx="42" cy="44" rx="4.5" ry="3" fill={WHITE} opacity="0.9" />
      <ellipse cx="58" cy="44" rx="4.5" ry="3" fill={WHITE} opacity="0.9" />
      <circle cx="42" cy="44" r="2.5" fill={EYE_GREEN} />
      <circle cx="58" cy="44" r="2.5" fill={EYE_GREEN} />
      <circle cx="42" cy="44" r="1.2" fill="#1a2a1a" />
      <circle cx="58" cy="44" r="1.2" fill="#1a2a1a" />
      <circle cx="43.2" cy="43" r="0.7" fill={WHITE} opacity="0.85" />
      <circle cx="59.2" cy="43" r="0.7" fill={WHITE} opacity="0.85" />
      {/* Natural brows */}
      <path d="M36 40c3-2 6-2.5 9-1.5" stroke={HAIR_BROWN} strokeWidth="2" strokeLinecap="round" />
      <path d="M55 38.5c3-1 6-0.5 9 1.5" stroke={HAIR_BROWN} strokeWidth="2" strokeLinecap="round" />
      {/* Eye outlines */}
      <path d="M37.5 43c2-2 6-2 9 0" stroke={SKIN_SHADOW} strokeWidth="1" fill="none" />
      <path d="M53.5 43c2-2 6-2 9 0" stroke={SKIN_SHADOW} strokeWidth="1" fill="none" />

      {/* Nose */}
      <path d="M49 45c0.5 3 0.8 5 1 7" stroke={SKIN_SHADOW} strokeWidth="1.3" strokeLinecap="round" />

      {/* Confident smile */}
      <path d="M42 58c4 3 10 3 16 0" stroke={LIPS} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M44 58c3 1.5 6 1.5 12 0" fill={LIPS} opacity="0.3" />

      {/* Ranger cloak */}
      <path d="M28 74c6-4 13-7 22-7s16 3 22 7" fill={CLOTH_GREEN} />
      <path d="M28 74c6-4 13-7 22-7s16 3 22 7" stroke="#3a5a3a" strokeWidth="1.5" />
      <path d="M26 76l10-6M74 76l-10-6" stroke="#3a5a3a" strokeWidth="1.5" />
      {/* Leaf clasp */}
      <path d="M47 71c1.5-2.5 3-3.5 3-3.5s1.5 1 3 3.5c-1.5 1.5-3 2-3 2s-1.5-.5-3-2z" fill="#4a8a4a" />
      <path d="M50 68v5" stroke="#3a6a3a" strokeWidth="0.8" />

      {/* Neck */}
      <rect x="43" y="68" width="14" height="6" fill={SKIN} opacity="0.7" />
    </svg>
  );
}

/** Vesper — keeper of the ford, mysterious, deep cowl, one eye in shadow, pendant */
function Vesper({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Deep cowl */}
      <path d="M16 58C16 20 28 4 50 4s34 16 34 54" fill={CLOTH_DARK} />
      <path d="M18 56C18 24 29 8 50 8s32 16 32 48" fill="#342e4d" />
      {/* Cowl rim */}
      <path d="M20 54C20 26 30 10 50 10s30 16 30 44" stroke="#4a4470" strokeWidth="1.5" fill="none" />
      {/* Cowl folds */}
      <path d="M22 48c2-10 8-22 16-30" stroke="#3d3660" strokeWidth="1.5" opacity="0.6" />
      <path d="M78 48c-2-10-8-22-16-30" stroke="#3d3660" strokeWidth="1.5" opacity="0.5" />

      {/* Shadow on left face */}
      <path d="M50 22c-14 2-22 14-22 32v4c0 6 4 12 10 16" fill="#1a1530" opacity="0.5" />

      {/* Face */}
      <ellipse cx="50" cy="48" rx="18" ry="23" fill={SKIN} />
      <ellipse cx="50" cy="48" rx="18" ry="23" fill={SKIN_SHADOW} opacity="0.25" />
      {/* Left side deeper shadow */}
      <ellipse cx="42" cy="48" rx="10" ry="20" fill={SKIN_SHADOW} opacity="0.25" />
      {/* Cheekbone highlights */}
      <ellipse cx="60" cy="48" rx="4" ry="2.5" fill={SKIN_HIGHLIGHT} opacity="0.35" />

      {/* Left eye — in shadow, dimmer */}
      <ellipse cx="42" cy="44" rx="3.5" ry="2.2" fill={WHITE} opacity="0.5" />
      <circle cx="42" cy="44" r="1.5" fill={EYE_BROWN} opacity="0.6" />
      <circle cx="42" cy="44" r="0.7" fill="#1a1a2a" opacity="0.7" />
      <path d="M38.5 43c1.5-1.5 4-1.5 7 0" stroke={SKIN_SHADOW} strokeWidth="1.2" fill="none" />

      {/* Right eye — bright, piercing */}
      <ellipse cx="58" cy="44" rx="4.5" ry="3" fill={WHITE} opacity="0.9" />
      <circle cx="58" cy="44" r="2.5" fill={EYE_BROWN} />
      <circle cx="58" cy="44" r="1.3" fill="#1a1a2a" />
      <circle cx="59.2" cy="43" r="0.7" fill={WHITE} opacity="0.85" />
      <path d="M53.5 43c2-2 6-2 9 0" stroke={SKIN_SHADOW} strokeWidth="1.3" fill="none" />

      {/* Thin arched brows */}
      <path d="M38 40c2-1.5 4-1.8 6-1" stroke={HAIR_BLACK} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M55 39c2-1.5 5-1.5 8 0" stroke={HAIR_BLACK} strokeWidth="1.5" strokeLinecap="round" />

      {/* Narrow nose */}
      <path d="M50 44v10" stroke={SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48.5 54c1 0.5 2.5 0.5 3 0" stroke={SKIN_SHADOW} strokeWidth="0.8" />

      {/* Thin enigmatic lips — slight smirk */}
      <path d="M45 60c2-0.5 4 0.5 5 0.5s3-1 5-0.5" stroke={LIPS_DARK} strokeWidth="1.5" strokeLinecap="round" />

      {/* Pendant chain */}
      <path d="M44 68c2 4 4 6 6 8 2-2 4-4 6-8" stroke={GOLD} strokeWidth="1" opacity="0.7" />
      <circle cx="50" cy="78" r="4.5" fill={GOLD} opacity="0.3" />
      <circle cx="50" cy="78" r="3.5" stroke={GOLD} strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="78" r="1.8" fill={GOLD} opacity="0.7" />

      {/* Cowl drape */}
      <path d="M16 58c2 12 6 22 12 30" stroke="#3d3660" strokeWidth="3" strokeLinecap="round" />
      <path d="M84 58c-2 12-6 22-12 30" stroke="#3d3660" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Rowena — ash gatherer, warm and kind, full curly hair, earrings, bright eyes */
function Rowena({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Full curly hair */}
      <path d="M22 38c2-20 13-30 28-30s26 10 28 30" fill={HAIR_RED} />
      <path d="M24 36c2-18 12-28 26-28s24 10 26 28" fill="#9a4438" />
      {/* Hair flowing down */}
      <path d="M20 40c-3 12-4 26-2 38" fill={HAIR_RED} opacity="0.8" />
      <path d="M80 40c3 12 4 26 2 38" fill={HAIR_RED} opacity="0.8" />
      <path d="M20 40c-3 12-4 26-2 38" stroke="#7a3428" strokeWidth="2" />
      <path d="M80 40c3 12 4 26 2 38" stroke="#7a3428" strokeWidth="2" />
      {/* Curl details */}
      <path d="M22 44c-2 5-1 10-2 14s0 8 1 12" stroke="#7a3428" strokeWidth="1.5" opacity="0.6" />
      <path d="M78 44c2 5 1 10 2 14s0 8-1 12" stroke="#7a3428" strokeWidth="1.5" opacity="0.6" />
      {/* Top hair volume */}
      <path d="M32 16c5-4 11-6 18-6s13 2 18 6" stroke="#aa5448" strokeWidth="2" opacity="0.5" />

      {/* Face — rounder, warm */}
      <ellipse cx="50" cy="48" rx="19" ry="23" fill={SKIN} />
      <ellipse cx="50" cy="48" rx="19" ry="23" fill={SKIN_HIGHLIGHT} opacity="0.2" />
      {/* Rosy cheeks */}
      <ellipse cx="38" cy="52" rx="5" ry="3" fill="#d4907a" opacity="0.35" />
      <ellipse cx="62" cy="52" rx="5" ry="3" fill="#d4907a" opacity="0.35" />

      {/* Kind round eyes */}
      <ellipse cx="42" cy="44" rx="4.5" ry="3.2" fill={WHITE} opacity="0.9" />
      <ellipse cx="58" cy="44" rx="4.5" ry="3.2" fill={WHITE} opacity="0.9" />
      <circle cx="42" cy="44.5" r="2.3" fill={EYE_BROWN} />
      <circle cx="58" cy="44.5" r="2.3" fill={EYE_BROWN} />
      <circle cx="42" cy="44.5" r="1.1" fill="#1a1a1a" />
      <circle cx="58" cy="44.5" r="1.1" fill="#1a1a1a" />
      <circle cx="43" cy="43.5" r="0.7" fill={WHITE} opacity="0.85" />
      <circle cx="59" cy="43.5" r="0.7" fill={WHITE} opacity="0.85" />
      {/* Lash lines */}
      <path d="M37.5 43c2-2 6-2 9 0" stroke="#3a2a1f" strokeWidth="1.3" fill="none" />
      <path d="M53.5 43c2-2 6-2 9 0" stroke="#3a2a1f" strokeWidth="1.3" fill="none" />
      {/* Soft brows */}
      <path d="M37 40c3-1.5 6-2 8-1" stroke={HAIR_RED} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M55 39c3-1 5-.5 8 1" stroke={HAIR_RED} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Nose */}
      <path d="M49 45c0.5 3 0.8 5.5 1 7.5" stroke={SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />

      {/* Warm full smile */}
      <path d="M40 58c4 4 12 4 20 0" stroke={LIPS} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M42 58c3 2.5 9 2.5 16 0" fill={LIPS} opacity="0.4" />
      {/* Dimples */}
      <circle cx="39" cy="58" r="1.2" fill={SKIN_SHADOW} opacity="0.25" />
      <circle cx="61" cy="58" r="1.2" fill={SKIN_SHADOW} opacity="0.25" />

      {/* Dangling earrings */}
      <path d="M26 44v5" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="26" cy="50" r="3" stroke={GOLD} strokeWidth="1.5" fill="none" />
      <circle cx="26" cy="54" r="2" fill={GOLD} opacity="0.7" />
      <path d="M74 44v5" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="74" cy="50" r="3" stroke={GOLD} strokeWidth="1.5" fill="none" />
      <circle cx="74" cy="54" r="2" fill={GOLD} opacity="0.7" />

      {/* Shawl */}
      <path d="M30 74c6-4 13-7 20-7s14 3 20 7" fill={CLOTH_BROWN} />
      <path d="M28 78c7-5 14-8 22-8s15 3 22 8" fill={CLOTH_BROWN} opacity="0.7" />
      <path d="M30 74c6-4 13-7 20-7s14 3 20 7" stroke="#5a4332" strokeWidth="1.5" />

      {/* Neck */}
      <rect x="42" y="68" width="16" height="8" fill={SKIN} opacity="0.7" />
    </svg>
  );
}

/** Aldric — bell watcher, broad-faced, bald, thick brows, jaw scar, heavy build */
function Aldric({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Bald head */}
      <path d="M22 46c0-22 11-36 28-36s28 14 28 36" fill={SKIN} />
      <path d="M22 46c0-22 11-36 28-36s28 14 28 36" fill={SKIN_SHADOW} opacity="0.15" />
      {/* Head shine */}
      <ellipse cx="50" cy="18" rx="14" ry="6" fill={SKIN_HIGHLIGHT} opacity="0.5" />
      <ellipse cx="46" cy="14" rx="8" ry="3" fill={WHITE} opacity="0.15" />

      {/* Face — wide, square */}
      <ellipse cx="50" cy="50" rx="21" ry="24" fill={SKIN} />
      <ellipse cx="50" cy="50" rx="21" ry="24" fill={SKIN_SHADOW} opacity="0.15" />
      {/* Jaw definition */}
      <path d="M30 54c2 10 10 18 20 20 10-2 18-10 20-20" stroke={SKIN_SHADOW} strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Very thick heavy brows */}
      <path d="M31 38c4-3 9-4 13-2" stroke={HAIR_DARK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M56 36c4-2 9-1 13 2" stroke={HAIR_DARK} strokeWidth="3.5" strokeLinecap="round" />

      {/* Small intense eyes */}
      <ellipse cx="40" cy="44" rx="4" ry="2.5" fill={WHITE} opacity="0.9" />
      <ellipse cx="60" cy="44" rx="4" ry="2.5" fill={WHITE} opacity="0.9" />
      <circle cx="40" cy="44" r="2" fill={EYE_BROWN} />
      <circle cx="60" cy="44" r="2" fill={EYE_BROWN} />
      <circle cx="40" cy="44" r="1" fill="#1a1a1a" />
      <circle cx="60" cy="44" r="1" fill="#1a1a1a" />
      <circle cx="41" cy="43.2" r="0.5" fill={WHITE} opacity="0.8" />
      <circle cx="61" cy="43.2" r="0.5" fill={WHITE} opacity="0.8" />
      {/* Upper eye rim */}
      <path d="M36 43c2-1.5 5-1.5 8 0" stroke={SKIN_SHADOW} strokeWidth="1.3" fill="none" />
      <path d="M56 43c2-1.5 5-1.5 8 0" stroke={SKIN_SHADOW} strokeWidth="1.3" fill="none" />

      {/* Broad nose */}
      <path d="M47 45c0.5 3 1 6 1.5 10" stroke={SKIN_SHADOW} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M53 45c-0.5 3-1 6-1.5 10" stroke={SKIN_SHADOW} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M45 55c3 1.5 6 1.5 10 0" stroke={SKIN_SHADOW} strokeWidth="1.2" />

      {/* Scar across left cheek */}
      <path d="M26 48c4 1 8 3 13 2" stroke="#d4907a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M28 47l1.5 2M33 49l1.5 2M37 50l1 1.5" stroke="#c4806a" strokeWidth="0.8" opacity="0.5" />

      {/* Firm wide mouth */}
      <path d="M39 62c4 0.5 8 1 12 1s6-0.5 10-1" stroke={LIPS_DARK} strokeWidth="2" strokeLinecap="round" />
      <path d="M41 63c4 0.5 8 0.5 18 0" fill={LIPS_DARK} opacity="0.25" />

      {/* Stubble */}
      {[36,40,44,48,52,56,60,64].map(x => (
        <React.Fragment key={`stubble-${x}`}>
          <circle cx={x} cy={58 + (x % 3)} r="0.7" fill={HAIR_DARK} opacity="0.2" />
          <circle cx={x - 2} cy={65 + (x % 2)} r="0.6" fill={HAIR_DARK} opacity="0.15" />
        </React.Fragment>
      ))}

      {/* Thick neck */}
      <path d="M36 72l-8 16M64 72l8 16" stroke={SKIN_SHADOW} strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
      <rect x="38" y="70" width="24" height="14" fill={SKIN} opacity="0.7" />

      {/* Broad shoulders and leather vest */}
      <path d="M18 88c10-8 18-12 32-12s22 4 32 12" fill={CLOTH_BROWN} />
      <path d="M18 88c10-8 18-12 32-12s22 4 32 12" stroke="#5a4332" strokeWidth="2" />
    </svg>
  );
}

const FANTASY_PORTRAITS: Record<string, (props: Props) => React.JSX.Element> = {
  Mordecai,
  Isolde,
  Theron,
  Vesper,
  Rowena,
  Aldric,
};

// ═══════════════════════════════════════════════════════════════
// GASLIGHT PORTRAITS — Victorian sepia, oval vignette framing
// ═══════════════════════════════════════════════════════════════

const GL_SKIN = '#d4a574';
const GL_SKIN_SHADOW = '#b08060';
const GL_SKIN_HIGHLIGHT = '#e8c097';
const GL_HAIR_DARK = '#2a1f15';
const GL_HAIR_GREY = '#7a7068';
const GL_HAIR_WHITE = '#bab0a0';
const GL_HAIR_AUBURN = '#6b3328';
const GL_EYE_BLUE = '#5d7a8a';
const GL_EYE_GREEN = '#5a7a5c';
const GL_EYE_BROWN = '#5a4020';
const GL_CLOTH_CHARCOAL = '#1a1810';
const GL_CLOTH_NAVY = '#1a1a2a';
const GL_CLOTH_BURGUNDY = '#3a1520';
const GL_BRASS = '#c9a84c';
const GL_IVORY = '#e8dcc8';
const GL_LIPS_M = '#a07060';
const GL_LIPS_F = '#b87068';

/** Inspector Graves — stern, bowler hat, thick mustache, piercing stare */
function InspectorGraves({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Oval vignette */}
      <ellipse cx="50" cy="50" rx="44" ry="48" fill="#1a1510" />
      <ellipse cx="50" cy="50" rx="42" ry="46" stroke={GL_BRASS} strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Bowler hat */}
      <ellipse cx="50" cy="18" rx="26" ry="5" fill={GL_CLOTH_CHARCOAL} />
      <path d="M28 18c0-14 10-16 22-16s22 2 22 16" fill={GL_HAIR_DARK} />
      <path d="M28 18c0-14 10-16 22-16s22 2 22 16" fill={GL_CLOTH_CHARCOAL} />
      <ellipse cx="50" cy="18" rx="26" ry="5" stroke={GL_HAIR_DARK} strokeWidth="1" />
      {/* Hat band */}
      <rect x="30" y="16" width="40" height="3" fill={GL_BRASS} opacity="0.4" rx="1" />
      {/* Face — square jaw, stern */}
      <ellipse cx="50" cy="46" rx="18" ry="22" fill={GL_SKIN} />
      <ellipse cx="50" cy="46" rx="18" ry="22" fill={GL_SKIN_SHADOW} opacity="0.2" />
      {/* Jawline */}
      <path d="M34 50c2 10 8 16 16 18 8-2 14-8 16-18" stroke={GL_SKIN_SHADOW} strokeWidth="1" fill="none" opacity="0.3" />
      {/* Deep-set stern eyes */}
      <ellipse cx="42" cy="42" rx="4" ry="2.5" fill={GL_IVORY} opacity="0.9" />
      <ellipse cx="58" cy="42" rx="4" ry="2.5" fill={GL_IVORY} opacity="0.9" />
      <circle cx="42" cy="42" r="2" fill={GL_EYE_BLUE} />
      <circle cx="58" cy="42" r="2" fill={GL_EYE_BLUE} />
      <circle cx="42" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="58" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="43" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.8" />
      <circle cx="59" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.8" />
      {/* Heavy brows — furrowed */}
      <path d="M36 38c3-2.5 6-3 10-1.5" stroke={GL_HAIR_DARK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 36.5c4-1.5 7-0.5 10 1.5" stroke={GL_HAIR_DARK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Upper lids */}
      <path d="M38 41c2-1.5 5-1.5 8 0" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" fill="none" />
      <path d="M54 41c2-1.5 5-1.5 8 0" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" fill="none" />
      {/* Nose — strong, aquiline */}
      <path d="M49 43c0.5 3 1 7 1.5 10" stroke={GL_SKIN_SHADOW} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 53c2 1 4 1 5 0" stroke={GL_SKIN_SHADOW} strokeWidth="1" />
      {/* Thick handlebar mustache */}
      <path d="M38 58c3-2 6-2 12-2s9 0 12 2" fill={GL_HAIR_DARK} opacity="0.9" />
      <path d="M36 58c-4 1-6 2-6 4" stroke={GL_HAIR_DARK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 58c4 1 6 2 6 4" stroke={GL_HAIR_DARK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Mouth barely visible below mustache */}
      <path d="M44 62c3 0.5 6 0.5 12 0" stroke={GL_LIPS_M} strokeWidth="1" opacity="0.5" />
      {/* High collar and coat */}
      <path d="M28 76c6-4 13-7 22-7s16 3 22 7" fill={GL_CLOTH_CHARCOAL} />
      <path d="M28 76c6-4 13-7 22-7s16 3 22 7" stroke="#2a2420" strokeWidth="1.5" />
      {/* Collar points */}
      <path d="M40 72l-6 8M60 72l6 8" stroke={GL_IVORY} strokeWidth="1.5" opacity="0.4" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="10" fill={GL_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Lady Ashworth — elegant, upswept hair with pins, pearl necklace, high collar */
function LadyAshworth({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Oval vignette */}
      <ellipse cx="50" cy="50" rx="44" ry="48" fill="#1a1510" />
      <ellipse cx="50" cy="50" rx="42" ry="46" stroke="#8a6b3e" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Upswept hair — elaborate Victorian coiffure */}
      <path d="M26 36c2-18 12-28 24-28s22 10 24 28" fill={GL_HAIR_AUBURN} />
      <path d="M28 34c2-16 11-24 22-24s20 8 22 24" fill="#7a3d30" />
      {/* Hair volume on top */}
      <path d="M30 20c4-8 10-14 20-14s16 6 20 14" fill={GL_HAIR_AUBURN} />
      <ellipse cx="50" cy="10" rx="14" ry="6" fill="#7a3d30" />
      {/* Decorative hair pins */}
      <circle cx="38" cy="14" r="2.5" fill={GL_BRASS} opacity="0.7" />
      <circle cx="62" cy="14" r="2.5" fill={GL_BRASS} opacity="0.7" />
      <circle cx="50" cy="8" r="2" fill={GL_IVORY} opacity="0.6" />
      {/* Face — refined, high cheekbones */}
      <ellipse cx="50" cy="46" rx="17" ry="22" fill={GL_SKIN} />
      <ellipse cx="50" cy="46" rx="17" ry="22" fill={GL_SKIN_HIGHLIGHT} opacity="0.15" />
      {/* Cheekbone definition */}
      <path d="M33 45l6-1" stroke={GL_SKIN_SHADOW} strokeWidth="0.8" opacity="0.4" />
      <path d="M67 45l-6-1" stroke={GL_SKIN_SHADOW} strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="38" cy="48" rx="4" ry="2" fill={GL_SKIN_HIGHLIGHT} opacity="0.3" />
      <ellipse cx="62" cy="48" rx="4" ry="2" fill={GL_SKIN_HIGHLIGHT} opacity="0.3" />
      {/* Elegant almond eyes */}
      <path d="M36 42c2-2.5 6-2.5 9 0" fill={GL_IVORY} opacity="0.9" />
      <path d="M36 42c2 1.5 6 1.5 9 0" fill={GL_IVORY} opacity="0.9" />
      <path d="M55 42c2-2.5 6-2.5 9 0" fill={GL_IVORY} opacity="0.9" />
      <path d="M55 42c2 1.5 6 1.5 9 0" fill={GL_IVORY} opacity="0.9" />
      <circle cx="41" cy="42" r="2" fill={GL_EYE_GREEN} />
      <circle cx="59" cy="42" r="2" fill={GL_EYE_GREEN} />
      <circle cx="41" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="59" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="42" cy="41.3" r="0.5" fill={GL_IVORY} opacity="0.8" />
      <circle cx="60" cy="41.3" r="0.5" fill={GL_IVORY} opacity="0.8" />
      {/* Thin arched brows */}
      <path d="M35 38c3-2 6-2.5 10-1" stroke={GL_HAIR_AUBURN} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M55 37c4-1.5 7-1 10 1" stroke={GL_HAIR_AUBURN} strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyeliner */}
      <path d="M35.5 42c2-2.5 6.5-2.5 10 0" stroke="#3a2a1f" strokeWidth="1" fill="none" />
      <path d="M54.5 42c2-2.5 6.5-2.5 10 0" stroke="#3a2a1f" strokeWidth="1" fill="none" />
      {/* Delicate nose */}
      <path d="M49 43c0.4 3 0.6 6 0.8 8" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 51c1.2 0.6 2.5 0.6 3.5 0" stroke={GL_SKIN_SHADOW} strokeWidth="0.8" />
      {/* Refined lips */}
      <path d="M44 57c2-0.5 4 0.5 6 1 2-0.5 4-1.5 6-1" stroke={GL_LIPS_F} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 58c3 1 8 1 12 0" fill={GL_LIPS_F} opacity="0.35" />
      {/* Pearl necklace */}
      <path d="M36 68c4 2 8 3 14 3s10-1 14-3" stroke={GL_IVORY} strokeWidth="0.8" fill="none" opacity="0.4" />
      {[38,42,46,50,54,58,62].map(x => (
        <circle key={`pearl-${x}`} cx={x} cy={68 + Math.sin((x-50)*0.3)*1.5} r="2" fill={GL_IVORY} opacity="0.7" />
      ))}
      {/* High-collared dress */}
      <path d="M30 76c6-4 12-6 20-6s14 2 20 6" fill={GL_CLOTH_BURGUNDY} />
      <path d="M30 76c6-4 12-6 20-6s14 2 20 6" stroke="#4a2030" strokeWidth="1.5" />
      {/* Collar lace trim */}
      <path d="M36 72c4-1 8-2 14-2s10 1 14 2" stroke={GL_IVORY} strokeWidth="1" opacity="0.3" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="8" fill={GL_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Dr. Pemberton — round spectacles, neat short beard, receding hairline, cravat */
function DrPemberton({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Oval vignette */}
      <ellipse cx="50" cy="50" rx="44" ry="48" fill="#1a1510" />
      <ellipse cx="50" cy="50" rx="42" ry="46" stroke="#6b5b3e" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Receding hair — side hair only */}
      <path d="M24 38c0-12 6-22 14-26" fill={GL_HAIR_GREY} />
      <path d="M76 38c0-12-6-22-14-26" fill={GL_HAIR_GREY} />
      {/* Bald top */}
      <path d="M30 24c5-8 11-14 20-14s15 6 20 14" fill={GL_SKIN} />
      <ellipse cx="50" cy="16" rx="14" ry="5" fill={GL_SKIN_HIGHLIGHT} opacity="0.4" />
      {/* Face */}
      <ellipse cx="50" cy="46" rx="18" ry="23" fill={GL_SKIN} />
      <ellipse cx="50" cy="46" rx="18" ry="23" fill={GL_SKIN_SHADOW} opacity="0.15" />
      {/* Round spectacles */}
      <circle cx="40" cy="42" r="7" stroke={GL_BRASS} strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="42" r="7" stroke={GL_BRASS} strokeWidth="1.5" fill="none" />
      <path d="M47 42h6" stroke={GL_BRASS} strokeWidth="1.2" />
      <path d="M33 42h-6M67 42h6" stroke={GL_BRASS} strokeWidth="1" opacity="0.6" />
      {/* Eyes behind spectacles */}
      <ellipse cx="40" cy="42" rx="3.5" ry="2.5" fill={GL_IVORY} opacity="0.85" />
      <ellipse cx="60" cy="42" rx="3.5" ry="2.5" fill={GL_IVORY} opacity="0.85" />
      <circle cx="40" cy="42" r="2" fill={GL_EYE_BROWN} />
      <circle cx="60" cy="42" r="2" fill={GL_EYE_BROWN} />
      <circle cx="40" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="60" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="41" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.7" />
      <circle cx="61" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.7" />
      {/* Mild brows */}
      <path d="M34 36c3-1.5 6-1.5 9-0.5" stroke={GL_HAIR_GREY} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M57 35.5c3-1 6-0.5 9 0.5" stroke={GL_HAIR_GREY} strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M49 44c0.5 3 0.8 6 1 8" stroke={GL_SKIN_SHADOW} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M48 52c1.5 0.8 3 0.8 4.5 0" stroke={GL_SKIN_SHADOW} strokeWidth="0.8" />
      {/* Neat short beard */}
      <path d="M35 58c0 4 3 10 15 12 12-2 15-8 15-12" fill={GL_HAIR_GREY} opacity="0.5" />
      <path d="M38 58c-1 3 0 7 4 9" stroke="#8a8078" strokeWidth="1" opacity="0.4" />
      <path d="M62 58c1 3 0 7-4 9" stroke="#8a8078" strokeWidth="1" opacity="0.4" />
      <path d="M50 60c0 4-0.5 7-1 9" stroke="#8a8078" strokeWidth="1" opacity="0.4" />
      {/* Mouth in beard */}
      <path d="M44 59c3 0.5 6 0.5 12 0" stroke={GL_LIPS_M} strokeWidth="1.2" opacity="0.6" />
      {/* Cravat */}
      <path d="M44 70l6 6 6-6" fill={GL_IVORY} opacity="0.5" />
      <circle cx="50" cy="72" r="2" fill={GL_BRASS} opacity="0.6" />
      {/* Coat */}
      <path d="M26 80c7-5 14-8 24-8s17 3 24 8" fill={GL_CLOTH_CHARCOAL} />
      <path d="M26 80c7-5 14-8 24-8s17 3 24 8" stroke="#2a2420" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="8" fill={GL_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Miss Harlow — governess, tight bun, high collar, cameo brooch, watchful eyes */
function MissHarlow({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Oval vignette */}
      <ellipse cx="50" cy="50" rx="44" ry="48" fill="#1a1510" />
      <ellipse cx="50" cy="50" rx="42" ry="46" stroke="#7a6440" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Hair — pulled back tightly, parted center */}
      <path d="M28 36c2-16 11-26 22-26s20 10 22 26" fill={GL_HAIR_DARK} />
      <path d="M30 34c2-14 10-22 20-22s18 8 20 22" fill="#3a2d20" />
      {/* Center parting */}
      <path d="M50 10v14" stroke={GL_SKIN_SHADOW} strokeWidth="1" opacity="0.4" />
      {/* Hair bun at back (visible top) */}
      <ellipse cx="50" cy="12" rx="10" ry="6" fill={GL_HAIR_DARK} />
      <ellipse cx="50" cy="12" rx="8" ry="4" stroke="#4a3a2a" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Hairpin */}
      <path d="M56 10l4-4" stroke={GL_BRASS} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="61" cy="5" r="2" fill={GL_BRASS} opacity="0.6" />
      {/* Face — oval, serious */}
      <ellipse cx="50" cy="46" rx="17" ry="22" fill={GL_SKIN} />
      <ellipse cx="50" cy="46" rx="17" ry="22" fill={GL_SKIN_SHADOW} opacity="0.15" />
      {/* Cheek highlights */}
      <ellipse cx="39" cy="50" rx="4" ry="2" fill={GL_SKIN_HIGHLIGHT} opacity="0.25" />
      <ellipse cx="61" cy="50" rx="4" ry="2" fill={GL_SKIN_HIGHLIGHT} opacity="0.25" />
      {/* Watchful, direct eyes */}
      <ellipse cx="42" cy="42" rx="4" ry="2.8" fill={GL_IVORY} opacity="0.9" />
      <ellipse cx="58" cy="42" rx="4" ry="2.8" fill={GL_IVORY} opacity="0.9" />
      <circle cx="42" cy="42" r="2.2" fill={GL_EYE_BROWN} />
      <circle cx="58" cy="42" r="2.2" fill={GL_EYE_BROWN} />
      <circle cx="42" cy="42" r="1.1" fill="#1a1a2a" />
      <circle cx="58" cy="42" r="1.1" fill="#1a1a2a" />
      <circle cx="43" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.8" />
      <circle cx="59" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.8" />
      {/* Neat brows */}
      <path d="M36 38c3-1.5 6-2 9-1" stroke={GL_HAIR_DARK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M55 37c3-1 6-0.5 9 1" stroke={GL_HAIR_DARK} strokeWidth="1.5" strokeLinecap="round" />
      {/* Lash lines */}
      <path d="M38 41c2-1.5 5-1.5 8 0" stroke="#2a1f15" strokeWidth="1" fill="none" />
      <path d="M54 41c2-1.5 5-1.5 8 0" stroke="#2a1f15" strokeWidth="1" fill="none" />
      {/* Nose */}
      <path d="M49 43c0.4 3 0.6 5.5 0.8 7.5" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 51c1 0.5 2.5 0.5 3 0" stroke={GL_SKIN_SHADOW} strokeWidth="0.8" />
      {/* Thin pressed lips — serious expression */}
      <path d="M44 58c3 0.3 6 0.5 12 0" stroke={GL_LIPS_F} strokeWidth="1.5" strokeLinecap="round" />
      {/* High collar with lace */}
      <path d="M36 68c4 1 8 2 14 2s10-1 14-2" fill={GL_IVORY} opacity="0.3" />
      <path d="M36 70c4 0.5 8 1 14 1s10-0.5 14-1" stroke={GL_IVORY} strokeWidth="0.8" opacity="0.3" />
      {/* Cameo brooch */}
      <ellipse cx="50" cy="72" rx="4" ry="3.5" fill="#4a3728" stroke={GL_BRASS} strokeWidth="1" />
      <ellipse cx="50" cy="72" rx="2.5" ry="2" fill={GL_IVORY} opacity="0.5" />
      {/* Dark dress */}
      <path d="M30 78c6-3 12-5 20-5s14 2 20 5" fill={GL_CLOTH_NAVY} />
      <path d="M30 78c6-3 12-5 20-5s14 2 20 5" stroke="#2a2a3a" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="6" fill={GL_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Colonel Finch — military bearing, walrus mustache, bald with side grey, medals */
function ColonelFinch({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Oval vignette */}
      <ellipse cx="50" cy="50" rx="44" ry="48" fill="#1a1510" />
      <ellipse cx="50" cy="50" rx="42" ry="46" stroke="#8a7a5e" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Military peaked cap */}
      <path d="M22 22l56 0" stroke={GL_HAIR_DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M26 22c0-10 10-16 24-16s24 6 24 16" fill="#2a3020" />
      <rect x="26" y="20" width="48" height="5" fill="#2a3020" />
      {/* Cap badge */}
      <circle cx="50" cy="14" r="3" fill={GL_BRASS} opacity="0.6" />
      <path d="M48 14l2-2 2 2" stroke={GL_BRASS} strokeWidth="0.8" />
      {/* Cap visor */}
      <path d="M24 24c8 3 16 4 26 4s18-1 26-4" fill="#1a2018" />
      {/* Face — square, weathered */}
      <ellipse cx="50" cy="46" rx="19" ry="22" fill={GL_SKIN} />
      <ellipse cx="50" cy="46" rx="19" ry="22" fill={GL_SKIN_SHADOW} opacity="0.2" />
      {/* Side grey hair below cap */}
      <path d="M28 28c-2 4-4 10-4 16" fill={GL_HAIR_WHITE} />
      <path d="M72 28c2 4 4 10 4 16" fill={GL_HAIR_WHITE} />
      {/* Crow's feet — weathered */}
      <path d="M33 44c-1 0.5-2 1.5-3 3M33 45c-1-0.2-2 0-3 0.5" stroke={GL_SKIN_SHADOW} strokeWidth="0.7" />
      <path d="M67 44c1 0.5 2 1.5 3 3M67 45c1-0.2 2 0 3 0.5" stroke={GL_SKIN_SHADOW} strokeWidth="0.7" />
      {/* Hard eyes */}
      <ellipse cx="42" cy="42" rx="4" ry="2.5" fill={GL_IVORY} opacity="0.9" />
      <ellipse cx="58" cy="42" rx="4" ry="2.5" fill={GL_IVORY} opacity="0.9" />
      <circle cx="42" cy="42" r="2" fill={GL_EYE_BLUE} />
      <circle cx="58" cy="42" r="2" fill={GL_EYE_BLUE} />
      <circle cx="42" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="58" cy="42" r="1" fill="#1a1a2a" />
      <circle cx="43" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.7" />
      <circle cx="59" cy="41.2" r="0.5" fill={GL_IVORY} opacity="0.7" />
      {/* Thick stern brows */}
      <path d="M35 38c3-2 7-3 11-1.5" stroke={GL_HAIR_WHITE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 36.5c4-1.5 8-0.5 11 1.5" stroke={GL_HAIR_WHITE} strokeWidth="2.5" strokeLinecap="round" />
      {/* Upper lids */}
      <path d="M38 41c2-1.5 5-1.5 8 0" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" fill="none" />
      <path d="M54 41c2-1.5 5-1.5 8 0" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" fill="none" />
      {/* Nose — broad */}
      <path d="M48 44c0.5 3 1 6 1.5 9" stroke={GL_SKIN_SHADOW} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M47 53c2 1 4 1 6 0" stroke={GL_SKIN_SHADOW} strokeWidth="1" />
      {/* Walrus mustache */}
      <path d="M34 58c4-2 8-3 16-3s12 1 16 3c-2 4-6 5-8 5-4 0-5-1-8-1s-4 1-8 1c-2 0-6-1-8-5" fill={GL_HAIR_WHITE} opacity="0.7" />
      {/* Mouth */}
      <path d="M44 60c3 0.5 6 0.5 12 0" stroke={GL_LIPS_M} strokeWidth="1" opacity="0.4" />
      {/* Military jacket */}
      <path d="M20 82c8-6 16-10 30-10s22 4 30 10" fill="#2a3020" />
      <path d="M20 82c8-6 16-10 30-10s22 4 30 10" stroke="#3a4030" strokeWidth="1.5" />
      {/* Epaulets */}
      <rect x="22" y="76" width="10" height="4" rx="1" fill={GL_BRASS} opacity="0.5" />
      <rect x="68" y="76" width="10" height="4" rx="1" fill={GL_BRASS} opacity="0.5" />
      {/* Medals */}
      <circle cx="40" cy="82" r="2.5" fill={GL_BRASS} opacity="0.5" />
      <circle cx="46" cy="82" r="2.5" fill="#8a2020" opacity="0.5" />
      {/* Neck */}
      <rect x="42" y="66" width="16" height="8" fill={GL_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Mrs. Whitmore — housekeeper, grey hair in cap, round kind face, keys on chain */
function MrsWhitmore({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Oval vignette */}
      <ellipse cx="50" cy="50" rx="44" ry="48" fill="#1a1510" />
      <ellipse cx="50" cy="50" rx="42" ry="46" stroke="#6b5540" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Grey hair — visible at sides below cap */}
      <path d="M26 34c1-10 8-18 16-20" fill={GL_HAIR_WHITE} />
      <path d="M74 34c-1-10-8-18-16-20" fill={GL_HAIR_WHITE} />
      <path d="M24 40c-1 8 0 16 1 24" stroke={GL_HAIR_WHITE} strokeWidth="4" strokeLinecap="round" />
      <path d="M76 40c1 8 0 16-1 24" stroke={GL_HAIR_WHITE} strokeWidth="4" strokeLinecap="round" />
      {/* Mob cap */}
      <path d="M22 28c4-12 14-18 28-18s24 6 28 18" fill={GL_IVORY} opacity="0.7" />
      <path d="M20 28c8 2 18 3 30 3s22-1 30-3" stroke={GL_IVORY} strokeWidth="2" opacity="0.5" />
      {/* Cap ruffle */}
      <path d="M22 28c2 1 4 2 6 1s4-2 6-1 4 2 6 1 4-2 6-1 4 2 6 1 4-2 6-1 4 2 6 1" stroke={GL_IVORY} strokeWidth="1" opacity="0.4" />
      {/* Face — round, kind but stern */}
      <ellipse cx="50" cy="48" rx="19" ry="22" fill={GL_SKIN} />
      <ellipse cx="50" cy="48" rx="19" ry="22" fill={GL_SKIN_HIGHLIGHT} opacity="0.15" />
      {/* Rosy cheeks */}
      <ellipse cx="38" cy="52" rx="4" ry="2.5" fill="#c49080" opacity="0.25" />
      <ellipse cx="62" cy="52" rx="4" ry="2.5" fill="#c49080" opacity="0.25" />
      {/* Eyes — kind, slightly wrinkled */}
      <ellipse cx="42" cy="44" rx="4" ry="2.8" fill={GL_IVORY} opacity="0.9" />
      <ellipse cx="58" cy="44" rx="4" ry="2.8" fill={GL_IVORY} opacity="0.9" />
      <circle cx="42" cy="44" r="2.2" fill={GL_EYE_BROWN} />
      <circle cx="58" cy="44" r="2.2" fill={GL_EYE_BROWN} />
      <circle cx="42" cy="44" r="1" fill="#1a1a2a" />
      <circle cx="58" cy="44" r="1" fill="#1a1a2a" />
      <circle cx="43" cy="43.2" r="0.5" fill={GL_IVORY} opacity="0.7" />
      <circle cx="59" cy="43.2" r="0.5" fill={GL_IVORY} opacity="0.7" />
      {/* Crow's feet */}
      <path d="M35 44c-1 0.5-1.5 1-2 2" stroke={GL_SKIN_SHADOW} strokeWidth="0.7" />
      <path d="M65 44c1 0.5 1.5 1 2 2" stroke={GL_SKIN_SHADOW} strokeWidth="0.7" />
      {/* Soft grey brows */}
      <path d="M36 40c3-1.5 6-2 9-1" stroke={GL_HAIR_WHITE} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M55 39c3-1 6-0.5 9 1" stroke={GL_HAIR_WHITE} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Nose */}
      <path d="M49 44c0.4 3 0.7 6 1 8" stroke={GL_SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      {/* Warm small smile */}
      <path d="M43 58c3 2 8 2 14 0" stroke={GL_LIPS_F} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* White collar */}
      <path d="M36 70c4 1 8 2 14 2s10-1 14-2" fill={GL_IVORY} opacity="0.4" />
      {/* Black dress */}
      <path d="M28 78c6-3 12-6 22-6s16 3 22 6" fill={GL_CLOTH_CHARCOAL} />
      <path d="M28 78c6-3 12-6 22-6s16 3 22 6" stroke="#2a2420" strokeWidth="1.5" />
      {/* Keys on chain */}
      <path d="M60 74v8" stroke="#8a8078" strokeWidth="1.5" />
      <circle cx="60" cy="84" r="2" stroke="#8a8078" strokeWidth="1.2" fill="none" />
      <path d="M62 84h4" stroke="#8a8078" strokeWidth="1" />
      <circle cx="56" cy="86" r="1.5" stroke="#8a8078" strokeWidth="1" fill="none" />
      <path d="M58 86h3" stroke="#8a8078" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="42" y="66" width="16" height="8" fill={GL_SKIN} opacity="0.7" />
    </svg>
  );
}

const GASLIGHT_PORTRAITS: Record<string, (props: Props) => React.JSX.Element> = {
  'Inspector Graves': InspectorGraves,
  'Lady Ashworth': LadyAshworth,
  'Dr. Pemberton': DrPemberton,
  'Miss Harlow': MissHarlow,
  'Colonel Finch': ColonelFinch,
  'Mrs. Whitmore': MrsWhitmore,
};

// ═══════════════════════════════════════════════════════════════
// CASEFILE PORTRAITS — Modern procedural, angular frame, cool tones
// ═══════════════════════════════════════════════════════════════

const CF_SKIN = '#c8a882';
const CF_SKIN_SHADOW = '#a88a6c';
const CF_SKIN_HIGHLIGHT = '#ddc0a0';
const CF_SKIN_DARK = '#8b6842';
const CF_SKIN_DARK_SHADOW = '#6a5030';
const CF_SKIN_DARK_HIGHLIGHT = '#a08058';
const CF_HAIR_BLACK = '#1a1a1a';
const CF_HAIR_BROWN = '#3d2b1f';
const CF_HAIR_AUBURN = '#5a3028';
const CF_EYE_BROWN = '#5a3e20';
const CF_EYE_DARK = '#2a2018';
const CF_EYE_HAZEL = '#6a7040';
const CF_CLOTH_DARK = '#1a2030';
const CF_CLOTH_GREY = '#2a2a34';
const CF_CLOTH_TACTICAL = '#1a2218';
const CF_ACCENT = '#3b82f6';
const CF_STEEL = '#6b7280';
const CF_WHITE = '#e2e8f0';
const CF_LIPS_M = '#9a7868';
const CF_LIPS_F = '#b07068';

/** Marcus Cole — Head of Security, buzz cut, strong jaw, earpiece, serious */
function MarcusCole({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Angular frame */}
      <rect x="6" y="4" width="88" height="92" rx="4" fill="#141820" stroke={CF_ACCENT} strokeWidth="1" opacity="0.2" />
      {/* Buzz cut hair — very short */}
      <path d="M26 38c1-18 11-28 24-28s23 10 24 28" fill={CF_HAIR_BLACK} />
      <path d="M28 36c1-16 10-24 22-24s21 8 22 24" fill="#2a2a2a" />
      {/* Stubble texture on scalp */}
      <ellipse cx="50" cy="14" rx="16" ry="5" fill="#2a2a2a" opacity="0.3" />
      {/* Face — square jaw, strong */}
      <ellipse cx="50" cy="48" rx="19" ry="22" fill={CF_SKIN} />
      <ellipse cx="50" cy="48" rx="19" ry="22" fill={CF_SKIN_SHADOW} opacity="0.15" />
      {/* Strong jawline */}
      <path d="M32 50c2 10 8 16 18 18 10-2 16-8 18-18" stroke={CF_SKIN_SHADOW} strokeWidth="1.2" fill="none" opacity="0.3" />
      {/* Focused eyes */}
      <ellipse cx="42" cy="44" rx="4.5" ry="2.8" fill={CF_WHITE} opacity="0.9" />
      <ellipse cx="58" cy="44" rx="4.5" ry="2.8" fill={CF_WHITE} opacity="0.9" />
      <circle cx="42" cy="44" r="2.2" fill={CF_EYE_BROWN} />
      <circle cx="58" cy="44" r="2.2" fill={CF_EYE_BROWN} />
      <circle cx="42" cy="44" r="1.1" fill="#1a1a1a" />
      <circle cx="58" cy="44" r="1.1" fill="#1a1a1a" />
      <circle cx="43" cy="43.2" r="0.5" fill={CF_WHITE} opacity="0.8" />
      <circle cx="59" cy="43.2" r="0.5" fill={CF_WHITE} opacity="0.8" />
      {/* Strong brows */}
      <path d="M35 40c3-2 7-2.5 10-1.5" stroke={CF_HAIR_BLACK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M55 38.5c3-1 7-0.5 10 1.5" stroke={CF_HAIR_BLACK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Upper lids */}
      <path d="M37.5 43c2-1.5 6-1.5 9 0" stroke={CF_SKIN_SHADOW} strokeWidth="1.2" fill="none" />
      <path d="M53.5 43c2-1.5 6-1.5 9 0" stroke={CF_SKIN_SHADOW} strokeWidth="1.2" fill="none" />
      {/* Nose */}
      <path d="M49 45c0.5 3 1 6 1.5 9" stroke={CF_SKIN_SHADOW} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 54c2 1 4 1 5.5 0" stroke={CF_SKIN_SHADOW} strokeWidth="1" />
      {/* Firm mouth */}
      <path d="M42 60c4 0.5 8 0.5 16 0" stroke={CF_LIPS_M} strokeWidth="1.8" strokeLinecap="round" />
      {/* Earpiece — security detail */}
      <path d="M72 40c3-1 5 0 5 3" stroke={CF_ACCENT} strokeWidth="1.5" />
      <circle cx="77" cy="44" r="2" fill={CF_ACCENT} opacity="0.5" />
      <path d="M76 46v6" stroke={CF_ACCENT} strokeWidth="1" opacity="0.4" />
      {/* Tactical collar */}
      <path d="M26 78c7-5 14-8 24-8s17 3 24 8" fill={CF_CLOTH_TACTICAL} />
      <path d="M26 78c7-5 14-8 24-8s17 3 24 8" stroke="#2a3228" strokeWidth="1.5" />
      {/* Collar line */}
      <path d="M40 72l-4 6M60 72l4 6" stroke="#2a3228" strokeWidth="1" opacity="0.5" />
      {/* Neck */}
      <rect x="42" y="68" width="16" height="8" fill={CF_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Elena Rivera — Financial Analyst, pulled-back hair, rectangular glasses, sharp */
function ElenaRivera({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Angular frame */}
      <rect x="6" y="4" width="88" height="92" rx="4" fill="#141820" stroke={CF_ACCENT} strokeWidth="1" opacity="0.2" />
      {/* Hair — dark brown, pulled back into low ponytail */}
      <path d="M26 36c2-16 11-26 24-26s22 10 24 26" fill={CF_HAIR_BROWN} />
      <path d="M28 34c2-14 10-22 22-22s20 8 22 24" fill="#4a3628" />
      {/* Ponytail trailing back */}
      <path d="M72 36c4 4 8 14 6 28" stroke={CF_HAIR_BROWN} strokeWidth="5" strokeLinecap="round" />
      <path d="M73 38c3 3 6 10 5 22" stroke="#4a3628" strokeWidth="2" opacity="0.5" />
      {/* Face — angular, defined */}
      <ellipse cx="50" cy="46" rx="17" ry="22" fill={CF_SKIN} />
      <ellipse cx="50" cy="46" rx="17" ry="22" fill={CF_SKIN_HIGHLIGHT} opacity="0.15" />
      {/* Cheekbone highlights */}
      <ellipse cx="38" cy="48" rx="4" ry="2" fill={CF_SKIN_HIGHLIGHT} opacity="0.3" />
      <ellipse cx="62" cy="48" rx="4" ry="2" fill={CF_SKIN_HIGHLIGHT} opacity="0.3" />
      {/* Rectangular glasses */}
      <rect x="34" y="39" width="13" height="8" rx="2" stroke={CF_STEEL} strokeWidth="1.5" fill="none" />
      <rect x="53" y="39" width="13" height="8" rx="2" stroke={CF_STEEL} strokeWidth="1.5" fill="none" />
      <path d="M47 43h6" stroke={CF_STEEL} strokeWidth="1.2" />
      <path d="M34 43h-6M66 43h6" stroke={CF_STEEL} strokeWidth="1" opacity="0.5" />
      {/* Eyes behind glasses */}
      <ellipse cx="41" cy="43" rx="3.5" ry="2.5" fill={CF_WHITE} opacity="0.85" />
      <ellipse cx="59" cy="43" rx="3.5" ry="2.5" fill={CF_WHITE} opacity="0.85" />
      <circle cx="41" cy="43" r="2" fill={CF_EYE_BROWN} />
      <circle cx="59" cy="43" r="2" fill={CF_EYE_BROWN} />
      <circle cx="41" cy="43" r="1" fill="#1a1a1a" />
      <circle cx="59" cy="43" r="1" fill="#1a1a1a" />
      <circle cx="42" cy="42.2" r="0.5" fill={CF_WHITE} opacity="0.7" />
      <circle cx="60" cy="42.2" r="0.5" fill={CF_WHITE} opacity="0.7" />
      {/* Brows */}
      <path d="M35 37c3-1.5 6-2 9-1" stroke={CF_HAIR_BROWN} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 36c3-1 6-0.5 9 1" stroke={CF_HAIR_BROWN} strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M49 44c0.4 3 0.6 5.5 0.8 7.5" stroke={CF_SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 52c1 0.5 2.5 0.5 3.5 0" stroke={CF_SKIN_SHADOW} strokeWidth="0.8" />
      {/* Confident slight smile */}
      <path d="M44 58c2-0.3 4 0.5 6 0.8 2-0.3 4-1 6-0.8" stroke={CF_LIPS_F} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 58.5c3 0.8 8 0.8 12 0" fill={CF_LIPS_F} opacity="0.3" />
      {/* Blazer */}
      <path d="M28 78c6-4 12-6 22-6s16 2 22 6" fill={CF_CLOTH_DARK} />
      <path d="M28 78c6-4 12-6 22-6s16 2 22 6" stroke="#2a3040" strokeWidth="1.5" />
      {/* Lapel */}
      <path d="M42 72l-6 8M58 72l6 8" stroke="#2a3040" strokeWidth="1.2" opacity="0.5" />
      {/* Blouse V */}
      <path d="M46 72l4 5 4-5" stroke={CF_WHITE} strokeWidth="1" opacity="0.3" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="8" fill={CF_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Jay Chen — IT Admin, messy hair, round glasses, headphones, hoodie */
function JayChen({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Angular frame */}
      <rect x="6" y="4" width="88" height="92" rx="4" fill="#141820" stroke="#60a5fa" strokeWidth="1" opacity="0.2" />
      {/* Messy tousled black hair */}
      <path d="M26 36c2-18 12-28 24-28s22 10 24 28" fill={CF_HAIR_BLACK} />
      <path d="M28 34c2-14 10-24 22-24s20 10 22 24" fill="#2a2a2a" />
      {/* Messy spikes */}
      <path d="M32 16c-2-6 0-10 4-8" fill={CF_HAIR_BLACK} />
      <path d="M42 10c-1-6 2-10 5-7" fill={CF_HAIR_BLACK} />
      <path d="M54 8c0-6 3-8 5-5" fill={CF_HAIR_BLACK} />
      <path d="M64 12c1-5 4-6 5-3" fill={CF_HAIR_BLACK} />
      {/* Hair falling over forehead */}
      <path d="M34 28c4-4 10-6 16-4" fill={CF_HAIR_BLACK} opacity="0.7" />
      {/* Face */}
      <ellipse cx="50" cy="48" rx="18" ry="22" fill={CF_SKIN} />
      <ellipse cx="50" cy="48" rx="18" ry="22" fill={CF_SKIN_HIGHLIGHT} opacity="0.15" />
      {/* Round glasses */}
      <circle cx="41" cy="44" r="7" stroke={CF_STEEL} strokeWidth="1.5" fill="none" />
      <circle cx="59" cy="44" r="7" stroke={CF_STEEL} strokeWidth="1.5" fill="none" />
      <path d="M48 44h4" stroke={CF_STEEL} strokeWidth="1.2" />
      <path d="M34 44h-5M66 44h5" stroke={CF_STEEL} strokeWidth="1" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="41" cy="44" rx="3.5" ry="2.5" fill={CF_WHITE} opacity="0.85" />
      <ellipse cx="59" cy="44" rx="3.5" ry="2.5" fill={CF_WHITE} opacity="0.85" />
      <circle cx="41" cy="44" r="2" fill={CF_EYE_DARK} />
      <circle cx="59" cy="44" r="2" fill={CF_EYE_DARK} />
      <circle cx="41" cy="44" r="1" fill="#0a0a0a" />
      <circle cx="59" cy="44" r="1" fill="#0a0a0a" />
      <circle cx="42" cy="43.2" r="0.5" fill={CF_WHITE} opacity="0.7" />
      <circle cx="60" cy="43.2" r="0.5" fill={CF_WHITE} opacity="0.7" />
      {/* Casual brows */}
      <path d="M35 38c3-1 6-1.5 8-0.5" stroke={CF_HAIR_BLACK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M57 37.5c2-0.5 5 0 7 0.5" stroke={CF_HAIR_BLACK} strokeWidth="1.5" strokeLinecap="round" />
      {/* Nose */}
      <path d="M49 45c0.4 3 0.7 5.5 0.8 7" stroke={CF_SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      {/* Relaxed mouth */}
      <path d="M44 58c3 1 6 1 12 0" stroke={CF_LIPS_M} strokeWidth="1.5" strokeLinecap="round" />
      {/* Headphones around neck */}
      <path d="M28 52c-4 6-4 14-2 20" stroke={CF_STEEL} strokeWidth="3" strokeLinecap="round" />
      <path d="M72 52c4 6 4 14 2 20" stroke={CF_STEEL} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="26" cy="72" rx="4" ry="5" fill={CF_CLOTH_GREY} stroke={CF_STEEL} strokeWidth="1" />
      <ellipse cx="74" cy="72" rx="4" ry="5" fill={CF_CLOTH_GREY} stroke={CF_STEEL} strokeWidth="1" />
      {/* Hoodie */}
      <path d="M26 78c7-4 14-7 24-7s17 3 24 7" fill={CF_CLOTH_GREY} />
      <path d="M26 78c7-4 14-7 24-7s17 3 24 7" stroke="#3a3a44" strokeWidth="1.5" />
      {/* Hood bunched at back of neck */}
      <path d="M38 70c4-2 8-3 12-3s8 1 12 3" stroke="#3a3a44" strokeWidth="2" fill="none" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="8" fill={CF_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Sofia Mercer — Building Manager, short bob, no-nonsense, lanyard with badge */
function SofiaMercer({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Angular frame */}
      <rect x="6" y="4" width="88" height="92" rx="4" fill="#141820" stroke={CF_ACCENT} strokeWidth="1" opacity="0.2" />
      {/* Short bob — practical */}
      <path d="M26 38c2-18 12-28 24-28s22 10 24 28" fill={CF_HAIR_AUBURN} />
      <path d="M28 36c2-14 10-24 22-24s20 10 22 24" fill="#6a3830" />
      {/* Bob ends at jaw level */}
      <path d="M24 38c-1 8-1 16 0 24" fill={CF_HAIR_AUBURN} />
      <path d="M76 38c1 8 1 16 0 24" fill={CF_HAIR_AUBURN} />
      {/* Bangs */}
      <path d="M32 28c6-2 12-3 18-2" fill={CF_HAIR_AUBURN} opacity="0.8" />
      {/* Face */}
      <ellipse cx="50" cy="48" rx="18" ry="22" fill={CF_SKIN} />
      <ellipse cx="50" cy="48" rx="18" ry="22" fill={CF_SKIN_HIGHLIGHT} opacity="0.15" />
      {/* Direct confident eyes */}
      <ellipse cx="42" cy="44" rx="4.5" ry="2.8" fill={CF_WHITE} opacity="0.9" />
      <ellipse cx="58" cy="44" rx="4.5" ry="2.8" fill={CF_WHITE} opacity="0.9" />
      <circle cx="42" cy="44" r="2.2" fill={CF_EYE_HAZEL} />
      <circle cx="58" cy="44" r="2.2" fill={CF_EYE_HAZEL} />
      <circle cx="42" cy="44" r="1.1" fill="#1a1a1a" />
      <circle cx="58" cy="44" r="1.1" fill="#1a1a1a" />
      <circle cx="43" cy="43.2" r="0.5" fill={CF_WHITE} opacity="0.8" />
      <circle cx="59" cy="43.2" r="0.5" fill={CF_WHITE} opacity="0.8" />
      {/* Brows */}
      <path d="M36 40c3-1.5 6-2 9-1" stroke={CF_HAIR_AUBURN} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M55 39c3-1 6-0.5 9 1" stroke={CF_HAIR_AUBURN} strokeWidth="1.5" strokeLinecap="round" />
      {/* Lash lines */}
      <path d="M37.5 43c2-1.5 6-1.5 9 0" stroke="#3a2a1f" strokeWidth="1" fill="none" />
      <path d="M53.5 43c2-1.5 6-1.5 9 0" stroke="#3a2a1f" strokeWidth="1" fill="none" />
      {/* Nose */}
      <path d="M49 45c0.4 2.5 0.6 5 0.8 7" stroke={CF_SKIN_SHADOW} strokeWidth="1.2" strokeLinecap="round" />
      {/* Determined mouth */}
      <path d="M43 58c3 0.5 6 0.8 14 0" stroke={CF_LIPS_F} strokeWidth="1.5" strokeLinecap="round" />
      {/* Lanyard */}
      <path d="M44 68v14M56 68v14" stroke={CF_ACCENT} strokeWidth="1.5" opacity="0.5" />
      {/* Badge at bottom */}
      <rect x="42" y="82" width="16" height="10" rx="2" fill={CF_ACCENT} opacity="0.25" stroke={CF_ACCENT} strokeWidth="1" />
      <rect x="45" y="85" width="10" height="2" rx="0.5" fill={CF_WHITE} opacity="0.3" />
      <rect x="45" y="88" width="7" height="1.5" rx="0.5" fill={CF_WHITE} opacity="0.2" />
      {/* Blazer */}
      <path d="M28 78c6-4 12-6 22-6s16 2 22 6" fill={CF_CLOTH_DARK} />
      <path d="M28 78c6-4 12-6 22-6s16 2 22 6" stroke="#2a3040" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="8" fill={CF_SKIN} opacity="0.7" />
    </svg>
  );
}

/** Kwame Osei — Night Shift Lead, dark skin, short hair, goatee, tired but alert */
function KwameOsei({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Angular frame */}
      <rect x="6" y="4" width="88" height="92" rx="4" fill="#141820" stroke={CF_ACCENT} strokeWidth="1" opacity="0.2" />
      {/* Short cropped hair */}
      <path d="M26 38c1-18 11-28 24-28s23 10 24 28" fill={CF_HAIR_BLACK} />
      <path d="M28 36c1-14 10-24 22-24s21 10 22 24" fill="#1a1a1a" />
      {/* Face — strong features */}
      <ellipse cx="50" cy="48" rx="19" ry="22" fill={CF_SKIN_DARK} />
      <ellipse cx="50" cy="48" rx="19" ry="22" fill={CF_SKIN_DARK_SHADOW} opacity="0.15" />
      {/* Highlight */}
      <ellipse cx="50" cy="44" rx="12" ry="8" fill={CF_SKIN_DARK_HIGHLIGHT} opacity="0.2" />
      {/* Tired but alert eyes */}
      <ellipse cx="42" cy="44" rx="4.5" ry="2.5" fill="#e8dcc8" opacity="0.85" />
      <ellipse cx="58" cy="44" rx="4.5" ry="2.5" fill="#e8dcc8" opacity="0.85" />
      <circle cx="42" cy="44" r="2.2" fill={CF_EYE_DARK} />
      <circle cx="58" cy="44" r="2.2" fill={CF_EYE_DARK} />
      <circle cx="42" cy="44" r="1.1" fill="#0a0a0a" />
      <circle cx="58" cy="44" r="1.1" fill="#0a0a0a" />
      <circle cx="43" cy="43.2" r="0.5" fill="#e8dcc8" opacity="0.7" />
      <circle cx="59" cy="43.2" r="0.5" fill="#e8dcc8" opacity="0.7" />
      {/* Slight under-eye circles — night shift fatigue */}
      <path d="M38 46c2 1 5 1 8 0" stroke={CF_SKIN_DARK_SHADOW} strokeWidth="1" opacity="0.4" />
      <path d="M54 46c2 1 5 1 8 0" stroke={CF_SKIN_DARK_SHADOW} strokeWidth="1" opacity="0.4" />
      {/* Strong brows */}
      <path d="M35 40c3-2 7-2.5 10-1.5" stroke={CF_HAIR_BLACK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M55 38.5c3-1 7-0.5 10 1.5" stroke={CF_HAIR_BLACK} strokeWidth="2.2" strokeLinecap="round" />
      {/* Upper lids */}
      <path d="M37.5 43c2-1.5 6-1.5 9 0" stroke={CF_SKIN_DARK_SHADOW} strokeWidth="1.2" fill="none" />
      <path d="M53.5 43c2-1.5 6-1.5 9 0" stroke={CF_SKIN_DARK_SHADOW} strokeWidth="1.2" fill="none" />
      {/* Broad nose */}
      <path d="M48 45c0.5 3 1 6 1.5 8" stroke={CF_SKIN_DARK_SHADOW} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M47 53c2 1 4 1 6 0" stroke={CF_SKIN_DARK_SHADOW} strokeWidth="1" />
      {/* Goatee */}
      <path d="M44 60c3 1 6 1 12 0" fill={CF_HAIR_BLACK} opacity="0.6" />
      <path d="M46 62c2 2 4 3 4 3s2-1 4-3" fill={CF_HAIR_BLACK} opacity="0.4" />
      {/* Mouth */}
      <path d="M43 59c3 0.5 6 0.5 14 0" stroke="#8a6858" strokeWidth="1.5" strokeLinecap="round" />
      {/* Work vest */}
      <path d="M24 80c7-5 15-8 26-8s19 3 26 8" fill={CF_CLOTH_GREY} />
      <path d="M24 80c7-5 15-8 26-8s19 3 26 8" stroke="#3a3a44" strokeWidth="1.5" />
      {/* Vest zipper line */}
      <path d="M50 72v12" stroke={CF_STEEL} strokeWidth="1.5" opacity="0.4" />
      {/* Reflective strip */}
      <path d="M26 82h48" stroke="#8a9aaa" strokeWidth="1.5" opacity="0.2" />
      {/* Neck */}
      <rect x="42" y="68" width="16" height="8" fill={CF_SKIN_DARK} opacity="0.7" />
    </svg>
  );
}

/** Lin Zhao — Executive Assistant, sleek black hair, sharp features, stud earrings */
function LinZhao({ className = '', size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      {/* Angular frame */}
      <rect x="6" y="4" width="88" height="92" rx="4" fill="#141820" stroke="#60a5fa" strokeWidth="1" opacity="0.2" />
      {/* Sleek straight black hair */}
      <path d="M26 36c2-16 12-28 24-28s22 12 24 28" fill={CF_HAIR_BLACK} />
      <path d="M28 34c2-14 10-24 22-24s20 10 22 24" fill="#2a2225" />
      {/* Hair flowing past shoulders */}
      <path d="M24 38c-2 10-3 22-2 34" fill={CF_HAIR_BLACK} opacity="0.8" />
      <path d="M76 38c2 10 3 22 2 34" fill={CF_HAIR_BLACK} opacity="0.8" />
      <path d="M24 38c-2 10-3 22-2 34" stroke="#2a2225" strokeWidth="1.5" opacity="0.4" />
      <path d="M76 38c2 10 3 22 2 34" stroke="#2a2225" strokeWidth="1.5" opacity="0.4" />
      {/* Hair sheen */}
      <path d="M36 18c4-4 8-6 14-6" stroke="#3a3538" strokeWidth="2" opacity="0.4" />
      {/* Face — elegant, sharp */}
      <ellipse cx="50" cy="48" rx="17" ry="22" fill={CF_SKIN} />
      <ellipse cx="50" cy="48" rx="17" ry="22" fill={CF_SKIN_HIGHLIGHT} opacity="0.15" />
      {/* Cheekbone definition */}
      <path d="M33 46l6-1" stroke={CF_SKIN_SHADOW} strokeWidth="0.8" opacity="0.35" />
      <path d="M67 46l-6-1" stroke={CF_SKIN_SHADOW} strokeWidth="0.8" opacity="0.35" />
      <ellipse cx="38" cy="48" rx="3.5" ry="2" fill={CF_SKIN_HIGHLIGHT} opacity="0.25" />
      <ellipse cx="62" cy="48" rx="3.5" ry="2" fill={CF_SKIN_HIGHLIGHT} opacity="0.25" />
      {/* Elegant eyes */}
      <path d="M36 43c2-2.5 6-2.5 9 0" fill={CF_WHITE} opacity="0.9" />
      <path d="M36 43c2 1.5 6 1.5 9 0" fill={CF_WHITE} opacity="0.9" />
      <path d="M55 43c2-2.5 6-2.5 9 0" fill={CF_WHITE} opacity="0.9" />
      <path d="M55 43c2 1.5 6 1.5 9 0" fill={CF_WHITE} opacity="0.9" />
      <circle cx="41" cy="43" r="2" fill={CF_EYE_DARK} />
      <circle cx="59" cy="43" r="2" fill={CF_EYE_DARK} />
      <circle cx="41" cy="43" r="1" fill="#0a0a0a" />
      <circle cx="59" cy="43" r="1" fill="#0a0a0a" />
      <circle cx="42" cy="42.3" r="0.5" fill={CF_WHITE} opacity="0.8" />
      <circle cx="60" cy="42.3" r="0.5" fill={CF_WHITE} opacity="0.8" />
      {/* Refined brows */}
      <path d="M35 39c3-1.5 6-2 9-1" stroke={CF_HAIR_BLACK} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M56 38c3-1 6-0.5 9 1" stroke={CF_HAIR_BLACK} strokeWidth="1.3" strokeLinecap="round" />
      {/* Eyeliner */}
      <path d="M35.5 43c2-2.5 6.5-2.5 10 0" stroke="#1a1518" strokeWidth="1" fill="none" />
      <path d="M54.5 43c2-2.5 6.5-2.5 10 0" stroke="#1a1518" strokeWidth="1" fill="none" />
      {/* Nose */}
      <path d="M49 44c0.4 2.5 0.6 5 0.7 7" stroke={CF_SKIN_SHADOW} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M48.5 51c1 0.5 2 0.5 2.5 0" stroke={CF_SKIN_SHADOW} strokeWidth="0.7" />
      {/* Composed lips */}
      <path d="M44 57c2-0.3 4 0.5 6 0.8 2-0.3 4-1 6-0.8" stroke={CF_LIPS_F} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 58c3 0.8 8 0.8 12 0" fill={CF_LIPS_F} opacity="0.3" />
      {/* Stud earrings */}
      <circle cx="28" cy="48" r="2" fill="#60a5fa" opacity="0.6" />
      <circle cx="28" cy="48" r="1" fill={CF_WHITE} opacity="0.4" />
      <circle cx="72" cy="48" r="2" fill="#60a5fa" opacity="0.6" />
      <circle cx="72" cy="48" r="1" fill={CF_WHITE} opacity="0.4" />
      {/* High-collar professional blouse */}
      <path d="M36 70c4 0.5 8 1 14 1s10-0.5 14-1" fill={CF_WHITE} opacity="0.15" />
      {/* Blazer */}
      <path d="M28 78c6-4 12-6 22-6s16 2 22 6" fill={CF_CLOTH_DARK} />
      <path d="M28 78c6-4 12-6 22-6s16 2 22 6" stroke="#2a3040" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="43" y="66" width="14" height="8" fill={CF_SKIN} opacity="0.7" />
    </svg>
  );
}

const CASEFILE_PORTRAITS: Record<string, (props: Props) => React.JSX.Element> = {
  'Marcus Cole': MarcusCole,
  'Elena Rivera': ElenaRivera,
  'Jay Chen': JayChen,
  'Sofia Mercer': SofiaMercer,
  'Kwame Osei': KwameOsei,
  'Lin Zhao': LinZhao,
};

export default function SuspectPortrait({ name, className = '', size = 56, portraitStyle }: Props & { name: string; portraitStyle?: string }) {
  if (portraitStyle === 'gaslight') {
    const Portrait = GASLIGHT_PORTRAITS[name];
    if (Portrait) return <Portrait className={className} size={size} />;
  }
  if (portraitStyle === 'casefile') {
    const Portrait = CASEFILE_PORTRAITS[name];
    if (Portrait) return <Portrait className={className} size={size} />;
  }

  // Fantasy mode — use hand-drawn portraits
  const Portrait = FANTASY_PORTRAITS[name];
  if (Portrait) return <Portrait className={className} size={size} />;

  // Fallback silhouette for unknown names
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <ellipse cx="50" cy="42" rx="18" ry="22" fill="#2a2540" />
      <path d="M 24 78 Q 50 62 76 78" fill="#2a2540" />
    </svg>
  );
}
