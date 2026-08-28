import prisma from '@/lib/prisma';
import ProductsManager from '@/components/admin/ProductsManager';

export const metadata = { title: 'Catalog | Employee Workspace' };

export default async function EmployeeProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({
      where: { type: 'PRODUCT' },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
  ]);

  const payload = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <ProductsManager
      initialProducts={payload}
      categories={categories}
    />
  );
}
