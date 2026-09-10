'use client';
import { useEffect, useMemo, useState } from 'react';
import MapleImage from '@/components/MapleImage';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/shop/CartProvider';
import { useWishlist } from '@/components/shop/WishlistProvider';
import CartButton from '@/components/shop/CartButton';
import { Pagination, usePagination } from '@/components/Pagination';
import { productMatchesCategory, rootProductCategories } from '@/lib/categoryTree';
import { openWhatsApp, prepareWhatsAppTab } from '@/lib/whatsapp';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

const FINISHES = ['Natural', 'Matte', 'Polished', 'Brushed'];
const SAMPLE_SIZES = ['A4 sample', '300×300 board', 'Site mock-up'];

export default function ProductCatalog({ products, categories = [] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const { addItem } = useCart();
  const { has, toggle, count: wishCount } = useWishlist();

  const rootCategories = useMemo(() => rootProductCategories(categories), [categories]);
  const cats = useMemo(() => ['All', ...rootCategories.map((category) => category.name)], [rootCategories]);

  const [filter, setFilter] = useState(initialCategory);
  const [stockOnly, setStockOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({});
  const [enquireFor, setEnquireFor] = useState(null);
  const [enq, setEnq] = useState({ name: '', email: '', phone: '', message: '' });
  const [enqStatus, setEnqStatus] = useState('idle');
  const [enqError, setEnqError] = useState('');

  useBodyScrollLock(!!enquireFor);

  useEffect(() => {
    if (initialCategory) setFilter(initialCategory);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!productMatchesCategory(p.category, filter, categories)) return false;
      if (stockOnly && !p.inStock) return false;
      if (savedOnly && !has(p.id)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.description} ${p.category} ${p.leadTime || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, filter, stockOnly, savedOnly, query, has, categories]);

  const { page, setPage, totalPages, totalItems, paged } = usePagination(
    filtered,
    9,
    `${filter}|${query}|${stockOnly}|${savedOnly}`
  );

  const setOpt = (id, key, value) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { finish: 'Natural', sample: 'A4 sample', ...(prev[id] || {}), [key]: value },
    }));
  };

  const submitEnquire = async (e) => {
    e.preventDefault();
    if (!enquireFor) return;
    setEnqStatus('submitting');
    setEnqError('');
    const opts = selected[enquireFor.id] || { finish: 'Natural', sample: 'A4 sample' };
    const waTab = prepareWhatsAppTab();

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enq.name,
          email: enq.email,
          phone: enq.phone,
          message:
            enq.message ||
            `Enquiry for ${enquireFor.name} (${opts.finish}, ${opts.sample})`,
          productSlug: enquireFor.slug,
          finish: opts.finish,
          sample: opts.sample,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        try { waTab?.close(); } catch { /* ignore */ }
        throw new Error(data.error || 'Failed');
      }
      if (data.whatsappUrl) openWhatsApp(data.whatsappUrl, waTab);
      else try { waTab?.close(); } catch { /* ignore */ }
      setEnqStatus('success');
      setEnq({ name: '', email: '', phone: '', message: '' });
      if (data.whatsappUrl) {
        setEnquireFor((prev) => (prev ? { ...prev, _waUrl: data.whatsappUrl } : prev));
      }
    } catch (err) {
      setEnqError(err.message || 'Something went wrong');
      setEnqStatus('error');
    }
  };

  return (
    <>
      <div className="dm-toolbar" style={{ opacity: 1 }}>
        <div className="dm-filters" style={{ marginBottom: 0 }}>
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className={`dm-chip ${filter === c ? 'is-active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            className={`dm-chip ${stockOnly ? 'is-active' : ''}`}
            onClick={() => setStockOnly((v) => !v)}
          >
            In stock only
          </button>
          <button
            type="button"
            className={`dm-chip ${savedOnly ? 'is-active' : ''}`}
            onClick={() => setSavedOnly((v) => !v)}
          >
            Saved{wishCount ? ` (${wishCount})` : ''}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="dm-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stone, timber, lighting…"
          />
          <CartButton />
        </div>
      </div>

      <p className="dm-toolbar-meta" style={{ marginBottom: '1.5rem', opacity: 1, color: 'rgba(244,241,236,0.72)' }}>
        {totalItems} products · add to cart, save for later, or enquire on WhatsApp
      </p>

      <div className="dm-grid pe-grid">
        {paged.map((p) => {
          const opts = selected[p.id] || { finish: 'Natural', sample: 'A4 sample' };
          const saved = has(p.id);
          return (
            <article className="dm-card" key={p.id}>
              <Link href={`/products/${p.slug}`} className="pe-card-btn">
                <div className="dm-card-media">
                  <MapleImage src={p.image} alt={p.imageAlt || p.name} width={800} height={550} />
                </div>
              </Link>
              <div className="dm-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <h3>
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <button
                    type="button"
                    className={`wish-btn ${saved ? 'is-active' : ''}`}
                    onClick={() => toggle(p.id)}
                    aria-label={saved ? 'Remove from saved' : 'Save for later'}
                    aria-pressed={saved}
                  >
                    {saved ? '★' : '☆'}
                  </button>
                </div>
                <p>{p.description}</p>
                <div className="dm-card-meta">
                  <span>{p.category}</span>
                  {p.price && <span>{p.price}</span>}
                  <span>{p.inStock ? 'In stock' : 'Made to order'}</span>
                  {p.leadTime && <span>Lead · {p.leadTime}</span>}
                </div>

                <div className="dm-option-row" aria-label="Finish">
                  {FINISHES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`dm-option ${opts.finish === f ? 'is-active' : ''}`}
                      onClick={() => setOpt(p.id, 'finish', f)}
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
                      className={`dm-option ${opts.sample === s ? 'is-active' : ''}`}
                      onClick={() => setOpt(p.id, 'sample', s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="shop-card-actions">
                  <button type="button" className="btn btn-sm" onClick={() => addItem(p, opts)}>
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEnquireFor(p);
                      setEnqStatus('idle');
                      setEnqError('');
                    }}
                  >
                    Enquire WhatsApp
                  </button>
                  <Link href={`/products/${p.slug}`} className="btn btn-ghost btn-sm">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalItems === 0 && (
        <p style={{ color: 'var(--text-muted)', marginTop: '2rem' }}>
          No products match. Clear filters to see the full shop.
        </p>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        totalItems={totalItems}
        pageSize={9}
      />

      {enquireFor && (
        <div className="cart-overlay cart-overlay--center" onClick={() => setEnquireFor(null)} role="presentation" data-lenis-prevent>
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
                <p>{enquireFor.name}</p>
              </div>
              <button type="button" className="cart-close" onClick={() => setEnquireFor(null)}>×</button>
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
                    {enquireFor._waUrl && (
                      <a
                        className="btn btn-outline"
                        href={enquireFor._waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ width: '100%', textAlign: 'center', marginTop: '0.75rem' }}
                      >
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
