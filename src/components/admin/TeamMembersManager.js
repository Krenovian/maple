'use client';
import { useMemo, useState } from 'react';
import MapleImage from '@/components/MapleImage';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, Field, useAdminMutate, apiJson } from './ui';
import ImageUpload from './ImageUpload';

const EMPTY = {
  name: '',
  role: '',
  bio: '',
  image: '',
  imageAlt: '',
  sortOrder: 0,
  featured: true,
};

export default function TeamMembersManager({ initialMembers }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');

  const members = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialMembers;
    return initialMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q)
    );
  }, [initialMembers, query]);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(members, 12, query);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image: member.image || '',
      imageAlt: member.imageAlt || '',
      sortOrder: member.sortOrder || 0,
      featured: member.featured,
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/team-members', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...form }),
        });
      } else {
        await apiJson('/api/admin/team-members', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
    });
    if (ok) setOpen(false);
  };

  const remove = async (id, name) => {
    if (!confirm(`Remove ${name} from the team page?`)) return;
    await run(async () => {
      await apiJson(`/api/admin/team-members?id=${id}`, { method: 'DELETE' });
    });
  };

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Team profiles</h1>
          <p>Manage the public team page — names, roles and photos shown to visitors.</p>
        </div>
        <div className="ad-actions">
          <input
            className="ad-search"
            placeholder="Search team…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="btn btn-sm" onClick={openCreate}>Add member</button>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Order</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ position: 'relative', width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.06)' }}>
                        {member.image ? (
                          <MapleImage src={member.image} alt="" fill sizes="48px" style={{ objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <strong style={{ color: '#fff' }}>{member.name}</strong>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td>{member.sortOrder}</td>
                  <td>
                    <span className={`ad-badge ${member.featured ? 'update' : 'status'}`}>
                      {member.featured ? 'Shown' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button type="button" className="ad-icon-btn" onClick={() => openEdit(member)}>Edit</button>
                      <button type="button" className="ad-icon-btn danger" onClick={() => remove(member.id, member.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr><td colSpan={5} className="ad-empty">No team members yet.</td></tr>
              )}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            totalItems={totalItems}
            pageSize={12}
          />
        </div>
      </div>

      {open && (
        <Modal title={editing ? 'Edit team member' : 'Add team member'} onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Field label="Full name">
              <input required value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Role / title">
              <input required value={form.role} onChange={set('role')} placeholder="e.g. Licensed Architect" />
            </Field>
            <Field label="Short bio">
              <textarea rows={3} value={form.bio} onChange={set('bio')} placeholder="Optional — shown on the team page" />
            </Field>
            <Field label="Photo">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm((current) => ({ ...current, image: url }))}
                folder="maple/team"
                label="Team photo"
              />
            </Field>
            <Field label="Photo alt text">
              <input value={form.imageAlt} onChange={set('imageAlt')} placeholder={form.name || 'Team member photo'} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Sort order">
                <input type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} />
              </Field>
              <Field label="Show on team page">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={form.featured} onChange={set('featured')} />
                  <span>Visible to visitors</span>
                </label>
              </Field>
            </div>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
