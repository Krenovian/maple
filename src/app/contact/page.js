import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/site/ContactForm';
import Link from 'next/link';

export const metadata = { title: 'Contact | MAPLE INFRA & INTERIORS' };

const HOURS = [
  { day: 'Monday – Friday', time: '10:00 – 18:00' },
  { day: 'Saturday', time: 'By appointment' },
  { day: 'Sunday', time: 'Closed' },
];

export default function ContactPage() {
  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">05 — Contact</span>
          <h1>
            Get in <em>touch</em>
          </h1>
          <p>
            Send us a message — we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="dm-wrap dm-contact-grid">
          <div className="reveal-left">
            <ContactForm />
          </div>

          <div className="dm-info-block reveal-right">
            <div>
              <h3>Headquarters</h3>
              <p>
                Maranchery, Malappuram
                <br />
                Kerala, India
              </p>
            </div>
            <div>
              <h3>Our reach</h3>
              <p>
                South India · Qatar
                <br />
                Based in Maranchery, Malappuram, with projects delivered across Kerala,
                Bengaluru and Qatar.
              </p>
            </div>
            <div>
              <h3>General Inquiries</h3>
              <p>
                <a href="mailto:studio@demaple.com">studio@demaple.com</a>
              </p>
            </div>
            <div>
              <h3>Office hours</h3>
              <div className="dm-hours">
                {HOURS.map((h) => (
                  <div className="dm-hours-row" key={h.day}>
                    <span>{h.day}</span>
                    <strong>{h.time}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3>Careers</h3>
              <p>
                We are always looking for exceptional talent across architecture,
                engineering and interiors.
                <br />
                <a href="mailto:careers@demaple.com">careers@demaple.com</a>
              </p>
            </div>

            <div className="dm-map reveal-scale">
              <div className="dm-map-inner">
                <strong>Maranchery HQ</strong>
                <p>10°44&apos;N · 75°58&apos;E</p>
                <Link href="https://maps.google.com/?q=Maranchery+Ponnani+Malappuram" target="_blank" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                  Open in Maps ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <div className="dm-cta-band reveal-scale">
            <div>
              <h2>Prefer email?</h2>
              <p>Write to us directly and we&apos;ll reply within two working days.</p>
            </div>
            <a href="mailto:studio@demaple.com" className="btn">studio@demaple.com</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
