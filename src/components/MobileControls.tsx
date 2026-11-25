import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Move } from 'lucide-react';
import {
  resetVirtualInput,
  setVirtualDirection,
  type VirtualDirection,
} from '../game/inputBridge';

interface MobileControlsProps {
  disabled?: boolean;
  compact?: boolean;
}

const DIRECTIONS: Array<{
  direction: VirtualDirection;
  label: string;
  icon: React.ReactNode;
  className: string;
}> = [
  {
    direction: 'up',
    label: 'Đi lên',
    icon: <ChevronUp className="h-6 w-6" />,
    className: 'col-start-2 row-start-1',
  },
  {
    direction: 'left',
    label: 'Đi sang trái',
    icon: <ChevronLeft className="h-6 w-6" />,
    className: 'col-start-1 row-start-2',
  },
  {
    direction: 'right',
    label: 'Đi sang phải',
    icon: <ChevronRight className="h-6 w-6" />,
    className: 'col-start-3 row-start-2',
  },
  {
    direction: 'down',
    label: 'Đi xuống',
    icon: <ChevronDown className="h-6 w-6" />,
    className: 'col-start-2 row-start-3',
  },
];

/**
 * Cụm D-Pad ảo cho mobile. Ghi trực tiếp vào inputBridge (không re-render mỗi frame).
 * Có reset toàn cục khi nhả tay ra ngoài nút để tránh nhân vật "dính" hướng đi.
 */
export default function MobileControls({ disabled = false, compact = false }: MobileControlsProps) {
  const [pressed, setPressed] = useState<VirtualDirection | null>(null);

  useEffect(() => {
    const clear = () => {
      resetVirtualInput();
      setPressed(null);
    };
    window.addEventListener('pointerup', clear);
    window.addEventListener('pointercancel', clear);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('pointerup', clear);
      window.removeEventListener('pointercancel', clear);
      window.removeEventListener('blur', clear);
      clear();
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      resetVirtualInput();
      setPressed(null);
    }
  }, [disabled]);

  const press = (direction: VirtualDirection) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (disabled) return;
    setVirtualDirection(direction, true);
    setPressed(direction);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Một số trình duyệt cũ không hỗ trợ pointer capture — bỏ qua.
    }
  };

  const release = (direction: VirtualDirection) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setVirtualDirection(direction, false);
    setPressed((current) => (current === direction ? null : current));
  };

  return (
    <div
      className={`absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] left-3 z-30 select-none touch-none transition-opacity sm:left-5 ${
        disabled ? 'pointer-events-none opacity-40' : 'opacity-100'
      }`}
      role="group"
      aria-label="Điều khiển di chuyển nhân vật"
    >
      <div
        className={`relative rounded-[26px] border border-white/15 bg-school-950/45 shadow-float backdrop-blur-md ${
          compact ? 'p-1.5' : 'p-2'
        }`}
      >
        <div className={`grid grid-cols-3 grid-rows-3 ${compact ? 'gap-1' : 'gap-1.5'}`}>
          {DIRECTIONS.map(({ direction, label, icon, className }) => (
            <button
              key={direction}
              type="button"
              aria-label={label}
              onPointerDown={press(direction)}
              onPointerUp={release(direction)}
              onPointerCancel={release(direction)}
              onPointerLeave={release(direction)}
              onContextMenu={(event) => event.preventDefault()}
              className={`${className} grid place-items-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-inner transition active:scale-95 active:border-gold-300/60 active:bg-school-500/80 ${
                pressed === direction ? 'scale-95 border-gold-300/60 bg-school-500/80' : ''
              }`}
              style={{ height: compact ? '2.5rem' : '3rem', width: compact ? '2.5rem' : '3rem' }}
            >
              {icon}
            </button>
          ))}

          <div className="col-start-2 row-start-2 grid place-items-center">
            <span
              className={`grid place-items-center rounded-full border border-white/15 bg-white/5 text-white/50 ${
                compact ? 'h-7 w-7' : 'h-9 w-9'
              }`}
            >
              <Move className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            </span>
          </div>
        </div>

        {!compact && (
          <p className="mt-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Di chuyển
          </p>
        )}
      </div>
    </div>
  );
}
