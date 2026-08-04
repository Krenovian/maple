import prisma from '@/lib/prisma';

export const metadata = { title: 'Activity | Admin Workspace' };

export default async function AdminActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 80,
  });

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Activity</h1>
          <p>Who edited projects, products, tasks and leads.</p>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.actorName || '—'}</td>
                  <td>
                    <span className={`ad-badge ${String(log.action).toLowerCase()}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.entity}</td>
                  <td>{log.summary}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="ad-empty">No activity yet. Edits will show up here.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
