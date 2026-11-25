/**
 * Danh sách khóa học của trường: K71 (mới nhất) -> K50 (cũ nhất).
 * Dùng chung cho form đăng kỷ niệm và bộ lọc kho ảnh.
 */
export const COHORTS: string[] = Array.from({ length: 71 - 50 + 1 }, (_, index) => `K${71 - index}`);

export const DEFAULT_COHORT = '';

export function isValidCohort(value: string): boolean {
  return COHORTS.includes(value);
}

export const COHORT_FILTER_ALL = 'ALL';
