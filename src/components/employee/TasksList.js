'use client';
import { Pagination, usePagination } from '@/components/Pagination';
import { useAdminMutate, apiJson } from '@/components/admin/ui';

export default function TasksList({ tasks }) {
  const { busy, error, run } = useAdminMutate();
  const { page, setPage, totalPages, totalItems, paged } = usePagination(tasks, 10);

  const setStatus = async (id, status) => {
    await run(async () => {
      await apiJson('/api/admin/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
    });
  };

  return (
    <div className="ad-panel">
      {error && (
        <div className="login-error" style={{ margin: '1rem 1.25rem 0' }}>{error}</div>
      )}
      <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((t) => (
              <tr key={t.id}>
                <td>
                  <strong style={{ color: '#fff' }}>{t.title}</strong>
                  {t.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {t.description}
                    </div>
                  )}
                </td>
                <td>{t.projectName || '—'}</td>
                <td style={{ color: t.priority === 'HIGH' ? 'var(--danger)' : 'inherit' }}>
                  {t.priority}
                </td>
                <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                <td>
                  <span className={`ad-badge ${t.status.toLowerCase()}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {t.status === 'PENDING' && (
                    <button
                      type="button"
                      className="ad-icon-btn"
                      disabled={busy}
                      onClick={() => setStatus(t.id, 'IN_PROGRESS')}
                    >
                      Start
                    </button>
                  )}
                  {t.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      className="ad-icon-btn"
                      disabled={busy}
                      onClick={() => setStatus(t.id, 'COMPLETED')}
                    >
                      Finish
                    </button>
                  )}
                  {t.status === 'COMPLETED' && (
                    <button
                      type="button"
                      className="ad-icon-btn"
                      disabled={busy}
                      onClick={() => setStatus(t.id, 'IN_PROGRESS')}
                    >
                      Reopen
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {totalItems === 0 && (
              <tr>
                <td colSpan={6} className="ad-empty">You have no assigned tasks.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={totalItems}
          pageSize={10}
        />
      </div>
    </div>
  );
}
