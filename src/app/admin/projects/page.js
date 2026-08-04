import prisma from '@/lib/prisma';
import ProjectsManager from '@/components/admin/ProjectsManager';

export const metadata = { title: 'Projects | Admin Workspace' };

export default async function AdminProjectsPage() {
  const [projects, employees, categories] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      where: { type: 'PROJECT' },
      orderBy: { name: 'asc' },
    }),
  ]);

  const payload = projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <ProjectsManager
      initialProjects={payload}
      employees={employees}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
