import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER,
  CLOUDINARY_UPLOAD_PRESET,
  isCloudinaryConfigured,
} from './env';

export interface CloudinaryUploadResult {
  url: string;
  publicId?: string;
}

/**
 * Upload ảnh lên Cloudinary bằng Unsigned Upload Preset qua REST API.
 * Dùng XMLHttpRequest để lấy được tiến trình upload (0-100%).
 */
export function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error('Chưa cấu hình Cloudinary. Hãy thêm VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET vào .env.'),
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/image/upload`;

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    if (CLOUDINARY_FOLDER) {
      formData.append('folder', CLOUDINARY_FOLDER);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.timeout = 90_000;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
      }
    };

    xhr.onload = () => {
      let payload: {
        secure_url?: string;
        url?: string;
        public_id?: string;
        error?: { message?: string };
      } = {};

      try {
        payload = JSON.parse(xhr.responseText || '{}');
      } catch {
        reject(new Error('Cloudinary trả về dữ liệu không hợp lệ. Vui lòng thử lại.'));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300 && (payload.secure_url || payload.url)) {
        onProgress?.(100);
        resolve({
          url: payload.secure_url || payload.url || '',
          publicId: payload.public_id,
        });
        return;
      }

      reject(new Error(payload.error?.message || `Upload ảnh thất bại (HTTP ${xhr.status}).`));
    };

    xhr.onerror = () => reject(new Error('Không thể kết nối Cloudinary. Kiểm tra mạng và thử lại.'));
    xhr.ontimeout = () => reject(new Error('Upload ảnh quá lâu. Vui lòng thử lại với ảnh nhỏ hơn.'));
    xhr.onabort = () => reject(new Error('Upload ảnh đã bị huỷ.'));

    xhr.send(formData);
  });
}
