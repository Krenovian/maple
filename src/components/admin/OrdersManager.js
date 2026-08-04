'use client';
import { useMemo, useState } from 'react';
import { Pagination, usePagination } from '@/components/Pagination';
import { buildWhatsAppUrl, formatOrderWhatsAppMessage } from '@/lib/whatsapp';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

function parseItems(raw) {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function OrdersManager({ initialLeads = [] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(null);

  useBodyScrollLock(!!active);

  const sorted = useMemo(
    () => [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [leads]
  );

  const { page, setPage, totalPages, totalItems, paged } = usePagination(sorted, 10);

  const updateStatus = async (id, status) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
      setActive((curr) => (curr?.id === id ? { ...curr, ...updated } : curr));
    } catch {
      alert('Could not update status');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this order lead?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setActive(null);
    } catch {
      alert('Could not delete');
    } finally {
      setBusy(false);
    }
  };

  const openWa = (lead) => {
    const items = parseItems(lead.items);
    const url = buildWhatsAppUrl(
      formatOrderWhatsAppMessage({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        note: lead.note,
        items,
        source: lead.source,
      })
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Order leads</h1>
          <p>Cart checkouts and WhatsApp product enquiries saved from the site.</p>
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Lead</th>
              <th>Source</th>
              <th>Items</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paged.map((lead) => {
              const items = parseItems(lead.items);
              return (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleString('en-IN')}</td>
                  <td>
                    <strong>{lead.name}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {lead.email}<br />{lead.phone}
                    </div>
                  </td>
                  <td>{lead.source}</td>
                  <td>{items.length}</td>
                  <td>
                    <span className={`status-badge status-${String(lead.status || 'new').toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button type="button" className="ad-icon-btn" onClick={() => setActive(lead)}>View</button>
                    <button type="button" className="ad-icon-btn" onClick={() => openWa(lead)}>WA</button>
                  </td>
                </tr>
              );
            })}
            {totalItems === 0 && (
              <tr>
                <td colSpan={6} style={{ color: 'var(--text-muted)' }}>No order leads yet.</td>
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

      {active && (
        <div
          className="dm-drawer-overlay"
          onClick={() => setActive(null)}
          role="presentation"
          data-lenis-prevent
        >
          <div
            className="dm-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
          >
            <div className="dm-drawer-head">
              <h2>{active.name}</h2>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setActive(null)}>Close</button>
            </div>
            <div className="dm-drawer-meta">
              <span>{active.source}</span>
              <span>{active.status}</span>
              <span>{new Date(active.createdAt).toLocaleString('en-IN')}</span>
            </div>
            <p><strong>Email:</strong> {active.email}</p>
            <p><strong>Phone:</strong> {active.phone}</p>
            {active.note && <p style={{ marginTop: '0.75rem' }}><strong>Note:</strong> {active.note}</p>}
            <ul style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {parseItems(active.items).map((item, i) => (
                <li key={`${item.slug}-${i}`}>
                  {item.name} · {item.finish} · {item.sample} · qty {item.qty}
                  {item.price ? ` · ${item.price}` : ''}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-sm" onClick={() => openWa(active)}>Open WhatsApp ↗</button>
              <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => updateStatus(active.id, 'CONTACTED')}>Mark contacted</button>
              <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => updateStatus(active.id, 'CLOSED')}>Close lead</button>
              <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => remove(active.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
