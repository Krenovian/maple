import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCatalog from '@/components/site/ProductCatalog';
import FaqList from '@/components/site/FaqList';

export const metadata = {
  title: 'Shop',
  description:
    'Browse MAPLE shop products — stone, timber, lighting, metals and finishes curated from studio projects. Sample, cart and enquire on WhatsApp.',
};

const FAQ = [
  {
    q: 'Can I order samples before committing?',
    a: 'Yes. Choose finish and sample size, then Add to cart or Enquire WhatsApp — we save your lead and open a chat with the studio.',
  },
  {
    q: 'Do you install products yourselves?',
    a: 'For full commissions, yes — installation is coordinated through our site team. For shop-only orders we can introduce certified installers.',
  },
  {
    q: 'Are prices fixed?',
    a: 'Listed rates are indicative. Final quotes depend on finish, quantity, logistics and current supplier stock.',
  },
];

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({
      where: { type: 'PRODUCT' },
      orderBy: { name: 'asc' },
      select: { name: true },
    }),
  ]);
  const payload = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">03 — Shop</span>
          <h1>
            Shop <em>products</em>
          </h1>
          <p>
            Finishes and fittings curated from Maple projects. Filter by category,
            pick a finish and sample size, then add to cart or enquire on WhatsApp.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 'clamp(3rem, 6vw, 5rem)' }}>
        <div className="dm-wrap">
          <ProductCatalog
            products={payload}
            categoryOptions={categories.map((c) => c.name)}
          />
        </div>
      </section>

      <section className="section dm-band">
        <div className="dm-wrap dm-materials-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'start' }}>
          <div className="reveal-left">
            <span className="dm-page-kicker">How it works</span>
            <h2 className="dm-block-title reveal-blur">From sample to site</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Every product in the shop has been used on a Maple project.
              We only list finishes we trust to weather, install cleanly, and age with the architecture.
            </p>
          </div>
          <div className="dm-steps reveal-stagger" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[
              { n: '01', t: 'Browse', d: 'Filter by category and stock.' },
              { n: '02', t: 'Specify', d: 'Choose finish + sample size.' },
              { n: '03', t: 'Quote', d: 'Send a request from the card.' },
              { n: '04', t: 'Deliver', d: 'We coordinate lead time & logistics.' },
            ].map((s) => (
              <div className="dm-step" key={s.n} style={{ minHeight: 160 }}>
                <div className="dm-step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="dm-wrap" style={{ maxWidth: 900 }}>
          <span className="dm-page-kicker reveal-up">FAQ</span>
          <h2 className="dm-block-title reveal-blur" style={{ marginBottom: '2rem' }}>Shop questions</h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <div className="dm-cta-band reveal-scale">
            <div>
              <h2>Need a custom palette?</h2>
              <p>We can assemble a site-specific board from stone, timber, metal and plaster.</p>
            </div>
            <Link href="/contact" className="btn">Talk to Maple</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
