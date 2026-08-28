'use client';

import { useMemo, useState } from 'react';
import ImageUpload from './ImageUpload';
import { Field, useAdminMutate, apiJson } from './ui';
import { getDefaultShopSettings, groupShopSettingFields } from '@/lib/shopSettings';

export default function ShopSettingsManager({ initialSettings }) {
  const groups = useMemo(() => groupShopSettingFields(), []);
  const defaults = useMemo(() => getDefaultShopSettings(), []);
  const { busy, error, setError, run } = useAdminMutate();
  const [form, setForm] = useState({
    ...defaults,
    ...initialSettings,
    shop_promo_enabled: initialSettings.shop_promo_enabled ? 'true' : 'false',
    shop_banner_enabled: initialSettings.shop_banner_enabled ? 'true' : 'false',
  });
  const [saved, setSaved] = useState('');

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () =>
    run(async () => {
      await apiJson('/api/admin/shop-settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setSaved('Shop settings updated.');
      setTimeout(() => setSaved(''), 2500);
    });

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Shop &amp; promos</h1>
          <p>
            Control THE DECOR CLUB promo strip and offer banner on the shop page. Mark products
            as featured in Catalog to highlight them on the homepage.
          </p>
        </div>
        <div className="ad-actions">
          <button type="button" className="btn btn-sm" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save shop settings'}
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div className="ad-panel" key={group.section} style={{ marginBottom: '1.5rem' }}>
          <div className="ad-panel-head">
            <h2>{group.section}</h2>
          </div>
          <div className="ad-panel-body ad-shop-settings-grid">
            {group.fields.map((field) => (
              <div className="ad-shop-setting" key={field.id}>
                <div className="ad-site-image-meta">
                  <strong>{field.label}</strong>
                  <span>{field.usedIn}</span>
                </div>
                {field.type === 'boolean' ? (
                  <label className="ad-check">
                    <input
                      type="checkbox"
                      checked={form[field.id] === 'true'}
                      onChange={(e) => setField(field.id, e.target.checked ? 'true' : 'false')}
                    />
                    Enabled
                  </label>
                ) : field.type === 'image' ? (
                  <Field label="Image">
                    <ImageUpload
                      value={form[field.id] || ''}
                      onChange={(url) => setField(field.id, url)}
                      folder={field.folder}
                      label={field.label}
                    />
                  </Field>
                ) : (
                  <Field label={field.label}>
                    {field.id === 'shop_banner_text' ? (
                      <textarea
                        rows={3}
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
                )}
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
