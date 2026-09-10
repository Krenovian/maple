/**
 * Custom Next.js image loader.
 * Local paths (/images/*, /uploads/*) are served directly — not via /_next/image.
 * Runtime uploads are outside the static build; the optimizer cannot read them.
 * Remote URLs still use the built-in optimizer.
 */
export default function mapleImageLoader({ src, width, quality }) {
  if (typeof src === 'string' && src.startsWith('/')) {
    return src;
  }

  const q = quality || 75;
  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  return src;
}
