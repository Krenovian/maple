'use client';
import DashboardShell from '@/components/dashboard/DashboardShell';

const NAV = [
  { href: '/admin', label: 'Overview', ico: '01' },
  { href: '/admin/tasks', label: 'Tasks', ico: '02' },
  { href: '/admin/projects', label: 'Projects', ico: '03' },
  { href: '/admin/products', label: 'Catalog', ico: '04' },
  { href: '/admin/categories', label: 'Categories', ico: '05' },
  { href: '/admin/orders', label: 'Orders', ico: '06' },
  { href: '/admin/inquiries', label: 'Inbox', ico: '07' },
  { href: '/admin/blog', label: 'Blog', ico: '13' },
  { href: '/admin/team', label: 'Team profiles', ico: '14' },
  { href: '/admin/employees', label: 'Staff accounts', ico: '08' },
  { href: '/admin/homepage', label: 'Homepage copy', ico: '12' },
  { href: '/admin/shop', label: 'Shop promos', ico: '11' },
  { href: '/admin/site', label: 'Site images', ico: '10' },
  { href: '/admin/activity', label: 'Activity', ico: '09' },
];

export default function AdminShell({ userName, children }) {
  return (
    <DashboardShell
      homeHref="/admin"
      homeLabel="Admin"
      sidebarId="admin-sidebar"
      nav={NAV}
      userName={userName}
    >
      {children}
    </DashboardShell>
  );
}
