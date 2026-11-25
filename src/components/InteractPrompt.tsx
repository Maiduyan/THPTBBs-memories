import { Sparkles } from 'lucide-react';
import type { Zone } from '../types';

interface InteractPromptProps {
  zone: Zone | null;
  onInteract: (zone: Zone) => void;
  disabled?: boolean;
  compact?: boolean;
}

/**
 * Nút tương tác nổi bật khi học sinh bước vào vùng đặc biệt.
 * - Desktop: góc phải dưới.
 * - Mobile dọc: phía trên cụm D-Pad.
 * - Mobile ngang (compact): góc phải dưới, thu gọn để không đè D-Pad.
 */
export default function InteractPrompt({
  zone,
  onInteract,
  disabled = false,
  compact = false,
}: InteractPromptProps) {
  if (!zone || disabled) return null;

  const wrapperClass = compact
    ? 'absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-40 w-[calc(100%-13rem)] max-w-[19rem]'
    : 'absolute bottom-[calc(14.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[22rem] -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-8 sm:w-auto sm:max-w-none sm:translate-x-0';

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        onClick={() => onInteract(zone)}
        className={`group flex w-full animate-float-soft items-center rounded-2xl border border-white/60 bg-white/95 text-left shadow-float ring-2 ring-gold-300/70 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-400 ${
          compact ? 'gap-2 px-2.5 py-2' : 'gap-3 px-3.5 py-3 sm:px-4'
        }`}
        aria-label={`Khám phá ${zone.name}`}
      >
        <span
          className={`relative grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-school-600 to-school-800 text-white shadow-pop ${
            compact ? 'h-8 w-8' : 'h-10 w-10'
          }`}
        >
          <Sparkles className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-300 ring-2 ring-white" />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block font-bold uppercase tracking-[0.18em] text-school-500 ${
              compact ? 'text-[8px]' : 'text-[9px]'
            }`}
          >
            Khu vực đặc biệt
          </span>
          <span
            className={`block line-clamp-2 font-extrabold leading-snug text-school-950 ${
              compact ? 'text-[11px]' : 'text-[13px] sm:max-w-[17rem] sm:text-sm'
            }`}
          >
            Khám phá {zone.name}
          </span>
        </span>

        {!compact && (
          <span className="hidden shrink-0 flex-col items-center gap-0.5 sm:flex">
            <kbd className="rounded-md border border-school-200 bg-school-50 px-2 py-0.5 font-mono text-[11px] font-bold text-school-700 shadow-sm">
              E
            </kbd>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">hoặc chạm</span>
          </span>
        )}
      </button>
    </div>
  );
}
