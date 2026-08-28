import { parseJsonArray } from '@/lib/catalog';
import { deleteUploadedImages, isManagedUploadUrl } from '@/lib/localUploads';

export { isManagedUploadUrl } from '@/lib/uploadUrls';

export function collectEntityImageUrls(entity) {
  if (!entity) return [];

  const urls = [];
  if (entity.image) urls.push(entity.image);

  const gallery = Array.isArray(entity.gallery)
    ? entity.gallery
    : parseJsonArray(entity.images);

  if (Array.isArray(gallery)) {
    urls.push(...gallery.filter(Boolean));
  }

  return [...new Set(urls.filter(Boolean))];
}

export function collectRemovedUploadUrls(beforeUrls, afterUrls) {
  const after = new Set((afterUrls || []).filter(Boolean));
  return [...new Set((beforeUrls || []).filter((url) => isManagedUploadUrl(url) && !after.has(url)))];
}

export async function deleteUploadUrls(urls) {
  return deleteUploadedImages(urls);
}
