'use client';
import { useMemo, useState } from 'react';
import { Modal, Field, useAdminMutate, apiJson } from './ui';

export default function CategoriesManager({ initialCategories }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'PRODUCT' });

  const productCats = useMemo(
    () => initialCategories.filter((c) => c.type === 'PRODUCT'),
    [initialCategories]
  );
  const projectCats = useMemo(
    () => initialCategories.filter((c) => c.type === 'PROJECT'),
    [initialCategories]
  );

  const openCreate = (type) => {
    setEditing(null);
    setForm({ name: '', type });
    setError('');
    setOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, type: cat.type });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/categories', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, name: form.name }),
        });
      } else {
        await apiJson('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
    });
    if (ok) setOpen(false);
  };

  const remove = async (cat) => {
    if (!confirm(`Delete category “${cat.name}”?`)) return;
    await run(async () => {
      await apiJson(`/api/admin/categories?id=${cat.id}`, { method: 'DELETE' });
    });
  };

  const Table = ({ title, rows, type }) => (
    <div className="ad-panel" style={{ marginBottom: '1.25rem' }}>
      <div className="ad-panel-head">
        <h2>{title}</h2>
        <button type="button" className="btn btn-sm" onClick={() => openCreate(type)}>
          Add
        </button>
      </div>
      <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td><strong style={{ color: '#fff' }}>{c.name}</strong></td>
                <td>
                  <div className="ad-row-actions">
                    <button type="button" className="ad-icon-btn" onClick={() => openEdit(c)}>Rename</button>
                    <button type="button" className="ad-icon-btn danger" onClick={() => remove(c)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="ad-empty">No categories yet. Add one to use in forms.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Categories</h1>
          <p>Add, rename, or delete categories for the shop catalog and portfolio projects.</p>
        </div>
      </div>

      {error && !open && (
        <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      <Table title="Product / shop categories" rows={productCats} type="PRODUCT" />
      <Table title="Project / portfolio categories" rows={projectCats} type="PROJECT" />

      {open && (
        <Modal
          title={editing ? `Rename ${editing.type === 'PRODUCT' ? 'product' : 'project'} category` : `New ${form.type === 'PRODUCT' ? 'product' : 'project'} category`}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={save}>
            {!editing && (
              <Field label="Type">
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="PRODUCT">Product / shop</option>
                  <option value="PROJECT">Project / portfolio</option>
                </select>
              </Field>
            )}
            <Field label="Name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={form.type === 'PRODUCT' ? 'e.g. Stone' : 'e.g. Residential'}
              />
            </Field>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Saving…' : editing ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
