import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { href: '/about', label: 'About Us' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/products', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Start a Project' },
];

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'mailto:studio@demaple.com', label: 'studio@demaple.com' },
];

export default function Footer() {
  return (
    <footer className="dm-footer">
      <div className="dm-wrap">
        <div className="dm-footer-top">
          <div className="dm-footer-brand">
            <Link href="/" className="dm-footer-logo">
              <Image src="/images/logo-leaf.png" alt="MAPLE INFRA & INTERIORS" width={28} height={28} />
              <span>maple</span>
            </Link>
            <p>
              Architecture, interiors, contracting and consultancy from Maranchery,
              Ponnani — practical, sustainable and aesthetically refined spaces for
              every client.
            </p>
          </div>

          <div className="dm-footer-col">
            <h4>Studio</h4>
            <nav className="dm-footer-nav">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>{n.label}</Link>
              ))}
            </nav>
          </div>

          <div className="dm-footer-col">
            <h4>Connect</h4>
            <div className="dm-footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="dm-footer-wordmark" aria-hidden="true">
          MAPLE
        </div>

        <div className="dm-footer-bottom">
          <span>© {new Date().getFullYear()} MAPLE INFRA &amp; INTERIORS · Malappuram, Kerala</span>
          <div className="dm-footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
