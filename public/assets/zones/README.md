# Ảnh đại diện khu vực

Thư mục này chứa **ảnh banner** hiển thị ở Phần 1 của Sổ lưu niệm.

## Hiện tại

19 file `.svg` là **ảnh minh hoạ placeholder** được sinh tự động bởi:

```bash
npm run zones:placeholders
```

Mỗi file tương ứng với một `zone_id` trong `src/data/map_thptbb_zones.json`.

## Thay bằng ảnh chụp thật

1. Chuẩn bị ảnh ngang, tỉ lệ khoảng **16:7**, kích thước khuyến nghị **1600×700px**.
2. Nén ảnh xuống **dưới 500KB** (có thể dùng [squoosh.app](https://squoosh.app)).
3. Đặt file vào thư mục này, ví dụ:

   ```
   public/assets/zones/san_khau.jpg
   public/assets/zones/cong_truong.jpg
   ```

4. Mở `src/config/zoneImages.ts` và khai báo đường dẫn:

   ```ts
   export const ZONE_IMAGE_OVERRIDES: Record<string, string> = {
     san_khau: 'assets/zones/san_khau.jpg',
     cong_truong: 'assets/zones/cong_truong.jpg',
   };
   ```

5. Tải lại trang — ảnh mới sẽ xuất hiện trong sổ lưu niệm của khu vực đó.

## Danh sách zone_id

| zone_id | Tên khu vực |
| --- | --- |
| `san_khau` | Sân khấu |
| `san_SH` | Sinh Hoạt |
| `can_tin` | Căn tin |
| `day_lop_hoc_toa_a` | Dãy lớp học Toà A |
| `day_lop_hoc_toa_b` | Dãy lớp học Toà B |
| `bang_vinh_danh_thong_bao` | Bảng vinh danh & thông báo |
| `ban_ghe_da` | Bàn ghế đá |
| `cot_co` | Cột cờ |
| `xich_du` | Xích đu |
| `day_chuc_nang` | Dãy Chức Năng |
| `day_hieu_bo` | Dãy hiệu Bộ |
| `hang_cay_trai` | Hàng cây (trái) |
| `hang_cay_phai` | Hàng cây (phải) |
| `bang_danh_nhan_trai` | Bảng danh nhân (trái) |
| `bang_danh_nhan_phai` | Bảng danh nhân (phải) |
| `san_bong_chuyen` | Sân bóng chuyền |
| `nha_xe_hs` | Nhà xe học sinh |
| `nha_xe_gv` | Nhà xe giáo viên |
| `cong_truong` | Cổng trường |

> Lưu ý: có thể giữ nguyên file SVG nếu chưa có ảnh thật — sổ lưu niệm vẫn hoạt động bình thường.
