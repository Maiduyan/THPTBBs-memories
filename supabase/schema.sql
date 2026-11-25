-- ============================================================================
--  KỶ NIỆM THPT BẮC BÌNH — SUPABASE SCHEMA
--  Thực hiện bởi Mai Duy An
--
--  CÁCH DÙNG:
--  1. Mở Supabase Dashboard -> SQL Editor -> New query.
--  2. Dán toàn bộ nội dung file này và bấm RUN.
--  3. Kiểm tra Table Editor: bảng public.memories đã xuất hiện.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Bảng lưu metadata kỷ niệm (ảnh nằm trên Cloudinary, chỉ lưu URL)
-- ----------------------------------------------------------------------------
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  zone_id     text not null,
  author_name text not null,
  cohort      text not null,
  caption     text not null,
  image_url   text not null,
  created_at  timestamptz not null default now(),

  constraint memories_zone_id_length
    check (char_length(btrim(zone_id)) between 1 and 64),
  constraint memories_author_name_length
    check (char_length(btrim(author_name)) between 2 and 60),
  constraint memories_cohort_range
    check (cohort in (
      'K71','K70','K69','K68','K67','K66','K65','K64','K63','K62','K61',
      'K60','K59','K58','K57','K56','K55','K54','K53','K52','K51','K50'
    )),
  constraint memories_caption_length
    check (char_length(btrim(caption)) between 50 and 6000),
  constraint memories_image_url_format
    check (image_url ~* '^https?://' or image_url like 'data:image/%')
);

comment on table public.memories is
  'Kỷ niệm của học sinh theo từng khu vực trong trường THPT Bắc Bình.';
comment on column public.memories.cohort is
  'Khóa học, từ K50 (cũ nhất) đến K71 (mới nhất).';
comment on column public.memories.zone_id is
  'ID khu vực, khớp với src/data/map_thptbb_zones.json.';

-- ----------------------------------------------------------------------------
-- Index phục vụ truy vấn theo khu vực + thời gian / khóa học
-- (danh sách mặc định sắp xếp created_at ASC)
-- ----------------------------------------------------------------------------
create index if not exists memories_zone_created_idx
  on public.memories (zone_id, created_at asc);

create index if not exists memories_zone_cohort_created_idx
  on public.memories (zone_id, cohort, created_at asc);

-- ----------------------------------------------------------------------------
-- Row Level Security: chỉ cho phép đọc & thêm mới công khai.
-- KHÔNG có policy UPDATE/DELETE => dữ liệu đã đăng không thể bị sửa/xoá
-- bằng anon key.
-- ----------------------------------------------------------------------------
alter table public.memories enable row level security;

drop policy if exists "Public can read memories" on public.memories;
create policy "Public can read memories"
  on public.memories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert memories" on public.memories;
create policy "Public can insert memories"
  on public.memories
  for insert
  to anon, authenticated
  with check (true);

-- ----------------------------------------------------------------------------
-- Quyền cho các role mặc định của Supabase API
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert on table public.memories to anon, authenticated;

-- ============================================================================
-- (Tuỳ chọn) Kiểm tra nhanh sau khi chạy:
--   select * from public.memories order by created_at asc limit 20;
-- ============================================================================
