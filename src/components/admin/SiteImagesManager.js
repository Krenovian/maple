'use client';

import { useMemo, useState } from 'react';
import ImageUpload from './ImageUpload';
import { Field, useAdminMutate, apiJson } from './ui';
import { getDefaultSiteImages, groupSiteImageFields } from '@/lib/siteImageFields';

export default function SiteImagesManager({ initialImages }) {
  const groups = useMemo(() => groupSiteImageFields(), []);
  const defaults = useMemo(() => getDefaultSiteImages(), []);
  const { busy, error, setError, run } = useAdminMutate();
  const [form, setForm] = useState(initialImages);
  const [saved, setSaved] = useState('');

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () =>
    run(async () => {
      await apiJson('/api/admin/site-settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setSaved('Site images updated.');
      setTimeout(() => setSaved(''), 2500);
    });

  const resetDefaults = () => {
    setError('');
    setForm(defaults);
  };

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Site images</h1>
          <p>
            Manage every marketing image used across the homepage, About page, and Services page.
            Upload an image or paste a URL, then save.
          </p>
        </div>
        <div className="ad-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={resetDefaults} disabled={busy}>
            Reset all to defaults
          </button>
          <button type="button" className="btn btn-sm" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save all images'}
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div className="ad-panel" key={group.section} style={{ marginBottom: '1.5rem' }}>
          <div className="ad-panel-head">
            <h2>{group.section}</h2>
          </div>
          <div className="ad-panel-body ad-site-images-grid">
            {group.fields.map((field) => (
              <div className="ad-site-image-card" key={field.id}>
                <div className="ad-site-image-meta">
                  <strong>{field.label}</strong>
                  <span>{field.usedIn}</span>
                </div>
                <Field label="Image">
                  <ImageUpload
                    value={form[field.id] || ''}
                    onChange={(url) => setField(field.id, url)}
                    folder={field.folder}
                    label={field.label}
                  />
                </Field>
                {field.altId ? (
                  <Field label="Alt text">
                    <input
                      value={form[field.altId] || ''}
                      onChange={(e) => setField(field.altId, e.target.value)}
                      placeholder={field.defaultAlt}
                    />
                  </Field>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="dm-form-status err">{error}</p>}
      {saved && <p className="dm-form-status ok">{saved}</p>}
    </>
  );
}
