import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Heart, Info, MapPin, Quote, Sparkles, X } from 'lucide-react';
import type { Memory, SortOrder, Zone } from '../types';
import { COHORT_FILTER_ALL } from '../config/cohorts';
import { formatDateTime } from '../lib/text';
import { useMemories } from '../hooks/useMemories';
import MemoryForm from './MemoryForm';
import MemoryGallery from './MemoryGallery';
import Lightbox, { type LightboxItem } from './Lightbox';

interface MemoryModalProps {
  zone: Zone;
  onClose: () => void;
}

export default function MemoryModal({ zone, onClose }: MemoryModalProps) {
  const [sort, setSort] = useState<SortOrder>('oldest');
  const [cohortFilter, setCohortFilter] = useState<string>(COHORT_FILTER_ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [bannerFailed, setBannerFailed] = useState(false);

  const activeCohort = cohortFilter === COHORT_FILTER_ALL ? null : cohortFilter;
  const { memories, loading, error, refresh, highlightId, markCreated } = useMemories(
    zone.id,
    activeCohort,
    sort,
  );

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      memories.map((memory: Memory) => ({
        src: memory.image_url,
        author: memory.author_name,
        cohort: memory.cohort,
        caption: memory.caption,
        date: formatDateTime(memory.created_at),
      })),
    [memories],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxIndex === null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, onClose]);

  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= memories.length) {
      setLightboxIndex(null);
    }
  }, [lightboxIndex, memories.length]);

  const handleCreated = (memory: Memory) => {
    // Đảm bảo kỷ niệm vừa đăng hiển thị trong danh sách hiện tại.
    setCohortFilter(COHORT_FILTER_ALL);
    markCreated(memory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-school-950/70 backdrop-blur-sm animate-fade-in"
        aria-label="Đóng sổ lưu niệm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-modal-title"
        className="relative flex h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] border border-white/30 bg-paper-100 shadow-float animate-slide-up sm:h-[92dvh] sm:rounded-[28px]"
      >
        <header className="relative z-20 flex shrink-0 items-center gap-3 border-b border-white/10 bg-gradient-to-r from-school-900 via-school-900 to-school-800 px-4 py-3 text-white sm:px-6">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/25">
            <BookOpen className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-300">
              Sổ lưu niệm khu vực
            </p>
            <h2 id="memory-modal-title" className="truncate text-sm font-extrabold sm:text-base">
              {zone.name}
            </h2>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-school-200 ring-1 ring-white/10 sm:flex">
              <MapPin className="h-3 w-3 text-gold-300" /> THPT Bắc Bình
            </span>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              aria-label="Đóng sổ lưu niệm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth">
          {/* PHẦN 1 — GIỚI THIỆU KHU VỰC */}
          <section>
            <div className="px-5 pt-5 sm:px-8">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-school-700 text-[11px] font-extrabold text-white shadow-sm">
                  1
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-school-900">
                  Giới thiệu khu vực
                </h3>
                <span className="ml-auto hidden items-center gap-1 text-[10px] font-semibold text-gold-600 sm:flex">
                  <Sparkles className="h-3 w-3" /> Điểm đến thanh xuân
                </span>
              </div>
            </div>

            <div className="relative mx-5 overflow-hidden rounded-2xl bg-school-900 shadow-pop ring-1 ring-school-900/10 sm:mx-8">
              {!bannerFailed ? (
                <img
                  src={zone.image}
                  alt={`Ảnh đại diện khu vực ${zone.name}`}
                  className="h-40 w-full object-cover sm:h-56"
                  onError={() => setBannerFailed(true)}
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-school-700 to-school-950 sm:h-56">
                  <BookOpen className="h-10 w-10 text-white/30" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-school-950 via-school-950/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5 sm:px-5 sm:pb-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-gold-200 ring-1 ring-gold-300/30 backdrop-blur">
                  <MapPin className="h-2.5 w-2.5" /> Khu vực khám phá
                </span>
                <h3 className="mt-1.5 line-clamp-2 text-xl font-extrabold leading-tight text-white drop-shadow sm:text-2xl">
                  {zone.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium italic text-white/80 sm:text-xs">
                  {zone.story.tagline}
                </p>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-8">
              <div className="space-y-3">
                {zone.story.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${zone.id}-paragraph-${index}`}
                    className="text-[13px] leading-relaxed text-slate-700 sm:text-sm"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-gold-200/80 bg-gold-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gold-700">
                  <Quote className="h-3 w-3" /> Gợi ý kỷ niệm để bạn kể
                </p>
                <ul className="mt-2 space-y-1.5">
                  {zone.story.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-[11px] leading-relaxed text-amber-900/80"
                    >
                      <Heart className="mt-0.5 h-3 w-3 shrink-0 text-rose-400" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                <span>
                  Ảnh trên là ảnh minh hoạ của khu vực. Thầy cô và các bạn có thể thay bằng ảnh chụp
                  thật trong <code className="font-semibold">public/assets/zones/</code> (xem README).
                </span>
              </p>
            </div>
          </section>

          {/* PHẦN 2 — FORM ĐĂNG KỶ NIỆM */}
          <div className="border-t border-paper-300/80">
            <MemoryForm zone={zone} onCreated={handleCreated} />
          </div>

          {/* PHẦN 3 — KHO ẢNH & BỘ LỌC */}
          <MemoryGallery
            memories={memories}
            loading={loading}
            error={error}
            sort={sort}
            cohort={cohortFilter}
            zoneName={zone.name}
            highlightId={highlightId}
            onSortChange={setSort}
            onCohortChange={setCohortFilter}
            onRetry={refresh}
            onOpenLightbox={setLightboxIndex}
          />
        </div>
      </div>

      {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
        <Lightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
