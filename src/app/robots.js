import { siteUrl } from '@/lib/catalog';

export default function robots() {
  const base = siteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/employee', '/login', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
