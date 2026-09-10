import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { siteUrl } from '@/lib/catalog';
import { SERVICE_INTEGRATED } from '@/lib/services';

function parseGallery(project) {
  const extras = [];
  if (project.images) {
    try {
      const parsed = JSON.parse(project.images);
      if (Array.isArray(parsed)) extras.push(...parsed.filter(Boolean));
    } catch {
      /* ignore bad JSON */
    }
  }

  const primary = [project.image, ...extras].filter(Boolean);
  const unique = [...new Set(primary)];

  // Only pad with local placeholders when the project has no real gallery yet
  if (unique.length >= 2) return unique;

  const fallbacks = ['/images/hero.png', '/images/interior.png', '/images/bedroom.png', '/images/pool.png'];
  return [...new Set([...unique, ...fallbacks.filter((src) => src !== project.image)])].slice(0, 4);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: 'Project | MAPLE INFRA & INTERIORS' };

  const title = project.metaTitle || `${project.title} | MAPLE INFRA & INTERIORS`;
  const description = project.metaDescription || project.description;
  const url = `${siteUrl()}/portfolio/${project.slug}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url,
      images: project.image
        ? [{ url: project.image, alt: project.imageAlt || project.title }]
        : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  const gallery = parseGallery(project);

  const related = await prisma.project.findMany({
    where: {
      slug: { not: project.slug },
      OR: [{ category: project.category }, { featured: true }],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const facts = [
    { label: 'Typology', value: project.category },
    { label: 'Location', value: project.location },
    project.year && { label: 'Year', value: project.year },
    project.area && { label: 'Area', value: project.area },
    project.status && { label: 'Status', value: project.status },
  ].filter(Boolean);

  return (
    <div className="dm-page">
      <Navbar />

      <header className="pd-hero">
        <div className="pd-hero-media">
          <Image
            src={project.image}
            alt={project.imageAlt || project.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="pd-hero-veil" />
        <div className="dm-wrap pd-hero-inner">
          <Link href="/portfolio" className="pd-back">
            ← All projects
          </Link>
          <span className="dm-page-kicker">{project.category}</span>
          <h1>{project.title}</h1>
          <p className="pd-hero-loc">
            {project.location}
            {project.year ? ` · ${project.year}` : ''}
          </p>
        </div>
      </header>

      <section className="section pd-overview">
        <div className="dm-wrap pd-overview-grid">
          <div className="pd-overview-copy reveal-left">
            <span className="dm-page-kicker">Overview</span>
            <h2 className="reveal-blur">Project brief</h2>
            <p>{project.description}</p>
            <p className="pd-overview-extra">
              Delivered by MAPLE INFRA &amp; INTERIORS — integrated capability across
              {SERVICE_INTEGRATED}. Based in
              Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru and Qatar.
            </p>
            <div className="pd-actions">
              <Link href="/contact" className="btn">
                Start a similar project ↗
              </Link>
              <Link href="/services" className="btn btn-outline">
                Our capabilities
              </Link>
            </div>
          </div>

          <aside className="pd-facts reveal-right">
            <h3>Project facts</h3>
            <dl className="pd-fact-list">
              {facts.map((f) => (
                <div className="pd-fact" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section pd-gallery dm-band">
          <div className="dm-wrap">
            <div className="pd-gallery-head">
              <span className="dm-page-kicker reveal-up">Gallery</span>
              <h2 className="dm-block-title reveal-blur">Spaces &amp; details</h2>
            </div>
            <div className="pd-gallery-grid">
              {gallery.map((src, i) => (
                <figure
                  key={`${src}-${i}`}
                  className={`pd-gallery-item reveal-clip ${i === 0 ? 'is-wide' : ''}`}
                >
                  <Image
                    src={src}
                    alt={`${project.title} — image ${i + 1}`}
                    width={i === 0 ? 1400 : 900}
                    height={i === 0 ? 900 : 700}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="dm-wrap">
          <div className="pd-cta-band reveal-scale">
            <div>
              <h2>Like this approach?</h2>
              <p>
                Share your site and programme — we’ll tell you how a similar brief
                could unfold with Maple.
              </p>
            </div>
            <Link href="/contact" className="btn">
              Discuss this typology ↗
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="dm-wrap">
            <div className="pd-related-head">
              <span className="dm-page-kicker reveal-up">Continue</span>
              <h2 className="dm-block-title reveal-blur">Related projects</h2>
            </div>
            <div className="dm-grid pd-related-grid">
              {related.map((p) => (
                <Link href={`/portfolio/${p.slug}`} className="dm-card pd-related-card" key={p.id}>
                  <div className="dm-card-media">
                    <Image src={p.image} alt={p.title} width={800} height={550} />
                  </div>
                  <div className="dm-card-body">
                    <h3>{p.title}</h3>
                    <div className="dm-card-meta">
                      <span>{p.category}</span>
                      <span>{p.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link href="/portfolio" className="btn btn-outline">
                Back to portfolio
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
