import rawZoneData from '../data/map_thptbb_zones.json';
import type { RawZoneFile } from '../types';
import { MAP_SCALE } from './game';

const raw = rawZoneData as RawZoneFile;

export interface ColliderDef {
  /** Tọa độ góc trái trên trên bản đồ thế giới (sau khi quy đổi từ 1376x768 sang 2752x1536). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Ghi chú ngắn dùng cho debug (DEBUG_MODE). */
  label: string;
}

export interface ColliderGroup {
  /** Công trình/học phí: chặn toàn bộ bbox (day_lop_hoc_toa_a, can_tin, …). */
  solid: ColliderDef[];
  /** Nhà xe học sinh/giáo viên: chặn phần mái (khoảng 50% chiều cao từ y trở xuống). */
  roofs: ColliderDef[];
  /** Vật thể tự nhiên riêng: cây, tảng đá, bệ cột cờ… */
  extras: ColliderDef[];
}

/** Những khu vực được coi là nhà: chặn toàn bộ bbox của zone. */
const HALL_ZONE_IDS = [
  'day_lop_hoc_toa_a',
  'day_lop_hoc_toa_b',
  'day_chuc_nang',
  'day_hieu_bo',
  'can_tin',
  'san_khau',
  'xich_du',
  'bang_vinh_danh_thong_bao',
  'bang_danh_nhan_trai',
  'bang_danh_nhan_phai',
  'ban_ghe_da',
];

/** Nhà xe: chặn phần mái, cho phép đi bộ bên dưới gầm nhà xe. */
const BUS_STOP_ZONE_IDS = ['nha_xe_hs', 'nha_xe_gv'];

function findZone(id: string) {
  return raw.zones.find((z) => z.id === id);
}

/** Quy đổi bbox của zone sang world (scale 2x từ 1376x768 -> 2752x1536). */
function zoneWorldRect(id: string): ColliderDef | null {
  const zone = findZone(id);
  if (!zone) return null;
  return {
    x: Math.round(zone.bbox.x * MAP_SCALE.x),
    y: Math.round(zone.bbox.y * MAP_SCALE.y),
    width: Math.round(zone.bbox.width * MAP_SCALE.x),
    height: Math.round(zone.bbox.height * MAP_SCALE.y),
    label: `Khu vực ${zone.name}`,
  };
}

/** Nhà xe: collider chỉ ở phần mái — từ y trở xuống đến zone center (~50% bbox height). */
function busStopRoofRect(id: string): ColliderDef | null {
  const zone = findZone(id);
  if (!zone) return null;
  const rect = zoneWorldRect(id);
  if (!rect) return null;
  const centerY = Math.round(
    (zone.center?.y ?? zone.bbox.y + zone.bbox.height / 2) * MAP_SCALE.y,
  );
  return { ...rect, height: Math.max(8, centerY - rect.y), label: `Mái nhà xe ${zone.name}` };
}

/** Vị trí tham chiếu cho cây xanh (từ phân tích pixel của bản đồ). */
export const TREE_RECTS: ColliderDef[] = [
  { x: 673, y: 4.92, width: 36, height: 41, label: 'Cây' },
  { x: 2175, y: 4.44, width: 48, height: 37, label: 'Cây' },
  { x: 2720, y: 126.12, width: 32, height: 51, label: 'Cây' },
  { x: 1124, y: 273.12, width: 24, height: 26, label: 'Cây' },
  { x: 2221.5, y: 666.16, width: 56, height: 43, label: 'Cây' },
  { x: 2081, y: 766.56, width: 42, height: 38, label: 'Cây' },
  { x: 1491, y: 806.76, width: 37, height: 73, label: 'Cây' },
  { x: 1223, y: 806.8, width: 45, height: 65, label: 'Cây' },
  { x: 1802, y: 1068.28, width: 43, height: 44, label: 'Cây' },
  { x: 1912, y: 1163.72, width: 33, height: 31, label: 'Cây' },
  { x: 2687, y: 1210.44, width: 52, height: 62, label: 'Cây' },
  { x: 53, y: 1250.88, width: 23, height: 24, label: 'Cây' },
  { x: 2068.5, y: 1387.8, width: 56, height: 65, label: 'Cây' },
  { x: 1686.5, y: 1514, width: 56, height: 25, label: 'Cây' },
  { x: 2678, y: 1514.88, width: 56, height: 24, label: 'Cây' },
];

/** Tảng đá ở góc dưới bên phải sân bóng chuyền (tâm ước lượng world x: 1068, y: 540). */
export const ROCK_RECT: ColliderDef = { x: 1013, y: 485, width: 110, height: 110, label: 'Tảng đá' };

/** Bệ tròn của cột cờ (chặn phần bệ tròn ở giữa/dưới cột cờ). */
export const COT_CO_BASE: ColliderDef = { x: 1311, y: 704, width: 100, height: 26, label: 'Bệ cột cờ' };

/** Tổng hợp toàn bộ dữ liệu va chạm (tách theo nhóm để dễ bảo trì). */
export function buildColliders(): ColliderGroup {
  const solid = HALL_ZONE_IDS.map(zoneWorldRect).filter((d): d is ColliderDef => d !== null);
  const roofs = BUS_STOP_ZONE_IDS.map(busStopRoofRect).filter((d): d is ColliderDef => d !== null);
  const extras: ColliderDef[] = [...TREE_RECTS, ROCK_RECT, COT_CO_BASE];
  return { solid, roofs, extras };
}
