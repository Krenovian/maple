'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    title: 'Architecture',
    image: '/images/hero.png',
    desc: 'Architectural design from concept through documentation — residential, commercial and institutional work tailored to site and brief.',
    tags: ['Concept', 'Planning', 'Documentation'],
  },
  {
    num: '02',
    title: 'Engineering',
    image: '/images/bedroom.png',
    desc: 'Structural and civil engineering with town planning input — buildable, compliant solutions from early design through site.',
    tags: ['Structure', 'Civil', 'Planning'],
  },
  {
    num: '03',
    title: 'Interiors',
    image: '/images/interior.png',
    desc: 'Interior and retail design with practical layouts, refined finishes and spaces ready for everyday use.',
    tags: ['Interiors', 'Retail', 'Fit-out'],
  },
  {
    num: '04',
    title: 'Contracting',
    image: '/images/pool.png',
    desc: 'Structural and interior contracting delivered in-house — quality control, clear timelines and accountable site execution.',
    tags: ['Structure', 'Interiors', 'Site'],
  },
  {
    num: '05',
    title: 'Consultancy',
    image: '/images/hero.png',
    desc: 'Comprehensive consultancy across design, structure and town planning for clients who need expert guidance at every stage.',
    tags: ['Advice', 'Structure', 'Planning'],
  },
];

const CAPABILITY_IMAGE_KEYS = [
  'capability_architecture_image',
  'capability_engineering_image',
  'capability_interiors_image',
  'capability_contracting_image',
  'capability_consultancy_image',
];

export default function Services({ siteImages = {} }) {
  const root = useRef(null);
  const items = SERVICES.map((service, index) => {
    const imageKey = CAPABILITY_IMAGE_KEYS[index];
    return {
      ...service,
      image: siteImages[imageKey] || service.image,
      alt: siteImages[`${imageKey}_alt`] || service.title,
    };
  });

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const cards = q('[data-card]');

      const mm = gsap.matchMedia();

      mm.add('(min-width: 901px)', () => {
        // Dim the card under only once the next one is clearly in focus.
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

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

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
          {items.map((s) => (
            <article className="dm-stack-card" data-card key={s.num}>
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
                <Image
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
