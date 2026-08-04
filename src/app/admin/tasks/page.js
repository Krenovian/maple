import prisma from '@/lib/prisma';
import TasksManager from '@/components/admin/TasksManager';

export const metadata = { title: 'Tasks | Admin Workspace' };

export default async function AdminTasksPage() {
  const [tasks, employees, projects] = await Promise.all([
    prisma.task.findMany({
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    prisma.project.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  const payload = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return <TasksManager initialTasks={payload} employees={employees} projects={projects} />;
}
