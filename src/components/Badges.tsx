import { Heart, MapPin } from 'lucide-react';
import type { Zone } from '../types';

interface ZoneBadgeProps {
  zone: Zone | null;
}

/** Hiển thị vị trí hiện tại của học sinh, luôn nằm ở góc trên bên trái khung game. */
export function ZoneBadge({ zone }: ZoneBadgeProps) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[calc(100%-11.5rem)] sm:left-5 sm:top-5 sm:max-w-[calc(100%-22rem)]">
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-school-950/65 px-3 py-1.5 shadow-pop backdrop-blur-md">
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${
              zone ? 'animate-ping bg-gold-300/70' : 'bg-emerald-400/50'
            }`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              zone ? 'bg-gold-300' : 'bg-emerald-400'
            }`}
          />
        </span>
        <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-300" />
        <span className="min-w-0">
          <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-school-300">
            {zone ? 'Đang ở khu vực' : 'Vị trí hiện tại'}
          </span>
          <span className="block max-w-[11rem] truncate text-[11px] font-bold leading-tight text-white sm:max-w-[16rem] sm:text-xs">
            {zone ? zone.name : 'Khuôn viên trường'}
          </span>
        </span>
      </div>
    </div>
  );
}

interface AuthorBadgeProps {
  onClick?: () => void;
}

/** Badge tác giả nhỏ gọn, đặt ở góc trên bên phải — không che D-Pad trên mobile. */
export function AuthorBadge({ onClick }: AuthorBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-school-950/65 px-2.5 py-1.5 text-white/85 shadow-pop backdrop-blur-md transition hover:bg-school-900/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 sm:right-5 sm:top-5 sm:px-3"
      title="Thông tin tác giả & hướng dẫn"
    >
      <Heart className="h-3 w-3 text-rose-300 transition group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
      <span className="text-[9px] font-semibold leading-none tracking-tight sm:text-[11px]">
        Thực hiện bởi <span className="font-extrabold text-gold-200">Mai Duy An</span>
      </span>
    </button>
  );
}
