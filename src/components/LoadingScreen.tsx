import { useEffect, useState } from 'react';
import { useThemeStrict } from '../hooks/ThemeContext.js';

export default function LoadingScreen() {
  const [show, setShow] = useState(false);
  const { theme } = useThemeStrict();
  useEffect(() => { setShow(true); }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-bg-deep transition-opacity duration-700 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center relative">
        {/* Animated rune circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" style={{ animation: 'runeCircleSpin 12s linear infinite' }}>
            <circle cx="100" cy="100" r="90" stroke="rgba(196,163,90,0.15)" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="85" stroke="rgba(196,163,90,0.08)" strokeWidth="0.5" fill="none" strokeDasharray="4 8" />
            {/* Rune marks around the circle */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <line
                key={deg}
                x1="100" y1="15" x2="100" y2="25"
                stroke="rgba(196,163,90,0.3)"
                strokeWidth="1.5"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </svg>

          {/* Inner ring - counter-rotate */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" style={{ animation: 'runeCircleSpinReverse 8s linear infinite' }}>
            <circle cx="100" cy="100" r="60" stroke="rgba(196,163,90,0.1)" strokeWidth="0.5" fill="none" />
            <polygon
              points="100,50 115,80 150,80 122,100 132,135 100,115 68,135 78,100 50,80 85,80"
              stroke="rgba(196,163,90,0.15)"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>

          {/* Center eye */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" className="animate-breathe text-gold">
              <ellipse cx="20" cy="20" rx="16" ry="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>

        <p className={`${theme.visuals.headingFontClass} text-gold/60 text-sm tracking-[0.3em] uppercase animate-breathe`}>
          {theme.copy.loadingText}
        </p>
        <div className="mt-4 w-32 h-px mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    </div>
  );
}
