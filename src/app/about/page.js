import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import FaqList from '@/components/site/FaqList';

export const metadata = { title: 'About | MAPLE INFRA & INTERIORS' };

const VALUES = [
  {
    num: '01',
    title: 'Quality',
    desc: 'Every drawing, detail and site decision is held to the same standard — practical, durable and finished with care.',
  },
  {
    num: '02',
    title: 'Innovation',
    desc: 'We keep refining how we design and deliver — from climate-smart planning to efficient contracting on site.',
  },
  {
    num: '03',
    title: 'Professionalism',
    desc: 'Clear communication, reliable timelines and ethical practice across architecture, engineering and interiors.',
  },
];

const TIMELINE = [
  {
    year: '2011',
    title: 'Practice founded',
    desc: 'DE MAPLE Architects & Engineers opens in Maranchery, Ponnani, serving clients from Malappuram and across Kerala.',
  },
  {
    year: '2016',
    title: 'Regional expansion',
    desc: 'Commissions grow across Kerala as the team builds strength in architecture, structure and interiors.',
  },
  {
    year: '2020',
    title: 'Beyond Kerala',
    desc: 'Work extends to Bengaluru and Qatar while the in-house team of architects, engineers and designers expands.',
  },
  {
    year: '2026',
    title: 'Rebrand — 15th year',
    desc: 'Celebrating fifteen years and 200+ projects, we become MAPLE INFRA & INTERIORS with a renewed brand identity.',
  },
];

const TEAM = [
  {
    name: 'Architecture',
    role: 'Licensed architects',
    bio: 'Concept, planning and detailing for residential, commercial and institutional work.',
    image: '/images/interior.png',
  },
  {
    name: 'Engineering',
    role: 'Structural & civil',
    bio: 'Structural engineers and town planners ensuring every design is buildable and compliant.',
    image: '/images/bedroom.png',
  },
  {
    name: 'Interiors & retail',
    role: 'Design specialists',
    bio: 'Interior and retail designers shaping spaces that are refined, functional and ready for use.',
    image: '/images/pool.png',
  },
];

const FAQ = [
  {
    q: 'Are you still the same firm as DE MAPLE?',
    a: 'Yes. MAPLE INFRA & INTERIORS is the rebranded identity of DE MAPLE Architects & Engineers. Management, expertise, service quality and work ethics remain the same.',
  },
  {
    q: 'Where are you based?',
    a: 'Our headquarters is in Maranchery, Ponnani, Malappuram district, Kerala. We deliver projects across Kerala, Bengaluru and Qatar.',
  },
  {
    q: 'Do you handle contracting as well as design?',
    a: 'Yes. Alongside architectural and interior design and consultancy, we offer structural and interior contracting for end-to-end delivery.',
  },
];

export default function AboutPage() {
  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">01 — About</span>
          <h1>
            About <em>Maple</em>
          </h1>
          <p>
            Fifteen years of architecture, engineering and interiors — now MAPLE INFRA &amp; INTERIORS,
            still rooted in Maranchery, Ponnani.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="dm-wrap dm-split">
          <div className="dm-split-copy reveal-left">
            <h2 className="reveal-blur">Our story</h2>
            <p>
              For over 15 years, DE MAPLE Architects &amp; Engineers has proudly served clients from
              our headquarters in Maranchery, Ponnani. Based in Malappuram, our team of 13
              professionals — licensed architects, engineers, structural engineers, town planners,
              interior designers and retail designers — has completed more than 200 projects across
              Kerala, Bengaluru and Qatar.
            </p>
            <p>
              As we celebrate our 15th year, we now operate as MAPLE INFRA &amp; INTERIORS with a
              fresh brand identity. Our management, expertise, service quality and commitment to
              excellence remain exactly the same — transforming your dreams into reality with
              practical, sustainable and aesthetically refined spaces.
            </p>
            <div className="dm-tags reveal-stagger">
              {['Architecture', 'Interiors', 'Contracting', 'Consultancy', 'Engineering'].map((t) => (
                <span className="dm-tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
          <figure className="dm-figure reveal-clip reveal-right">
            <Image src="/images/interior.png" alt="Maple project interior" width={900} height={1125} data-parallax="8" />
          </figure>
        </div>
      </section>

      <section className="section ab-figures">
        <div className="dm-wrap ab-figures-inner">
          <div className="ab-figures-intro reveal-left">
            <span className="dm-page-kicker">By the numbers</span>
            <h2 className="reveal-blur">
              Practice,
              <br />
              <em>measured</em>
            </h2>
            <p>
              From Maranchery to Bengaluru and Qatar — a compact studio with a long
              record of built work.
            </p>
          </div>

          <div className="ab-figures-lead reveal-up">
            <div className="ab-figures-lead-num">
              <span data-counter="200" data-decimals="0">0</span>
              <sup>+</sup>
            </div>
            <span className="ab-figures-label">Projects completed</span>
          </div>

          <ul className="ab-figures-rail reveal-stagger">
            {[
              { n: '15', label: 'Years in practice' },
              { n: '13', label: 'Professionals' },
              { n: '3', label: 'Regions served' },
            ].map((item) => (
              <li className="ab-figures-rail-item" key={item.label}>
                <strong>
                  <span data-counter={item.n} data-decimals="0">0</span>
                </strong>
                <span className="ab-figures-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section dm-band">
        <div className="dm-wrap">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="dm-page-kicker reveal-up">Principles</span>
            <h2 className="dm-block-title reveal-blur">What guides us</h2>
          </div>
          <div className="dm-value-grid reveal-stagger">
            {VALUES.map((v) => (
              <article className="dm-value" key={v.num}>
                <div className="dm-value-num">{v.num}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="dm-wrap dm-about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(2rem,5vw,5rem)' }}>
          <div className="reveal-left">
            <span className="dm-page-kicker">Timeline</span>
            <h2 className="dm-block-title reveal-blur">A practice built over fifteen years</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '36ch' }}>
              From DE MAPLE Architects &amp; Engineers to MAPLE INFRA &amp; INTERIORS —
              the same team, expanded capabilities, renewed identity.
            </p>
          </div>
          <div className="dm-timeline reveal-stagger">
            {TIMELINE.map((t) => (
              <div className="dm-tl-item" key={t.year}>
                <div className="dm-tl-dot" />
                <div>
                  <div className="dm-tl-year">{t.year}</div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dm-band">
        <div className="dm-wrap">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="dm-page-kicker reveal-up">People</span>
            <h2 className="dm-block-title reveal-blur">A team of 13</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '48ch', marginTop: '0.75rem', lineHeight: 1.7 }}>
              Licensed architects, engineers, structural engineers, town planners, interior designers
              and retail designers — working as one practice from Malappuram.
            </p>
          </div>
          <div className="dm-team-grid reveal-stagger">
            {TEAM.map((m) => (
              <article className="dm-team-card" key={m.name}>
                <div className="dm-team-media">
                  <Image src={m.image} alt={m.name} width={700} height={875} />
                </div>
                <div className="dm-team-body">
                  <h3>{m.name}</h3>
                  <div className="dm-team-role">{m.role}</div>
                  <p>{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="dm-wrap" style={{ maxWidth: 900 }}>
          <span className="dm-page-kicker reveal-up">FAQ</span>
          <h2 className="dm-block-title reveal-blur" style={{ marginBottom: '2rem' }}>Common questions</h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <div className="dm-cta-band reveal-scale" data-pin-fade>
            <div>
              <h2>Build with us</h2>
              <p>Tell us about your project. We’ll respond with availability and next steps.</p>
            </div>
            <Link href="/contact" className="btn">Start a Project ↗</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
