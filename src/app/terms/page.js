import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = { title: 'Terms of Use | MAPLE INFRA & INTERIORS' };

const SECTIONS = [
  {
    title: 'Agreement',
    body: [
      'By accessing this website or contacting MAPLE INFRA & INTERIORS (formerly DE MAPLE Architects & Engineers) through this site, you agree to these terms. If you do not agree, please do not use the site. Project commissions and contracting engagements are governed by separate written agreements between you and the firm.',
    ],
  },
  {
    title: 'Our services',
    body: [
      'Information on this site describes our architectural design, interior design, structural and interior contracting, and consultancy offerings in general terms. It does not constitute an offer, quotation, or professional advice until confirmed in a signed proposal or contract.',
      'Submitting an inquiry does not create a client relationship or oblige us to accept a project.',
    ],
  },
  {
    title: 'Intellectual property',
    body: [
      'All text, imagery, drawings, branding, and design work on this site are owned by MAPLE INFRA & INTERIORS or used under licence. You may not copy, reproduce, distribute, or create derivative works from site content without prior written permission, except for personal, non-commercial viewing.',
      'Project photographs and drawings remain our intellectual property unless otherwise stated in a client agreement.',
    ],
  },
  {
    title: 'Inquiries and materials',
    body: [
      'When you send project information, site photos, or drawings, you confirm you have the right to share them and that they do not infringe third-party rights. We treat shared materials as confidential for the purpose of evaluating your brief.',
      'Materials listings and sample references on the site are illustrative. Availability, finish, and pricing are confirmed separately and may change without notice.',
    ],
  },
  {
    title: 'Acceptable use',
    body: [
      'You agree not to misuse the site — including attempting to gain unauthorised access, introducing malware, scraping content at scale, or submitting spam or fraudulent inquiries.',
      'We may suspend or block access where we reasonably believe these terms have been violated.',
    ],
  },
  {
    title: 'Disclaimer',
    body: [
      'The site is provided “as is”. While we aim for accuracy, we do not warrant that content is complete, current, or error-free. To the fullest extent permitted by law, MAPLE INFRA & INTERIORS is not liable for any indirect, incidental, or consequential loss arising from use of the site.',
      'Nothing on this site replaces professional architectural, engineering, or legal advice for a specific project or jurisdiction.',
    ],
  },
  {
    title: 'Third-party links',
    body: [
      'Links to maps, social platforms, or other external sites are provided for convenience. We are not responsible for their content, policies, or practices.',
    ],
  },
  {
    title: 'Governing law',
    body: [
      'These terms are governed by the laws of India. Courts in Malappuram / Kerala shall have exclusive jurisdiction over disputes arising from use of this site, subject to any mandatory protections that apply to you under local law.',
    ],
  },
  {
    title: 'Changes',
    body: [
      'We may revise these terms periodically. The “Last updated” date reflects the latest version. Continued use of the site after changes means you accept the updated terms.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">Legal</span>
          <h1>
            Terms of <em>use</em>
          </h1>
          <p>
            The conditions that apply when you browse this site or contact MAPLE INFRA &amp; INTERIORS.
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
              Questions about these terms:{' '}
              <a href="mailto:studio@demaple.com">studio@demaple.com</a>
              <br />
              MAPLE INFRA &amp; INTERIORS · Maranchery, Ponnani, Malappuram, Kerala, India
            </p>
            <p className="dm-legal-links">
              See also our <Link href="/privacy">Privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
