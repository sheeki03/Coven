import { useMemo } from 'react';
import { useGame } from '../hooks/GameContext.js';
import { useHighlight } from '../hooks/useHighlight.js';
import { getSuspectLocations, getSuspectEdges } from '../utils/mapHelpers.js';
import SuspectCard from './SuspectCard.js';

interface Props {
  onAccuse?: (id: string, name: string) => void;
}

export default function SuspectGrid({ onAccuse }: Props) {
  const { state } = useGame();
  const { highlight } = useHighlight();

  const suspectLocs = useMemo(() => getSuspectLocations(state.suspects), [state.suspects]);
  const suspectEdgeMap = useMemo(() => getSuspectEdges(state.suspects), [state.suspects]);

  const filtered = useMemo(() => {
    let list = state.suspects;

    // Suspicion filter
    if (highlight.suspicionFilter === 'unmarked') {
      list = list.filter(s => s.strikes === 0);
    } else if (highlight.suspicionFilter === 'suspect') {
      list = list.filter(s => s.strikes === 1);
    } else if (highlight.suspicionFilter === 'condemned') {
      list = list.filter(s => s.strikes >= 2);
    }

    // Map filter
    if (highlight.mapFilter) {
      if (highlight.mapFilter.type === 'node') {
        list = list.filter(s => suspectLocs[s.id]?.has(highlight.mapFilter!.id));
      } else if (highlight.mapFilter.type === 'edge') {
        list = list.filter(s => suspectEdgeMap[s.id]?.has(highlight.mapFilter!.id));
      }
    }

    return list;
  }, [state.suspects, highlight.suspicionFilter, highlight.mapFilter, suspectLocs, suspectEdgeMap]);

  return (
    <div>
      {filtered.length === 0 ? (
        <p className="text-center py-6 font-body text-iron/40 text-sm italic">No suspects match the current filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((suspect) => (
            <SuspectCard key={suspect.id} suspect={suspect} onAccuse={onAccuse} />
          ))}
        </div>
      )}
    </div>
  );
}
