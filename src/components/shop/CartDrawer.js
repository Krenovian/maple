'use client';
import { useState } from 'react';
import MapleImage from '@/components/MapleImage';
import { useCart } from './CartProvider';
import { openWhatsApp, prepareWhatsAppTab } from '@/lib/whatsapp';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, removeItem, clear, lineKey, count } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [waUrl, setWaUrl] = useState('');

  useBodyScrollLock(open);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setStatus('submitting');
    setError('');
    setWaUrl('');

    // Must open before await — otherwise browsers block the popup
    const waTab = prepareWhatsAppTab();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          note,
          items,
          source: 'cart',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        try { waTab?.close(); } catch { /* ignore */ }
        throw new Error(data.error || 'Failed to save order lead');
      }

      if (data.whatsappUrl) {
        setWaUrl(data.whatsappUrl);
        openWhatsApp(data.whatsappUrl, waTab);
      } else {
        try { waTab?.close(); } catch { /* ignore */ }
      }

      clear();
      setName('');
      setEmail('');
      setPhone('');
      setNote('');
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div
      className="cart-overlay"
      onClick={() => setOpen(false)}
      role="presentation"
      data-lenis-prevent
    >
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cart and WhatsApp checkout"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      >
        <header className="cart-head">
          <div>
            <h2>Your cart</h2>
            <p>{count} {count === 1 ? 'item' : 'items'} · checkout opens WhatsApp</p>
          </div>
          <button type="button" className="cart-close" onClick={() => setOpen(false)} aria-label="Close cart">
            ×
          </button>
        </header>

        <div className="cart-body">
          {items.length === 0 ? (
            <p className="cart-empty">Cart is empty. Add products from the shop.</p>
          ) : (
            <ul className="cart-list">
              {items.map((item) => {
                const key = lineKey(item);
                return (
                  <li key={key} className="cart-line">
                    <div className="cart-line-media">
                      <MapleImage src={item.image} alt={item.name} width={72} height={72} />
                    </div>
                    <div className="cart-line-body">
                      <strong>{item.name}</strong>
                      <span>
                        {item.finish} · {item.sample}
                        {item.price ? ` · ${item.price}` : ''}
                      </span>
                      <div className="cart-line-actions">
                        <button type="button" onClick={() => updateQty(key, item.qty - 1)} aria-label="Decrease">−</button>
                        <em>{item.qty}</em>
                        <button type="button" onClick={() => updateQty(key, item.qty + 1)} aria-label="Increase">+</button>
                        <button type="button" className="cart-remove" onClick={() => removeItem(key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {items.length > 0 && (
            <form className="cart-checkout" onSubmit={submit}>
              <h3>Checkout via WhatsApp</h3>
              <p className="cart-checkout-hint">
                We save your lead in our backend, then open WhatsApp with your details and cart.
              </p>
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
              </label>
              <label>
                Phone / WhatsApp
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 9XXXXXXXXX" />
              </label>
              <label>
                Note (optional)
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Site location, quantity needs…" />
              </label>

              <button type="submit" className="btn" disabled={status === 'submitting'} style={{ width: '100%' }}>
                {status === 'submitting' ? 'Saving…' : 'Save & open WhatsApp ↗'}
              </button>

              {status === 'success' && (
                <div className="cart-wa-success">
                  <p className="dm-form-status ok" style={{ marginBottom: '0.75rem' }}>
                    Lead saved.
                  </p>
                  {waUrl && (
                    <a className="btn btn-outline" href={waUrl} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textAlign: 'center' }}>
                      Open WhatsApp now ↗
                    </a>
                  )}
                </div>
              )}
              {status === 'error' && (
                <p className="dm-form-status err">{error}</p>
              )}
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
