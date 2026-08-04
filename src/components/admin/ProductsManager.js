'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, Field, useAdminMutate, apiJson } from './ui';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';
import { parseJsonArray, parseSpecs } from '@/lib/catalog';

const EMPTY = {
  name: '',
  description: '',
  category: '',
  price: '',
  image: '',
  imageAlt: '',
  gallery: [],
  specsText: '',
  leadTime: '',
  inStock: true,
  metaTitle: '',
  metaDescription: '',
};

function specsToText(raw) {
  return parseSpecs(raw)
    .map((s) => `${s.label}: ${s.value}`)
    .join('\n');
}

function textToSpecs(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return null;
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((row) => row && row.label && row.value);
}

export default function ProductsManager({ initialProducts, categories = [] }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');

  const categoryNames = useMemo(
    () => categories.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean),
    [categories]
  );

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.leadTime || '').toLowerCase().includes(q)
    );
  }, [initialProducts, query]);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(products, 10, query);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, category: categoryNames[0] || '' });
    setError('');
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price || '',
      image: p.image,
      imageAlt: p.imageAlt || '',
      gallery: parseJsonArray(p.images),
      specsText: specsToText(p.specs),
      leadTime: p.leadTime || '',
      inStock: p.inStock,
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
    });
    setError('');
    setOpen(true);
  };

  const payloadFromForm = () => ({
    name: form.name,
    description: form.description,
    category: form.category,
    price: form.price,
    image: form.image,
    imageAlt: form.imageAlt,
    gallery: form.gallery,
    specs: textToSpecs(form.specsText),
    leadTime: form.leadTime,
    inStock: form.inStock,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
  });

  const save = async (e) => {
    e.preventDefault();
    const body = payloadFromForm();
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/products', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...body }),
        });
      } else {
        await apiJson('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
    });
    if (ok) setOpen(false);
  };

  const remove = async (id, name) => {
    if (!confirm(`Delete “${name}”?`)) return;
    await run(async () => {
      await apiJson(`/api/admin/products?id=${id}`, { method: 'DELETE' });
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
          <h1>Catalog</h1>
          <p>Shop products — categories, lead times, gallery and specs.</p>
        </div>
        <div className="ad-actions">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog…"
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
            Add Product
          </button>
        </div>
      </div>

      <div className="ad-panel">
        <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Lead time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="ad-thumb round">
                      <Image src={p.image} alt={p.imageAlt || ''} fill style={{ objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td><strong style={{ color: '#fff' }}>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>{p.price || '—'}</td>
                  <td>{p.leadTime || '—'}</td>
                  <td>
                    <span className={`ad-badge ${p.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {p.inStock ? 'In Stock' : 'Lead time'}
                    </span>
                  </td>
                  <td>
                    <div className="ad-row-actions">
                      <button type="button" className="ad-icon-btn" onClick={() => openEdit(p)}>Edit</button>
                      <button type="button" className="ad-icon-btn danger" onClick={() => remove(p.id, p.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {totalItems === 0 && (
                <tr><td colSpan={7} className="ad-empty">No products found.</td></tr>
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
        <Modal title={editing ? 'Edit Product' : 'New Product'} onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Field label="Name">
              <input required value={form.name} onChange={set('name')} />
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
              <Field label="Price">
                <input value={form.price} onChange={set('price')} placeholder="₹12,000/sqm" />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Lead time note">
                <input value={form.leadTime} onChange={set('leadTime')} placeholder="2–3 weeks" />
              </Field>
              <Field label="Cover alt text">
                <input value={form.imageAlt} onChange={set('imageAlt')} placeholder="Describe the image" />
              </Field>
            </div>
            <Field label="Cover image">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                folder="maple/products"
                label="Image URL"
              />
            </Field>
            <Field label="Gallery">
              <GalleryUpload
                values={form.gallery}
                onChange={(gallery) => setForm((f) => ({ ...f, gallery }))}
                folder="maple/products/gallery"
              />
            </Field>
            <Field label="Specs (one per line: Label: Value)">
              <textarea
                rows={4}
                value={form.specsText}
                onChange={set('specsText')}
                placeholder={'Thickness: 18mm\nFinish: Matte\nOrigin: Italy'}
              />
            </Field>
            <Field label="SEO title (optional)">
              <input value={form.metaTitle} onChange={set('metaTitle')} />
            </Field>
            <Field label="SEO description (optional)">
              <textarea rows={2} value={form.metaDescription} onChange={set('metaDescription')} />
            </Field>
            <label className="ad-check">
              <input type="checkbox" checked={form.inStock} onChange={set('inStock')} />
              Currently in stock
            </label>
            {error && <p className="dm-form-status err">{error}</p>}
            <div className="ad-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
