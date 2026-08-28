export const UPLOAD_URL_PREFIX = '/uploads';

export function isManagedUploadUrl(url) {
  return typeof url === 'string' && url.startsWith(`${UPLOAD_URL_PREFIX}/`);
}

export function isUploadedImageUrl(url) {
  return isManagedUploadUrl(url);
}
