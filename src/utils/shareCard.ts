import type { GameState } from '../types/index.js';
import type { ThemeConfig } from '../themes/types.js';

const MODE_EMOJIS: Record<string, string> = { ledger: '\u2694\uFE0F', gaslight: '\uD83D\uDD6F\uFE0F', casefile: '\uD83D\uDCC1' };

export function generateShareText(state: GameState, theme: ThemeConfig): string {
  const modeEmoji = MODE_EMOJIS[theme.id] ?? '\u2694\uFE0F';
  const verdict = state.won ? theme.copy.verdictWin : theme.copy.verdictLose;

  const dots = state.suspects.map(s =>
    s.strikes >= 2 ? '\uD83D\uDD34' : s.strikes === 1 ? '\uD83D\uDFE1' : '\uD83D\uDFE2'
  ).join('');

  const elapsed = state.elapsedSeconds ?? 0;

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const challengeUrl = `${baseUrl}?seed=${state.seed}&mode=${theme.id}`;

  return [
    `COVEN #${state.seed} ${modeEmoji} ${verdict}`,
    `${dots} ${state.score}pts ${elapsed}s`,
    `Can you survive? ${challengeUrl}`,
  ].join('\n');
}

export function generateShareCanvas(state: GameState, theme: ThemeConfig): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1080);
  grad.addColorStop(0, '#1a1533');
  grad.addColorStop(0.5, '#0d0a1a');
  grad.addColorStop(1, '#1a1533');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Border
  ctx.strokeStyle = '#c4a35a40';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1000, 1000);
  ctx.strokeRect(50, 50, 980, 980);

  // Title — use theme game title
  ctx.fillStyle = '#c4a35a';
  ctx.font = 'bold 42px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(theme.copy.gameTitle, 540, 160);

  // Seed + mode
  ctx.fillStyle = '#6b7280';
  ctx.font = '24px Cinzel, serif';
  ctx.fillText(`#${state.seed} \u2014 ${theme.id}`, 540, 210);

  // Result
  const won = state.won;
  ctx.fillStyle = won ? '#2e7d4a' : '#c62828';
  ctx.font = 'bold 96px Cinzel, serif';
  ctx.fillText(won ? theme.copy.verdictWin : theme.copy.verdictLose, 540, 420);

  // Colored circles — canvas arc, NOT emoji text
  const circleY = 530;
  const circleR = 28;
  const totalWidth = state.suspects.length * (circleR * 2 + 16) - 16;
  const startX = 540 - totalWidth / 2 + circleR;

  state.suspects.forEach((s, i) => {
    const cx = startX + i * (circleR * 2 + 16);
    ctx.beginPath();
    ctx.arc(cx, circleY, circleR, 0, Math.PI * 2);
    ctx.fillStyle = s.strikes >= 2 ? '#ef4444' : s.strikes === 1 ? '#eab308' : '#22c55e';
    ctx.fill();
  });

  // Score
  ctx.fillStyle = '#c4a35a';
  ctx.font = 'bold 64px Cinzel, serif';
  ctx.fillText(`${state.score} pts`, 540, 660);

  // Stats
  ctx.fillStyle = '#6b7280';
  ctx.font = '28px Cinzel, serif';
  const elapsed = state.elapsedSeconds ?? 0;
  ctx.fillText(`${state.drawnCards.length} drawn  |  ${elapsed}s  |  Hint: ${state.hintUsed ? '1' : '0'}`, 540, 720);

  // Codex stamp (bottom-left)
  const stamp = won ? (state.score >= 700 ? theme.copy.stampWin : theme.copy.stampMercy) : theme.copy.stampLose;
  const stampColor = won ? (state.score >= 700 ? '#2e7d4a' : '#b45309') : '#8b1a1a';
  ctx.beginPath();
  ctx.arc(160, 880, 55, 0, Math.PI * 2);
  ctx.fillStyle = stampColor + '40';
  ctx.fill();
  ctx.strokeStyle = stampColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#e8dcc8';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(stamp, 160, 886);

  // Footer
  ctx.fillStyle = '#e0d8c880';
  ctx.font = '20px Cinzel, serif';
  ctx.fillText('Can you survive?', 540, 920);

  // Seal (bottom-right)
  ctx.beginPath();
  ctx.arc(920, 880, 50, 0, Math.PI * 2);
  ctx.fillStyle = (won ? '#1a3a2a' : '#8b1a1a') + '60';
  ctx.fill();
  ctx.strokeStyle = won ? '#1a3a2a' : '#8b1a1a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#e8dcc8';
  ctx.font = 'bold 20px Cinzel, serif';
  ctx.fillText(won ? '\u2713' : '\u2717', 920, 888);

  return canvas;
}
