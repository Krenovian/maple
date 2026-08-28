'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export default function DashboardShell({
  homeHref,
  homeLabel,
  sidebarId,
  nav,
  userName,
  children,
}) {
  const pathname = usePathname();
  const [now, setNow] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  useBodyScrollLock(navOpen);

  useEffect(() => {
    const fmt = () =>
      setNow(
        new Date().toLocaleString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    fmt();
    const id = setInterval(fmt, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href);

  return (
    <div className={`ad-shell ${navOpen ? 'ad-nav-open' : ''}`}>
      <header className="ad-mobile-bar">
        <Link href={homeHref} className="ad-brand" onClick={() => setNavOpen(false)}>
          <Image src="/images/logo-mark.png" alt="" width={32} height={32} style={{ borderRadius: 6 }} />
          <div>
            <span>maple</span>
            <small>{homeLabel}</small>
          </div>
        </Link>
        <button
          type="button"
          className={`ad-menu-toggle ${navOpen ? 'is-open' : ''}`}
          aria-expanded={navOpen}
          aria-controls={sidebarId}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setNavOpen((v) => !v)}
        >
          <span className="ad-menu-burger" aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>
      </header>

      <button
        type="button"
        className="ad-sidebar-backdrop"
        aria-label="Close menu"
        tabIndex={navOpen ? 0 : -1}
        onClick={() => setNavOpen(false)}
      />

      <aside
        className="ad-sidebar"
        id={sidebarId}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      >
        <Link href={homeHref} className="ad-brand ad-brand-drawer" onClick={() => setNavOpen(false)}>
          <Image src="/images/logo-mark.png" alt="" width={32} height={32} style={{ borderRadius: 6 }} />
          <div>
            <span>maple</span>
            <small>{homeLabel}</small>
          </div>
        </Link>

        <nav className="ad-nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              <span className="ad-nav-ico">{item.ico}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ad-side-foot">
          <div className="ad-user">
            Signed in as
            <strong>{userName}</strong>
            {now && (
              <div
                style={{
                  marginTop: '0.45rem',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.06em',
                }}
              >
                {now}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: '100%' }}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Sign Out
          </button>
          <Link
            href="/"
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', marginTop: '0.45rem' }}
            target="_blank"
          >
            View Live Site ↗
          </Link>
        </div>
      </aside>

      <main className="ad-main">{children}</main>
    </div>
  );
}
