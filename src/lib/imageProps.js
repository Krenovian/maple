/** Props for next/image when the src may be a runtime upload under /uploads/. */
export function managedUploadImageProps(src) {
  if (typeof src === 'string' && src.startsWith('/uploads/')) {
    return { unoptimized: true };
  }
  return {};
}
