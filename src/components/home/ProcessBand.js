'use client';
import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: '01', t: 'Listen', d: 'Site, climate, and the way you want to live.' },
  { n: '02', t: 'Shape', d: 'Massing, light studies, and material direction.' },
  { n: '03', t: 'Craft', d: 'Details, samples, and engineering coordination.' },
  { n: '04', t: 'Build', d: 'Site presence through handover and soft landing.' },
];

export default function ProcessBand() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const cards = self.selector('[data-step]');
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="dm-home-process" ref={root}>
      <div className="dm-wrap">
        <div className="dm-home-process-head">
          <span className="dm-eyebrow">04 — Method</span>
          <h2>
            How we <em>work</em>
          </h2>
        </div>
        <div className="dm-home-process-grid">
          {STEPS.map((s) => (
            <article data-step key={s.n}>
              <span>{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
        <div className="dm-home-process-links">
          <Link href="/services">Full capabilities ↗</Link>
          <Link href="/about">Our story ↗</Link>
        </div>
      </div>
    </section>
  );
}
