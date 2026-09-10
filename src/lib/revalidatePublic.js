import { revalidatePath } from 'next/cache';

/**
 * Bust Next.js route cache after CMS edits so the public site updates immediately.
 * Uses layout revalidation to cover list pages and nested slugs (/portfolio/foo, etc.).
 */
export function revalidatePublicSite(extraPaths = []) {
  revalidatePath('/', 'layout');

  const paths = [
    '/',
    '/about',
    '/services',
    '/portfolio',
    '/products',
    '/blog',
    '/team',
    '/contact',
    ...extraPaths,
  ];

  for (const path of paths) {
    if (path) revalidatePath(path);
  }
}
