'use client';
import { useState } from 'react';
import MapleImage from '@/components/MapleImage';
import Link from 'next/link';
import { useCart } from '@/components/shop/CartProvider';
import { useWishlist } from '@/components/shop/WishlistProvider';
import CartButton from '@/components/shop/CartButton';
import { openWhatsApp, prepareWhatsAppTab } from '@/lib/whatsapp';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

const FINISHES = ['Natural', 'Matte', 'Polished', 'Brushed'];
const SAMPLE_SIZES = ['A4 sample', '300×300 board', 'Site mock-up'];

export default function ProductDetailClient({ product, gallery, specs, related }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [active, setActive] = useState(0);
  const [finish, setFinish] = useState('Natural');
  const [sample, setSample] = useState('A4 sample');
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enq, setEnq] = useState({ name: '', email: '', phone: '', message: '' });
  const [enqStatus, setEnqStatus] = useState('idle');
  const [enqError, setEnqError] = useState('');
  const [waUrl, setWaUrl] = useState('');

  useBodyScrollLock(enquireOpen);

  const images = gallery.length ? gallery : [product.image];
  const saved = has(product.id);
  const alt = product.imageAlt || product.name;

  const submitEnquire = async (e) => {
    e.preventDefault();
    setEnqStatus('submitting');
    setEnqError('');
    const waTab = prepareWhatsAppTab();
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enq.name,
          email: enq.email,
          phone: enq.phone,
          message: enq.message || `Enquiry for ${product.name} (${finish}, ${sample})`,
          productSlug: product.slug,
          finish,
          sample,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        try { waTab?.close(); } catch { /* ignore */ }
        throw new Error(data.error || 'Failed');
      }
      if (data.whatsappUrl) {
        setWaUrl(data.whatsappUrl);
        openWhatsApp(data.whatsappUrl, waTab);
      } else {
        try { waTab?.close(); } catch { /* ignore */ }
      }
      setEnqStatus('success');
      setEnq({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setEnqError(err.message || 'Something went wrong');
      setEnqStatus('error');
    }
  };

  return (
    <>
      <div className="pd-shop">
        <div className="pd-shop-gallery">
          <div className="pd-shop-main">
            <MapleImage
              src={images[active] || product.image}
              alt={alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          {images.length > 1 && (
            <div className="pd-shop-thumbs">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`pd-shop-thumb ${active === i ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <MapleImage src={src} alt="" width={120} height={90} style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-shop-info">
          <div className="pd-shop-topbar">
            <Link href="/products" className="pd-back">← Shop</Link>
            <CartButton />
          </div>
          <p className="pd-shop-cat">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="pd-shop-desc">{product.description}</p>

          <div className="dm-card-meta" style={{ margin: '1rem 0 1.25rem' }}>
            {product.price && <span>{product.price}</span>}
            <span>{product.inStock ? 'In stock' : 'Made to order'}</span>
            {product.leadTime && <span>Lead time · {product.leadTime}</span>}
          </div>

          <div className="dm-option-row" aria-label="Finish">
            {FINISHES.map((f) => (
              <button
                key={f}
                type="button"
                className={`dm-option ${finish === f ? 'is-active' : ''}`}
                onClick={() => setFinish(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="dm-option-row" aria-label="Sample size">
            {SAMPLE_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={`dm-option ${sample === s ? 'is-active' : ''}`}
                onClick={() => setSample(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="shop-card-actions" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-sm" onClick={() => addItem(product, { finish, sample })}>
              Add to cart
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEnquireOpen(true);
                setEnqStatus('idle');
                setEnqError('');
                setWaUrl('');
              }}
            >
              Enquire WhatsApp
            </button>
            <button
              type="button"
              className={`btn btn-ghost btn-sm ${saved ? 'is-saved' : ''}`}
              onClick={() => toggle(product.id)}
              aria-pressed={saved}
            >
              {saved ? 'Saved ✓' : 'Save for later'}
            </button>
          </div>

          {specs.length > 0 && (
            <div className="pd-shop-specs">
              <h2>Specifications</h2>
              <dl>
                {specs.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 'clamp(2rem,4vw,3.5rem)' }}>
          <div className="dm-wrap">
            <span className="dm-page-kicker">Related</span>
            <h2 className="dm-block-title" style={{ marginBottom: '1.5rem' }}>More from the shop</h2>
            <div className="dm-grid pe-grid">
              {related.map((p) => (
                <article className="dm-card" key={p.id}>
                  <Link href={`/products/${p.slug}`}>
                    <div className="dm-card-media">
                      <MapleImage src={p.image} alt={p.imageAlt || p.name} width={800} height={550} />
                    </div>
                    <div className="dm-card-body">
                      <h3>{p.name}</h3>
                      <div className="dm-card-meta">
                        <span>{p.category}</span>
                        {p.price && <span>{p.price}</span>}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {enquireOpen && (
        <div className="cart-overlay cart-overlay--center" onClick={() => setEnquireOpen(false)} role="presentation" data-lenis-prevent>
          <div
            className="enquire-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
          >
            <header className="cart-head">
              <div>
                <h2>Enquire on WhatsApp</h2>
                <p>{product.name}</p>
              </div>
              <button type="button" className="cart-close" onClick={() => setEnquireOpen(false)}>×</button>
            </header>
            <div className="enquire-modal-body">
              <form className="cart-checkout cart-checkout--flush" onSubmit={submitEnquire}>
                <label>
                  Name
                  <input required value={enq.name} onChange={(e) => setEnq((s) => ({ ...s, name: e.target.value }))} />
                </label>
                <label>
                  Email
                  <input type="email" required value={enq.email} onChange={(e) => setEnq((s) => ({ ...s, email: e.target.value }))} />
                </label>
                <label>
                  Phone / WhatsApp
                  <input type="tel" required value={enq.phone} onChange={(e) => setEnq((s) => ({ ...s, phone: e.target.value }))} />
                </label>
                <label>
                  Message
                  <textarea
                    rows={3}
                    value={enq.message}
                    onChange={(e) => setEnq((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Tell us quantity, site location…"
                  />
                </label>
                <button type="submit" className="btn" disabled={enqStatus === 'submitting'} style={{ width: '100%' }}>
                  {enqStatus === 'submitting' ? 'Saving…' : 'Save & open WhatsApp ↗'}
                </button>
                {enqStatus === 'success' && (
                  <div>
                    <p className="dm-form-status ok">Lead saved.</p>
                    {waUrl && (
                      <a className="btn btn-outline" href={waUrl} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textAlign: 'center', marginTop: '0.75rem' }}>
                        Open WhatsApp now ↗
                      </a>
                    )}
                  </div>
                )}
                {enqStatus === 'error' && <p className="dm-form-status err">{enqError}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
