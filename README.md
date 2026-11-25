# 🎓 Kỷ Niệm THPT Bắc Bình

> Web game 2D dạo bước trong khuôn viên **THPT Bắc Bình**, khám phá từng góc nhỏ và lưu lại những kỷ niệm thanh xuân bằng ảnh cùng câu chuyện của bạn.
>
> **Thực hiện bởi Mai Duy An**

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Phaser" src="https://img.shields.io/badge/Phaser-3-fa5c28?style=flat-square&logo=phaser&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase&logoColor=white" />
  <img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-Images-3448c5?style=flat-square&logo=cloudinary&logoColor=white" />
</p>

---

## 📖 Giới thiệu

**Kỷ Niệm THPT Bắc Bình** là một web game 2D top-down. Người chơi hoá thân thành một học sinh, đi dạo quanh bản đồ pixel art của trường bằng bàn phím hoặc D-Pad ảo trên điện thoại. Khi bước vào một khu vực đặc biệt (cổng trường, sân khấu, căn tin, cột cờ, sân bóng chuyền…), một nút **“Khám phá [Tên khu vực]”** sẽ hiện lên. Bấm vào đó (hoặc nhấn `E`) để mở **Sổ lưu niệm** của khu vực.

Mỗi sổ lưu niệm gồm 3 phần:

1. **Giới thiệu khu vực** — banner, tên khu vực và câu chuyện/kỷ niệm gắn với nơi ấy.
2. **Đăng ảnh kỷ niệm** — nhập tên, chọn khóa K50–K71, viết caption **100–200 từ**, chọn ảnh (tự nén < 500KB) rồi gửi.
3. **Kho ảnh từ mọi người** — lọc theo khóa, sắp xếp cũ/mới, xem ảnh full màn hình (Lightbox).

Ứng dụng chạy tốt trên **PC** (WASD / phím mũi tên + `E`) và **mobile** (D-Pad ảo + nút chạm), sẵn sàng deploy **miễn phí lên Vercel**.

---

## ✨ Tính năng chính

- 🗺️ Bản đồ trường **2752 × 1536px**, 19 khu vực tương tác lấy trực tiếp từ `map_thptbb_zones.json`.
- 🎮 Nhân vật học sinh pixel art vẽ bằng Phaser Graphics (áo trắng, váy xanh, animation nhấp nhô khi đi).
- 🎥 Camera mượt bám theo nhân vật, tự canh zoom theo kích thước màn hình, tường bao chống đi ra ngoài bản đồ.
- 💬 Nút tương tác nổi bật + phím `E`, tự khoá điều khiển khi mở sổ lưu niệm.
- 🧱 Va chạm & vật cản: nhà công trình (day_lop_hoc_toa_a/b, day_chuc_nang, day_hieu_bo, can_tin, san_khau, …), mái nhà xe học sinh/giáo viên (nhân vật vẫn đi bộ được bên dưới gầm nhà xe), cây xanh trên sân và dọc tường rào, tảng đá ở góc dưới bên phải sân bóng chuyền, bệ cột cờ; tường rào cạnh dưới có lối đi ở phần giữa cong_truong (Cổng Trường).
- 📱 D-Pad ảo cho mobile với xử lý nhả tay an toàn (không bị “dính” hướng đi).
- 📝 Form đăng kỷ niệm có validation chặt chẽ, bộ đếm từ trực tiếp 100–200 từ.
- 🖼️ Nén ảnh phía client bằng `browser-image-compression` (< 500KB, thử nhiều mức nếu cần).
- ☁️ Upload Cloudinary qua **Unsigned Upload Preset** (REST API, có thanh tiến trình).
- 🗄️ Lưu metadata vào Supabase với RLS chỉ cho phép `SELECT` + `INSERT`.
- 🔎 Lọc theo khóa K71→K50, sắp xếp mặc định **cũ nhất trước (`created_at ASC`)**.
- 🧪 **Chế độ demo** tự động: chưa cấu hình backend vẫn chạy đầy đủ luồng đăng ảnh (lưu localStorage).
- 🏫 Ảnh minh hoạ cho từng khu vực, dễ dàng thay bằng ảnh chụp thật.
- 👤 Badge tác giả **“Thực hiện bởi Mai Duy An”** ở góc màn hình và trong Hướng dẫn.

