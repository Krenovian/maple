import { isManagedUploadUrl } from '@/lib/uploadUrls';

export async function deleteRemoteImage(url) {
  if (!isManagedUploadUrl(url)) return { ok: true, skipped: true };

  const res = await fetch('/api/admin/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete uploaded image');
  return data;
}

export async function deleteRemoteImages(urls) {
  const managed = [...new Set((urls || []).filter(isManagedUploadUrl))];
  if (!managed.length) return { ok: true, deleted: [] };

  const res = await fetch('/api/admin/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls: managed }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete uploaded images');
  return data;
}

export { isUploadedImageUrl, isManagedUploadUrl } from '@/lib/uploadUrls';
