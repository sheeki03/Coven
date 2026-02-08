import { ThemeProvider, useTheme } from './hooks/ThemeContext.js';
import { GameProvider } from './hooks/GameContext.js';
import GameBoard from './components/GameBoard.js';
import WelcomeScreen from './components/WelcomeScreen.js';
import { getSeed } from './utils/rng.js';

function AppInner() {
  const { mode } = useTheme();

  if (!mode) {
    return <WelcomeScreen />;
  }

  // Key GameProvider with mode:seed to force full React remount on mode switch
  const seed = getSeed();
  return (
    <GameProvider key={`${mode}:${seed}`}>
      <GameBoard />
    </GameProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
