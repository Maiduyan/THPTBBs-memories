import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  CloudUpload,
  ImagePlus,
  Info,
  Loader2,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { Memory, UploadPhase, Zone } from '../types';
import { COHORTS, isValidCohort } from '../config/cohorts';
import {
  AUTHOR_MAX_LENGTH,
  AUTHOR_MIN_LENGTH,
  CAPTION_MAX_CHARS,
  CAPTION_MAX_WORDS,
  CAPTION_MIN_WORDS,
  countWords,
  getCaptionHint,
  isCaptionWordCountValid,
} from '../lib/text';
import { compressImage, formatBytes, validateImageFile } from '../lib/image';
import { createMemory, resolveImageUrl } from '../lib/memories';
import { isCloudinaryConfigured, isDemoMode } from '../lib/env';

interface MemoryFormProps {
  zone: Zone;
  onCreated: (memory: Memory) => void;
}

const inputClass =
  'w-full rounded-xl border border-paper-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-school-500 focus:ring-2 focus:ring-school-200 disabled:bg-paper-50 disabled:text-slate-400';

const PHASE_LABEL: Record<Exclude<UploadPhase, 'idle' | 'done'>, string> = {
  compressing: 'Đang nén ảnh xuống dưới 500KB…',
  uploading: 'Đang tải ảnh lên Cloudinary…',
  saving: 'Đang lưu kỷ niệm vào Supabase…',
};

