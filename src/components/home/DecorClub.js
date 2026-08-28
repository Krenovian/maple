'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DecorClub({ shop, products = [] }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;

      q('[data-tdc-fade]').forEach((el, index) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          delay: index * 0.05,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  if (!shop?.enabled) return null;

  return (
    <section className="dm-decor-club" ref={root} id="decor-club">
      <div className="dm-wrap">
        <div className="dm-decor-head" data-tdc-fade>
          <span className="dm-eyebrow">{shop.eyebrow}</span>
          <h2>{shop.title}</h2>
        </div>

        {products.length > 0 ? (
          <>
            <div className="tdc-featured-head" data-tdc-fade>
              <span className="dm-eyebrow">Featured picks</span>
              <Link href="/products" className="tdc-view-all">
                View full shop →
              </Link>
            </div>
            <div className="tdc-featured-grid" data-tdc-fade>
              {products.map((product) => (
                <article className="tdc-product-card" key={product.id}>
                  <Link href={`/products/${product.slug}`} className="tdc-product-media">
                    <Image
                      src={product.image}
                      alt={product.imageAlt || product.name}
                      width={640}
                      height={760}
                    />
                  </Link>
                  <div className="tdc-product-body">
                    <span className="tdc-product-cat">{product.category}</span>
                    <h3>
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    {product.price ? <p className="tdc-product-price">{product.price}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="tdc-empty-note" data-tdc-fade>
            Nothing found.
          </p>
        )}

        <div className="tdc-section-cta" data-tdc-fade>
          <Link href="/products" className="btn btn-outline">
            Explore THE DECOR CLUB →
          </Link>
        </div>
      </div>
    </section>
  );
}
