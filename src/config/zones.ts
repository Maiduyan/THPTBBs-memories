import type { RawZoneFile, Zone } from '../types';
import rawZoneData from '../data/map_thptbb_zones.json';
import { FALLBACK_STORY, ZONE_STORIES } from '../data/zoneContent';
import { getZoneImage } from './zoneImages';
import { MAP_HEIGHT, MAP_SCALE, MAP_WIDTH, ZONE_PADDING } from './game';

const raw = rawZoneData as RawZoneFile;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Quy đổi dữ liệu JSON (toạ độ theo ảnh gốc 1376x768) sang toạ độ world thật
 * của game (2752x1536) và gắn nội dung giới thiệu + ảnh đại diện cho từng zone.
 */
export const ZONES: Zone[] = raw.zones.map((zone) => {
  const x = clamp(Math.round(zone.bbox.x * MAP_SCALE.x), 0, MAP_WIDTH);
  const y = clamp(Math.round(zone.bbox.y * MAP_SCALE.y), 0, MAP_HEIGHT);
  const width = clamp(Math.round(zone.bbox.width * MAP_SCALE.x), 1, MAP_WIDTH - x);
  const height = clamp(Math.round(zone.bbox.height * MAP_SCALE.y), 1, MAP_HEIGHT - y);
  const centerX = clamp(
    Math.round((zone.center?.x ?? zone.bbox.x + zone.bbox.width / 2) * MAP_SCALE.x),
    x,
    x + width,
  );
  const centerY = clamp(
    Math.round((zone.center?.y ?? zone.bbox.y + zone.bbox.height / 2) * MAP_SCALE.y),
    y,
    y + height,
  );

  return {
    id: zone.id,
    name: zone.name.trim(),
    x,
    y,
    width,
    height,
    centerX,
    centerY,
    image: getZoneImage(zone.id),
    story: ZONE_STORIES[zone.id] ?? FALLBACK_STORY,
  };
});

export const ZONE_BY_ID: ReadonlyMap<string, Zone> = new Map(ZONES.map((zone) => [zone.id, zone]));

export const MAP_NAME = raw.map_name ?? 'Trường THPT Bắc Bình';

export function getZoneById(id: string): Zone | undefined {
  return ZONE_BY_ID.get(id);
}

/**
 * Tìm zone mà nhân vật đang đứng trong đó (dùng toạ độ "chân" nhân vật).
 * Nếu nhiều zone chồng lấn, chọn zone có tâm gần nhất để hành vi dễ đoán.
 */
export function findZoneAtPoint(x: number, y: number): Zone | null {
  let best: Zone | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const zone of ZONES) {
    const inside =
      x >= zone.x - ZONE_PADDING &&
      x <= zone.x + zone.width + ZONE_PADDING &&
      y >= zone.y - ZONE_PADDING &&
      y <= zone.y + zone.height + ZONE_PADDING;

    if (!inside) continue;

    const dx = x - zone.centerX;
    const dy = y - zone.centerY;
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = zone;
    }
  }

  return best;
}
