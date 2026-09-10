import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import FaqList from '@/components/site/FaqList';
import { getSiteImages } from '@/lib/siteSettings';
import { SERVICE_INTEGRATED, SERVICE_NAMES } from '@/lib/services';

export const metadata = { title: 'About | MAPLE INFRA & INTERIORS' };

const VALUES = [
  {
    num: '01',
    title: 'Quality',
    desc: (
      <>
        Every design, drawing, material and site decision is held to a high standard —{' '}
        <em>practical, durable and thoughtfully executed</em>.
      </>
    ),
  },
  {
    num: '02',
    title: 'Integrated Thinking',
    desc: (
      <>
        We bring <em>architecture, engineering, interiors and execution together</em>, creating
        solutions that work beautifully from concept to completion.
      </>
    ),
  },
  {
    num: '03',
    title: 'Professionalism',
    desc: (
      <>
        Clear communication, responsible planning, reliable timelines and{' '}
        <em>ethical practice</em> guide every project and every client relationship.
      </>
    ),
  },
];

const FIGURES = [
  { n: '15', suffix: '+', label: 'Years of experience' },
  { n: '200', suffix: '+', label: 'Projects completed' },
  { n: '13', suffix: '', label: 'Professionals' },
  { n: String(SERVICE_NAMES.length), suffix: '', label: 'Core services' },
];

const TIMELINE = [
  {
    year: '2011',
    title: 'Practice Founded',
    desc: (
      <>
        <em>DE MAPLE Architects &amp; Engineers</em> is established in Maranchery, Ponnani,
        beginning a journey in architecture and professional design services across Kerala.
      </>
    ),
  },
  {
    year: '2016',
    title: 'Growing Capabilities',
    desc: (
      <>
        The practice expands its capabilities across{' '}
        <em>architecture, engineering, structural design and interiors</em>, strengthening its
        multidisciplinary approach.
      </>
    ),
  },
  {
    year: '2020',
    title: 'Beyond Kerala',
    desc: (
      <>
        Our work expands beyond Kerala, with projects extending to{' '}
        <em>Bengaluru and Qatar</em> as our team and professional capabilities continue to grow.
      </>
    ),
  },
  {
    year: '2026',
    title: 'A New Chapter',
    desc: (
      <>
        After <em>15 years and 200+ projects</em>, DE MAPLE evolves into{' '}
        <strong>MAPLE INFRA &amp; INTERIORS</strong>, bringing architecture, engineering,
        interiors, consultancy and contracting together under a renewed brand identity.
      </>
    ),
  },
];

const FAQ = [
  {
    q: 'Are you still the same firm as DE MAPLE?',
    a: 'Yes. MAPLE INFRA & INTERIORS is the rebranded identity of DE MAPLE Architects & Engineers. Management, expertise, service quality and work ethics remain the same.',
  },
  {
    q: 'Where are you based?',
    a: 'Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru and Qatar. Our reach is South India · Qatar.',
  },
  {
    q: 'Do you handle contracting as well as design?',
    a: 'Yes. Alongside architectural and interior design and consultancy, we offer structural and interior contracting for end-to-end delivery.',
  },
];

export default async function AboutPage() {
  const siteImages = await getSiteImages();

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
            <em>
              Fifteen years of architecture, engineering, interiors and execution — now evolving
              as MAPLE INFRA &amp; INTERIORS.
            </em>
          </p>
          <p>
            Built on years of experience, our multidisciplinary team brings together design,
            technical expertise and execution to create{' '}
            <em>practical, sustainable and thoughtfully crafted spaces</em> across South India
            and beyond.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="dm-wrap dm-split">
          <div className="dm-split-copy reveal-left">
            <h2 className="reveal-blur">Our story</h2>
            <p>
              For over <strong>15 years, DE MAPLE Architects &amp; Engineers</strong> has been
              shaping spaces and serving clients across <strong>South India and beyond</strong>.
              With a multidisciplinary team of 13 professionals—including licensed architects,
              engineers, structural engineers, town planners, interior designers, and retail
              designers—we have successfully delivered{' '}
              <strong>more than 200 projects across Kerala, Bengaluru, and Qatar</strong>.
            </p>
            <p>
              Today, as we celebrate 15 years of experience, we enter a new chapter as{' '}
              <strong>MAPLE INFRA &amp; INTERIORS</strong>. Our brand identity may be new, but our{' '}
              <strong>leadership, expertise, commitment to quality, and values remain the same</strong>.
            </p>
            <p>
              Building on years of experience in architecture, engineering, interiors, and
              execution, we continue to create spaces that are{' '}
              <strong>practical, sustainable, thoughtfully designed, and built to last</strong>.
            </p>
            <p>
              <strong>
                From an idea to a finished space, we bring expertise, creativity, and execution
                together.
              </strong>
            </p>
            <p className="ab-capability reveal-up">
              <span>Integrated capability</span>
              {SERVICE_INTEGRATED}
            </p>
          </div>
          <figure className="dm-figure reveal-clip reveal-right">
            <Image
              src={siteImages.about_story_image}
              alt={siteImages.about_story_image_alt}
              width={900}
              height={1125}
              data-parallax="8"
            />
          </figure>
        </div>
      </section>

      <section className="section ab-reach">
        <div className="dm-wrap ab-reach-inner reveal-up">
          <span className="dm-page-kicker">Our reach</span>
          <h2 className="reveal-blur">South India · Qatar</h2>
          <p>
            Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru
            and Qatar.
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            <Link href="/team" className="btn btn-outline">Meet the team →</Link>
          </p>
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
              Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru
              and Qatar.
            </p>
          </div>

          <ul className="ab-figures-rail reveal-stagger">
            {FIGURES.map((item) => (
              <li className="ab-figures-rail-item" key={item.label}>
                <strong>
                  <span data-counter={item.n} data-decimals="0">0</span>
                  {item.suffix ? <sup>{item.suffix}</sup> : null}
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
            <span className="dm-page-kicker reveal-up">Our Principles</span>
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
            <h2 className="dm-block-title reveal-blur">A practice built over 15 years</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '42ch' }}>
              <em>
                From DE MAPLE Architects &amp; Engineers to MAPLE INFRA &amp; INTERIORS — 15 years
                of experience, an expanded multidisciplinary practice and a renewed identity.
              </em>
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
