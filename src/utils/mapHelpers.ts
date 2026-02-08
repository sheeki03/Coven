import type { Suspect, LocationId } from '../types/index.js';

export function getEdgeId(from: LocationId, to: LocationId): string {
  return [from, to].sort().join('::');
}

export function getSuspectLocations(suspects: Suspect[]): Record<string, Set<LocationId>> {
  const result: Record<string, Set<LocationId>> = {};
  for (const s of suspects) {
    const locs = new Set<LocationId>();
    for (const seg of s.claimVector.segments) {
      locs.add(seg.from);
      locs.add(seg.to);
    }
    result[s.id] = locs;
  }
  return result;
}

export function getSuspectEdges(suspects: Suspect[]): Record<string, Set<string>> {
  const result: Record<string, Set<string>> = {};
  for (const s of suspects) {
    const edges = new Set<string>();
    for (const seg of s.claimVector.segments) {
      if (seg.from !== seg.to) {
        edges.add(getEdgeId(seg.from, seg.to));
      }
    }
    result[s.id] = edges;
  }
  return result;
}
