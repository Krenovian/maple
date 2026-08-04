import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import FaqList from '@/components/site/FaqList';

export const metadata = { title: 'Services | MAPLE INFRA & INTERIORS' };

const services = [
  {
    num: '01',
    title: 'Architectural Design',
    desc: 'From concept to completion, we design residential and commercial buildings that respond to climate, culture and craftsmanship — tailored to each client’s unique requirements.',
    features: ['Residential', 'Commercial', 'Institutional', 'Masterplanning'],
    image: '/images/hero.png',
  },
  {
    num: '02',
    title: 'Interior Design',
    desc: 'Curated interiors for homes, workplaces and retail — practical layouts, refined material palettes and spaces that feel complete from day one.',
    features: ['Space Planning', 'Material Selection', 'Retail Design', 'Furniture'],
    image: '/images/interior.png',
  },
  {
    num: '03',
    title: 'Structural & Interior Contracting',
    desc: 'In-house contracting that turns drawings into built reality — structural works and interior fit-outs delivered with quality control and on-time execution.',
    features: ['Structural Works', 'Interior Fit-out', 'Site Management', 'Handover'],
    image: '/images/bedroom.png',
  },
  {
    num: '04',
    title: 'Consultancy',
    desc: 'Comprehensive consultancy across architecture, structure, interiors and town planning — clear advice for clients who need expert guidance at every stage.',
    features: ['Design Consultancy', 'Structural Advice', 'Town Planning', 'Project Support'],
    image: '/images/pool.png',
  },
];

const STEPS = [
  { n: '01', t: 'Discovery', d: 'Brief workshop, site visit and programme clarification.' },
  { n: '02', t: 'Design', d: 'Architecture and interiors developed with engineering input.' },
  { n: '03', t: 'Detail', d: 'Drawings, samples, approvals and contracting scope.' },
  { n: '04', t: 'Deliver', d: 'Construction / fit-out supervision through handover.' },
];

const FAQ = [
  {
    q: 'Do you offer end-to-end delivery?',
    a: 'Yes. Architectural design, interiors, structural and interior contracting, and consultancy can be commissioned together or as individual scopes.',
  },
  {
    q: 'Where do you take projects?',
    a: 'We are based in Maranchery, Ponnani (Malappuram) and have delivered work across Kerala, Bengaluru and Qatar.',
  },
  {
    q: 'Can you work with an existing contractor?',
    a: 'We can. We also offer our own structural and interior contracting when clients prefer a single accountable team.',
  },
];

export default function ServicesPage() {
  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">04 — Capabilities</span>
          <h1>
            Our <em>services</em>
          </h1>
          <p>
            Architectural design, interior design, structural and interior contracting,
            and comprehensive consultancy — from first sketch through handover.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="dm-wrap">
          {services.map((s, i) => (
            <article
              className="dm-service-row reveal-up"
              key={s.num}
              style={{ gridTemplateColumns: '100px 1.1fr 0.9fr', alignItems: 'center' }}
            >
              <span className="dm-service-num">{s.num}</span>
              <div className={i % 2 === 0 ? 'reveal-left' : 'reveal-right'}>
                <h2 className="reveal-blur">{s.title}</h2>
                <p>{s.desc}</p>
                <div className="dm-tags">
                  {s.features.map((f) => (
                    <span className="dm-tag" key={f}>{f}</span>
                  ))}
                </div>
              </div>
              <div className="dm-figure reveal-clip" style={{ aspectRatio: '4 / 3', minHeight: 180 }}>
                <Image src={s.image} alt={s.title} width={800} height={600} />
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
          <h2 className="dm-block-title reveal-blur" style={{ marginBottom: '2rem' }}>Engagement questions</h2>
          <FaqList items={FAQ} />
          <div style={{ marginTop: '3rem' }}>
            <Link href="/contact" className="btn">Discuss a Project ↗</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
