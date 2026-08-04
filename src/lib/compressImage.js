/**
 * Compress / resize an image in the browser before upload.
 * Returns a File (webp when possible, otherwise jpeg).
 */
export async function compressImageFile(file, opts = {}) {
  const maxEdge = opts.maxEdge || 1920;
  const quality = opts.quality ?? 0.82;

  if (!file || !file.type?.startsWith('image/')) return file;
  // Skip animated/gif and already-small files
  if (file.type === 'image/gif') return file;
  if (file.size < 280 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const preferWebp = typeof canvas.toBlob === 'function';
  const blob = await new Promise((resolve) => {
    if (!preferWebp) {
      resolve(null);
      return;
    }
    canvas.toBlob(
      (b) => resolve(b),
      'image/webp',
      quality
    );
  });

  const finalBlob =
    blob ||
    (await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    }));

  if (!finalBlob || finalBlob.size >= file.size) return file;

  const base = String(file.name || 'image').replace(/\.[^.]+$/, '');
  const ext = finalBlob.type === 'image/webp' ? 'webp' : 'jpg';
  return new File([finalBlob], `${base}.${ext}`, {
    type: finalBlob.type,
    lastModified: Date.now(),
  });
}