---

## 🧰 Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Framework | React 18 + Vite 5 + TypeScript |
| Giao diện | Tailwind CSS 3 + lucide-react |
| Game engine | Phaser 3 (Arcade Physics) |
| Database | Supabase (`@supabase/supabase-js`) |
| Lưu trữ ảnh | Cloudinary (unsigned upload qua REST) |
| Nén ảnh | `browser-image-compression` |
| Deploy | Vercel (static hosting, 0đ) |

---

## 🚀 Chạy dự án

### Yêu cầu

- Node.js **18+** (khuyến nghị 20/22)
- npm 9+

### Cài đặt

```bash
npm install
npm run dev
```

Mở http://localhost:5173.

> Nếu chưa tạo `.env`, ứng dụng tự chạy ở **chế độ demo** — bạn vẫn đi dạo và đăng ảnh được, dữ liệu chỉ lưu trong trình duyệt hiện tại.

### Build production

```bash
npm run build
npm run preview
```

---

## 📁 Cấu trúc thư mục

```
.
├─ public/
│  ├─ assets/
│  │  ├─ map_thptbb.png          # Bản đồ trường 2752×1536
│  │  └─ zones/                  # 19 banner khu vực (SVG placeholder)
│  └─ favicon.svg
├─ scripts/
│  └─ generate-zone-placeholders.mjs
├─ supabase/
│  └─ schema.sql                 # SQL tạo bảng + RLS
├─ src/
│  ├─ components/
│  │  ├─ PhaserGame.tsx          # Khởi tạo game, cầu nối React ↔ Phaser
│  │  ├─ MemoryModal.tsx         # Sổ lưu niệm 3 phần
│  │  ├─ MemoryForm.tsx          # Form đăng kỷ niệm + validation
│  │  ├─ MemoryGallery.tsx       # Bộ lọc, sắp xếp, danh sách
│  │  ├─ MemoryCard.tsx          # Card ảnh kỷ niệm
│  │  ├─ Lightbox.tsx            # Xem ảnh full màn hình
│  │  ├─ HelpModal.tsx           # Hướng dẫn + thông tin tác giả
│  │  ├─ MobileControls.tsx      # D-Pad ảo
│  │  ├─ InteractPrompt.tsx      # Nút “Khám phá …”
│  │  └─ Badges.tsx              # Badge vị trí + badge tác giả
│  ├─ config/
│  │  ├─ game.ts                 # Kích thước map, tốc độ, DEBUG_MODE
│  │  ├─ zones.ts                # Parse & quy đổi toạ độ zone
│  │  ├─ zoneImages.ts           # Ánh xạ ảnh đại diện khu vực
│  │  └─ cohorts.ts              # Danh sách khóa K50–K71
│  ├─ data/
│  │  ├─ map_thptbb_zones.json   # Dữ liệu zone gốc
│  │  └─ zoneContent.ts          # Nội dung giới thiệu từng khu vực
│  ├─ game/
│  │  ├─ MainScene.ts            # Scene chính: map, nhân vật, camera
│  │  ├─ events.ts               # Event emitter giữa Phaser và React
│  │  └─ inputBridge.ts          # Trạng thái D-Pad ảo
│  ├─ hooks/useMemories.ts
│  ├─ lib/
│  │  ├─ env.ts                  # Đọc & kiểm tra biến môi trường
│  │  ├─ supabase.ts             # Supabase client
│  │  ├─ memories.ts             # API lấy/đăng kỷ niệm
│  │  ├─ cloudinary.ts           # Upload ảnh
│  │  ├─ image.ts                # Nén & kiểm tra ảnh
│  │  ├─ demoStore.ts            # Fallback localStorage
│  │  └─ text.ts                 # Đếm từ, format ngày, badge màu
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env.example
├─ supabase/schema.sql
└─ README.md
```

---

## 🗺️ Bản đồ & dữ liệu khu vực

### Kích thước & quy đổi toạ độ

