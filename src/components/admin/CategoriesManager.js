'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Modal, Field, useAdminMutate, apiJson } from './ui';
import ImageUpload from './ImageUpload';
import { buildCategoryTree, flattenCategoryOptions } from '@/lib/categoryTree';

const EMPTY = {
  name: '',
  type: 'PRODUCT',
  parentId: '',
  image: '',
  imageAlt: '',
  sortOrder: 0,
};

function CategoryRow({ category, depth, onEdit, onRemove }) {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: `${depth * 1.1}rem` }}>
          <div className="ad-thumb round" style={{ width: 44, height: 44, position: 'relative', flexShrink: 0 }}>
            {category.image ? (
              <Image src={category.image} alt={category.imageAlt || category.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', color: 'var(--text-dim)' }}>
                —
              </span>
            )}
          </div>
          <strong style={{ color: '#fff' }}>{category.name}</strong>
        </div>
      </td>
      <td>{depth === 0 ? 'Main' : 'Sub'}</td>
      <td>
        <div className="ad-row-actions">
          <button type="button" className="ad-icon-btn" onClick={() => onEdit(category)}>Edit</button>
          <button type="button" className="ad-icon-btn danger" onClick={() => onRemove(category)}>Delete</button>
        </div>
      </td>
    </tr>
  );
}

function flattenRows(tree, depth = 0) {
  const rows = [];
  for (const node of tree) {
    rows.push({ category: node, depth });
    if (node.children.length) rows.push(...flattenRows(node.children, depth + 1));
  }
  return rows;
}

export default function CategoriesManager({ initialCategories }) {
  const { busy, error, setError, run } = useAdminMutate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const productTree = useMemo(
    () => buildCategoryTree(initialCategories.filter((category) => category.type === 'PRODUCT')),
    [initialCategories]
  );
  const projectTree = useMemo(
    () => buildCategoryTree(initialCategories.filter((category) => category.type === 'PROJECT')),
    [initialCategories]
  );

  const parentOptions = useMemo(() => {
    const options = flattenCategoryOptions(initialCategories, form.type);
    if (!editing) return options;
    return options.filter((option) => option.id !== editing.id);
  }, [initialCategories, form.type, editing]);

  const openCreate = (type) => {
    setEditing(null);
    setForm({ ...EMPTY, type });
    setError('');
    setOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      type: category.type,
      parentId: category.parentId || '',
      image: category.image || '',
      imageAlt: category.imageAlt || '',
      sortOrder: category.sortOrder || 0,
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      parentId: form.parentId || null,
      sortOrder: Number(form.sortOrder) || 0,
    };
    const ok = await run(async () => {
      if (editing) {
        await apiJson('/api/admin/categories', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
      } else {
        await apiJson('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    });
    if (ok) setOpen(false);
  };

  const remove = async (category) => {
    if (!confirm(`Delete category “${category.name}”?`)) return;
    await run(async () => {
      await apiJson(`/api/admin/categories?id=${category.id}`, { method: 'DELETE' });
    });
  };

  const Table = ({ title, tree, type }) => {
    const rows = flattenRows(tree);
    return (
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
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ category, depth }) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  depth={depth}
                  onEdit={openEdit}
                  onRemove={remove}
                />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="ad-empty">No categories yet. Add one to use in forms.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Categories</h1>
          <p>
            Add main and sub categories with optional images. Subcategories appear nested under their
            parent in admin and on the shop.
          </p>
        </div>
      </div>

      {error && !open && (
        <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      <Table title="Product / shop categories" tree={productTree} type="PRODUCT" />
      <Table title="Project / portfolio categories" tree={projectTree} type="PROJECT" />

      {open && (
        <Modal
          title={
            editing
              ? `Edit ${editing.type === 'PRODUCT' ? 'product' : 'project'} category`
              : `New ${form.type === 'PRODUCT' ? 'product' : 'project'} category`
          }
          onClose={() => setOpen(false)}
        >
          <form onSubmit={save}>
            {!editing && (
              <Field label="Type">
                <select
                  value={form.type}
                  onChange={(e) => setForm((current) => ({ ...current, type: e.target.value, parentId: '' }))}
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
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                placeholder={form.type === 'PRODUCT' ? 'e.g. Antique Brass' : 'e.g. Residential'}
              />
            </Field>
            {form.type === 'PRODUCT' ? (
              <Field label="Parent category (optional)">
                <select
                  value={form.parentId}
                  onChange={(e) => setForm((current) => ({ ...current, parentId: e.target.value }))}
                >
                  <option value="">None — main category</option>
                  {parentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {`${'  '.repeat(option.depth)}${option.label}`}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
            {form.type === 'PRODUCT' ? (
              <>
                <Field label="Category image">
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm((current) => ({ ...current, image: url }))}
                    folder="maple/categories"
                    label="Category image"
                  />
                </Field>
                <Field label="Image alt text">
                  <input
                    value={form.imageAlt}
                    onChange={(e) => setForm((current) => ({ ...current, imageAlt: e.target.value }))}
                    placeholder="Describe the category image"
                  />
                </Field>
              </>
            ) : null}
            <Field label="Sort order">
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((current) => ({ ...current, sortOrder: e.target.value }))}
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
