'use client';
import { useMemo, useState } from 'react';
import MapleImage from '@/components/MapleImage';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, Field, useAdminMutate, apiJson } from './ui';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';

function parseGallery(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

const EMPTY = {
  title: '',
  description: '',
  category: '',
  location: '',
  area: '',
  year: '',
  image: '',
  imageAlt: '',
  gallery: [],
  status: 'Completed',
  featured: true,
  metaTitle: '',
  metaDescription: '',
};

export default function ProjectsManager({ initialProjects, employees = [], categories = [] }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');
  const [taskFor, setTaskFor] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  const categoryNames = useMemo(
    () => categories.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean),
    [categories]
  );

  const projects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialProjects;
    return initialProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [initialProjects, query]);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(projects, 10, query);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, category: categoryNames[0] || '' });
    setError('');
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      category: p.category,
      location: p.location,
      area: p.area || '',
      year: p.year || '',
      image: p.image,
      imageAlt: p.imageAlt || '',
      gallery: parseGallery(p.images),
      status: p.status,
      featured: p.featured,
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/projects', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...form }),
        });
      } else {
        await apiJson('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
    });
    if (ok) setOpen(false);
  };

  const remove = async (id, title) => {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    await run(async () => {
      await apiJson(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
    });
  };

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Projects</h1>
          <p>Manage featured work and portfolio entries.</p>
        </div>
        <div className="ad-actions">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            style={{
              minWidth: 200,
              padding: '0.7rem 1rem',
              borderRadius: 999,
              border: '1px solid var(--line)',
              background: 'var(--panel)',
              color: 'var(--text)',
              fontSize: '0.85rem',
            }}
          />
          <button type="button" className="btn btn-sm" onClick={openCreate}>
            Add Project
          </button>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="ad-thumb">
                      <MapleImage src={p.image} alt="" fill style={{ objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: '#fff' }}>{p.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>{p.category}</div>
                  </td>
                  <td>{p.location}</td>
                  <td>
                    <span className={`ad-badge ${p.status.toLowerCase()}`}>{p.status}</span>
                  </td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="ad-row-actions">
                      <button type="button" className="ad-icon-btn" onClick={() => openEdit(p)}>Edit</button>
                      {employees.length > 0 && (
                        <button
                          type="button"
                          className="ad-icon-btn"
                          onClick={() => {
                            setTaskFor(p);
                            setTaskForm({
                              title: `Follow-up: ${p.title}`,
                              description: '',
                              assigneeId: employees[0]?.id || '',
                              priority: 'MEDIUM',
                              dueDate: '',
                            });
                            setError('');
                          }}
                        >
                          Assign task
                        </button>
                      )}
                      <button type="button" className="ad-icon-btn danger" onClick={() => remove(p.id, p.title)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr>
                  <td colSpan={6} className="ad-empty">No projects found.</td>
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
        <Modal title={editing ? 'Edit Project' : 'New Project'} onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Field label="Title">
              <input required value={form.title} onChange={set('title')} />
            </Field>
            <Field label="Description">
              <textarea required value={form.description} onChange={set('description')} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Category">
                <select required value={form.category} onChange={set('category')}>
                  <option value="" disabled>Select category…</option>
                  {categoryNames.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {form.category && !categoryNames.includes(form.category) && (
                    <option value={form.category}>{form.category} (legacy)</option>
                  )}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={set('status')}>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Concept</option>
                </select>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Location">
                <input required value={form.location} onChange={set('location')} />
              </Field>
              <Field label="Year">
                <input value={form.year} onChange={set('year')} placeholder="2026" />
              </Field>
            </div>
            <Field label="Area">
              <input value={form.area} onChange={set('area')} placeholder="4,200 sq ft" />
            </Field>
            <Field label="Cover image">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                folder="maple/projects"
                label="Cover image URL"
              />
            </Field>
            <Field label="Cover alt text">
              <input value={form.imageAlt} onChange={set('imageAlt')} placeholder="Describe the cover image" />
            </Field>
            <Field label="Gallery">
              <GalleryUpload
                values={form.gallery}
                onChange={(gallery) => setForm((f) => ({ ...f, gallery }))}
                folder="maple/projects/gallery"
              />
            </Field>
            <Field label="SEO title (optional)">
              <input value={form.metaTitle} onChange={set('metaTitle')} />
            </Field>
            <Field label="SEO description (optional)">
              <textarea rows={2} value={form.metaDescription} onChange={set('metaDescription')} />
            </Field>
            <label className="ad-check">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} />
              Featured on homepage
            </label>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {taskFor && (
        <Modal title={`Assign task · ${taskFor.title}`} onClose={() => setTaskFor(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await run(async () => {
                await apiJson('/api/admin/tasks', {
                  method: 'POST',
                  body: JSON.stringify({
                    ...taskForm,
                    projectId: taskFor.id,
                    projectName: taskFor.title,
                  }),
                });
              });
              if (ok) setTaskFor(null);
            }}
          >
            <Field label="Title">
              <input
                required
                value={taskForm.title}
                onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
            <Field label="Assign to">
              <select
                required
                value={taskForm.assigneeId}
                onChange={(e) => setTaskForm((f) => ({ ...f, assigneeId: e.target.value }))}
              >
                <option value="">Select employee…</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Priority">
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm((f) => ({ ...f, priority: e.target.value }))}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </Field>
              <Field label="Due date">
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
              </Field>
            </div>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setTaskFor(null)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Assigning…' : 'Assign task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
