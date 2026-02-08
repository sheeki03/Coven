import type { AnswerChip } from '../types/index.js';
import { useHighlight } from '../hooks/useHighlight.js';

interface Props {
  chips: AnswerChip[];
  suspectId: string;
}

const CHIP_STYLES: Record<AnswerChip['chipType'], string> = {
  claim: 'bg-gold/12 text-gold/85 border-gold/25',
  evasion: 'bg-amber-500/12 text-amber-400/85 border-amber-500/25',
  refusal: 'bg-crimson/12 text-crimson-bright/85 border-crimson/25',
  deflection: 'bg-iron/12 text-iron/65 border-iron/25',
};

export default function AnswerChipBar({ chips, suspectId }: Props) {
  const { highlightDispatch } = useHighlight();

  const suspectChips = chips.filter(c => c.suspectId === suspectId);
  if (suspectChips.length === 0) return null;

  const handleClick = (chip: AnswerChip) => {
    // Fire cross-highlight
    if (chip.referencedSegmentIndex != null) {
      highlightDispatch({ type: 'HOVER_SUSPECT', id: suspectId });
    }
    if (chip.referencedLocationId) {
      highlightDispatch({ type: 'SET_MAP_FILTER', filter: { type: 'node', id: chip.referencedLocationId } });
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {suspectChips.map((chip, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(chip);
          }}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-body
            border cursor-pointer transition-all hover:opacity-80
            ${CHIP_STYLES[chip.chipType]}
          `}
          title={chip.chipSummary}
        >
          <span className="max-w-[260px] truncate">{chip.chipSummary}</span>
        </button>
      ))}
    </div>
  );
}