- Ảnh map thật: `public/assets/map_thptbb.png` — **2752 × 1536px**.
- File `src/data/map_thptbb_zones.json` mô tả toạ độ theo ảnh gốc **1376 × 768** (`image_dimensions`).
- `src/config/zones.ts` tự tính tỉ lệ:

  ```ts
  MAP_SCALE = 2752 / 1376 = 2  (cả x và y)
  ```

  nên mọi `bbox.x/y/width/height` và `center` đều được nhân đôi khi nạp vào game. Nếu sau này thay ảnh map kích thước khác, chỉ cần cập nhật `MAP_WIDTH` / `MAP_HEIGHT` trong `src/config/game.ts` — tỉ lệ sẽ tự tính lại.

### Thêm / chỉnh khu vực

Mỗi zone trong JSON có dạng:

```json
{
  "id": "cong_truong",
  "name": "Cổng Trường (Trường THPT BB)",
  "bbox": { "x": 579, "y": 609, "width": 229, "height": 155 },
  "center": { "x": 694, "y": 686 }
}
```

Để thêm nội dung giới thiệu, mở `src/data/zoneContent.ts` và thêm entry theo `id`.
Để thêm ảnh đại diện, xem mục [Thay ảnh khu vực](#-thay-ảnh-đại-diện-khu-vực).

### DEBUG_MODE

Mở `src/config/game.ts`:

```ts
export const DEBUG_MODE = true;
```

Khi bật:

- Hiện khung đỏ + ID/tên của cả 19 zone.
- Hiện body vật lý (Arcade debug) của nhân vật và tường bao.
- Hiện HUD toạ độ `x, y`, zone hiện tại và zoom camera.

Dùng để căn chỉnh toạ độ khi thay bản đồ mới. Nhớ đặt lại `false` trước khi deploy.

---

## 🗄️ Cài đặt Supabase

1. Tạo project tại https://supabase.com (gói Free là đủ).
2. Vào **SQL Editor → New query**, dán toàn bộ nội dung [`supabase/schema.sql`](./supabase/schema.sql) và bấm **RUN**.
3. Mở **Project Settings → API**, copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Tạo file `.env` từ `.env.example` và điền hai giá trị trên.
5. Khởi động lại `npm run dev`.

### Schema bảng `memories`

| Cột | Kiểu | Ghi chú |
| --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `zone_id` | `text` | not null, khớp ID trong JSON |
| `author_name` | `text` | not null, 2–60 ký tự |
| `cohort` | `text` | not null, `K50`…`K71` |
| `caption` | `text` | not null, 50–6000 ký tự (UI chặn 100–200 từ) |
| `image_url` | `text` | not null, URL Cloudinary (hoặc data URL ở chế độ dev) |
| `created_at` | `timestamptz` | default `now()` |

### RLS

File SQL đã cấu hình:

- ✅ `SELECT` công khai cho `anon` + `authenticated`.
- ✅ `INSERT` công khai cho `anon` + `authenticated`.
- ❌ Không có policy `UPDATE` / `DELETE` → dữ liệu đã đăng không thể bị sửa/xoá bằng anon key.

> Nếu bạn từng tạo bảng trước đó, hãy chạy lại phần `drop policy if exists` + `create policy` trong file SQL để cập nhật.

---

## ☁️ Cài đặt Cloudinary (Unsigned Upload Preset)

1. Đăng ký tài khoản miễn phí tại https://cloudinary.com.
2. Vào **Settings → Upload** (hoặc **Upload presets**).
3. Bấm **Add upload preset**:
   - **Preset name**: ví dụ `thptbb_unsigned`
   - **Signing Mode**: **Unsigned** ← bắt buộc
   - (Tuỳ chọn) **Folder**: `thptbb/memories`
   - (Tuỳ chọn) Giới hạn định dạng/kích thước ảnh.
4. Lưu preset.
5. Lấy **Cloud name** ở đầu trang Dashboard.
6. Điền vào `.env`:

   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=thptbb_unsigned
   # VITE_CLOUDINARY_FOLDER=thptbb/memories   # chỉ điền nếu preset cho phép
   ```

7. Khởi động lại dev server.

**Lưu ý:**

- Đây là upload **unsigned** nên chỉ dùng cho ảnh công khai, không dùng cho tài liệu riêng tư.
- Nếu gặp lỗi *“folder parameter is not allowed”*, hãy bỏ trống `VITE_CLOUDINARY_FOLDER` hoặc cấu hình folder ngay trong preset.
- Nên bật moderation/giới hạn dung lượng trong preset nếu trang được chia sẻ rộng rãi.

---

## 🔐 Biến môi trường

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Có (để lưu thật) | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Có (để lưu thật) | Anon public key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Có (để upload thật) | Cloud name Cloudinary |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Có (để upload thật) | Tên unsigned preset |
| `VITE_CLOUDINARY_FOLDER` | Không | Folder Cloudinary (nếu preset cho phép) |

> Chỉ dùng **anon public key**. Không bao giờ đưa `service_role` key vào frontend.
> Biến `VITE_*` sẽ nằm trong bundle — hãy đảm bảo đó là key công khai/an toàn.

### Chế độ demo

Nếu thiếu cấu hình Supabase hoặc Cloudinary:

- Kỷ niệm lưu trong `localStorage` (key `thptbb:demo-memories:v1`).
- Ảnh lưu dạng data URL (nếu thiếu Cloudinary).
- Giao diện hiển thị banner nhắc rõ **“Chế độ demo”**.
- Giới hạn: dung lượng localStorage ~5MB, chỉ xem được trên đúng trình duyệt đó.

---

## 🖼️ Thay ảnh đại diện khu vực

Ảnh placeholder nằm trong `public/assets/zones/*.svg`, sinh bằng:

```bash
npm run zones:placeholders
```

Để dùng ảnh thật:

1. Đặt ảnh (tỉ lệ ~16:7, khuyến nghị 1600×700, < 500KB) vào `public/assets/zones/`.
   Ví dụ: `public/assets/zones/cong_truong.jpg`.
2. Mở `src/config/zoneImages.ts` và khai báo:

   ```ts
   export const ZONE_IMAGE_OVERRIDES: Record<string, string> = {
     cong_truong: 'assets/zones/cong_truong.jpg',
     san_khau: 'assets/zones/san_khau.jpg',
   };
   ```

3. Tải lại trang. Danh sách `zone_id` xem tại [`public/assets/zones/README.md`](./public/assets/zones/README.md).

---

## ✅ Quy tắc kiểm tra dữ liệu (Validation)

| Trường | Quy tắc |
| --- | --- |
| `author_name` | Bắt buộc, 2–60 ký tự, phải có chữ cái |
| `cohort` | Bắt buộc, thuộc `K50`–`K71` |
| `caption` | Bắt buộc, **100–200 từ** (đếm bằng khoảng trắng, gộp nhiều khoảng trắng) |
| `image` | Bắt buộc, JPG/PNG/WEBP/HEIC, ≤ 15MB trước nén |
| Sau nén | Bắt buộc **< 500KB**, giảm dần chất lượng/kích thước tối đa 4 lần |

Nút **Gửi** bị khoá khi caption chưa đạt 100–200 từ; bộ đếm chuyển màu xanh khi hợp lệ và đỏ khi chưa đạt.

---

## ☁️ Deploy lên Vercel (miễn phí)

### Cách 1 — GitHub + Vercel Dashboard

1. Đưa source code lên GitHub.
2. Vào https://vercel.com/new → **Import Git Repository**.
3. Cấu hình:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Mở **Environment Variables**, thêm các biến `VITE_*` ở trên (cho cả Production/Preview).
5. Bấm **Deploy**. Mỗi lần push code mới, Vercel tự build lại.

### Cách 2 — Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

### Lưu ý sau deploy

- Nếu đổi biến môi trường, phải **Redeploy** thì bundle mới nhận giá trị mới.
- Không commit `.env` (đã nằm trong `.gitignore`).
- Domain Vercel có HTTPS sẵn, cần thiết cho `crypto.randomUUID` và các API hiện đại khác.

---

## 🧭 Điều khiển

### PC

| Hành động | Phím |
| --- | --- |
| Di chuyển | `W` `A` `S` `D` hoặc `↑` `↓` `←` `→` |
| Mở sổ lưu niệm | `E` (hoặc `Enter`) khi đã vào khu vực |
| Đóng sổ / Lightbox | `Esc` |
| Chuyển ảnh trong Lightbox | `←` / `→` |

### Mobile

- D-Pad ảo ở góc dưới bên trái.
- Nút **“Khám phá …”** nổi lên khi bước vào khu vực đặc biệt.
- Chạm ảnh trong kho để mở Lightbox, vuốt dọc để cuộn sổ.

---

## 🧪 Kiểm tra & chất lượng mã

```bash
npm run build      # type-check + build production
npm run preview    # chạy thử bản build
```

Dự án dùng TypeScript strict, không có `any` tuỳ tiện ở lớp dữ liệu và không có `// TODO` bỏ ngỏ.

---

## 🛠️ Xử lý sự cố

| Hiện tượng | Cách khắc phục |
| --- | --- |
| Màn hình báo “Không tải được bản đồ” | Kiểm tra `public/assets/map_thptbb.png` tồn tại; chạy lại `npm run dev` |
| Nhân vật đi xuyên ra ngoài | Kiểm tra `MAP_WIDTH`/`MAP_HEIGHT` trong `src/config/game.ts` khớp ảnh map |
| Vị trí zone lệch | Bật `DEBUG_MODE = true`, so khung đỏ với bản đồ, cập nhật JSON (nhớ đúng hệ 1376×768) |
| Không thấy nút Khám phá | Đứng đúng vào khung zone; bật debug để xem vùng |
| Supabase báo `relation "memories" does not exist` | Chạy `supabase/schema.sql` trong SQL Editor |
| Supabase báo lỗi RLS / permission | Chạy lại phần policy + grant trong `supabase/schema.sql` |
| Upload Cloudinary lỗi `Upload preset not found` | Kiểm tra preset đúng tên và ở chế độ **Unsigned** |
| Upload lỗi `folder parameter is not allowed` | Bỏ `VITE_CLOUDINARY_FOLDER` hoặc cấu hình folder trong preset |
| Ảnh không hiển thị | Mở DevTools → Network kiểm tra URL Cloudinary; thử bấm “Tải lại” trong kho ảnh |
| D-Pad bị “dính” hướng | Đã xử lý reset khi nhả tay; nếu gặp, tải lại trang (sự kiện `pointercancel` đã bắt) |
| Đổi `.env` không có tác dụng | Khởi động lại `npm run dev` (Vite chỉ đọc env lúc khởi động) |

---

## 🧹 Ghi chú về asset

- File gốc ban đầu `"map thptbb.png"` đã được chuẩn hoá thành `public/assets/map_thptbb.png`.
- File `"map_thptbb_zones.json"` đã được chuyển vào `src/data/map_thptbb_zones.json`.
- Các file placeholder SVG chỉ là ảnh minh hoạ, không phải ảnh thật của trường. Hãy thay bằng ảnh chụp thật nếu có điều kiện.
- Nội dung giới thiệu trong `zoneContent.ts` là văn bản gợi mở, có thể chỉnh sửa tự do cho đúng với ký ức của từng thế hệ học sinh.

---

## 🤝 Đóng góp

Mọi đóng góp về nội dung kỷ niệm, ảnh thật của trường, hoặc cải thiện code đều được hoan nghênh. Hãy tạo Pull Request hoặc mở Issue.

---

## 👤 Tác giả

**Mai Duy An**

- Ý tưởng, phát triển và thiết kế: Mai Duy An
- Dự án phi lợi nhuận, phục vụ cộng đồng học sinh **THPT Bắc Bình**.

> “Có những nơi ta chỉ đi qua một lần, nhưng ký ức ở đó thì đi cùng ta mãi mãi.”

---

## 📄 Giấy phép

Mã nguồn phát hành theo giấy phép **MIT**. Hình ảnh bản đồ, ảnh khu vực và nội dung kỷ niệm thuộc về cộng đồng THPT Bắc Bình — vui lòng ghi nguồn khi sử dụng lại.
