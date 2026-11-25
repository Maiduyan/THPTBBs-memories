/**
 * ẢNH ĐẠI DIỆN CHO TỪNG KHU VỰC
 * -------------------------------------------------------------
 * Mặc định game dùng ảnh placeholder dạng SVG sinh bởi:
 *     npm run zones:placeholders
 *     -> public/assets/zones/<zone_id>.svg
 *
 * MUỐN THAY BẰNG ẢNH CHỤP THẬT:
 * 1. Bỏ ảnh thật vào public/assets/zones/ (vd: san_khau.jpg).
 * 2. Mở khoá dòng tương ứng bên dưới và trỏ đúng đường dẫn, ví dụ:
 *        san_khau: 'assets/zones/san_khau.jpg',
 *    (không cần dấu "/" ở đầu, hàm getZoneImage sẽ tự ghép BASE_URL)
 * 3. Khuyến nghị ảnh ngang tỉ lệ 16:7, kích thước ~1600x700px, nén < 500KB
 *    để trang tải nhanh trên điện thoại.
 *
 * Danh sách zone_id hợp lệ:
 *   san_khau, san_SH, can_tin, day_lop_hoc_toa_a, day_lop_hoc_toa_b,
 *   bang_vinh_danh_thong_bao, ban_ghe_da, cot_co, xich_du, day_chuc_nang,
 *   day_hieu_bo, hang_cay_trai, hang_cay_phai, bang_danh_nhan_trai,
 *   bang_danh_nhan_phai, san_bong_chuyen, nha_xe_hs, nha_xe_gv, cong_truong
 */
export const ZONE_IMAGE_OVERRIDES: Record<string, string> = {
  // san_khau: 'assets/zones/san_khau.jpg',
  // cong_truong: 'assets/zones/cong_truong.jpg',
};

/** Trả về URL ảnh banner của một khu vực (đã tính BASE_URL của Vite). */
export function getZoneImage(zoneId: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const custom = ZONE_IMAGE_OVERRIDES[zoneId];
  const relative = custom ? custom.replace(/^\/+/, '') : `assets/zones/${zoneId}.svg`;
  return `${base}${relative}`;
}
