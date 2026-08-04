import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import TasksList from '@/components/employee/TasksList';

export const metadata = { title: 'My Tasks | MAPLE' };

export default async function EmployeeTasksPage() {
  const session = await getServerSession(authOptions);

  const tasks = await prisma.task.findMany({
    where: { assigneeId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const payload = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>My Tasks</h1>
          <p>Start work and mark assignments finished when done.</p>
        </div>
      </div>

      <TasksList tasks={payload} />
    </>
  );
}
