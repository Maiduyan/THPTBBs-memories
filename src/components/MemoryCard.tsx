import { useState } from 'react';
import { Clock, ImageOff, Maximize2 } from 'lucide-react';
import type { Memory } from '../types';
import { cohortBadgeClass, formatDateTime, getInitial } from '../lib/text';

interface MemoryCardProps {
  memory: Memory;
  highlighted?: boolean;
  onOpen: () => void;
}

export default function MemoryCard({ memory, highlighted = false, onOpen }: MemoryCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      id={`memory-${memory.id}`}
      className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-pop ${
        highlighted
          ? 'border-gold-400 ring-2 ring-gold-300/80 animate-pop-in'
          : 'border-paper-300'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-school-400"
        aria-label={`Xem ảnh kỷ niệm của ${memory.author_name}`}
      >
        {imageFailed ? (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 bg-paper-200 text-slate-400">
            <ImageOff className="h-6 w-6" />
            <span className="px-3 text-center text-[10px] leading-relaxed">
              Không tải được ảnh này
            </span>
          </span>
        ) : (
          <img
            src={memory.image_url}
            alt={`Kỷ niệm tại ${memory.zone_id} của ${memory.author_name}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-school-950/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 flex translate-y-1 items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-school-800 opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Maximize2 className="h-3 w-3" /> Xem ảnh
        </span>
      </button>

      <div className="p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-school-500 to-school-800 text-xs font-extrabold text-white shadow-sm">
            {getInitial(memory.author_name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-extrabold text-school-950">{memory.author_name}</p>
            <p className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="h-2.5 w-2.5" />
              {formatDateTime(memory.created_at)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ${cohortBadgeClass(memory.cohort)}`}
          >
            {memory.cohort}
          </span>
        </div>

        <p className="mt-3 whitespace-pre-line break-words text-[12.5px] leading-relaxed text-slate-700">
          {memory.caption}
        </p>
      </div>
    </article>
  );
}
