import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EmployeeShell from '@/components/employee/EmployeeShell';

export default async function EmployeeLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');
  if (session.user.role !== 'EMPLOYEE') redirect('/admin');

  return <EmployeeShell userName={session.user.name}>{children}</EmployeeShell>;
}
