interface Props {
  text: string;
  size?: 'sm' | 'md';
  align?: 'center' | 'right';
}

export default function HelpTip({ text, size = 'sm', align = 'center' }: Props) {
  const dim = size === 'md' ? 'w-7 h-7 text-sm' : 'w-6 h-6 text-xs';

  const tooltipPos = align === 'right'
    ? 'right-0'
    : 'left-1/2 -translate-x-1/2';

  const caretPos = align === 'right'
    ? 'right-3'
    : 'left-1/2 -translate-x-1/2';

  return (
    <span className="relative group/tip inline-flex ml-1.5 shrink-0">
      {/* The ? glyph */}
      <span
        className={`${dim} inline-flex items-center justify-center rounded-full
          border-2 border-gold/40 text-gold/70 font-body font-bold
          cursor-help select-none transition-all duration-200
          shadow-[0_0_8px_rgba(196,163,90,0.12)]
          group-hover/tip:border-gold/80 group-hover/tip:text-gold
          group-hover/tip:shadow-[0_0_16px_rgba(196,163,90,0.3)]
          group-hover/tip:bg-gold/15`}
      >
        ?
      </span>

      {/* Tooltip — instant appear on hover */}
      <span
        className={`absolute bottom-full ${tooltipPos} mb-2.5
          pointer-events-none z-50
          opacity-0 translate-y-1 scale-95
          group-hover/tip:opacity-100 group-hover/tip:translate-y-0 group-hover/tip:scale-100
          transition-all duration-150 ease-out`}
      >
        {/* Tooltip body */}
        <span
          className="block w-56 px-3.5 py-3 rounded-lg
            bg-bg-deep/95 backdrop-blur-sm
            border border-gold/25
            shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_2px_rgba(196,163,90,0.2)]
            font-body text-parchment/85 text-sm leading-relaxed text-center normal-case tracking-normal"
        >
          {text}
        </span>

        {/* Caret arrow */}
        <span
          className={`absolute top-full ${caretPos} -mt-px
            w-0 h-0
            border-l-[7px] border-l-transparent
            border-r-[7px] border-r-transparent
            border-t-[7px] border-t-gold/25`}
        />
      </span>
    </span>
  );
}
