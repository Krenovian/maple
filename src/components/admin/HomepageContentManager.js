'use client';

import { useMemo, useState } from 'react';
import { Field, useAdminMutate, apiJson } from './ui';
import {
  getDefaultHomepageContent,
  groupHomepageContentFields,
} from '@/lib/siteContentFields';

export default function HomepageContentManager({ initialContent }) {
  const groups = useMemo(() => groupHomepageContentFields(), []);
  const defaults = useMemo(() => getDefaultHomepageContent(), []);
  const { busy, error, setError, run } = useAdminMutate();
  const [form, setForm] = useState(initialContent);
  const [saved, setSaved] = useState('');

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () =>
    run(async () => {
      await apiJson('/api/admin/homepage-content', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setSaved('Homepage content updated.');
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
          <h1>Homepage content</h1>
          <p>
            Edit the Ethos / Practice section and the testimonial quote. Section images are managed
            under Site images.
          </p>
        </div>
        <div className="ad-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={resetDefaults} disabled={busy}>
            Reset to defaults
          </button>
          <button type="button" className="btn btn-sm" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save content'}
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div className="ad-panel" key={group.section} style={{ marginBottom: '1.5rem' }}>
          <div className="ad-panel-head">
            <h2>{group.section}</h2>
          </div>
          <div className="ad-panel-body ad-homepage-content-grid">
            {group.fields.map((field) => (
              <div className="ad-homepage-content-field" key={field.id}>
                <div className="ad-site-image-meta">
                  <strong>{field.label}</strong>
                  <span>{field.usedIn}</span>
                </div>
                <Field label={field.label}>
                  {field.multiline ? (
                    <textarea
                      rows={field.id === 'manifesto_statement' ? 4 : 5}
                      value={form[field.id] || ''}
                      onChange={(e) => setField(field.id, e.target.value)}
                    />
                  ) : (
                    <input
                      value={form[field.id] || ''}
                      onChange={(e) => setField(field.id, e.target.value)}
                    />
                  )}
                </Field>
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
