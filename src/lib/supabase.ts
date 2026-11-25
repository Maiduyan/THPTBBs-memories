import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

/**
 * Client Supabase dùng chung. Nếu chưa cấu hình .env, client sẽ là null
 * và ứng dụng tự chuyển sang chế độ demo cục bộ (xem src/lib/demoStore.ts).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export const MEMORIES_TABLE = 'memories';

/** Dịch một số lỗi Supabase thường gặp sang hướng dẫn dễ hiểu. */
export function explainSupabaseError(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes('relation') &&
    (normalized.includes('does not exist') || normalized.includes('schema cache'))
  ) {
    return 'Chưa tìm thấy bảng "memories". Hãy chạy file supabase/schema.sql trong SQL Editor của Supabase.';
  }
  if (normalized.includes('row-level security') || normalized.includes('permission denied')) {
    return 'Supabase đang chặn quyền truy cập. Hãy kiểm tra RLS: cho phép public SELECT và INSERT trên bảng "memories".';
  }
  if (normalized.includes('failed to fetch') || normalized.includes('networkerror')) {
    return 'Không kết nối được Supabase. Kiểm tra mạng và VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.';
  }
  if (normalized.includes('invalid api key') || normalized.includes('jwt')) {
    return 'Supabase Anon Key không hợp lệ. Hãy dán lại key trong file .env và khởi động lại dev server.';
  }
  return message;
}
