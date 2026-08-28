'use client';
import DashboardShell from '@/components/dashboard/DashboardShell';

const NAV = [
  { href: '/employee', label: 'Dashboard', ico: '01' },
  { href: '/employee/tasks', label: 'My Tasks', ico: '02' },
  { href: '/employee/projects', label: 'Projects', ico: '03' },
  { href: '/employee/products', label: 'Catalog', ico: '04' },
  { href: '/employee/categories', label: 'Categories', ico: '05' },
  { href: '/employee/orders', label: 'Orders', ico: '06' },
  { href: '/employee/inquiries', label: 'Inbox', ico: '07' },
];

export default function EmployeeShell({ userName, children }) {
  return (
    <DashboardShell
      homeHref="/employee"
      homeLabel="Employee"
      sidebarId="employee-sidebar"
      nav={NAV}
      userName={userName}
    >
      {children}
    </DashboardShell>
  );
}
