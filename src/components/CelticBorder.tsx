interface Props {
  className?: string;
}

export default function CelticBorder({ className = '' }: Props) {
  return (
    <svg className={`w-full ${className}`} viewBox="0 0 800 24" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(196,163,90,0)" />
          <stop offset="20%" stopColor="rgba(196,163,90,0.5)" />
          <stop offset="50%" stopColor="rgba(196,163,90,0.8)" />
          <stop offset="80%" stopColor="rgba(196,163,90,0.5)" />
          <stop offset="100%" stopColor="rgba(196,163,90,0)" />
        </linearGradient>
      </defs>
      {/* Central diamond */}
      <path d="M400 4l8 8-8 8-8-8z" stroke="url(#borderGrad)" strokeWidth="1" fill="none" />
      <circle cx="400" cy="12" r="2" fill="rgba(196,163,90,0.6)" />
      {/* Lines radiating out */}
      <line x1="380" y1="12" x2="200" y2="12" stroke="url(#borderGrad)" strokeWidth="0.5" />
      <line x1="420" y1="12" x2="600" y2="12" stroke="url(#borderGrad)" strokeWidth="0.5" />
      {/* Decorative dots */}
      <circle cx="300" cy="12" r="1.5" fill="rgba(196,163,90,0.3)" />
      <circle cx="500" cy="12" r="1.5" fill="rgba(196,163,90,0.3)" />
      <circle cx="350" cy="12" r="1" fill="rgba(196,163,90,0.2)" />
      <circle cx="450" cy="12" r="1" fill="rgba(196,163,90,0.2)" />
      {/* Small diamonds */}
      <path d="M300 8l4 4-4 4-4-4z" stroke="rgba(196,163,90,0.25)" strokeWidth="0.5" fill="none" />
      <path d="M500 8l4 4-4 4-4-4z" stroke="rgba(196,163,90,0.25)" strokeWidth="0.5" fill="none" />
    </svg>
  );
}
