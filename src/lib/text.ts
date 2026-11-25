export const CAPTION_MIN_WORDS = 100;
export const CAPTION_MAX_WORDS = 200;
export const AUTHOR_MIN_LENGTH = 2;
export const AUTHOR_MAX_LENGTH = 60;
export const CAPTION_MAX_CHARS = 4000;

/**
 * Đếm số từ theo quy tắc: tách bằng khoảng trắng (space, tab, xuống dòng).
 * Dùng chung cho bộ đếm và bộ kiểm tra hợp lệ.
 */
export function countWords(text: string): number {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return 0;
  return normalized.split(' ').length;
}

export function isCaptionWordCountValid(wordCount: number): boolean {
  return wordCount >= CAPTION_MIN_WORDS && wordCount <= CAPTION_MAX_WORDS;
}

export function getCaptionHint(wordCount: number): string {
  if (wordCount === 0) return `Hãy viết từ ${CAPTION_MIN_WORDS} đến ${CAPTION_MAX_WORDS} từ cho câu chuyện của bạn.`;
  if (wordCount < CAPTION_MIN_WORDS) {
    const missing = CAPTION_MIN_WORDS - wordCount;
    return `Cần thêm ${missing} từ nữa để đạt mức tối thiểu ${CAPTION_MIN_WORDS} từ.`;
  }
  if (wordCount > CAPTION_MAX_WORDS) {
    const excess = wordCount - CAPTION_MAX_WORDS;
    return `Vượt quá ${excess} từ. Vui lòng rút gọn còn tối đa ${CAPTION_MAX_WORDS} từ.`;
  }
  return 'Độ dài hợp lệ. Câu chuyện của bạn đã sẵn sàng để đăng!';
}

/** Màu badge khóa học, ổn định theo từng khóa. */
const COHORT_BADGE_CLASSES = [
  'bg-school-100 text-school-800 ring-school-200',
  'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'bg-amber-100 text-amber-800 ring-amber-200',
  'bg-rose-100 text-rose-800 ring-rose-200',
  'bg-violet-100 text-violet-800 ring-violet-200',
  'bg-cyan-100 text-cyan-800 ring-cyan-200',
];

export function cohortBadgeClass(cohort: string): string {
  const number = Number.parseInt(cohort.replace(/[^0-9]/g, ''), 10);
  const index = Number.isFinite(number) ? Math.abs(number) % COHORT_BADGE_CLASSES.length : 0;
  return COHORT_BADGE_CLASSES[index];
}

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';
  return dateTimeFormatter.format(date);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return dateFormatter.format(date);
}

export function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}
