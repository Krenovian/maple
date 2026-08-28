import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Suspense } from 'react';
import ProductCatalog from '@/components/site/ProductCatalog';
import FaqList from '@/components/site/FaqList';
import PromoBar from '@/components/shop/PromoBar';
import OfferBanner from '@/components/shop/OfferBanner';
import { getShopSettings } from '@/lib/shopSettings';

export const metadata = {
  title: 'THE DECOR CLUB | Shop',
  description:
    'THE DECOR CLUB (TDC) — curated antique brass, imported blue pottery, premium crockery and lifestyle objects. Distinctive, minimal, timeless décor.',
};

const STEPS = [
  {
    n: '01',
    t: 'Discover',
    d: 'Explore our curated collection of distinctive décor and lifestyle pieces.',
  },
  {
    n: '02',
    t: 'Choose',
    d: 'Find the pieces that complement your home, table or interior.',
  },
  {
    n: '03',
    t: 'Order',
    d: 'Place your order directly through our online store or enquire with our team.',
  },
  {
    n: '04',
    t: 'Enjoy',
    d: 'We carefully pack and deliver your selected pieces to your doorstep.',
  },
];

const FAQ = [
  {
    q: 'What can I find at THE DECOR CLUB?',
    a: (
      <>
        THE DECOR CLUB offers a curated selection of{' '}
        <strong>
          antique brass pieces, imported blue pottery, premium crockery, home décor and lifestyle
          products
        </strong>
        , carefully selected for distinctive homes and interiors.
      </>
    ),
  },
  {
    q: 'Are the products available for online purchase?',
    a: (
      <>
        Yes. Selected products can be{' '}
        <strong>browsed and purchased directly through our online store</strong>. For special or
        limited pieces, you can also contact our team for availability.
      </>
    ),
  },
  {
    q: 'Do you deliver across Kerala?',
    a: 'Yes. We offer delivery across Kerala, with shipping options for selected locations outside Kerala as well.',
  },
  {
    q: 'Are the products unique or limited in quantity?',
    a: (
      <>
        Many of our pieces are <strong>carefully sourced in limited quantities</strong>, so
        availability may vary. Some collections may not be restocked once sold out.
      </>
    ),
  },
  {
    q: 'Can I visit the store?',
    a: 'Yes. You can visit THE DECOR CLUB to explore our collection in person. Please contact us for store location and timings.',
  },
  {
    q: 'Do you offer gifting options?',
    a: (
      <>
        <p>
          Yes. Selected products can be arranged as{' '}
          <strong>
            gifts, curated gift sets and custom gift boxes for housewarming and wedding occasions
          </strong>
          , making them suitable for personal celebrations as well as corporate gifting.
        </p>
        <p>
          We also offer <strong>surprise gift delivery to your favourite persons</strong>, where we
          carefully pack and deliver your chosen gift on your behalf to make the moment more
          special.
        </p>
      </>
    ),
  },
  {
    q: 'Can I create custom gift boxes for special occasions?',
    a: (
      <>
        Yes. We offer{' '}
        <strong>
          custom-curated gift boxes for housewarming ceremonies, weddings and special celebrations
        </strong>
        . Each box is thoughtfully assembled using products from our collection based on your
        preference, theme and budget.
      </>
    ),
  },
  {
    q: 'Can I enquire about a product before purchasing?',
    a: (
      <>
        Absolutely. If you need more information about a product, availability or delivery, you can{' '}
        <strong>contact our TDC team before placing your order</strong>.
      </>
    ),
  },
];

export default async function ProductsPage() {
  const [products, categories, shopSettings] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({
      where: { type: 'PRODUCT' },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    getShopSettings(),
  ]);

  const payload = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="dm-page">
      <Navbar />

      {shopSettings.shop_promo_enabled ? <PromoBar lines={shopSettings.promoLines} /> : null}

      <section className="section" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="dm-wrap">
          <OfferBanner settings={shopSettings} />
        </div>
      </section>

      <section className="section" id="tdc-catalog" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <Suspense fallback={<p style={{ color: 'var(--text-muted)' }}>Loading catalog…</p>}>
            <ProductCatalog products={payload} categories={categories} />
          </Suspense>
        </div>
      </section>

      <section className="section dm-band">
        <div
          className="dm-wrap dm-materials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem,5vw,4rem)',
            alignItems: 'start',
          }}
        >
          <div className="reveal-left">
            <span className="dm-page-kicker">How it works</span>
            <h2 className="dm-block-title reveal-blur">Curated for Your Space</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              At <strong>THE DECOR CLUB</strong>, we bring together distinctive décor, antique brass
              pieces, imported blue pottery, premium crockery and lifestyle objects—carefully
              selected for their character, craftsmanship and timeless appeal.
            </p>
          </div>
          <div className="dm-steps reveal-stagger" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {STEPS.map((s) => (
              <div className="dm-step" key={s.n} style={{ minHeight: 160 }}>
                <div className="dm-step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="dm-wrap" style={{ maxWidth: 900 }}>
          <span className="dm-page-kicker reveal-up">FAQ</span>
          <h2 className="dm-block-title reveal-blur" style={{ marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <div className="dm-cta-band reveal-scale">
            <div>
              <h2>Find something extraordinary.</h2>
              <p>
                Our collection is built around{' '}
                <em>distinctive objects, limited finds and timeless pieces</em> chosen to bring
                character to your space.
              </p>
            </div>
            <Link href="#tdc-catalog" className="btn">
              Discover the Collection →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
