import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene, MAIN_SCENE_KEY } from '../game/MainScene';
import { GAME_EVENT, gameEvents } from '../game/events';
import { resetVirtualInput } from '../game/inputBridge';
import { DEBUG_MODE } from '../config/game';
import type { Zone } from '../types';
import { AlertTriangle, Loader2, MapPinned } from 'lucide-react';

interface PhaserGameProps {
  inputLocked: boolean;
  onZoneEnter: (zone: Zone) => void;
  onZoneLeave: () => void;
  onInteract: (zone: Zone) => void;
  onError?: (message: string) => void;
}

/**
 * Khởi tạo Phaser 3 một lần duy nhất và gắn canvas vào container.
 * Mọi giao tiếp với React đi qua gameEvents (xem src/game/events.ts).
 */
export default function PhaserGame({
  inputLocked,
  onZoneEnter,
  onZoneLeave,
  onInteract,
  onError,
}: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MainScene | null>(null);
  const inputLockedRef = useRef(inputLocked);
  const callbacksRef = useRef({ onZoneEnter, onZoneLeave, onInteract, onError });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  inputLockedRef.current = inputLocked;
  callbacksRef.current = { onZoneEnter, onZoneLeave, onInteract, onError };

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    let disposed = false;

    const width = Math.max(parent.clientWidth, 320);
    const height = Math.max(parent.clientHeight, 320);

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      backgroundColor: '#091536',
      transparent: false,
      banner: false,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: DEBUG_MODE,
        },
      },
      render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
        powerPreference: 'high-performance',
      },
      audio: { noAudio: true },
      scene: [MainScene],
    });

    const handleReady = () => {
      if (disposed) return;
      const scene = game.scene.getScene(MAIN_SCENE_KEY) as MainScene | null;
      sceneRef.current = scene ?? null;
      scene?.setControlsEnabled(!inputLockedRef.current);
      resetVirtualInput();
      setStatus('ready');
    };

    const handleZoneEnter = (zone: Zone) => callbacksRef.current.onZoneEnter(zone);
    const handleZoneLeave = () => callbacksRef.current.onZoneLeave();
    const handleZoneInteract = (zone: Zone) => callbacksRef.current.onInteract(zone);
    const handleGameError = (message: string) => {
      if (disposed) return;
      setErrorMessage(message);
      setStatus('error');
      callbacksRef.current.onError?.(message);
    };

    gameEvents.on(GAME_EVENT.ready, handleReady);
    gameEvents.on(GAME_EVENT.zoneEnter, handleZoneEnter);
    gameEvents.on(GAME_EVENT.zoneLeave, handleZoneLeave);
    gameEvents.on(GAME_EVENT.zoneInteract, handleZoneInteract);
    gameEvents.on(GAME_EVENT.error, handleGameError);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextWidth = Math.floor(entry.contentRect.width);
      const nextHeight = Math.floor(entry.contentRect.height);
      if (nextWidth > 0 && nextHeight > 0 && game.scale) {
        game.scale.resize(nextWidth, nextHeight);
      }
    });
    resizeObserver.observe(parent);

    const handleWindowBlur = () => resetVirtualInput();
    const handleVisibility = () => {
      if (document.hidden) resetVirtualInput();
    };
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibility);

      gameEvents.off(GAME_EVENT.ready, handleReady);
      gameEvents.off(GAME_EVENT.zoneEnter, handleZoneEnter);
      gameEvents.off(GAME_EVENT.zoneLeave, handleZoneLeave);
      gameEvents.off(GAME_EVENT.zoneInteract, handleZoneInteract);
      gameEvents.off(GAME_EVENT.error, handleGameError);

      resetVirtualInput();
      sceneRef.current = null;
      game.destroy(true);
    };
    // Chỉ khởi tạo game một lần cho mỗi lần mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setControlsEnabled(!inputLocked);
    if (inputLocked) resetVirtualInput();
  }, [inputLocked]);

  return (
    <div className="absolute inset-0">
      <div
        ref={containerRef}
        className="h-full w-full touch-none select-none overflow-hidden bg-school-950 [&>canvas]:block"
        onContextMenu={(event) => event.preventDefault()}
      />

      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-school-950">
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/15">
              <MapPinned className="h-7 w-7 text-gold-300" />
              <span className="absolute inset-0 animate-ping rounded-2xl bg-gold-300/10" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Đang mở cánh cổng trường…</p>
              <p className="mt-1 flex items-center justify-center gap-2 text-xs text-school-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chuẩn bị bản đồ THPT Bắc Bình
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-school-950/95 px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-float">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white">Không tải được bản đồ</h2>
            <p className="mt-2 text-sm leading-relaxed text-school-200">
              {errorMessage || 'Có lỗi xảy ra khi khởi tạo thế giới game.'}
            </p>
            <p className="mt-3 rounded-xl bg-black/25 px-3 py-2 text-left text-[11px] leading-relaxed text-school-300">
              Kiểm tra file <code className="text-gold-300">public/assets/map_thptbb.png</code> đã tồn tại
              đúng đường dẫn, sau đó tải lại trang.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
