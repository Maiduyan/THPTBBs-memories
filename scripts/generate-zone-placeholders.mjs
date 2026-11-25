/**
 * Sinh ảnh banner placeholder (SVG) cho 19 khu vực của trường THPT Bắc Bình.
 *
 * CÁCH DÙNG:
 *   npm run zones:placeholders
 *
 * GHI CHÚ:
 *   - Đây chỉ là ảnh minh hoạ tạm thời để giao diện đẹp khi chưa có ảnh thật.
 *   - Muốn dùng ảnh chụp thật: bỏ file vào public/assets/zones/ rồi khai báo
 *     đường dẫn trong src/config/zoneImages.ts (xem hướng dẫn trong file đó).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public', 'assets', 'zones');
mkdirSync(outDir, { recursive: true });

const ZONES = [
  { id: 'san_khau', motif: 'stage' },
  { id: 'san_SH', motif: 'flag' },
  { id: 'can_tin', motif: 'cup' },
  { id: 'day_lop_hoc_toa_a', motif: 'building' },
  { id: 'day_lop_hoc_toa_b', motif: 'building' },
  { id: 'bang_vinh_danh_thong_bao', motif: 'award' },
  { id: 'ban_ghe_da', motif: 'bench' },
  { id: 'cot_co', motif: 'flag' },
  { id: 'xich_du', motif: 'swing' },
  { id: 'day_chuc_nang', motif: 'building' },
  { id: 'day_hieu_bo', motif: 'building' },
  { id: 'hang_cay_trai', motif: 'tree' },
  { id: 'hang_cay_phai', motif: 'tree' },
  { id: 'bang_danh_nhan_trai', motif: 'award' },
  { id: 'bang_danh_nhan_phai', motif: 'award' },
  { id: 'san_bong_chuyen', motif: 'ball' },
  { id: 'nha_xe_hs', motif: 'bike' },
  { id: 'nha_xe_gv', motif: 'bike' },
  { id: 'cong_truong', motif: 'gate' },
];

const PALETTES = [
  ['#1d4ed8', '#0f2059', '#5d8bfc'],
  ['#0e7490', '#083344', '#22d3ee'],
  ['#b45309', '#451a03', '#fbbf24'],
  ['#6d28d9', '#2e1065', '#a78bfa'],
  ['#be123c', '#4c0519', '#fb7185'],
  ['#15803d', '#052e16', '#4ade80'],
];

const MOTIFS = {
  building: `
    <g opacity="0.5" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round">
      <path d="M-170 130 L-170 -30 L-90 -80 L-10 -30 L-10 130 Z" />
      <path d="M10 130 L10 -10 L90 -55 L170 -10 L170 130 Z" />
      <g stroke-width="6">
        <rect x="-140" y="-5" width="34" height="34" rx="4" />
        <rect x="-86" y="-5" width="34" height="34" rx="4" />
        <rect x="-140" y="54" width="34" height="34" rx="4" />
        <rect x="-86" y="54" width="34" height="34" rx="4" />
        <rect x="40" y="20" width="34" height="34" rx="4" />
        <rect x="104" y="20" width="34" height="34" rx="4" />
        <rect x="40" y="80" width="34" height="34" rx="4" />
        <rect x="104" y="80" width="34" height="34" rx="4" />
      </g>
      <path d="M-60 130 L-60 70 L-20 70 L-20 130" />
      <path d="M62 130 L62 78 L118 78 L118 130" />
    </g>`,
  flag: `
    <g opacity="0.55" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round">
      <path d="M-30 150 L-30 -140" />
      <path d="M-30 -138 C 30 -158, 90 -118, 168 -138 L168 -48 C 92 -28, 36 -68, -30 -48 Z" fill="rgba(255,255,255,0.16)" />
      <path d="M-96 150 L36 150" />
      <path d="M-30 30 L-96 90 M-30 30 L36 90" stroke-width="5" opacity="0.6" />
    </g>`,
  book: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round">
      <path d="M-170 80 C-110 42, -46 42, 0 74 C46 42, 110 42, 170 80 L170 0 C110 -38, 46 -38, 0 -6 C-46 -38, -110 -38, -170 0 Z" fill="rgba(255,255,255,0.14)" />
      <path d="M0 -6 L0 74" />
      <path d="M-134 22 C-100 8, -62 8, -34 20 M-134 50 C-100 36, -62 36, -34 48" stroke-width="5" opacity="0.7" />
      <path d="M34 20 C62 8, 100 8, 134 22 M34 48 C62 36, 100 36, 134 50" stroke-width="5" opacity="0.7" />
    </g>`,
  cup: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-74 -74 L-64 20 C-58 62, -30 86, 0 86 C30 86, 58 62, 64 20 L74 -74 Z" fill="rgba(255,255,255,0.14)" />
      <path d="M72 -40 C118 -56, 138 -14, 116 24 C102 48, 88 54, 76 50" />
      <path d="M-86 -74 L86 -74" />
      <path d="M0 88 L0 130 M-58 130 L58 130" />
      <path d="M-30 -30 L-16 10 L22 -34" stroke-width="10" />
    </g>`,
  award: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round">
      <path d="M0 -140 L32 -80 L100 -70 L52 -22 L64 48 L0 16 L-64 48 L-52 -22 L-100 -70 L-32 -80 Z" fill="rgba(255,255,255,0.16)" />
      <path d="M-32 40 L-58 140 M32 40 L58 140" stroke-width="7" />
      <circle cx="0" cy="-46" r="26" stroke-width="6" />
    </g>`,
  bench: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-170 -20 L170 -20 L170 20 L-170 20 Z" fill="rgba(255,255,255,0.14)" />
      <path d="M-160 20 L-160 120 M160 20 L160 120 M-150 90 L150 90" />
      <path d="M-190 -60 L190 -60 L190 -34 L180 -34" stroke-width="7" opacity="0.8" />
      <path d="M-120 -96 C-120 -130, -70 -130, -70 -96 C-70 -70, -120 -70, -120 -96" stroke-width="6" opacity="0.6" />
    </g>`,
  swing: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-140 140 L-40 -120 M140 140 L40 -120 M-40 -120 L40 -120" />
      <path d="M-100 -108 L-100 60 M100 -108 L100 60" stroke-width="6" opacity="0.85" />
      <path d="M-118 60 L-82 60 L-82 82 L-118 82 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M82 60 L118 60 L118 82 L82 82 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M-180 142 L180 142" stroke-width="6" opacity="0.7" />
    </g>`,
  tree: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M0 150 L0 -30" />
      <path d="M0 20 L-60 -30 M0 0 L64 -54 M0 60 L-46 26" stroke-width="6" opacity="0.8" />
      <circle cx="0" cy="-86" r="74" fill="rgba(255,255,255,0.14)" />
      <circle cx="-72" cy="-32" r="48" fill="rgba(255,255,255,0.1)" />
      <circle cx="76" cy="-36" r="54" fill="rgba(255,255,255,0.1)" />
      <path d="M-180 152 L180 152" stroke-width="6" opacity="0.6" />
    </g>`,
  ball: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8">
      <circle cx="0" cy="0" r="118" fill="rgba(255,255,255,0.12)" />
      <path d="M-118 -20 C-40 40, 40 -40, 118 20" stroke-width="6" opacity="0.8" />
      <path d="M-108 46 C-30 -10, 30 70, 108 -46" stroke-width="6" opacity="0.6" />
      <path d="M-64 -100 C-10 -40, 20 40, 64 100" stroke-width="6" opacity="0.5" />
      <path d="M-170 150 L170 150" stroke-width="6" opacity="0.6" />
    </g>`,
  gate: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-170 150 L-170 -20 C-110 -130, 110 -130, 170 -20 L170 150" />
      <path d="M-96 150 L-96 40 C-56 -18, 56 -18, 96 40 L96 150" />
      <path d="M-170 -20 L-96 40 M170 -20 L96 40" stroke-width="6" opacity="0.7" />
      <path d="M-28 150 L-28 60 M28 150 L28 60" stroke-width="6" opacity="0.85" />
      <path d="M-40 150 L0 118 L40 150" stroke-width="6" opacity="0.85" />
      <path d="M-220 152 L220 152" stroke-width="6" opacity="0.6" />
    </g>`,
  bike: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="-84" cy="62" r="46" />
      <circle cx="84" cy="62" r="46" />
      <path d="M-84 62 L-24 -26 L44 -26 L84 62 M-24 -26 L16 62 L-84 62" stroke-width="7" />
      <path d="M-40 -50 L12 -50" stroke-width="7" />
      <path d="M44 -26 L58 -52" stroke-width="7" />
      <path d="M-150 150 L150 150" stroke-width="6" opacity="0.6" />
    </g>`,
  stage: `
    <g opacity="0.55" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-190 -120 L-190 140 L190 140 L190 -120" />
      <path d="M-190 -120 C-130 -60, -130 60, -170 130" stroke-width="6" opacity="0.8" />
      <path d="M190 -120 C130 -60, 130 60, 170 130" stroke-width="6" opacity="0.8" />
      <path d="M-150 140 L-150 20 C-150 -40, -90 -40, -90 20 L-90 140" fill="rgba(255,255,255,0.12)" />
      <path d="M-120 -60 L-120 40 M-60 -60 L-60 40" stroke-width="4" opacity="0.5" />
      <circle cx="120" cy="-30" r="22" stroke-width="5" opacity="0.7" />
      <path d="M120 -8 L120 60 M120 20 L146 40 M120 20 L94 40" stroke-width="5" opacity="0.7" />
    </g>`,
};

function makeSvg(index, motif) {
  const [c1, c2, c3] = PALETTES[index % PALETTES.length];
  const art = MOTIFS[motif] ?? MOTIFS.building;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="700" viewBox="0 0 1600 700" role="img" aria-label="Ảnh minh hoạ khu vực THPT Bắc Bình">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="55%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c3}" stop-opacity="0.9" />
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="18%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <pattern id="lines" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="64" stroke="#ffffff" stroke-opacity="0.055" stroke-width="2" />
    </pattern>
  </defs>
  <rect width="1600" height="700" fill="url(#bg)" />
  <rect width="1600" height="700" fill="url(#lines)" />
  <rect width="1600" height="700" fill="url(#glow)" />
  <circle cx="1330" cy="120" r="220" fill="#ffffff" fill-opacity="0.06" />
  <circle cx="1430" cy="250" r="320" fill="#ffffff" fill-opacity="0.04" />
  <g transform="translate(1120 370) scale(1.15)">${art}</g>
  <g font-family="'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif">
  </g>
  <rect x="0" y="672" width="1600" height="28" fill="#091536" fill-opacity="0.28" />
</svg>
`;
}

let count = 0;
for (let index = 0; index < ZONES.length; index += 1) {
  const zone = ZONES[index];
  const svg = makeSvg(index, zone.motif);
  writeFileSync(join(outDir, `${zone.id}.svg`), svg, 'utf8');
  count += 1;
}

console.log(`Đã tạo ${count} ảnh placeholder trong ${outDir}`);
