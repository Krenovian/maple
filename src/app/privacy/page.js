import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy | MAPLE INFRA & INTERIORS' };

const SECTIONS = [
  {
    title: 'Who we are',
    body: [
      'MAPLE INFRA & INTERIORS (“Maple”, “we”, “us”), formerly DE MAPLE Architects & Engineers, is an architecture, interiors, engineering and contracting practice headquartered in Maranchery, Ponnani, Malappuram, Kerala. This policy explains how we collect, use, and protect personal information when you visit our website, submit an inquiry, request a materials quote, or otherwise engage with us.',
    ],
  },
  {
    title: 'Information we collect',
    body: [
      'We may collect information you provide directly — including your name, email address, phone number, project location, brief details, and any files or messages you send through our contact forms.',
      'We may also collect limited technical data such as browser type, device information, approximate location derived from IP address, and pages visited, used to keep the site secure and improve performance.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      'We use personal information to respond to inquiries, prepare proposals, schedule studio visits, fulfill materials requests, and communicate about active or prospective projects.',
      'We may also use aggregated, non-identifying information to understand how the site is used and to improve our services. We do not sell your personal information.',
    ],
  },
  {
    title: 'Sharing and retention',
    body: [
      'We share information only with trusted service providers who help us operate the practice (for example email, hosting, or analytics), and only to the extent needed for those services.',
      'We retain inquiry and project-related records for as long as reasonably necessary for operations, legal obligations, or dispute resolution, then delete or anonymise them when no longer required.',
    ],
  },
  {
    title: 'Cookies and similar technologies',
    body: [
      'Our site may use essential cookies and similar technologies required for basic functionality, security, and session management. Where optional analytics tools are used, they help us understand traffic patterns without identifying you personally for marketing sale purposes.',
      'You can control cookies through your browser settings. Disabling certain cookies may affect site features.',
    ],
  },
  {
    title: 'Security',
    body: [
      'We take reasonable administrative and technical measures to protect personal information against unauthorised access, alteration, or disclosure. No method of transmission over the internet is completely secure; please contact us if you believe your information has been compromised.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Depending on applicable law, you may request access to, correction of, or deletion of personal information we hold about you. You may also ask us to restrict or object to certain processing.',
      'To exercise these rights, email studio@demaple.com with the subject line “Privacy request”. We may need to verify your identity before responding.',
    ],
  },
  {
    title: 'Updates',
    body: [
      'We may update this policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the site after an update constitutes acceptance of the revised policy.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">Legal</span>
          <h1>
            Privacy <em>policy</em>
          </h1>
          <p>
            How MAPLE INFRA &amp; INTERIORS collects, uses, and protects information shared with us.
            Last updated 3 August 2026.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
        <div className="dm-wrap dm-legal">
          {SECTIONS.map((s) => (
            <article key={s.title} className="dm-legal-block reveal-up">
              <h2>{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </article>
          ))}

          <div className="dm-legal-contact reveal-up">
            <h2>Contact</h2>
            <p>
              Questions about this policy:{' '}
              <a href="mailto:studio@demaple.com">studio@demaple.com</a>
              <br />
              MAPLE INFRA &amp; INTERIORS · Maranchery, Ponnani, Malappuram, Kerala, India
            </p>
            <p className="dm-legal-links">
              See also our <Link href="/terms">Terms of use</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
