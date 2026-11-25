import { useEffect } from 'react';
import {
  ArrowRight,
  Cloud,
  Database,
  Gamepad2,
  GraduationCap,
  Heart,
  ImagePlus,
  Keyboard,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { isCloudinaryConfigured, isDemoMode, isSupabaseConfigured } from '../lib/env';

interface HelpModalProps {
  onClose: () => void;
}

function StatusRow({
  ok,
  icon,
  label,
  detail,
}: {
  ok: boolean;
  icon: React.ReactNode;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-paper-300/80 bg-white/70 p-3">
      <span
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-bold text-school-900">
          {label}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {ok ? 'Đã cấu hình' : 'Chưa cấu hình'}
          </span>
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

export default function HelpModal({ onClose }: HelpModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-school-950/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-label="Đóng hướng dẫn"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-white/50 bg-paper-100 shadow-float animate-slide-up sm:rounded-[28px]"
      >
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-school-800 via-school-900 to-school-950 px-5 pb-5 pt-5 text-white sm:px-6">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gold-400/20 blur-2xl" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-300/30">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                  Hướng dẫn
                </p>
                <h2 id="help-title" className="text-lg font-extrabold leading-tight">
                  Kỷ Niệm THPT Bắc Bình
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <Heart className="h-4 w-4 shrink-0 text-rose-300" />
            <p className="text-xs text-school-100">
              Thực hiện bởi <span className="font-bold text-white">Mai Duy An</span> — gửi gắm một góc
              thanh xuân của mái trường THPT Bắc Bình.
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-school-900">
              <Sparkles className="h-4 w-4 text-gold-500" /> Cách khám phá
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-paper-300 bg-white/70 p-3">
                <p className="flex items-center gap-2 text-xs font-bold text-school-800">
                  <Keyboard className="h-4 w-4" /> Trên máy tính
                </p>
                <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-slate-600">
                  <li>
                    Di chuyển: <kbd className="kbd">W</kbd> <kbd className="kbd">A</kbd>{' '}
                    <kbd className="kbd">S</kbd> <kbd className="kbd">D</kbd> hoặc phím mũi tên.
                  </li>
                  <li>
                    Tương tác: nhấn <kbd className="kbd">E</kbd> hoặc bấm nút “Khám phá”.
                  </li>
                  <li>Nhấn nút Hướng dẫn bất cứ lúc nào để mở lại bảng này.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-paper-300 bg-white/70 p-3">
                <p className="flex items-center gap-2 text-xs font-bold text-school-800">
                  <Smartphone className="h-4 w-4" /> Trên điện thoại
                </p>
                <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-slate-600">
                  <li>Dùng cụm D-Pad ở góc dưới bên trái để di chuyển.</li>
                  <li>Chạm nút “Khám phá…” ở phía trên D-Pad khi nó xuất hiện.</li>
                  <li>Kéo dọc trong sổ lưu niệm để xem ảnh và câu chuyện.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-school-900">
              <ImagePlus className="h-4 w-4 text-school-600" /> Đăng một kỷ niệm
            </h3>
            <ol className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="step-index">1</span>
                Bước đến khu vực muốn lưu giữ, bấm “Khám phá” để mở sổ lưu niệm.
              </li>
              <li className="flex gap-2">
                <span className="step-index">2</span>
                Nhập tên, chọn khóa học K50–K71 và viết caption từ <b>100 đến 200 từ</b>.
              </li>
              <li className="flex gap-2">
                <span className="step-index">3</span>
                Chọn một tấm ảnh. Ảnh được nén tự động xuống dưới 500KB trước khi tải lên.
              </li>
              <li className="flex gap-2">
                <span className="step-index">4</span>
                Bấm Gửi và xem kỷ niệm của bạn xuất hiện trong kho ảnh bên dưới.
              </li>
            </ol>
          </section>

          <section className="mt-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-school-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Trạng thái kết nối
            </h3>
            <div className="mt-3 space-y-2">
              <StatusRow
                ok={isSupabaseConfigured}
                icon={<Database className="h-4 w-4" />}
                label="Supabase"
                detail={
                  isDemoMode
                    ? 'Chưa cấu hình nên kỷ niệm chỉ lưu tạm trong trình duyệt của bạn. Xem README để tạo bảng memories.'
                    : 'Đã kết nối Supabase — kỷ niệm được lưu và chia sẻ tới mọi người.'
                }
              />
              <StatusRow
                ok={isCloudinaryConfigured}
                icon={<Cloud className="h-4 w-4" />}
                label="Cloudinary"
                detail={
                  isCloudinaryConfigured
                    ? 'Ảnh được tải lên Cloudinary với unsigned upload preset.'
                    : 'Chưa cấu hình Cloudinary. Ở chế độ demo, ảnh được lưu dạng dữ liệu trong trình duyệt.'
                }
              />
            </div>
          </section>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-school-50 p-3 text-[11px] leading-relaxed text-school-800 ring-1 ring-school-100">
            <Gamepad2 className="mt-0.5 h-4 w-4 shrink-0 text-school-600" />
            <p>
              Mẹo nhỏ: ảnh đại diện của mỗi khu vực hiện là ảnh minh hoạ. Thầy cô và các bạn có thể
              thay bằng ảnh chụp thật tại <code className="font-semibold">public/assets/zones/</code>{' '}
              (hướng dẫn trong README và file zoneImages.ts).
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-paper-300 bg-paper-100/90 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-school-700 px-4 py-3 text-sm font-bold text-white shadow-pop transition hover:bg-school-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-400 focus-visible:ring-offset-2"
          >
            Bắt đầu khám phá <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
