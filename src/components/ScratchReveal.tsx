import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
}

export default function ScratchReveal({ children, delay = 0 }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="relative cursor-pointer select-none"
      onClick={() => setRevealed(true)}
    >
      {children}
      {!revealed && (
        <div
          className="absolute inset-0 rounded-lg overflow-hidden animate-fade-in"
          style={{ animationDelay: `${delay}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-bg-deep/95 via-surface/90 to-bg-deep/95 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-body text-gold/40 text-xs italic tracking-wider">
              Tap to reveal
            </span>
          </div>
          {/* Shimmer effect */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(105deg, transparent 35%, rgba(196,163,90,0.08) 45%, rgba(196,163,90,0.12) 50%, rgba(196,163,90,0.08) 55%, transparent 65%)',
            backgroundSize: '200% 100%',
            animation: 'cardShimmer 2.5s ease-in-out infinite',
          }} />
        </div>
      )}
    </div>
  );
}
