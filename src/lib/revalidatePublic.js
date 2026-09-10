import { revalidatePath } from 'next/cache';

/** Bust static caches so CMS edits show on the public site immediately. */
export function revalidatePublicSite() {
  const paths = [
    '/',
    '/about',
    '/services',
    '/portfolio',
    '/products',
    '/blog',
    '/team',
    '/contact',
  ];

  for (const path of paths) {
    revalidatePath(path);
  }
}
