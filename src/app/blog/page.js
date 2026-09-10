import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Journal | MAPLE INFRA & INTERIORS',
  description:
    'Insights on architecture, engineering, interiors and project delivery from the MAPLE INFRA & INTERIORS team.',
};

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
  });

  const [featured, rest] = posts.length
    ? [posts.find((post) => post.featured) || posts[0], posts.filter((post) => post.id !== (posts.find((p) => p.featured) || posts[0]).id)]
    : [null, []];

  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">Journal</span>
          <h1>
            Studio <em>notes</em>
          </h1>
          <p>
            Thoughts on design, delivery and the spaces we build — from the MAPLE INFRA &amp; INTERIORS team.
          </p>
        </div>
      </header>

      <section className="section blog-section">
        <div className="dm-wrap">
          {posts.length === 0 ? (
            <p className="blog-empty">New articles are on the way. Check back soon.</p>
          ) : (
            <>
              {featured ? (
                <Link href={`/blog/${featured.slug}`} className="blog-featured reveal-up">
                  <div className="blog-featured-media">
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={featured.imageAlt || featured.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 60vw"
                        priority
                      />
                    ) : (
                      <div className="blog-featured-placeholder" />
                    )}
                  </div>
                  <div className="blog-featured-copy">
                    <span className="blog-meta">
                      {featured.featured ? 'Featured · ' : ''}
                      {formatDate(featured.publishedAt || featured.createdAt)}
                      {featured.authorName ? ` · ${featured.authorName}` : ''}
                    </span>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt || featured.content.slice(0, 180)}</p>
                    <span className="blog-read-more">Read article →</span>
                  </div>
                </Link>
              ) : null}

              {rest.length > 0 ? (
                <div className="blog-grid reveal-stagger">
                  {rest.map((post) => (
                    <Link href={`/blog/${post.slug}`} className="blog-card" key={post.id}>
                      <div className="blog-card-media">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            fill
                            sizes="(max-width: 700px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="blog-featured-placeholder" />
                        )}
                      </div>
                      <div className="blog-card-copy">
                        <span className="blog-meta">
                          {formatDate(post.publishedAt || post.createdAt)}
                          {post.authorName ? ` · ${post.authorName}` : ''}
                        </span>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt || `${post.content.slice(0, 120)}…`}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
