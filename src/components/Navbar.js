'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/portfolio', label: 'Projects' },
  { href: '/blog', label: 'Journal' },
  { href: '/products', label: 'Shop' },
  { href: '/services', label: 'Services' },
];

function pageLabel(pathname) {
  if (pathname === '/') return 'Home';
  const hit = LINKS.find((l) => l.href !== '/' && pathname.startsWith(l.href));
  if (hit) return hit.label;
  if (pathname.startsWith('/contact')) return 'Contact';
  if (pathname.startsWith('/privacy')) return 'Privacy';
  if (pathname.startsWith('/terms')) return 'Terms';
  return 'Menu';
}

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 160);
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('toggle-menu', toggleMenu);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('toggle-menu', toggleMenu);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const label = pageLabel(pathname);
  useBodyScrollLock(isMenuOpen);

  return (
    <>
      {/* Desktop dock */}
      <div className={`nav-wrapper nav-desktop ${isVisible ? 'nav-visible' : ''}`}>
        <nav className="main-nav" aria-label="Primary">
          <Link href="/" className="nav-logo">
            <Image src="/images/logo-mark.png" alt="" width={28} height={28} />
            <span>MAPLE</span>
          </Link>

          <ul className="nav-links">
            {LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={pathname === item.href ? 'is-active' : ''}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link href="/contact" className="nav-btn">
              Contact ↗
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile top dock — always visible on small screens */}
      <div className={`nav-mobile nav-mobile-visible ${isMenuOpen ? 'is-open' : ''}`}>
        <Link href="/" className="nav-mobile-brand" aria-label="Home">
          <Image src="/images/logo-mark.png" alt="" width={30} height={30} />
        </Link>

        <button
          type="button"
          className="nav-mobile-center"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className="nav-mobile-here">{label}</span>
          <span className="nav-mobile-burger" aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>

        <Link href="/contact" className="nav-mobile-cta" aria-label="Contact">
          <span>↗</span>
        </Link>
      </div>

      <div
        className={`overlay-menu ${isMenuOpen ? 'overlay-open' : ''}`}
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      >
        <button type="button" className="overlay-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
          ×
        </button>
        <div className="overlay-content">
          <p className="overlay-kicker">Navigate</p>
          <ul className="overlay-links">
            {[...LINKS, { href: '/contact', label: 'Contact' }].map((item, i) => (
              <li key={item.href} style={{ transitionDelay: isMenuOpen ? `${80 + i * 45}ms` : '0ms' }}>
                <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <span className="overlay-num">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="overlay-footer">
            <a href="mailto:studio@demaple.com">studio@demaple.com</a>
            <div className="overlay-socials">
              <a href="https://www.instagram.com/de_maple_architecture" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
