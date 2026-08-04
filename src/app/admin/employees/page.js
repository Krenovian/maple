import prisma from '@/lib/prisma';
import EmployeesManager from '@/components/admin/EmployeesManager';

export const metadata = { title: 'Team | Admin Workspace' };

export default async function AdminEmployeesPage() {
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const payload = employees.map(({ password, ...e }) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return <EmployeesManager initialEmployees={payload} />;
}
