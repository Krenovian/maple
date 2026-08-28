'use client';
import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  { href: '/portfolio', title: 'Portfolio', meta: 'Built work' },
  { href: '/products', title: 'Shop', meta: 'Studio products' },
  { href: '/about', title: 'About', meta: 'Who we are' },
  { href: '/contact', title: 'Contact', meta: 'Start here' },
];

export default function IndexList() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const list = q('[data-list]')[0];

      gsap.from(q('[data-row]'), {
        y: 44,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: list, start: 'top 85%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dm-index" ref={root}>
      <div className="dm-wrap">
        <div className="dm-index-head">
          <span className="dm-eyebrow">03 — Index</span>
          <span>Everything else</span>
        </div>

        <div className="dm-index-list" data-list>
          {ROWS.map((row) => (
            <Link href={row.href} className="dm-index-row" data-row key={row.href} data-cursor="open">
              <h3>{row.title}</h3>
              <small>{row.meta}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
