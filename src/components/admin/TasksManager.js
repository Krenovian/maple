'use client';
import { useState } from 'react';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, Field, useAdminMutate, apiJson } from './ui';

const EMPTY = {
  title: '',
  description: '',
  projectId: '',
  priority: 'MEDIUM',
  status: 'PENDING',
  assigneeId: '',
  dueDate: '',
};

export default function TasksManager({ initialTasks, employees, projects = [] }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(initialTasks, 10);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      projectId: task.projectId || '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'PENDING',
      assigneeId: task.assigneeId || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      assigneeId: form.assigneeId || null,
      projectId: form.projectId || null,
      dueDate: form.dueDate || null,
    };
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/tasks', {
          method: 'PATCH',
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
      } else {
        await apiJson('/api/admin/tasks', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    });
    if (ok) setOpen(false);
  };

  const remove = async (id, title) => {
    if (!confirm(`Delete task “${title}”?`)) return;
    await run(async () => {
      await apiJson(`/api/admin/tasks?id=${id}`, { method: 'DELETE' });
    });
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const projectLabel = (t) => t.project?.title || t.projectName || '—';

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Tasks</h1>
          <p>Assign work to the team and link it to portfolio projects.</p>
        </div>
        <div className="ad-actions">
          <button type="button" className="btn btn-sm" onClick={openCreate}>
            Assign Task
          </button>
        </div>
      </div>

      {error && !open && (
        <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assignee</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due</th>
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
                  <td>{t.assignee?.name || 'Unassigned'}</td>
                  <td>{projectLabel(t)}</td>
                  <td style={{ color: t.priority === 'HIGH' ? 'var(--danger)' : 'inherit' }}>
                    {t.priority}
                  </td>
                  <td>
                    <span className={`ad-badge ${t.status.toLowerCase()}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button type="button" className="ad-icon-btn" onClick={() => openEdit(t)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ad-icon-btn danger"
                      onClick={() => remove(t.id, t.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr>
                  <td colSpan={7} className="ad-empty">No tasks assigned yet.</td>
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

      {open && (
        <Modal title={editing ? 'Edit Task' : 'Assign Task'} onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            {error && <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            <Field label="Title">
              <input value={form.title} onChange={set('title')} required />
            </Field>
            <Field label="Description">
              <textarea rows={3} value={form.description} onChange={set('description')} />
            </Field>
            <Field label="Assign to">
              <select value={form.assigneeId} onChange={set('assigneeId')} required>
                <option value="">Select employee…</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Portfolio project">
              <select value={form.projectId} onChange={set('projectId')}>
                <option value="">No linked project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <Field label="Priority">
                <select value={form.priority} onChange={set('priority')}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={set('status')}>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </Field>
            </div>
            <Field label="Due date">
              <input type="date" value={form.dueDate} onChange={set('dueDate')} />
            </Field>
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Saving…' : editing ? 'Save Changes' : 'Assign'}
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
