import { useEffect, useState } from 'react';
import { useThemeStrict } from '../hooks/ThemeContext.js';

export default function WelcomeToast() {
  const [visible, setVisible] = useState(true);
  const { theme } = useThemeStrict();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in-down">
      <div className="bg-surface/90 backdrop-blur-sm border border-gold/20 rounded-lg px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <p className={`${theme.visuals.headingFontClass} text-parchment/80 text-sm tracking-wider text-center`}>
          {theme.copy.welcomeToastText}
        </p>
      </div>
    </div>
  );
}
