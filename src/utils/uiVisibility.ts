export function getVisibility(drawnCount: number, phase?: string) {
  return {
    showTimeline: true,
    showSegmentChips: true,
    showSecondaryChips: phase === 'ended' || drawnCount >= 1,
    showEvidenceChips: phase === 'ended',
    showAccuse: drawnCount >= 2,
    showCompare: drawnCount >= 2,
    showFullTestimonyAccordion: true,
    showDrawPulse: drawnCount === 0,
    showExtraDrawOption: drawnCount >= 2 && drawnCount < 4,
  };
}
