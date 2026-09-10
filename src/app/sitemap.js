import prisma from '@/lib/prisma';
import { siteUrl } from '@/lib/catalog';

export default async function sitemap() {
  const base = siteUrl();
  const [projects, products, posts] = await Promise.all([
    prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes = ['', '/about', '/team', '/blog', '/services', '/portfolio', '/products', '/contact', '/privacy', '/terms'].map(
    (path) => ({
      url: `${base}${path || '/'}`,
      lastModified: new Date(),
      changeFrequency: path === '' || path === '/portfolio' || path === '/products' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : 0.7,
    })
  );

  const projectRoutes = projects.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...productRoutes, ...postRoutes];
}
