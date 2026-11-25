import imageCompression from 'browser-image-compression';

/** Giới hạn bắt buộc: ảnh sau khi nén phải nhỏ hơn 500KB. */
export const MAX_IMAGE_BYTES = 500 * 1024;
/** Giới hạn file gốc trước khi nén. */
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File): string | null {
  const type = file.type.toLowerCase();
  const isHeicByName = /\.(heic|heif)$/i.test(file.name);
  if (!ACCEPTED_TYPES.has(type) && !isHeicByName) {
    return 'Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc HEIC.';
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return `Ảnh quá lớn (${formatBytes(file.size)}). Vui lòng chọn ảnh nhỏ hơn ${formatBytes(MAX_SOURCE_BYTES)}.`;
  }
  return null;
}

/**
 * Nén ảnh phía client xuống dưới 500KB.
 * Thử tối đa 4 lần, giảm dần kích thước & chất lượng nếu lần đầu chưa đạt.
 */
export async function compressImage(file: File): Promise<File> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const baseOptions = {
    maxSizeMB: 0.45,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.85,
    fileType: 'image/jpeg',
  } as const;

  let output = await imageCompression(file, baseOptions);

  const attempts = [
    { maxSizeMB: 0.4, maxWidthOrHeight: 1600, initialQuality: 0.78 },
    { maxSizeMB: 0.38, maxWidthOrHeight: 1400, initialQuality: 0.7 },
    { maxSizeMB: 0.35, maxWidthOrHeight: 1200, initialQuality: 0.6 },
  ];

  for (const attempt of attempts) {
    if (output.size <= MAX_IMAGE_BYTES) break;
    output = await imageCompression(output, {
      ...baseOptions,
      ...attempt,
    });
  }

  if (output.size > MAX_IMAGE_BYTES) {
    throw new Error('Không thể nén ảnh xuống dưới 500KB. Vui lòng chọn ảnh khác.');
  }

  return output;
}

export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Không đọc được file ảnh.'));
    reader.readAsDataURL(file);
  });
}
