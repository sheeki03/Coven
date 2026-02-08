import type { GeneratedPuzzle, RegenerationLog, WorldReveal } from '../types/index.js';
import type { ThemeCoreArrays, ThemeTemplates } from '../themes/types.js';
import { mulberry32 } from '../utils/rng.js';
import { generateWorld } from './worldgen.js';
import { generateHonestClaims, generateLiarClaims, assembleSuspects } from './suspects.js';
import { generateRuneDeck } from './runes.js';
import { validateSolvability } from './validator.js';

const MAX_ATTEMPTS = 50;

function generateHintFact(
  world: import('../types/index.js').WorldModel,
  templates: ThemeTemplates,
): WorldReveal | undefined {
  const longEdges = world.edges
    .filter(e => e.bellsRequired >= 2)
    .sort((a, b) => b.bellsRequired - a.bellsRequired);

  if (longEdges.length > 1) {
    const edge = longEdges[1];
    const fromName = world.locations.find(l => l.id === edge.from)?.name ?? edge.from;
    const toName = world.locations.find(l => l.id === edge.to)?.name ?? edge.to;
    return {
      type: 'movement',
      fact: `${templates.hintPrefix} the crossing from ${fromName} to ${toName} demands ${edge.bellsRequired} bell${edge.bellsRequired === 1 ? '' : 's'}, no fewer.`,
      targetsSuspects: [],
    };
  }

  return {
    type: 'time',
    fact: `${templates.hintPrefix} ${world.anchor.description}.`,
    targetsSuspects: [],
  };
}

export function generatePuzzle(
  seed: number,
  core: ThemeCoreArrays,
  templates: ThemeTemplates,
): GeneratedPuzzle {
  const log: RegenerationLog = {
    attemptCount: 0,
    suffixUsed: 0,
    failReasons: [],
  };

  const runeDisplay = {
    runeNames: templates.runeNames,
    bellNames: templates.bellNames,
    envFactTemplate: templates.envFactTemplate,
    roadFactTemplate: templates.roadFactTemplate,
    roadFactNoShorter: templates.roadFactNoShorter,
    relicHolderDesc: templates.relicHolderDesc,
    relicLocationFact: templates.relicLocationFact,
    movementFactGate: templates.movementFactGate,
  };

  for (let suffix = 0; suffix < MAX_ATTEMPTS; suffix++) {
    log.attemptCount++;
    const rng = mulberry32(seed + suffix);

    const world = generateWorld(
      rng,
      core.locations,
      core.scents,
      core.relics,
      templates.environmentDescriptors,
      templates.bellNames,
      templates.anchorDescription,
    );
    const honestClaims = generateHonestClaims(rng, world, 5);
    const { liarClaim, contradictionTypes } = generateLiarClaims(rng, world, honestClaims, core.scents);
    const { suspects, liarId } = assembleSuspects(rng, honestClaims, liarClaim, world, core.suspectNames, core.suspectRoles);
    const runeDeck = generateRuneDeck(rng, world, liarId, runeDisplay);

    const hintFact = generateHintFact(world, templates);
    const proof = validateSolvability(suspects, runeDeck, liarId, world, hintFact);

    if (proof) {
      log.suffixUsed = suffix;
      return {
        seed: seed + suffix,
        world,
        suspects,
        runeDeck,
        liarId,
        solvabilityProof: proof,
        regenerationLog: log,
      };
    }

    log.failReasons.push(
      `Suffix ${suffix}: no valid pair — contradictions: [${[...contradictionTypes].join(', ')}]`
    );
  }

  // Fallback
  const rng = mulberry32(seed);
  const world = generateWorld(
    rng,
    core.locations,
    core.scents,
    core.relics,
    templates.environmentDescriptors,
    templates.bellNames,
    templates.anchorDescription,
  );
  const honestClaims = generateHonestClaims(rng, world, 5);
  const { liarClaim } = generateLiarClaims(rng, world, honestClaims, core.scents);
  const { suspects, liarId } = assembleSuspects(rng, honestClaims, liarClaim, world, core.suspectNames, core.suspectRoles);
  const runeDeck = generateRuneDeck(rng, world, liarId, runeDisplay);
  log.suffixUsed = 0;

  return {
    seed,
    world,
    suspects,
    runeDeck,
    liarId,
    solvabilityProof: {
      bestPair: [runeDeck[0].id, runeDeck[1].id],
      pairRankings: {},
      pairExplanations: {},
      tiePairs: [],
      hintEffect: {},
    },
    regenerationLog: log,
  };
}
