/**
 * Custom Next.js image loader.
 * Runtime uploads under /uploads/ are served directly (not via /_next/image),
 * because those files live outside the static build and are served by our API.
 */
export default function mapleImageLoader({ src, width, quality }) {
  const q = quality || 75;

  if (typeof src === 'string' && src.startsWith('/uploads/')) {
    return src;
  }

  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
