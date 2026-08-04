import prisma from '@/lib/prisma';
import InboxManager from '@/components/admin/InboxManager';

export const metadata = { title: 'Inbox | Admin Workspace' };

export default async function AdminInquiriesPage() {
  const [inquiries, messages] = await Promise.all([
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const inquiryPayload = inquiries.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    product: i.product
      ? {
          ...i.product,
          createdAt: i.product.createdAt.toISOString(),
          updatedAt: i.product.updatedAt.toISOString(),
        }
      : null,
  }));

  const messagePayload = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <InboxManager
      initialInquiries={inquiryPayload}
      initialMessages={messagePayload}
    />
  );
}
