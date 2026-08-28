import prisma from '@/lib/prisma';
import CategoriesManager from '@/components/admin/CategoriesManager';

export const metadata = { title: 'Categories | Admin Workspace' };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
  });

  const payload = categories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return <CategoriesManager initialCategories={payload} />;
}
