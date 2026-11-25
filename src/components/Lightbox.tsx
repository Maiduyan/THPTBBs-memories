import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export interface LightboxItem {
  src: string;
  author: string;
  cohort: string;
  caption: string;
  date: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const item = items[index];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'ArrowRight' && items.length > 1) {
        onChange((index + 1) % items.length);
      } else if (event.key === 'ArrowLeft' && items.length > 1) {
        onChange((index - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [index, items.length, onChange, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-school-950/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Ảnh kỷ niệm của ${item.author}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-zoom-out"
        aria-label="Đóng ảnh"
        tabIndex={-1}
      />

      <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-xs sm:text-sm">
          <ZoomIn className="h-4 w-4 shrink-0 text-gold-300" />
          <span className="truncate font-semibold">{item.author}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-gold-200 ring-1 ring-white/15">
            {item.cohort}
          </span>
          <span className="hidden shrink-0 text-school-300 sm:inline">· {item.date}</span>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 1 && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-school-200 ring-1 ring-white/10">
              {index + 1} / {items.length}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
            aria-label="Đóng ảnh"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 pb-2 sm:px-10">
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onChange((index - 1 + items.length) % items.length)}
            className="absolute left-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:left-4 sm:h-12 sm:w-12"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <img
          key={item.src}
          src={item.src}
          alt={`Ảnh kỷ niệm tại khu vực, đăng bởi ${item.author}`}
          className="max-h-full max-w-full select-none rounded-xl object-contain shadow-2xl animate-fade-in"
          draggable={false}
        />

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onChange((index + 1) % items.length)}
            className="absolute right-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:right-4 sm:h-12 sm:w-12"
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="relative z-10 shrink-0 border-t border-white/10 bg-black/30 px-4 py-3 sm:px-8">
        <p className="mx-auto max-h-[22vh] max-w-3xl overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-school-100">
          {item.caption}
        </p>
      </div>
    </div>
  );
}
