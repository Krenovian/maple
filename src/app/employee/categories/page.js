import prisma from '@/lib/prisma';
import CategoriesManager from '@/components/admin/CategoriesManager';

export const metadata = { title: 'Categories | Employee Workspace' };

export default async function EmployeeCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  const payload = categories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return <CategoriesManager initialCategories={payload} />;
}
