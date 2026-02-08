import React, { useMemo } from 'react';
import type { WorldModel } from '../types/index.js';
import { useHighlight } from '../hooks/useHighlight.js';
import { getEdgeId, getSuspectLocations, getSuspectEdges } from '../utils/mapHelpers.js';
import { useGame } from '../hooks/GameContext.js';
import { useThemeStrict } from '../hooks/ThemeContext.js';
import HelpTip from './HelpTip.js';

interface Props {
  world: WorldModel;
  drawnCount: number;
}

function MapPanel({ world, drawnCount }: Props) {
  const { state } = useGame();
  const { theme } = useThemeStrict();
  const { highlight, highlightDispatch } = useHighlight();

  // Normalize coords to SVG space (20-280 in a 300x300 viewbox)
  const normalized = useMemo(() => {
    const xs = world.locations.map(l => l.coords.x);
    const ys = world.locations.map(l => l.coords.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    return world.locations.map(l => ({
      ...l,
      nx: 40 + ((l.coords.x - minX) / rangeX) * 220,
      ny: 40 + ((l.coords.y - minY) / rangeY) * 220,
    }));
  }, [world.locations]);

  const suspectLocs = useMemo(() => getSuspectLocations(state.suspects), [state.suspects]);
  const suspectEdgeMap = useMemo(() => getSuspectEdges(state.suspects), [state.suspects]);

  const hoveredSuspectId = highlight.hoveredSuspectId;
  const hoveredLocs = hoveredSuspectId ? suspectLocs[hoveredSuspectId] : null;
  const hoveredEdges = hoveredSuspectId ? suspectEdgeMap[hoveredSuspectId] : null;

  // Opacity ramp based on draws
  const baseOpacity = drawnCount === 0 ? 0.55 : drawnCount === 1 ? 0.75 : 1;

  const handleNodeClick = (locId: string) => {
    highlightDispatch({ type: 'SET_MAP_FILTER', filter: { type: 'node', id: locId } });
  };

  const handleEdgeClick = (from: string, to: string) => {
    highlightDispatch({ type: 'SET_MAP_FILTER', filter: { type: 'edge', id: getEdgeId(from, to) } });
  };

  const locMap = new Map(normalized.map(l => [l.id, l]));

  // Deduplicate bidirectional edges (worldgen pushes both A→B and B→A)
  const uniqueEdges = useMemo(() => {
    const seen = new Set<string>();
    return world.edges.filter(edge => {
      const eid = getEdgeId(edge.from, edge.to);
      if (seen.has(eid)) return false;
      seen.add(eid);
      return true;
    });
  }, [world.edges]);

  return (
    <div id="tutorial-map" className="surface-parchment rounded-xl p-5 animate-fade-in-up">
      <h3 className={`flex items-center ${theme.visuals.headingFontClass} text-gold/80 text-base tracking-[0.2em] uppercase mb-3`}>
        {theme.copy.mapLabel}
        <HelpTip size="md" text="Map of locations — numbers on paths show travel time in hours. Click a location or path to filter suspects who were there." />
      </h3>

      <svg viewBox="0 0 300 300" className="w-full" style={{ opacity: baseOpacity, transition: 'opacity 0.5s' }}>
        {/* Compass rose */}
        <text x="280" y="20" className="text-[11px]" fill="rgba(196,163,90,0.45)" textAnchor="middle">N</text>

        {/* Edges */}
        {uniqueEdges.map(edge => {
          const from = locMap.get(edge.from);
          const to = locMap.get(edge.to);
          if (!from || !to) return null;
          const edgeId = getEdgeId(edge.from, edge.to);
          const isHighlighted = hoveredEdges?.has(edgeId);
          const isFiltered = highlight.mapFilter?.type === 'edge' && highlight.mapFilter.id === edgeId;
          const isHintEdge = state.hintFact?.fact.includes(from.name) && state.hintFact?.fact.includes(to.name);

          return (
            <g key={edgeId} onClick={() => handleEdgeClick(edge.from, edge.to)} className="cursor-pointer">
              <line
                x1={from.nx} y1={from.ny} x2={to.nx} y2={to.ny}
                stroke={isHintEdge ? '#c4a35a' : isFiltered ? '#c4a35a' : isHighlighted ? 'rgba(196,163,90,0.7)' : 'rgba(196,163,90,0.35)'}
                strokeWidth={isFiltered || isHighlighted ? 3 : 2}
                strokeDasharray={isHintEdge ? '4 2' : undefined}
              />
              {/* Edge label */}
              <text
                x={(from.nx + to.nx) / 2}
                y={(from.ny + to.ny) / 2 - 6}
                textAnchor="middle"
                fill="rgba(196,163,90,0.65)"
                className="text-[11px] font-cinzel pointer-events-none font-bold"
              >
                {edge.bellsRequired}{theme.copy.travelUnitShort}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {normalized.map(loc => {
          const isHighlighted = hoveredLocs?.has(loc.id);
          const isFiltered = highlight.mapFilter?.type === 'node' && highlight.mapFilter.id === loc.id;

          return (
            <g key={loc.id} onClick={() => handleNodeClick(loc.id)} className="cursor-pointer">
              <circle
                cx={loc.nx} cy={loc.ny} r={isFiltered ? 16 : isHighlighted ? 14 : 12}
                fill={isFiltered ? 'rgba(196,163,90,0.3)' : isHighlighted ? 'rgba(196,163,90,0.2)' : 'rgba(17,14,32,0.9)'}
                stroke={isFiltered ? '#c4a35a' : isHighlighted ? 'rgba(196,163,90,0.6)' : 'rgba(196,163,90,0.4)'}
                strokeWidth={isFiltered ? 2.5 : 2}
                className="transition-all duration-200"
              />
              <text
                x={loc.nx} y={loc.ny + 24}
                textAnchor="middle"
                fill={isFiltered || isHighlighted ? '#c4a35a' : 'rgba(228,218,202,0.85)'}
                className="text-[12px] font-cinzel pointer-events-none"
              >
                {loc.name}
              </text>
            </g>
          );
        })}

        {/* Hint plaque */}
        {state.hintUsed && state.hintFact && (
          <text x="150" y="290" textAnchor="middle" fill="rgba(196,163,90,0.35)" className="text-[10px] font-body italic pointer-events-none">
            Stone Law in effect
          </text>
        )}
      </svg>

      {/* Clear filter */}
      {highlight.mapFilter && (
        <button
          onClick={() => highlightDispatch({ type: 'SET_MAP_FILTER', filter: null })}
          className="mt-1.5 text-sm font-body text-iron/50 hover:text-gold/70 cursor-pointer transition-colors"
        >
          ✕ Clear filter
        </button>
      )}
    </div>
  );
}

export default React.memo(MapPanel);
