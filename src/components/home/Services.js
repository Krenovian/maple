'use client';
import { useLayoutEffect, useRef } from 'react';
import MapleImage from '@/components/MapleImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOMEPAGE_CAPABILITIES } from '@/lib/services';

gsap.registerPlugin(ScrollTrigger);

export default function Services({ siteImages = {} }) {
  const root = useRef(null);
  const items = HOMEPAGE_CAPABILITIES.map((service) => ({
    ...service,
    image: siteImages[service.imageKey] || service.image,
    alt: siteImages[`${service.imageKey}_alt`] || service.title,
  }));

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const cards = q('[data-card]');

      const mm = gsap.matchMedia();

      mm.add('(min-width: 901px)', () => {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.96,
            filter: 'brightness(0.88)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top 55%',
              end: 'top 18%',
              scrub: true,
            },
          });
        });
      });

      cards.forEach((card) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 92%' },
        });
      });

      gsap.from(q('[data-services-fade]'), {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: q('[data-services-head]')[0], start: 'top 85%' },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section className="dm-services" ref={root} id="services">
      <div className="dm-wrap">
        <div className="dm-services-head" data-services-head>
          <h2 data-services-fade>
            Integrated
            <br />
            <em>capability</em>
          </h2>
          <span className="dm-eyebrow" data-services-fade>
            02 — Capabilities
          </span>
        </div>

        <div className="dm-stack">
          {items.map((s, index) => (
            <article
              className="dm-stack-card"
              data-card
              key={s.num}
              style={{ '--stack-index': index }}
            >
              <div className="dm-stack-text">
                <span className="dm-stack-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="dm-stack-tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="dm-stack-media">
                <MapleImage
                  src={s.image}
                  alt={s.alt}
                  width={900}
                  height={700}
                  sizes="(max-width: 900px) 100vw, 40vw"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
