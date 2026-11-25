import type { Memory, NewMemory, SortOrder } from '../types';

const STORAGE_KEY = 'thptbb:demo-memories:v1';

/**
 * Chế độ demo cục bộ: dùng khi chưa cấu hình Supabase/Cloudinary.
 * Kỷ niệm (kèm ảnh đã nén dạng data URL) được lưu trong localStorage
 * để bạn có thể trải nghiệm đầy đủ luồng đăng ảnh mà không cần backend.
 */

function safeParse(value: string | null): Memory[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Memory =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Memory).id === 'string' &&
        typeof (item as Memory).zone_id === 'string' &&
        typeof (item as Memory).image_url === 'string',
    );
  } catch {
    return [];
  }
}

export function readDemoMemories(): Memory[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeDemoMemories(memories: Memory[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch {
    throw new Error(
      'Bộ nhớ trình duyệt đã đầy nên không lưu được ảnh demo. Hãy xoá bớt kỷ niệm demo hoặc cấu hình Supabase + Cloudinary trong .env.',
    );
  }
}

export function listDemoMemories(
  zoneId: string,
  cohort: string | null,
  sort: SortOrder,
): Memory[] {
  return readDemoMemories()
    .filter((memory) => memory.zone_id === zoneId)
    .filter((memory) => (cohort ? memory.cohort === cohort : true))
    .sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sort === 'oldest' ? diff : -diff;
    });
}

export function insertDemoMemory(input: NewMemory): Memory {
  const memory: Memory = {
    ...input,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    created_at: new Date().toISOString(),
  };

  const memories = readDemoMemories();
  memories.push(memory);
  writeDemoMemories(memories);
  return memory;
}

export function clearDemoMemories(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function countDemoMemories(): number {
  return readDemoMemories().length;
}
