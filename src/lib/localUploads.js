import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { UPLOAD_URL_PREFIX, isManagedUploadUrl } from '@/lib/uploadUrls';

export { UPLOAD_URL_PREFIX, isManagedUploadUrl } from '@/lib/uploadUrls';

const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

export function getUploadRoot() {
  const configured = process.env.UPLOAD_ROOT?.trim();
  if (configured) return path.resolve(configured);
  return path.join(process.cwd(), 'public', 'uploads');
}

export function sanitizeUploadFolder(folder = 'maple') {
  return String(folder || 'maple')
    .replace(/[^\w/-]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\/+|\/+$/g, '') || 'maple';
}

export function getUploadAbsolutePath(url) {
  if (!isManagedUploadUrl(url)) return null;

  const relative = url.slice(UPLOAD_URL_PREFIX.length).replace(/^\/+/, '');
  const uploadsRoot = path.resolve(getUploadRoot());
  const absolute = path.resolve(uploadsRoot, relative);

  if (absolute !== uploadsRoot && !absolute.startsWith(`${uploadsRoot}${path.sep}`)) {
    return null;
  }
  return absolute;
}

export async function saveUploadedImage({ bytes, mimeType, folder = 'maple' }) {
  const ext = MIME_EXT[mimeType];
  if (!ext) {
    throw new Error('Unsupported image type');
  }

  const safeFolder = sanitizeUploadFolder(folder);
  const dir = path.join(getUploadRoot(), safeFolder);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
  const absolutePath = path.join(dir, filename);
  await writeFile(absolutePath, bytes);

  const url = `${UPLOAD_URL_PREFIX}/${safeFolder}/${filename}`;
  return { url, filename, bytes: bytes.length };
}

export async function deleteUploadedImage(url) {
  const absolutePath = getUploadAbsolutePath(url);
  if (!absolutePath) {
    return { deleted: false, skipped: true };
  }

  try {
    await unlink(absolutePath);
    return { deleted: true, skipped: false };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { deleted: true, skipped: false };
    }
    throw err;
  }
}

export async function deleteUploadedImages(urls) {
  const unique = [...new Set((urls || []).filter(isManagedUploadUrl))];
  const deleted = [];
  const skipped = [];
  const errors = [];

  for (const url of unique) {
    try {
      const result = await deleteUploadedImage(url);
      if (result.deleted) deleted.push(url);
      else skipped.push(url);
    } catch (err) {
      errors.push(`${url}: ${err.message || 'delete failed'}`);
    }
  }

  return { deleted, skipped, errors };
}
