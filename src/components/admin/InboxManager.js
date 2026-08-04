'use client';
import { useMemo, useState } from 'react';
import { Pagination, usePagination } from '@/components/Pagination';
import { Modal, useAdminMutate, apiJson } from './ui';

export default function InboxManager({ initialInquiries, initialMessages }) {
  const { busy, run } = useAdminMutate();
  const [tab, setTab] = useState('messages');
  const [active, setActive] = useState(null);

  const inquiries = initialInquiries;
  const messages = initialMessages;

  const counts = useMemo(
    () => ({
      messages: messages.filter((m) => m.status === 'UNREAD').length,
      inquiries: inquiries.filter((i) => i.status === 'NEW').length,
    }),
    [messages, inquiries]
  );

  const {
    page: msgPage,
    setPage: setMsgPage,
    totalPages: msgTotalPages,
    totalItems: msgTotalItems,
    paged: pagedMessages,
  } = usePagination(messages, 10, tab);

  const {
    page: inqPage,
    setPage: setInqPage,
    totalPages: inqTotalPages,
    totalItems: inqTotalItems,
    paged: pagedInquiries,
  } = usePagination(inquiries, 10, tab);

  const updateStatus = async (type, id, status) => {
    await run(async () => {
      await apiJson('/api/admin/inbox', {
        method: 'PATCH',
        body: JSON.stringify({ type, id, status }),
      });
      if (active?.id === id) setActive((a) => (a ? { ...a, status } : a));
    });
  };

  const remove = async (type, id) => {
    if (!confirm('Delete this item permanently?')) return;
    await run(async () => {
      await apiJson(`/api/admin/inbox?type=${type}&id=${id}`, { method: 'DELETE' });
      setActive(null);
    });
  };

  return (
    <>
      <div className="ad-top">
        <div>
          <h1>Inbox</h1>
          <p>Contact messages and product inquiries from the website.</p>
        </div>
        <div className="ad-actions">
          <button
            type="button"
            className={`btn btn-sm ${tab === 'messages' ? '' : 'btn-outline'}`}
            onClick={() => {
              setTab('messages');
              setActive(null);
            }}
          >
            Messages {counts.messages > 0 ? `(${counts.messages})` : ''}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'inquiries' ? '' : 'btn-outline'}`}
            onClick={() => {
              setTab('inquiries');
              setActive(null);
            }}
          >
            Inquiries {counts.inquiries > 0 ? `(${counts.inquiries})` : ''}
          </button>
        </div>
      </div>

      {tab === 'messages' ? (
        <div className="ad-panel">
          <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedMessages.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <strong style={{ color: '#fff' }}>{m.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{m.email}</div>
                    </td>
                    <td>{m.subject || '—'}</td>
                    <td><span className={`ad-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
                    <td>
                      <div className="ad-row-actions">
                        <button type="button" className="ad-icon-btn" onClick={() => setActive({ ...m, _type: 'message' })}>
                          Open
                        </button>
                        {m.status === 'UNREAD' && (
                          <button type="button" className="ad-icon-btn" disabled={busy} onClick={() => updateStatus('message', m.id, 'READ')}>
                            Mark Read
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {msgTotalItems === 0 && (
                  <tr><td colSpan={5} className="ad-empty">No contact messages yet.</td></tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={msgPage}
              totalPages={msgTotalPages}
              onChange={setMsgPage}
              totalItems={msgTotalItems}
              pageSize={10}
            />
          </div>
        </div>
      ) : (
        <div className="ad-panel">
          <div className="ad-panel-body" style={{ overflowX: 'auto' }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedInquiries.map((i) => (
                  <tr key={i.id}>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td>
                      <strong style={{ color: '#fff' }}>{i.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{i.email}</div>
                    </td>
                    <td>{i.product?.name || '—'}</td>
                    <td><span className={`ad-badge ${i.status.toLowerCase()}`}>{i.status}</span></td>
                    <td>
                      <div className="ad-row-actions">
                        <button type="button" className="ad-icon-btn" onClick={() => setActive({ ...i, _type: 'inquiry' })}>
                          Open
                        </button>
                        {i.status === 'NEW' && (
                          <button type="button" className="ad-icon-btn" disabled={busy} onClick={() => updateStatus('inquiry', i.id, 'CONTACTED')}>
                            Mark Contacted
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {inqTotalItems === 0 && (
                  <tr><td colSpan={5} className="ad-empty">No product inquiries yet.</td></tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={inqPage}
              totalPages={inqTotalPages}
              onChange={setInqPage}
              totalItems={inqTotalItems}
              pageSize={10}
            />
          </div>
        </div>
      )}

      {active && (
        <Modal title={active._type === 'message' ? 'Contact Message' : 'Product Inquiry'} onClose={() => setActive(null)}>
          <div className="ad-detail">
            <div><strong>From</strong><br />{active.name} · <a href={`mailto:${active.email}`}>{active.email}</a></div>
            {active.phone && <div><strong>Phone</strong><br />{active.phone}</div>}
            {active.subject && <div><strong>Subject</strong><br />{active.subject}</div>}
            {active.product?.name && <div><strong>Product</strong><br />{active.product.name}</div>}
            <div><strong>Message</strong><br />{active.message}</div>
            <div><strong>Status</strong><br /><span className={`ad-badge ${active.status.toLowerCase()}`}>{active.status}</span></div>
            <div><strong>Received</strong><br />{new Date(active.createdAt).toLocaleString()}</div>
          </div>

          <div className="ad-modal-actions" style={{ flexWrap: 'wrap' }}>
            {active._type === 'message' && (
              <>
                <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => updateStatus('message', active.id, 'READ')}>Mark Read</button>
                <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => updateStatus('message', active.id, 'REPLIED')}>Mark Replied</button>
              </>
            )}
            {active._type === 'inquiry' && (
              <>
                <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => updateStatus('inquiry', active.id, 'CONTACTED')}>Contacted</button>
                <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => updateStatus('inquiry', active.id, 'CLOSED')}>Close</button>
              </>
            )}
            <button type="button" className="btn btn-danger btn-sm" disabled={busy} onClick={() => remove(active._type, active.id)}>Delete</button>
            <button type="button" className="btn btn-sm" onClick={() => setActive(null)}>Close</button>
          </div>
        </Modal>
      )}
    </>
  );
}
