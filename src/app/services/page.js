import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import FaqList from '@/components/site/FaqList';
import { getSiteImages } from '@/lib/siteSettings';
import { SERVICE_INTEGRATED, SERVICES_PAGE_ROWS } from '@/lib/services';

export const metadata = {
  title: 'Services | MAPLE INFRA & INTERIORS',
  description:
    `${SERVICE_INTEGRATED} — design, technical expertise and execution from concept through handover.`,
};

const STEPS = [
  { n: '01', t: 'Discovery', d: 'Brief workshop, site visit and programme clarification.' },
  { n: '02', t: 'Design', d: 'Architecture and interiors developed with engineering input.' },
  { n: '03', t: 'Detail', d: 'Drawings, samples, approvals and contracting scope.' },
  { n: '04', t: 'Deliver', d: 'Construction / fit-out supervision through handover.' },
];

const FAQ = [
  {
    q: 'Do you offer end-to-end project delivery?',
    a: `Yes. ${SERVICE_INTEGRATED} can be commissioned together or individually, depending on the project’s requirements.`,
  },
  {
    q: 'Where do you undertake projects?',
    a: 'We undertake projects across South India, with experience in Kerala, Bengaluru and Qatar.',
  },
  {
    q: 'Can I appoint MII only for design or consultancy?',
    a: 'Yes. Our services can be engaged individually or combined as an integrated project solution.',
  },
  {
    q: 'Can you work with my existing contractor?',
    a: 'Yes. We can provide design, engineering, consultancy and coordination while working alongside your appointed contractor.',
  },
  {
    q: 'Do you handle approvals and technical documentation?',
    a: 'Yes. Depending on the scope, our team can assist with planning, documentation, estimation, technical coordination and statutory requirements.',
  },
  {
    q: 'Can you handle both architecture and interiors?',
    a: 'Yes. Our integrated approach allows architectural and interior design to be developed together for better functional, technical and aesthetic coordination.',
  },
];

export default async function ServicesPage() {
  const siteImages = await getSiteImages();

  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">04 — Capabilities</span>
          <h1>
            Our <em>Services</em>
          </h1>
          <p>
            <em>
              {SERVICE_INTEGRATED} — bringing design, technical expertise and execution together
              from the first concept through to final handover.
            </em>
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="dm-wrap">
          {SERVICES_PAGE_ROWS.map((s, i) => (
            <article
              className="dm-service-row reveal-up"
              key={s.num}
              style={{ gridTemplateColumns: '100px 1.1fr 0.9fr', alignItems: 'center' }}
            >
              <span className="dm-service-num">{s.num}</span>
              <div className={i % 2 === 0 ? 'reveal-left' : 'reveal-right'}>
                <h2 className="reveal-blur">{s.title}</h2>
                <p className="dm-service-features">{s.features}</p>
              </div>
              <div className="dm-figure reveal-clip" style={{ aspectRatio: '4 / 3', minHeight: 180 }}>
                <Image
                  src={siteImages[s.imageKey]}
                  alt={siteImages[`${s.imageKey}_alt`]}
                  width={800}
                  height={600}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dm-band">
        <div className="dm-wrap">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="dm-page-kicker reveal-up">Process</span>
            <h2 className="dm-block-title reveal-blur">How a project moves</h2>
          </div>
          <div className="dm-steps reveal-stagger">
            {STEPS.map((s) => (
              <div className="dm-step" key={s.n}>
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
          <h2 className="dm-block-title reveal-blur" style={{ marginBottom: '2rem' }}>
            Engagement questions
          </h2>
          <FaqList items={FAQ} />
          <div style={{ marginTop: '3rem' }}>
            <Link href="/contact" className="btn">
              Discuss a Project ↗
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
