import { useCallback, useState } from 'react';
import type { GameState } from '../types/index.js';

const STORAGE_KEY = 'coven:shards';

interface ShardState {
  total: number;
  earned: number[];  // seeds that already gave shards
}

function load(): ShardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { total: 0, earned: [] };
}

function save(state: ShardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function calculateShardReward(state: GameState): number {
  if (!state.won) return 1; // consolation shard
  let shards = 3;
  if (!state.hintUsed) shards += 2;           // clean hands bonus
  if (!state.usedExtraDraw) shards += 1;      // no safety net bonus
  if (state.score >= 700) shards += 2;        // clean verdict bonus
  return shards;
}

export function useShards() {
  const [shardState, setShardState] = useState(load);

  const recordGame = useCallback((state: GameState) => {
    const current = load();
    if (current.earned.includes(state.seed)) return 0;

    const reward = calculateShardReward(state);
    current.total += reward;
    current.earned.push(state.seed);
    // Keep only last 100 seeds to prevent storage bloat
    if (current.earned.length > 100) current.earned = current.earned.slice(-100);
    save(current);
    setShardState(current);
    return reward;
  }, []);

  const spend = useCallback((cost: number): boolean => {
    const current = load();
    if (current.total < cost) return false;
    current.total -= cost;
    save(current);
    setShardState({ ...current });
    return true;
  }, []);

  return {
    shards: shardState.total,
    recordGame,
    spend,
  };
}
