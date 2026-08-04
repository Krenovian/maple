import prisma from '@/lib/prisma';

/**
 * Best-effort activity log. Never throws to callers.
 */
export async function logActivity({ session, action, entity, entityId, summary }) {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: session?.user?.id || null,
        actorName: session?.user?.name || session?.user?.email || null,
        action,
        entity,
        entityId: entityId || null,
        summary: String(summary || '').slice(0, 500),
      },
    });
  } catch (err) {
    console.error('Activity log failed:', err);
  }
}
