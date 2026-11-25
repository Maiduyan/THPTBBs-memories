import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, GraduationCap, HelpCircle, Keyboard, MapPin, Sparkles, X } from 'lucide-react';
import PhaserGame from './components/PhaserGame';
import MemoryModal from './components/MemoryModal';
import HelpModal from './components/HelpModal';
import InteractPrompt from './components/InteractPrompt';
import MobileControls from './components/MobileControls';
import { AuthorBadge, ZoneBadge } from './components/Badges';
import type { Zone } from './types';

const VISITED_KEY = 'thptbb:has-visited-v1';

export default function App() {
  const [currentZone, setCurrentZone] = useState<Zone | null>(null);
  const [openZone, setOpenZone] = useState<Zone | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const inputLocked = Boolean(openZone) || helpOpen;

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const updateTouchMode = () => {
      setIsTouch(media.matches || window.innerWidth < 900);
      // Điện thoại nằm ngang: chiều cao rất thấp nên cần bố cục gọn cho D-Pad và nút Khám phá.
      setIsCompact(window.innerWidth > window.innerHeight && window.innerHeight < 560);
    };
    updateTouchMode();
    media.addEventListener('change', updateTouchMode);
    window.addEventListener('resize', updateTouchMode);
    window.addEventListener('orientationchange', updateTouchMode);
    return () => {
      media.removeEventListener('change', updateTouchMode);
      window.removeEventListener('resize', updateTouchMode);
      window.removeEventListener('orientationchange', updateTouchMode);
    };
  }, []);

  useEffect(() => {
    let shouldShow = true;
    try {
      shouldShow = !window.localStorage.getItem(VISITED_KEY);
      window.localStorage.setItem(VISITED_KEY, '1');
    } catch {
      shouldShow = true;
    }
    if (!shouldShow) return;

    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleInteract = useCallback((zone: Zone) => {
    setOpenZone((current) => current ?? zone);
  }, []);

  const closeModal = useCallback(() => setOpenZone(null), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  const hintText = useMemo(
    () =>
      isTouch
        ? 'Dùng D-Pad để đi dạo. Khi đến gần một khu vực đặc biệt, chạm “Khám phá” để mở sổ lưu niệm.'
        : 'Dùng WASD hoặc phím mũi tên để đi dạo. Nhấn E (hoặc bấm nút Khám phá) khi bước vào khu vực đặc biệt.',
    [isTouch],
  );

  const locationLabel = currentZone ? currentZone.name : 'Khuôn viên trường';

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-school-950 font-sans text-slate-800 antialiased">
      <header className="relative z-30 flex shrink-0 items-center gap-2.5 border-b border-white/10 bg-gradient-to-r from-school-950 via-school-900 to-school-950 px-3 pb-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] sm:gap-3 sm:px-5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30 sm:h-10 sm:w-10">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-extrabold leading-tight tracking-tight text-white sm:text-lg">
            Kỷ Niệm THPT Bắc Bình
          </h1>
          <p className="hidden truncate text-[11px] text-school-300 sm:block">
            Hành trình thanh xuân · Thực hiện bởi{' '}
            <span className="font-semibold text-gold-200">Mai Duy An</span>
          </p>
        </div>

        <div className="hidden max-w-[15rem] items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-school-100 lg:flex">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-300" />
          <span className="truncate">{locationLabel}</span>
        </div>

        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 sm:px-3.5"
        >
          <HelpCircle className="h-4 w-4 text-gold-200" />
          <span className="hidden sm:inline">Hướng dẫn</span>
        </button>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <PhaserGame
          inputLocked={inputLocked}
          onZoneEnter={setCurrentZone}
          onZoneLeave={() => setCurrentZone(null)}
          onInteract={handleInteract}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-school-950/55 via-school-950/10 to-transparent" />

        <ZoneBadge zone={currentZone} />
        <AuthorBadge onClick={() => setHelpOpen(true)} />

        <InteractPrompt
          zone={currentZone}
          onInteract={handleInteract}
          disabled={inputLocked}
          compact={isTouch && isCompact}
        />

        {isTouch && <MobileControls disabled={inputLocked} compact={isCompact} />}

        {!isTouch && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-20">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-school-950/55 px-4 py-2 text-[10px] font-semibold text-school-200 shadow-pop backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <Keyboard className="h-3.5 w-3.5 text-gold-300" />
                <kbd className="kbd-dark">W</kbd>
                <kbd className="kbd-dark">A</kbd>
                <kbd className="kbd-dark">S</kbd>
                <kbd className="kbd-dark">D</kbd>
                <span className="text-school-400">/</span>
                <span className="text-school-300">↑↓←→</span>
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold-300" />
                <kbd className="kbd-dark">E</kbd> khám phá
              </span>
            </div>
          </div>
        )}

        {showHint && (
          <div className="absolute left-1/2 top-16 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 animate-slide-up sm:top-20">
            <div className="relative flex items-start gap-2.5 rounded-2xl border border-gold-300/30 bg-school-900/90 px-3.5 py-3 pr-10 text-white shadow-float backdrop-blur-md">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-400/15 text-gold-300">
                <BookOpen className="h-4 w-4" />
              </span>
              <p className="text-[11px] leading-relaxed text-school-100">
                <span className="font-bold text-gold-200">Chào mừng trở lại trường!</span> {hintText}
              </p>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-school-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Đóng gợi ý"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {openZone && (
        <MemoryModal key={openZone.id} zone={openZone} onClose={closeModal} />
      )}

      {helpOpen && <HelpModal onClose={closeHelp} />}
    </div>
  );
}
