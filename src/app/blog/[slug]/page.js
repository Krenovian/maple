import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { siteUrl } from '@/lib/catalog';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderContent(content) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: 'Journal | MAPLE INFRA & INTERIORS' };

  const title = post.metaTitle || `${post.title} | MAPLE INFRA & INTERIORS`;
  const description = post.metaDescription || post.excerpt || post.content.slice(0, 160);
  const url = `${siteUrl()}/blog/${post.slug}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: post.image ? [{ url: post.image, alt: post.imageAlt || post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await prisma.post.findMany({
    where: { published: true, slug: { not: post.slug } },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="dm-page">
      <Navbar />

      <article className="blog-article">
        <header className="blog-article-hero">
          <div className="dm-wrap blog-article-hero-inner">
            <Link href="/blog" className="blog-back">← Journal</Link>
            <span className="blog-meta">
              {formatDate(post.publishedAt || post.createdAt)}
              {post.authorName ? ` · ${post.authorName}` : ''}
            </span>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="blog-article-excerpt">{post.excerpt}</p> : null}
          </div>
          {post.image ? (
            <div className="blog-article-cover">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                priority
                sizes="100vw"
              />
            </div>
          ) : null}
        </header>

        <div className="dm-wrap">
          <div
            className="blog-article-body reveal-up"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          {related.length > 0 ? (
            <section className="blog-related">
              <h2>More from the journal</h2>
              <div className="blog-related-grid">
                {related.map((item) => (
                  <Link href={`/blog/${item.slug}`} className="blog-related-card" key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <Footer />
    </div>
  );
}
