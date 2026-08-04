import prisma from '@/lib/prisma';
import Link from 'next/link';

export const metadata = { title: 'Dashboard | Admin Workspace' };

export default async function AdminDashboardPage() {
  const [
    projectCount,
    productCount,
    inquiryCount,
    messageCount,
    orderCount,
    recentMessages,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.product.count(),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.orderLead.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
  ]);

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Overview</h1>
          <p>Studio pulse — projects, catalog, and unread inbox.</p>
        </div>
        <div className="ad-actions">
          <Link href="/admin/tasks" className="btn btn-sm">Assign Task</Link>
          <Link href="/admin/inquiries" className="btn btn-outline btn-sm">Open Inbox</Link>
        </div>
      </div>

      <div className="ad-stats">
        <div className="ad-stat">
          <div className="ad-stat-label">Projects</div>
          <div className="ad-stat-value">{projectCount}</div>
          <div className="ad-stat-hint">In the portfolio</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Products</div>
          <div className="ad-stat-value">{productCount}</div>
          <div className="ad-stat-hint">Listed materials</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">New Inquiries</div>
          <div className="ad-stat-value" style={{ color: 'var(--warn)' }}>{inquiryCount}</div>
          <div className="ad-stat-hint">Awaiting response</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Order Leads</div>
          <div className="ad-stat-value" style={{ color: 'var(--ok)' }}>{orderCount}</div>
          <div className="ad-stat-hint">Cart / WhatsApp</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-label">Unread Mail</div>
          <div className="ad-stat-value" style={{ color: 'var(--accent)' }}>{messageCount}</div>
          <div className="ad-stat-hint">Contact form</div>
        </div>
      </div>

      <div className="ad-quick">
        <Link href="/admin/tasks">
          <strong>Assign Tasks</strong>
          <span>Give work to the team and track completion.</span>
        </Link>
        <Link href="/admin/projects">
          <strong>Manage Projects</strong>
          <span>Add, edit, feature or remove portfolio work.</span>
        </Link>
        <Link href="/admin/products">
          <strong>Update Catalog</strong>
          <span>Keep material prices and stock current.</span>
        </Link>
        <Link href="/admin/orders">
          <strong>Order Leads</strong>
          <span>Cart checkouts and WhatsApp enquiries.</span>
        </Link>
        <Link href="/admin/employees">
          <strong>Team Access</strong>
          <span>Invite employees to the workspace.</span>
        </Link>
      </div>

      <div className="ad-split">
        <div className="ad-panel">
          <div className="ad-panel-head">
            <h2>Latest Messages</h2>
            <Link href="/admin/inquiries" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong style={{ color: '#fff' }}>{m.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {new Date(m.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>{m.subject || '—'}</td>
                    <td><span className={`ad-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
                  </tr>
                ))}
                {recentMessages.length === 0 && (
                  <tr><td colSpan={3} className="ad-empty">Inbox is clear.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-panel">
          <div className="ad-panel-head">
            <h2>Recent Projects</h2>
            <Link href="/admin/projects" className="btn btn-ghost btn-sm">Manage</Link>
          </div>
          <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td><strong style={{ color: '#fff' }}>{p.title}</strong></td>
                    <td>{p.location}</td>
                    <td>{p.featured ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
                {recentProjects.length === 0 && (
                  <tr><td colSpan={3} className="ad-empty">No projects yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
