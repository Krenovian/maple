'use client';
import { useState } from 'react';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, Field, useAdminMutate, apiJson } from './ui';

const EMPTY = { name: '', email: '', password: '' };

export default function EmployeesManager({ initialEmployees }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(initialEmployees, 10);

  const openCreate = () => {
    setForm(EMPTY);
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const ok = await run(async () => {
      await apiJson('/api/admin/employees', {
        method: 'POST',
        body: JSON.stringify(form),
      });
    });
    if (ok) setOpen(false);
  };

  const remove = async (id, name) => {
    if (!confirm(`Remove ${name} from the team?`)) return;
    await run(async () => {
      await apiJson(`/api/admin/employees?id=${id}`, { method: 'DELETE' });
    });
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Team</h1>
          <p>Employee accounts that can access the workspace.</p>
        </div>
        <div className="ad-actions">
          <button type="button" className="btn btn-sm" onClick={openCreate}>Add Member</button>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Tasks</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((e) => (
                <tr key={e.id}>
                  <td><strong style={{ color: '#fff' }}>{e.name}</strong></td>
                  <td><a href={`mailto:${e.email}`}>{e.email}</a></td>
                  <td>{e._count?.tasks ?? 0}</td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button type="button" className="ad-icon-btn danger" onClick={() => remove(e.id, e.name)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr><td colSpan={5} className="ad-empty">No employees yet.</td></tr>
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
        <Modal title="Add Team Member" onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Field label="Full name">
              <input required value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Email">
              <input type="email" required value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Temporary password">
              <input type="password" required minLength={6} value={form.password} onChange={set('password')} />
            </Field>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Creating…' : 'Create Account'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