export default function MemoryForm({ zone, onCreated }: MemoryFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [cohort, setCohort] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ author?: string; cohort?: string; caption?: string }>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(() => countWords(caption), [caption]);
  const captionValid = isCaptionWordCountValid(wordCount);
  const nameValid =
    authorName.trim().length >= AUTHOR_MIN_LENGTH &&
    authorName.trim().length <= AUTHOR_MAX_LENGTH &&
    /\p{L}/u.test(authorName);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 8000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setSuccessMessage(null);
    if (!selected) {
      setFile(null);
      setFileError(null);
      return;
    }
    const validationError = validateImageFile(selected);
    if (validationError) {
      setFile(null);
      setFileError(validationError);
      event.target.value = '';
      return;
    }
    setFile(selected);
    setFileError(null);
  };

  const removeFile = () => {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSuccessMessage(null);
    setSubmitError(null);

    const nextErrors: typeof errors = {};
    if (!nameValid) {
      nextErrors.author = `Vui lòng nhập tên người đăng (${AUTHOR_MIN_LENGTH}–${AUTHOR_MAX_LENGTH} ký tự, có chữ cái).`;
    }
    if (!isValidCohort(cohort)) {
      nextErrors.cohort = 'Vui lòng chọn khóa học của bạn (K50–K71).';
    }
    if (!captionValid) {
      nextErrors.caption = getCaptionHint(wordCount);
    }
    if (!file) {
      setFileError('Vui lòng chọn một ảnh kỷ niệm để đăng cùng câu chuyện.');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !file) return;

    setSubmitting(true);
    setProgress(0);

    try {
      setPhase('compressing');
      const compressed = await compressImage(file);

      setPhase('uploading');
      const uploaded = await resolveImageUrl(compressed, setProgress);

      setPhase('saving');
      const memory = await createMemory({
        zone_id: zone.id,
        author_name: authorName.trim(),
        cohort,
        caption: caption.trim(),
        image_url: uploaded.url,
      });

      setPhase('done');
      onCreated(memory);
      setCaption('');
      removeFile();
      setErrors({});
      setProgress(100);
      setSuccessMessage(
        uploaded.isLocalDemo
          ? 'Đã đăng kỷ niệm ở chế độ demo (ảnh lưu tạm trong trình duyệt này). Cấu hình Cloudinary trong .env để ảnh được lưu trữ thật.'
          : 'Kỷ niệm của bạn đã được đăng thành công. Cảm ơn bạn đã chia sẻ!',
      );
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không đăng được kỷ niệm. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
      setPhase('idle');
    }
  };

  const progressPercent =
    phase === 'uploading'
      ? Math.max(8, progress)
      : phase === 'compressing' || phase === 'saving'
        ? 55
        : 0;

  return (
    <section className="px-5 py-6 sm:px-8">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-school-700 text-xs font-extrabold text-white shadow-pop">
          2
        </span>
        <div>
          <h3 className="text-base font-extrabold text-school-950 sm:text-lg">Đăng ảnh kỷ niệm của bạn</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            Chia sẻ một tấm ảnh và câu chuyện của bạn về {zone.name} để mọi người cùng nhớ.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-paper-300 bg-white/85 p-4 shadow-inset backdrop-blur-sm sm:p-5"
      >
        {isDemoMode && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-school-100 bg-school-50 px-3 py-2.5 text-[11px] leading-relaxed text-school-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-school-500" />
            <p>
              <b>Chế độ demo:</b> chưa cấu hình Supabase nên kỷ niệm chỉ lưu tạm trong trình duyệt này.
              {!isCloudinaryConfigured && ' Ảnh cũng chỉ lưu cục bộ, chưa tải lên Cloudinary.'} Xem
              README để cấu hình.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="author-name" className="mb-1.5 block text-xs font-bold text-school-900">
              Tên người đăng <span className="text-rose-600">*</span>
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              maxLength={AUTHOR_MAX_LENGTH}
              disabled={submitting}
              onChange={(event) => {
                setAuthorName(event.target.value);
                if (errors.author) setErrors((current) => ({ ...current, author: undefined }));
              }}
              placeholder="Ví dụ: Nguyễn Minh Anh"
              className={inputClass}
              autoComplete="name"
              aria-invalid={Boolean(errors.author)}
            />
            {errors.author && (
              <p className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" /> {errors.author}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cohort" className="mb-1.5 block text-xs font-bold text-school-900">
              Khóa học <span className="text-rose-600">*</span>
            </label>
            <select
              id="cohort"
              value={cohort}
              disabled={submitting}
              onChange={(event) => {
                setCohort(event.target.value);
                if (errors.cohort) setErrors((current) => ({ ...current, cohort: undefined }));
              }}
              className={`${inputClass} ${cohort ? 'text-slate-800' : 'text-slate-400'}`}
              aria-invalid={Boolean(errors.cohort)}
            >
              <option value="">— Chọn khóa học —</option>
              {COHORTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.cohort && (
              <p className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" /> {errors.cohort}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-end justify-between gap-2">
            <label htmlFor="caption" className="block text-xs font-bold text-school-900">
              Câu chuyện / Caption <span className="text-rose-600">*</span>
            </label>
            <span className="text-[10px] font-medium text-slate-400">100–200 từ</span>
          </div>
          <textarea
            id="caption"
            value={caption}
            rows={6}
            disabled={submitting}
            maxLength={CAPTION_MAX_CHARS}
            onChange={(event) => {
              setCaption(event.target.value);
              if (errors.caption) setErrors((current) => ({ ...current, caption: undefined }));
            }}
            placeholder="Hãy kể một kỷ niệm cụ thể: hôm ấy trời thế nào, bạn đi cùng ai, điều gì khiến bạn nhớ mãi… (100–200 từ)"
            className={`${inputClass} min-h-[9rem] resize-y leading-relaxed`}
            aria-invalid={Boolean(errors.caption) || !captionValid}
            aria-describedby="caption-counter"
          />

          <div id="caption-counter" className="mt-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <p
                className={`text-[11px] font-bold ${
                  captionValid ? 'text-emerald-600' : wordCount === 0 ? 'text-slate-400' : 'text-rose-600'
                }`}
              >
                Số từ hiện tại: {wordCount} / {CAPTION_MIN_WORDS}-{CAPTION_MAX_WORDS} từ
              </p>
              <p
                className={`text-[10px] font-medium ${
                  captionValid ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {getCaptionHint(wordCount)}
              </p>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  captionValid ? 'bg-emerald-500' : wordCount > CAPTION_MAX_WORDS ? 'bg-rose-500' : 'bg-school-500'
                }`}
                style={{ width: `${Math.min(100, Math.round((wordCount / CAPTION_MAX_WORDS) * 100))}%` }}
              />
            </div>
            {errors.caption && (
              <p className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" /> {errors.caption}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-bold text-school-900">
            Ảnh kỷ niệm <span className="text-rose-600">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handleFileChange}
            className="sr-only"
            id="memory-image"
          />

          {previewUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-paper-300 bg-paper-50">
              <img
                src={previewUrl}
                alt="Ảnh xem trước trước khi đăng"
                className="h-52 w-full object-cover sm:h-60"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-school-950/85 via-school-950/45 to-transparent px-3 py-2.5">
                <p className="min-w-0 text-[11px] text-white/90">
                  <Camera className="mr-1 inline h-3 w-3" />
                  <span className="align-middle">{file?.name}</span>
                  <span className="ml-1 text-white/60">· {file ? formatBytes(file.size) : ''}</span>
                </p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="rounded-lg bg-white/15 px-2.5 py-1.5 text-[10px] font-bold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/25 disabled:opacity-50"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    disabled={submitting}
                    className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500/80 text-white ring-1 ring-white/20 transition hover:bg-rose-600 disabled:opacity-50"
                    aria-label="Xoá ảnh đã chọn"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-paper-400 bg-paper-50 px-4 py-8 text-center transition hover:border-school-400 hover:bg-school-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-school-500 shadow-sm ring-1 ring-paper-300 transition group-hover:scale-105 group-hover:text-school-700">
                <ImagePlus className="h-6 w-6" />
              </span>
              <span className="text-xs font-bold text-school-900">Chọn ảnh từ thiết bị</span>
              <span className="text-[10px] leading-relaxed text-slate-500">
                JPG, PNG, WEBP, HEIC · Tự động nén còn dưới 500KB
              </span>
            </button>
          )}
          {fileError && (
            <p className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-rose-600">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" /> {fileError}
            </p>
          )}
        </div>

        {submitting && (
          <div className="mt-4 rounded-xl border border-school-100 bg-school-50/80 p-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-school-800">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-school-600" />
              {phase !== 'idle' && phase !== 'done' ? PHASE_LABEL[phase] : 'Đang xử lý…'}
              {phase === 'uploading' && <span className="text-school-500">{progress}%</span>}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-school-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-school-500 to-gold-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {submitError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[11px] leading-relaxed text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] leading-relaxed text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500">
            <CloudUpload className="mt-0.5 h-3.5 w-3.5 shrink-0 text-school-400" />
            Ảnh được nén tự động dưới 500KB trước khi tải lên Cloudinary.
          </p>
          <button
            type="submit"
            disabled={submitting || !captionValid}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-school-600 to-school-800 px-5 py-2.5 text-sm font-bold text-white shadow-pop transition hover:from-school-700 hover:to-school-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none sm:min-w-[11rem]"
            title={!captionValid ? 'Caption cần đạt 100–200 từ để gửi' : 'Gửi kỷ niệm'}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi…
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition group-hover:translate-x-0.5" /> Gửi kỷ niệm
              </>
            )}
          </button>
        </div>

        {!captionValid && (
          <p className="mt-2 flex items-center justify-end gap-1 text-[10px] font-medium text-rose-600">
            <Sparkles className="h-3 w-3" /> Nút Gửi mở khoá khi caption đạt 100–200 từ.
          </p>
        )}
      </form>
    </section>
  );
}
