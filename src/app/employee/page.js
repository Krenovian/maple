import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export const metadata = { title: 'Employee Dashboard | MAPLE' };

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function EmployeeDashboardPage() {
  const session = await getServerSession(authOptions);
  const today = startOfDay();
  const week = new Date(today);
  week.setDate(week.getDate() + 7);

  const [
    pendingTasks,
    inProgressTasks,
    completedTasks,
    projectCount,
    productCount,
    orderCount,
    messageCount,
    dueSoon,
    overdue,
  ] = await Promise.all([
    prisma.task.count({ where: { assigneeId: session.user.id, status: 'PENDING' } }),
    prisma.task.count({ where: { assigneeId: session.user.id, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { assigneeId: session.user.id, status: 'COMPLETED' } }),
    prisma.project.count(),
    prisma.product.count(),
    prisma.orderLead.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.task.findMany({
      where: {
        assigneeId: session.user.id,
        status: { not: 'COMPLETED' },
        dueDate: { gte: today, lte: week },
      },
      include: { project: { select: { title: true, slug: true } } },
      orderBy: { dueDate: 'asc' },
      take: 6,
    }),
    prisma.task.findMany({
      where: {
        assigneeId: session.user.id,
        status: { not: 'COMPLETED' },
        dueDate: { lt: today },
      },
      include: { project: { select: { title: true, slug: true } } },
      orderBy: { dueDate: 'asc' },
      take: 6,
    }),
  ]);

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Welcome, {session.user.name.split(' ')[0]}</h1>
          <p>Tasks, due dates, portfolio, catalog, and studio leads.</p>
        </div>
        <div className="ad-actions">
          <Link href="/employee/tasks" className="btn btn-sm">My Tasks</Link>
          <Link href="/employee/projects" className="btn btn-outline btn-sm">Projects</Link>
        </div>
      </div>

      <div className="ad-stats">
        <div className="ad-stat">
          <div className="ad-stat-label">Pending</div>
          <div className="ad-stat-value" style={{ color: 'var(--warn)' }}>{pendingTasks}</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">In Progress</div>
          <div className="ad-stat-value">{inProgressTasks}</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Overdue</div>
          <div className="ad-stat-value" style={{ color: 'var(--danger)' }}>{overdue.length}</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Due in 7 days</div>
          <div className="ad-stat-value" style={{ color: 'var(--accent)' }}>{dueSoon.length}</div>
        </div>
      </div>

      {(overdue.length > 0 || dueSoon.length > 0) && (
        <div className="ad-split" style={{ marginBottom: '1.5rem' }}>
          {overdue.length > 0 && (
            <div className="ad-panel">
              <div className="ad-panel-head">
                <h2>Overdue</h2>
                <Link href="/employee/tasks" className="btn btn-ghost btn-sm">Open tasks</Link>
              </div>
              <div className="ad-panel-body">
                <ul className="ad-reminder-list">
                  {overdue.map((t) => (
                    <li key={t.id}>
                      <strong>{t.title}</strong>
                      <span>
                        Due {new Date(t.dueDate).toLocaleDateString()}
                        {t.project?.title ? ` · ${t.project.title}` : t.projectName ? ` · ${t.projectName}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {dueSoon.length > 0 && (
            <div className="ad-panel">
              <div className="ad-panel-head">
                <h2>Due this week</h2>
                <Link href="/employee/tasks" className="btn btn-ghost btn-sm">Open tasks</Link>
              </div>
              <div className="ad-panel-body">
                <ul className="ad-reminder-list">
                  {dueSoon.map((t) => (
                    <li key={t.id}>
                      <strong>{t.title}</strong>
                      <span>
                        Due {new Date(t.dueDate).toLocaleDateString()}
                        {t.project?.title ? ` · ${t.project.title}` : t.projectName ? ` · ${t.projectName}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="ad-quick">
        <Link href="/employee/tasks">
          <strong>My Tasks</strong>
          <span>Start work and mark assignments finished.</span>
        </Link>
        <Link href="/employee/projects">
          <strong>Projects</strong>
          <span>Add, edit, or remove portfolio work · {projectCount} live.</span>
        </Link>
        <Link href="/employee/products">
          <strong>Catalog</strong>
          <span>Manage shop products · {productCount} listed.</span>
        </Link>
        <Link href="/employee/orders">
          <strong>Order Leads</strong>
          <span>{orderCount} new · WhatsApp / cart enquiries.</span>
        </Link>
        <Link href="/employee/inquiries">
          <strong>Inbox</strong>
          <span>{messageCount} unread contact messages.</span>
        </Link>
        <Link href="/employee/tasks">
          <strong>Completed</strong>
          <span>{completedTasks} tasks finished.</span>
        </Link>
      </div>
    </>
  );
}
