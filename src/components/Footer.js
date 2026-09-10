import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_SERVICE_NAMES } from '@/lib/services';

const STUDIO = [
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Our Team' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Journal' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Start a Project' },
];

const TDC = [
  { href: '/products', label: 'About TDC' },
  { href: '/products#tdc-catalog', label: 'Shop' },
  { href: '/products#tdc-catalog', label: 'Collections' },
  { href: '/contact', label: 'Contact TDC' },
];

const CONNECT = [
  { href: 'https://www.instagram.com/de_maple_architecture', label: 'Instagram', external: true },
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
  { href: 'mailto:studio@demaple.com', label: 'studio@demaple.com' },
];

export default function Footer() {
  return (
    <footer className="dm-footer">
      <div className="dm-wrap">
        <div className="dm-footer-top">
          <div className="dm-footer-brand">
            <Link href="/" className="dm-footer-logo">
              <Image src="/images/logo-mark.png" alt="MAPLE INFRA & INTERIORS" width={28} height={28} />
              <span>MAPLE INFRA &amp; INTERIORS</span>
            </Link>
            <p className="dm-footer-caps">
              {FOOTER_SERVICE_NAMES.map((name, index) => (
                <span className="dm-footer-cap-item" key={name}>
                  {name}
                  {index < FOOTER_SERVICE_NAMES.length - 1 ? (
                    <span className="dm-footer-cap-sep" aria-hidden="true">·</span>
                  ) : null}
                </span>
              ))}
            </p>
            <p>
              A multidisciplinary design and execution practice creating practical, sustainable
              and thoughtfully crafted spaces across South India and beyond.
            </p>
          </div>

          <div className="dm-footer-col">
            <h4>Studio</h4>
            <nav className="dm-footer-nav">
              {STUDIO.map((n) => (
                <Link key={n.label} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="dm-footer-col">
            <h4>THE DECOR CLUB</h4>
            <nav className="dm-footer-nav">
              {TDC.map((n) => (
                <Link key={n.label} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="dm-footer-col">
            <h4>Connect</h4>
            <div className="dm-footer-socials">
              {CONNECT.map((s) =>
                s.external ? (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ) : (
                  <a key={s.href} href={s.href}>
                    {s.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="dm-footer-tdc">
          <strong>THE DECOR CLUB (TDC)</strong>
          <em>A décor &amp; lifestyle division of MAPLE INFRA &amp; INTERIORS</em>
        </div>

        <div className="dm-footer-wordmark-wrap" aria-hidden="true">
          <div className="dm-footer-wordmark">MAPLE</div>
          <div className="dm-footer-wordmark-sub">
            <span>INFRA</span>
            <span>AND</span>
            <span>INTERIORS</span>
          </div>
        </div>

        <div className="dm-footer-bottom">
          <span>© {new Date().getFullYear()} MAPLE INFRA &amp; INTERIORS · South India · Qatar</span>
          <div className="dm-footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
