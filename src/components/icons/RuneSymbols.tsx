interface Props {
  className?: string;
  size?: number;
}

export function RuneOaths({ className = '', size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Hourglass / time rune */}
      <path d="M20 8h24v4l-8 16 8 16v4H20v-4l8-16-8-16V8z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="32" cy="28" r="2" fill="currentColor" opacity="0.6" />
      <line x1="26" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="26" y1="52" x2="38" y2="52" stroke="currentColor" strokeWidth="1.5" />
      {/* Sand particles */}
      <circle cx="32" cy="36" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="30" cy="40" r="0.8" fill="currentColor" opacity="0.3" />
      <circle cx="34" cy="42" r="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function RuneRoads({ className = '', size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Forking path */}
      <path d="M32 56V36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 36L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 36L46 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Compass points */}
      <circle cx="18" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="46" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="56" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Decorative dots along paths */}
      <circle cx="25" cy="25" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="39" cy="25" r="1.2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function RuneRelics({ className = '', size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Key shape */}
      <circle cx="32" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="32" cy="18" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="32" y1="28" x2="32" y2="52" stroke="currentColor" strokeWidth="2.5" />
      <line x1="32" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="48" x2="38" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Sparkle */}
      <path d="M48 12l2-4 2 4-4 2 4 2-2 4-2-4-4-2z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function RuneSkies({ className = '', size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Eye / all-seeing */}
      <ellipse cx="32" cy="32" rx="20" ry="12" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="32" r="2.5" fill="currentColor" />
      {/* Rays */}
      <line x1="32" y1="8" x2="32" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="48" x2="32" y2="56" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="8" y1="32" x2="12" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="52" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Mist wisps */}
      <path d="M10 46c4-2 8 1 12-1s6-3 10-1" stroke="currentColor" strokeWidth="0.8" opacity="0.25" fill="none" />
    </svg>
  );
}

export function WaxSeal({ className = '', size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Wavy seal edge */}
      <path d="M32 4C36 8 40 6 44 10s2 8 6 12-2 8 0 14-6 6-8 12-6 4-10 8-8-2-12 0-6-6-10-8-2-8-4-14 4-8 2-14 6-4 8-10 6-2 10-6z"
        fill="currentColor" opacity="0.9" />
      {/* Inner circle */}
      <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      {/* Pentagram-like symbol */}
      <path d="M32 18l4 12h-8z" fill="none" stroke="white" strokeWidth="1.2" opacity="0.7" />
      <path d="M32 46l-4-12h8z" fill="none" stroke="white" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

export function ScrollIcon({ className = '', size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8l6-6V5c0-1.1-.9-2-2-2H6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 15v6l6-6h-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="8" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function WatchtowerIcon({ className = '', size = 64 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="24" y="20" width="16" height="40" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <rect x="20" y="14" width="24" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <polygon points="32,4 20,14 44,14" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Window */}
      <rect x="29" y="26" width="6" height="8" rx="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Light beam */}
      <path d="M32 26L22 16M32 26L42 16" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Door */}
      <rect x="28" y="50" width="8" height="10" rx="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

export function ElderTree({ className = '', size = 64 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Trunk */}
      <path d="M30 60V36M34 60V36" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {/* Branches */}
      <path d="M32 36C24 32 18 24 22 16s12-8 10-12" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M32 36C40 32 46 24 42 16s-12-8-10-12" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M32 30C26 28 20 22 24 16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M32 30C38 28 44 22 40 16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Leaves / canopy dots */}
      <circle cx="22" cy="14" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="32" cy="8" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="42" cy="14" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="27" cy="10" r="2.5" fill="currentColor" opacity="0.1" />
      <circle cx="37" cy="10" r="2.5" fill="currentColor" opacity="0.1" />
      {/* Roots */}
      <path d="M28 60C24 62 20 60 18 62" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <path d="M36 60C40 62 44 60 46 62" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

export function SkullIcon({ className = '', size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C7.6 2 4 5.6 4 10c0 2.4 1 4.5 2.6 6H8v4h8v-4h1.4c1.6-1.5 2.6-3.6 2.6-6 0-4.4-3.6-8-8-8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <path d="M10 15v3M14 15v3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function EyeIcon({ className = '', size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
