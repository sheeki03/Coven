import { useEffect, useRef } from 'react';

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Disable on mobile
    if (window.innerWidth < 768) return;

    // Respect reduce-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; life: number; maxLife: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => {
      if (particles.length > 30) return;
      const maxLife = 300 + Math.random() * 400;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.15 + Math.random() * 0.35),
        size: 1 + Math.random() * 2.5,
        opacity: 0,
        life: 0,
        maxLife,
      });
    };

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.02;
        p.life++;

        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.15
          ? progress / 0.15 * 0.25
          : progress > 0.7
            ? (1 - progress) / 0.3 * 0.25
            : 0.25;

        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 163, 90, ${p.opacity})`;
        ctx.fill();
      }

      if (Math.random() < 0.06) spawn();
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
