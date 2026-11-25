export interface RawZoneBBox {
  x: number;
  y: number;
  width: number;
  height: number;
  x_max?: number;
  y_max?: number;
}

export interface RawZone {
  id: string;
  name: string;
  bbox: RawZoneBBox;
  center?: { x: number; y: number };
  normalized_1000?: {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
  };
}

export interface RawZoneFile {
  map_name?: string;
  image_dimensions: { width: number; height: number };
  total_zones?: number;
  zones: RawZone[];
}

export interface ZoneStory {
  /** Một câu giới thiệu ngắn, hiển thị dưới tên khu vực. */
  tagline: string;
  /** Các đoạn giới thiệu / kỷ niệm, hiển thị ở Phần 1 của sổ lưu niệm. */
  paragraphs: string[];
  /** Vài gợi ý kỷ niệm để người chơi có cảm hứng viết caption. */
  highlights: string[];
  /** Màu nhấn (hex) dùng cho banner, chip và hiệu ứng trên bản đồ. */
  accent: string;
}

export interface Zone {
  id: string;
  name: string;
  /** Toạ độ & kích thước thật trên ảnh map 2752x1536 (đã quy đổi). */
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  /** Đường dẫn ảnh đại diện khu vực (banner ở Phần 1 của MemoryModal). */
  image: string;
  story: ZoneStory;
}

export interface Memory {
  id: string;
  zone_id: string;
  author_name: string;
  cohort: string;
  caption: string;
  image_url: string;
  created_at: string;
}

export type NewMemory = Omit<Memory, 'id' | 'created_at'>;

export type SortOrder = 'oldest' | 'newest';

export type UploadPhase = 'idle' | 'compressing' | 'uploading' | 'saving' | 'done';
