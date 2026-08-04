import prisma from '@/lib/prisma';
import OrdersManager from '@/components/admin/OrdersManager';

export const metadata = { title: 'Order Leads | Employee Workspace' };

export default async function EmployeeOrdersPage() {
  const leads = await prisma.orderLead.findMany({ orderBy: { createdAt: 'desc' } });
  const payload = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));

  return <OrdersManager initialLeads={payload} />;
}
