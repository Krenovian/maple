import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PortfolioExplorer from '@/components/site/PortfolioExplorer';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio | MAPLE INFRA & INTERIORS',
  description:
    'Selected projects across South India · Qatar by MAPLE INFRA & INTERIORS. Based in Maranchery, Malappuram, with work delivered across Kerala, Bengaluru and Qatar.',
};

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  const payload = projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">02 — Work</span>
          <h1>
            Project <em>portfolio</em>
          </h1>
          <p>
            Selected work across South India · Qatar — based in Maranchery, Malappuram, with
            projects delivered across Kerala, Bengaluru and Qatar. Switch between stage and
            cards, filter by typology, location or year.
          </p>
        </div>
      </header>

      <section className="section pe-section" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <Suspense fallback={<div className="dm-wrap"><p style={{ color: 'var(--text-muted)' }}>Loading portfolio…</p></div>}>
          <PortfolioExplorer projects={payload} />
        </Suspense>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <div className="dm-cta-band reveal-scale">
            <div>
              <h2>Have a site in mind?</h2>
              <p>Share the plot, climate and programme. We’ll tell you if it’s a fit.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn">Start a Project</Link>
              <Link href="/services" className="btn btn-outline">See Capabilities</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
