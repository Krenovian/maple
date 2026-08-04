'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  { href: '/portfolio', title: 'Portfolio', meta: 'Built work', image: '/images/pool.png' },
  { href: '/products', title: 'Shop', meta: 'Studio products', image: '/images/interior.png' },
  { href: '/about', title: 'About', meta: 'Who we are', image: '/images/bedroom.png' },
  { href: '/contact', title: 'Contact', meta: 'Start here', image: '/images/hero.png' },
];

export default function IndexList() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const list = q('[data-list]')[0];
      const previews = q('[data-preview]');

      gsap.from(q('[data-row]'), {
        y: 44,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: list, start: 'top 85%' },
      });

      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!fine || !list) return;

      // Centre each preview on the pointer; xPercent/yPercent compose with the
      // x/y tweens below in a single transform.
      gsap.set(previews, { xPercent: -50, yPercent: -50 });

      const setX = previews.map((p) => gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' }));
      const setY = previews.map((p) => gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out' }));
      let active = -1;

      const onMove = (e) => {
        const rect = list.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        previews.forEach((_, i) => {
          setX[i](x);
          setY[i](y);
        });
      };

      const onEnterRow = (i) => {
        if (active === i) return;
        if (active > -1) gsap.to(previews[active], { opacity: 0, scale: 0.9, duration: 0.4 });
        active = i;
        gsap.fromTo(
          previews[i],
          { opacity: 0, scale: 0.9, rotate: -4 },
          { opacity: 1, scale: 1, rotate: -2, duration: 0.6, ease: 'power3.out' }
        );
      };

      const onLeaveList = () => {
        if (active > -1) gsap.to(previews[active], { opacity: 0, scale: 0.9, duration: 0.4 });
        active = -1;
      };

      const rows = q('[data-row]');
      const enterHandlers = rows.map((row, i) => {
        const h = () => onEnterRow(i);
        row.addEventListener('pointerenter', h);
        return h;
      });

      list.addEventListener('pointermove', onMove);
      list.addEventListener('pointerleave', onLeaveList);

      return () => {
        rows.forEach((row, i) => row.removeEventListener('pointerenter', enterHandlers[i]));
        list.removeEventListener('pointermove', onMove);
        list.removeEventListener('pointerleave', onLeaveList);
      };
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

          {ROWS.map((row) => (
            <div className="dm-index-preview" data-preview key={`p-${row.href}`}>
              <Image src={row.image} alt="" width={500} height={625} sizes="330px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
