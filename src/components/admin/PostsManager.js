'use client';
import { useMemo, useState } from 'react';
import MapleImage from '@/components/MapleImage';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, Field, useAdminMutate, apiJson } from './ui';
import ImageUpload from './ImageUpload';

const EMPTY = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  imageAlt: '',
  authorName: '',
  published: false,
  featured: false,
  metaTitle: '',
  metaDescription: '',
};

export default function PostsManager({ initialPosts }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialPosts;
    return initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.authorName || '').toLowerCase().includes(q)
    );
  }, [initialPosts, query]);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(posts, 10, query);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setOpen(true);
  };

  const openEdit = (post) => {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      image: post.image || '',
      imageAlt: post.imageAlt || '',
      authorName: post.authorName || '',
      published: post.published,
      featured: post.featured,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/posts', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...form }),
        });
      } else {
        await apiJson('/api/admin/posts', {
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
      await apiJson(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
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
          <h1>Blog</h1>
          <p>Create and publish journal posts for the public blog.</p>
        </div>
        <div className="ad-actions">
          <input
            className="ad-search"
            placeholder="Search posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="btn btn-sm" onClick={openCreate}>New post</button>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Author</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {post.image ? (
                        <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                          <MapleImage src={post.image} alt="" fill sizes="48px" style={{ objectFit: 'cover' }} />
                        </div>
                      ) : null}
                      <div>
                        <strong style={{ color: '#fff' }}>{post.title}</strong>
                        {post.featured ? <span className="ad-badge status" style={{ marginLeft: '0.5rem' }}>Featured</span> : null}
                        {post.excerpt ? <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{post.excerpt}</div> : null}
                      </div>
                    </div>
                  </td>
                  <td>{post.authorName || '—'}</td>
                  <td>
                    <span className={`ad-badge ${post.published ? 'update' : 'status'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button type="button" className="ad-icon-btn" onClick={() => openEdit(post)}>Edit</button>
                      <button type="button" className="ad-icon-btn danger" onClick={() => remove(post.id, post.title)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr><td colSpan={5} className="ad-empty">No blog posts yet.</td></tr>
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
        <Modal title={editing ? 'Edit post' : 'New post'} onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Field label="Title">
              <input required value={form.title} onChange={set('title')} />
            </Field>
            <Field label="Excerpt">
              <textarea rows={2} value={form.excerpt} onChange={set('excerpt')} placeholder="Short summary for the blog listing" />
            </Field>
            <Field label="Content">
              <textarea required rows={8} value={form.content} onChange={set('content')} placeholder="Write the article. Separate paragraphs with blank lines." />
            </Field>
            <Field label="Cover image">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm((current) => ({ ...current, image: url }))}
                folder="maple/blog"
                label="Blog cover"
              />
            </Field>
            <Field label="Image alt text">
              <input value={form.imageAlt} onChange={set('imageAlt')} />
            </Field>
            <Field label="Author name">
              <input value={form.authorName} onChange={set('authorName')} placeholder="e.g. Maple Studio" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Published">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={form.published} onChange={set('published')} />
                  <span>Show on public blog</span>
                </label>
              </Field>
              <Field label="Featured">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={form.featured} onChange={set('featured')} />
                  <span>Highlight on blog index</span>
                </label>
              </Field>
            </div>
            <Field label="SEO title">
              <input value={form.metaTitle} onChange={set('metaTitle')} />
            </Field>
            <Field label="SEO description">
              <textarea rows={2} value={form.metaDescription} onChange={set('metaDescription')} />
            </Field>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Saving…' : editing ? 'Save changes' : 'Create post'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
