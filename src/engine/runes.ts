import type { Bell, ContradictionType, RuneArchetype, RuneCard, WorldModel, WorldReveal } from '../types/index.js';
import type { RNG } from '../utils/rng.js';

// ─── Engine structural constant: archetype → contradiction type ───
// This mapping is NEVER themed. It lives in the engine.
const ARCHETYPE_TO_TYPE: Record<RuneArchetype, ContradictionType> = {
  oaths: 'time',
  roads: 'movement',
  relics: 'object',
  skies: 'environment',
};

interface RuneDisplayNames {
  runeNames: Record<RuneArchetype, { name: string; description: string }>;
  bellNames: Record<Bell, string>;
  envFactTemplate: string;
  roadFactTemplate: string;
  roadFactNoShorter: string;
  relicHolderDesc: string;
  relicLocationFact: string;
  movementFactGate: string;
}

function fmtBell(bell: Bell, bellNames: Record<Bell, string>): string {
  return bellNames[bell];
}

function generateTimeFacts(world: WorldModel, liarId: string, display: RuneDisplayNames): WorldReveal[] {
  const facts: WorldReveal[] = [];

  facts.push({
    type: 'time',
    fact: `${world.anchor.description}.`,
    targetsSuspects: [liarId],
  });

  if (world.edges.length > 0) {
    const edge = world.edges[0];
    const fromName = world.locations.find(l => l.id === edge.from)?.name ?? edge.from;
    const toName = world.locations.find(l => l.id === edge.to)?.name ?? edge.to;
    facts.push({
      type: 'time',
      fact: display.roadFactTemplate
        .replace('{from}', fromName)
        .replace('{to}', toName)
        .replace('{bells}', String(edge.bellsRequired))
        .replace('{s}', edge.bellsRequired === 1 ? '' : 's'),
      targetsSuspects: [liarId],
    });
  }

  return facts;
}

function generateMovementFacts(world: WorldModel, liarId: string, _rng: RNG, display: RuneDisplayNames): WorldReveal[] {
  const facts: WorldReveal[] = [];

  const longEdges = world.edges
    .filter(e => e.bellsRequired >= 2)
    .sort((a, b) => b.bellsRequired - a.bellsRequired);
  const edge = longEdges.length > 0 ? longEdges[0] : world.edges[0];

  const fromName = world.locations.find(l => l.id === edge.from)?.name ?? edge.from;
  const toName = world.locations.find(l => l.id === edge.to)?.name ?? edge.to;
  facts.push({
    type: 'movement',
    fact: display.roadFactNoShorter
      .replace('{from}', fromName)
      .replace('{to}', toName)
      .replace('{bells}', String(edge.bellsRequired))
      .replace('{s}', edge.bellsRequired === 1 ? '' : 's'),
    targetsSuspects: [liarId],
  });

  if (world.edges.length > 2) {
    const otherEdge = world.edges[2];
    const f = world.locations.find(l => l.id === otherEdge.from)?.name ?? otherEdge.from;
    const t = world.locations.find(l => l.id === otherEdge.to)?.name ?? otherEdge.to;
    facts.push({
      type: 'movement',
      fact: display.movementFactGate
        .replace('{from}', f)
        .replace('{to}', t)
        .replace('{bells}', String(otherEdge.bellsRequired))
        .replace('{s}', otherEdge.bellsRequired === 1 ? '' : 's'),
      targetsSuspects: [],
    });
  }

  return facts;
}

function generateObjectFacts(world: WorldModel, liarId: string, display: RuneDisplayNames): WorldReveal[] {
  const facts: WorldReveal[] = [];

  if (world.relicTruth.relic) {
    const holderDesc = world.relicTruth.holder
      ? display.relicHolderDesc
      : 'was seen at a single location';
    facts.push({
      type: 'object',
      fact: `${world.relicTruth.relic.charAt(0).toUpperCase() + world.relicTruth.relic.slice(1)} ${holderDesc} that day.`,
      targetsSuspects: [liarId],
    });
  }

  const locName = world.locations.find(l => l.id === world.relicTruth.location)?.name ?? world.relicTruth.location;
  facts.push({
    type: 'object',
    fact: display.relicLocationFact.replace('{loc}', locName),
    targetsSuspects: [],
  });

  return facts;
}

function generateEnvironmentFacts(world: WorldModel, liarId: string, _rng: RNG, display: RuneDisplayNames): WorldReveal[] {
  const facts: WorldReveal[] = [];

  const envFact = world.environmentFacts.find(ef => ef.scent);
  if (envFact) {
    const locName = world.locations.find(l => l.id === envFact.location)?.name ?? envFact.location;
    facts.push({
      type: 'environment',
      fact: display.envFactTemplate
        .replace('{loc}', locName)
        .replace('{scent}', envFact.scent!)
        .replace('{fromBell}', fmtBell(envFact.fromBell, display.bellNames))
        .replace('{toBell}', fmtBell(envFact.toBell, display.bellNames)),
      targetsSuspects: [liarId],
    });
  }

  const otherFact = world.environmentFacts.find(ef => ef !== envFact);
  if (otherFact) {
    facts.push({
      type: 'environment',
      fact: otherFact.fact,
      targetsSuspects: [],
    });
  }

  return facts;
}

export function generateRuneDeck(
  rng: RNG,
  world: WorldModel,
  liarId: string,
  display: RuneDisplayNames,
): RuneCard[] {
  const archetypes: RuneArchetype[] = ['oaths', 'roads', 'relics', 'skies'];
  const shuffled = rng.shuffle(archetypes);

  const factGenerators: Record<RuneArchetype, (w: WorldModel, lid: string, r: RNG, d: RuneDisplayNames) => WorldReveal[]> = {
    oaths: (w, lid, _r, d) => generateTimeFacts(w, lid, d),
    roads: (w, lid, r, d) => generateMovementFacts(w, lid, r, d),
    relics: (w, lid, _r, d) => generateObjectFacts(w, lid, d),
    skies: (w, lid, r, d) => generateEnvironmentFacts(w, lid, r, d),
  };

  return shuffled.map((archetype, i) => {
    const info = display.runeNames[archetype];
    const cType = ARCHETYPE_TO_TYPE[archetype];
    const facts = factGenerators[archetype](world, liarId, rng, display);

    return {
      id: `rune-${i}`,
      archetype,
      name: info.name,
      headline: facts[0] ?? { type: cType, fact: 'The runes remain silent on this matter.', targetsSuspects: [] },
      secondary: facts[1] ?? { type: cType, fact: 'No further wisdom stirs.', targetsSuspects: [] },
    };
  });
}
