import { useState, useEffect } from 'react';

interface Props {
  targetSelector: string;
  text: string;
}

export default function TutorialCallout({ targetSelector, text }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector(targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPos({ top: rect.top - 50, left: rect.left + rect.width / 2 });
        setVisible(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [targetSelector]);

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={{ top: pos.top, left: pos.left, transform: 'translateX(-50%)' }}
    >
      <div className="bg-gold/90 text-bg-deep px-3 py-1.5 rounded-lg font-body text-xs font-bold shadow-lg pointer-events-auto cursor-pointer"
        onClick={() => setVisible(false)}
      >
        <span className="mr-1">↓</span> {text}
      </div>
    </div>
  );
}
