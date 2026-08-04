import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { parseJsonArray, parseSpecs, siteUrl } from '@/lib/catalog';
import ProductDetailClient from '@/components/shop/ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: 'Product | MAPLE INFRA & INTERIORS' };

  const title = product.metaTitle || `${product.name} | Shop | MAPLE`;
  const description =
    product.metaDescription ||
    product.description?.slice(0, 160) ||
    `${product.name} from the MAPLE shop.`;
  const url = `${siteUrl()}/products/${product.slug}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url,
      images: product.image ? [{ url: product.image, alt: product.imageAlt || product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const gallery = [product.image, ...parseJsonArray(product.images)].filter(Boolean);
  const uniqueGallery = [...new Set(gallery)];
  const specs = parseSpecs(product.specs);

  const related = await prisma.product.findMany({
    where: {
      slug: { not: product.slug },
      OR: [{ category: product.category }, { inStock: true }],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const payload = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  const relatedPayload = related.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="dm-page">
      <Navbar />
      <section className="section" style={{ paddingTop: 'clamp(5.5rem, 10vw, 7rem)' }}>
        <div className="dm-wrap">
          <ProductDetailClient
            product={payload}
            gallery={uniqueGallery}
            specs={specs}
            related={relatedPayload}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
