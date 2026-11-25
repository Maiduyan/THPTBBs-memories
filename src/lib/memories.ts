import type { Memory, NewMemory, SortOrder } from '../types';
import { isCloudinaryConfigured, isSupabaseConfigured } from './env';
import { insertDemoMemory, listDemoMemories } from './demoStore';
import { explainSupabaseError, MEMORIES_TABLE, supabase } from './supabase';
import { uploadToCloudinary } from './cloudinary';
import { fileToDataUrl } from './image';

export interface ListMemoriesParams {
  zoneId: string;
  /** null = tất cả các khóa */
  cohort: string | null;
  sort: SortOrder;
}

/**
 * Lấy danh sách kỷ niệm của một khu vực.
 * Mặc định UI gọi với sort = 'oldest' (created_at ASC) theo yêu cầu.
 */
export async function listMemories({ zoneId, cohort, sort }: ListMemoriesParams): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return listDemoMemories(zoneId, cohort, sort);
  }

  let query = supabase.from(MEMORIES_TABLE).select('*').eq('zone_id', zoneId);
  if (cohort) {
    query = query.eq('cohort', cohort);
  }

  const { data, error } = await query.order('created_at', { ascending: sort === 'oldest' });

  if (error) {
    throw new Error(explainSupabaseError(error.message));
  }

  return (data ?? []) as Memory[];
}

/** Thêm một kỷ niệm mới rồi trả về bản ghi vừa tạo. */
export async function createMemory(input: NewMemory): Promise<Memory> {
  if (!isSupabaseConfigured || !supabase) {
    return insertDemoMemory(input);
  }

  const { data, error } = await supabase.from(MEMORIES_TABLE).insert(input).select('*').single();

  if (error) {
    throw new Error(explainSupabaseError(error.message));
  }

  return data as Memory;
}

/** Upload ảnh: Cloudinary nếu đã cấu hình, ngược lại dùng data URL cho chế độ demo. */
export async function resolveImageUrl(
  compressedFile: File,
  onProgress?: (percent: number) => void,
): Promise<{ url: string; isLocalDemo: boolean }> {
  if (isCloudinaryConfigured) {
    const result = await uploadToCloudinary(compressedFile, onProgress);
    return { url: result.url, isLocalDemo: false };
  }

  const dataUrl = await fileToDataUrl(compressedFile);
  onProgress?.(100);
  return { url: dataUrl, isLocalDemo: true };
}
