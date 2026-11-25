import { useEffect, useRef } from 'react';
import {
  ChevronDown,
  CloudOff,
  Filter,
  ImageOff,
  RefreshCw,
  SortAsc,
  SortDesc,
  Sparkles,
} from 'lucide-react';
import type { Memory, SortOrder } from '../types';
import { COHORTS, COHORT_FILTER_ALL } from '../config/cohorts';
import { isCloudinaryConfigured, isDemoMode } from '../lib/env';
import MemoryCard from './MemoryCard';

interface MemoryGalleryProps {
  memories: Memory[];
  loading: boolean;
  error: string | null;
  sort: SortOrder;
  cohort: string;
  zoneName: string;
  highlightId: string | null;
  onSortChange: (sort: SortOrder) => void;
  onCohortChange: (cohort: string) => void;
  onRetry: () => void;
  onOpenLightbox: (index: number) => void;
}

function GallerySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[0, 1].map((item) => (
        <div key={item} className="overflow-hidden rounded-2xl border border-paper-300 bg-white">
          <div className="aspect-[4/3] w-full animate-pulse bg-paper-200" />
          <div className="space-y-2 p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-paper-200" />
              <div className="h-3 w-28 animate-pulse rounded bg-paper-200" />
            </div>
            <div className="h-2.5 w-full animate-pulse rounded bg-paper-200" />
            <div className="h-2.5 w-11/12 animate-pulse rounded bg-paper-200" />
            <div className="h-2.5 w-9/12 animate-pulse rounded bg-paper-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MemoryGallery({
  memories,
  loading,
  error,
  sort,
  cohort,
  zoneName,
  highlightId,
  onSortChange,
  onCohortChange,
  onRetry,
  onOpenLightbox,
}: MemoryGalleryProps) {
  // Cuộn tới kỷ niệm vừa đăng để người dùng thấy ngay kết quả (chỉ một lần / kỷ niệm).
  const scrolledRef = useRef<string | null>(null);
  useEffect(() => {
    if (!highlightId || loading) return;
    if (scrolledRef.current === highlightId) return;
    const timer = window.setTimeout(() => {
      const element = document.getElementById(`memory-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        scrolledRef.current = highlightId;
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [highlightId, loading, memories]);

  return (
    <section className="border-t border-paper-300/80 bg-paper-50/60 px-5 py-6 sm:px-8">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 text-xs font-extrabold text-white shadow-pop">
          3
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-school-950 sm:text-lg">
            Kho ảnh kỷ niệm từ mọi người
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            Những câu chuyện được gửi gắm về {zoneName}. Mặc định sắp xếp theo thời gian đăng tăng dần.
          </p>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-school-700 ring-1 ring-paper-300">
          {loading ? '…' : `${memories.length} kỷ niệm`}
        </span>
      </div>

      {(isDemoMode || !isCloudinaryConfigured) && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-800">
          <CloudOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            {isDemoMode
              ? 'Đang ở chế độ demo: kỷ niệm và ảnh chỉ được lưu trong trình duyệt này.'
              : 'Supabase đã kết nối nhưng Cloudinary chưa cấu hình: ảnh sẽ được lưu dưới dạng dữ liệu trực tiếp.'}{' '}
            Cấu hình trong <code className="font-semibold">.env</code> để mọi người cùng xem.
          </p>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-paper-300 bg-white/80 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="cohort-filter" className="sr-only">
            Lọc theo khóa học
          </label>
          <div className="relative min-w-0 flex-1 sm:w-56">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-school-500" />
            <select
              id="cohort-filter"
              value={cohort}
              onChange={(event) => onCohortChange(event.target.value)}
              className="w-full appearance-none rounded-xl border border-paper-300 bg-white py-2 pl-9 pr-8 text-xs font-semibold text-school-900 outline-none transition focus:border-school-500 focus:ring-2 focus:ring-school-200"
            >
              <option value={COHORT_FILTER_ALL}>Tất cả các khóa</option>
              {COHORTS.map((item) => (
                <option key={item} value={item}>
                  Khóa {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-paper-300 bg-white text-school-600 transition hover:bg-school-50 disabled:opacity-50"
            aria-label="Tải lại danh sách kỷ niệm"
            title="Tải lại"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-paper-300 bg-paper-100 p-1">
          <button
            type="button"
            onClick={() => onSortChange('oldest')}
            aria-pressed={sort === 'oldest'}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left transition sm:flex-none ${
              sort === 'oldest'
                ? 'bg-white text-school-800 shadow-sm ring-1 ring-paper-300'
                : 'text-slate-500 hover:text-school-700'
            }`}
          >
            <SortAsc className="h-3.5 w-3.5 shrink-0" />
            <span>
              <span className="block text-[11px] font-bold leading-tight">Cũ nhất trước</span>
              <span className="block text-[9px] leading-tight opacity-70">Up sớm hiển thị sớm</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onSortChange('newest')}
            aria-pressed={sort === 'newest'}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left transition sm:flex-none ${
              sort === 'newest'
                ? 'bg-white text-school-800 shadow-sm ring-1 ring-paper-300'
                : 'text-slate-500 hover:text-school-700'
            }`}
          >
            <SortDesc className="h-3.5 w-3.5 shrink-0" />
            <span>
              <span className="block text-[11px] font-bold leading-tight">Mới nhất trước</span>
              <span className="block text-[9px] leading-tight opacity-70">Mới up</span>
            </span>
          </button>
        </div>
      </div>

      <p className="mb-3 text-[10px] font-medium text-slate-400">
        Đang sắp xếp: {sort === 'oldest' ? 'Cũ nhất trước (Up sớm hiển thị sớm)' : 'Mới nhất trước (Mới up)'}
        {cohort !== COHORT_FILTER_ALL && ` · Lọc: Khóa ${cohort}`}
      </p>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center">
          <p className="text-xs font-semibold leading-relaxed text-rose-700">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-rose-700"
          >
            <RefreshCw className="h-3 w-3" /> Thử lại
          </button>
        </div>
      ) : loading ? (
        <GallerySkeleton />
      ) : memories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-400 bg-white/70 px-5 py-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-paper-200 text-slate-400">
            <ImageOff className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-bold text-school-900">Chưa có kỷ niệm nào ở đây</p>
          <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-slate-500">
            {cohort !== COHORT_FILTER_ALL
              ? `Chưa có ảnh nào từ khóa ${cohort}. Thử chọn "Tất cả các khóa" hoặc là người đầu tiên chia sẻ!`
              : 'Hãy là người đầu tiên viết tiếp trang kỷ niệm của khu vực này bằng cách đăng một tấm ảnh ở phía trên.'}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-gold-600">
            <Sparkles className="h-3 w-3" /> Mỗi tấm ảnh là một mảnh ghép thanh xuân
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              highlighted={highlightId === memory.id}
              onOpen={() => onOpenLightbox(index)}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 border-t border-dashed border-paper-300 pt-4 text-[10px] text-slate-400">
        <p>
          Sổ lưu niệm <span className="font-semibold text-school-700">{zoneName}</span> · Kỷ Niệm THPT
          Bắc Bình · Thực hiện bởi <span className="font-semibold text-school-700">Mai Duy An</span>
        </p>
      </div>
    </section>
  );
}
