import { mkdir, stat, unlink, writeFile } from 'fs/promises';
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

/** Where new uploads are always written (inside the project). */
export function getUploadRoot() {
  return path.join(process.cwd(), 'public', 'uploads');
}

/** All folders checked when serving or deleting an existing upload. */
export function getUploadSearchRoots() {
  const roots = [getUploadRoot()];
  const configured = process.env.UPLOAD_ROOT?.trim();
  if (configured) {
    const resolved = path.resolve(configured);
    if (!roots.includes(resolved)) roots.push(resolved);
  }
  return roots;
}

export function sanitizeUploadFolder(folder = 'maple') {
  return String(folder || 'maple')
    .replace(/[^\w/-]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\/+|\/+$/g, '') || 'maple';
}

function resolveRelativeUploadPath(url) {
  if (!isManagedUploadUrl(url)) return null;
  return url.slice(UPLOAD_URL_PREFIX.length).replace(/^\/+/, '');
}

function absoluteForRoot(root, relative) {
  const uploadsRoot = path.resolve(root);
  const absolute = path.resolve(uploadsRoot, relative);
  if (absolute === uploadsRoot) return null;
  if (!absolute.startsWith(`${uploadsRoot}${path.sep}`)) return null;
  return absolute;
}

export function getUploadAbsolutePath(url) {
  const relative = resolveRelativeUploadPath(url);
  if (!relative) return null;
  return absoluteForRoot(getUploadRoot(), relative);
}

export async function resolveExistingUploadPath(url) {
  const relative = resolveRelativeUploadPath(url);
  if (!relative) return null;

  for (const root of getUploadSearchRoots()) {
    const absolute = absoluteForRoot(root, relative);
    if (!absolute) continue;
    try {
      const fileStat = await stat(absolute);
      if (fileStat.isFile()) return absolute;
    } catch {
      /* try next root */
    }
  }

  return null;
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
  return { url, filename, bytes: bytes.length, absolutePath };
}

export async function deleteUploadedImage(url) {
  const absolutePath = await resolveExistingUploadPath(url);
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
