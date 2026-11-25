import type { RawZoneFile } from '../types';
import rawZoneData from '../data/map_thptbb_zones.json';

export const MAP_WIDTH = 2752;
export const MAP_HEIGHT = 1536;

/**
 * Bật DEBUG_MODE = true để thấy khung viền các vùng tương tác
 * (và body vật lý của nhân vật) ngay trên bản đồ.
 */
export const DEBUG_MODE = false;

export const PLAYER_SPEED = 265;
export const PLAYER_SPRITE_HEIGHT = 56;
export const PLAYER_SPRITE_WIDTH = 30;
export const PLAYER_BODY_WIDTH = 20;
export const PLAYER_BODY_HEIGHT = 12;

/** Vị trí xuất phát: khoảng sân trước cổng trường (toạ độ world 2752x1536). */
export const SPAWN_POINT = { x: 1388, y: 1150 };

/** Vùng đệm quanh mỗi zone để việc "bước vào" dễ chịu hơn. */
export const ZONE_PADDING = 10;

export const ZONE_TEXTURE_KEY = 'school-map';
/** Ảnh gốc được đặt tại public/assets/map_thptbb.png */
export const MAP_ASSET_PATH = 'assets/map_thptbb.png';

const raw = rawZoneData as RawZoneFile;

/**
 * File JSON gốc mô tả toạ độ theo ảnh 1376x768.
 * Ảnh map thật là 2752x1536 (gấp đôi), nên mọi toạ độ được quy đổi tự động
 * theo tỉ lệ giữa image_dimensions trong JSON và kích thước map thật.
 */
export const MAP_SOURCE_SIZE = {
  width: raw.image_dimensions?.width || MAP_WIDTH,
  height: raw.image_dimensions?.height || MAP_HEIGHT,
};

export const MAP_SCALE = {
  x: MAP_WIDTH / MAP_SOURCE_SIZE.width,
  y: MAP_HEIGHT / MAP_SOURCE_SIZE.height,
};
