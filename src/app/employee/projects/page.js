import prisma from '@/lib/prisma';
import ProjectsManager from '@/components/admin/ProjectsManager';

export const metadata = { title: 'Projects | Employee Workspace' };

export default async function EmployeeProjectsPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
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
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
