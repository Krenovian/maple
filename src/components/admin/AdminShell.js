'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const NAV = [
  { href: '/admin', label: 'Overview', ico: '01' },
  { href: '/admin/tasks', label: 'Tasks', ico: '02' },
  { href: '/admin/projects', label: 'Projects', ico: '03' },
  { href: '/admin/products', label: 'Catalog', ico: '04' },
  { href: '/admin/categories', label: 'Categories', ico: '05' },
  { href: '/admin/orders', label: 'Orders', ico: '06' },
  { href: '/admin/inquiries', label: 'Inbox', ico: '07' },
  { href: '/admin/employees', label: 'Team', ico: '08' },
  { href: '/admin/activity', label: 'Activity', ico: '09' },
];

export default function AdminShell({ userName, children }) {
  const pathname = usePathname();
  const [now, setNow] = useState('');

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

  return (
    <div className="ad-shell">
      <aside className="ad-sidebar">
        <Link href="/admin" className="ad-brand">
          <Image src="/images/logo-leaf.png" alt="" width={32} height={32} style={{ borderRadius: 6 }} />
          <div>
            <span>maple</span>
            <small>Admin</small>
          </div>
        </Link>

        <nav className="ad-nav">
          {NAV.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
                <span className="ad-nav-ico">{item.ico}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ad-side-foot">
          <div className="ad-user">
            Signed in as
            <strong>{userName}</strong>
            {now && <div style={{ marginTop: '0.45rem', fontFamily: 'var(--mono)', fontSize: '0.58rem', letterSpacing: '0.06em' }}>{now}</div>}
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: '100%' }}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Sign Out
          </button>
          <Link href="/" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '0.45rem' }} target="_blank">
            View Live Site ↗
          </Link>
        </div>
      </aside>

      <main className="ad-main">{children}</main>
    </div>
  );
}
