'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const STATS = [
  { value: 200, suffix: '+', label: 'Projects completed' },
  { value: 15, suffix: '', label: 'Years in practice' },
  { value: 13, suffix: '', label: 'Professionals' },
  { value: 3, suffix: '', label: 'Regions served' },
];

export default function Manifesto() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const statement = q('[data-statement]')[0];
      let split;

      const build = () => {
        split = SplitText.create(statement, { type: 'words', wordsClass: 'dm-word' });
        gsap.to(split.words, {
          opacity: 1,
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            trigger: statement,
            start: 'top 82%',
            end: 'bottom 58%',
            scrub: 0.6,
          },
        });
      };

      if (document.fonts?.status === 'loaded') build();
      else document.fonts.ready.then(build);

      // Figure parallax
      gsap.fromTo(
        q('[data-parallax]'),
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-figure]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      // Bento cards fade in
      q('.dm-bento-card').forEach((el, index) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          delay: index * 0.1,
        });
      });

      // Counters
      q('[data-counter]').forEach((el) => {
        const target = parseFloat(el.dataset.counter);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });

      return () => split?.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dm-manifesto" ref={root} id="studio">
      <div className="dm-wrap">
        <div className="dm-manifesto-head" style={{ borderBottom: 'none', marginBottom: '2rem', paddingBottom: 0 }}>
          <span className="dm-eyebrow">The Practice</span>
          <span className="dm-manifesto-index">01 — Ethos</span>
        </div>
        
        {/* GenZ Bento Grid */}
        <div className="dm-bento-grid">
          
          {/* Main Statement Card */}
          <div className="dm-bento-card dm-bento-large">
            <h2 className="dm-statement" data-statement>
              We deliver <em>practical</em>, sustainable and aesthetically refined spaces —
              tailored to every client.
            </h2>
          </div>

          {/* Copy Card 1 */}
          <div className="dm-bento-card dm-bento-glass">
            <p className="dm-bento-text">
              MAPLE INFRA &amp; INTERIORS — formerly DE MAPLE Architects &amp; Engineers —
              works from Maranchery, Ponnani with a team of 13 architects, engineers, town
              planners and designers. Over 15 years we have completed 200+ projects across
              Kerala, Bengaluru and Qatar.
            </p>
          </div>

          {/* Image Card */}
          <figure className="dm-bento-card dm-bento-image" data-figure>
            <Image
              src="/images/interior.png"
              alt="Warm oak and travertine interior detail"
              fill
              data-parallax
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            <figcaption className="dm-figure-caption">Interior project — Bengaluru</figcaption>
          </figure>

          {/* Stats Grouped Card */}
          <div className="dm-bento-card dm-bento-stats-container">
            <div className="dm-stats-grid">
              {STATS.map((s) => (
                <div className="dm-stat-box" key={s.label}>
                  <div className="dm-stat-num">
                    <span data-counter={s.value} data-decimals={s.decimals || 0}>
                      0
                    </span>
                    {s.suffix && <sup>{s.suffix}</sup>}
                  </div>
                  <div className="dm-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Card 2 */}
          <div className="dm-bento-card dm-bento-glass">
            <p className="dm-bento-text">
              Quality, innovation and professionalism guide every project — from architectural
              design and interiors to structural contracting and consultancy. Same trusted team,
              renewed identity.
            </p>
            <p className="dm-signature" style={{ marginTop: 'auto' }}>
              — MAPLE INFRA &amp; INTERIORS
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
