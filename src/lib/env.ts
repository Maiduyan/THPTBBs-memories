/** Giá trị mặc định khi chưa cấu hình .env (chế độ demo cục bộ). */
const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const rawSupabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const SUPABASE_URL = rawSupabaseUrl.replace(/\/+$/, '');
export const SUPABASE_ANON_KEY = rawSupabaseKey;

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_URL.includes('your-project');

export const CLOUDINARY_CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '').trim();
export const CLOUDINARY_UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? '').trim();
/** Không bắt buộc. Chỉ đặt nếu Upload Preset của bạn cho phép truyền folder. */
export const CLOUDINARY_FOLDER = (import.meta.env.VITE_CLOUDINARY_FOLDER ?? '').trim();

export const isCloudinaryConfigured =
  CLOUDINARY_CLOUD_NAME.length > 0 &&
  CLOUDINARY_UPLOAD_PRESET.length > 0 &&
  !CLOUDINARY_CLOUD_NAME.includes('your-cloud') &&
  !CLOUDINARY_UPLOAD_PRESET.includes('your-');

/** Chế độ demo: chưa cấu hình backend nên dữ liệu lưu tạm trong trình duyệt. */
export const isDemoMode = !isSupabaseConfigured;
