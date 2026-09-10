'use client';
import { useLayoutEffect, useRef } from 'react';
import MapleImage from '@/components/MapleImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { SERVICE_INTEGRATED } from '@/lib/services';

gsap.registerPlugin(ScrollTrigger, SplitText);

const DEFAULT_MANIFESTO = {
  eyebrow: 'The Practice',
  index: '01 — Ethos',
  statement:
    'We deliver <em>practical</em>, sustainable and aesthetically refined spaces — tailored to every client.',
  copy1:
    `MAPLE INFRA & INTERIORS — formerly DE MAPLE Architects & Engineers — with a team of 13 professionals. Integrated capability: ${SERVICE_INTEGRATED}. Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru and Qatar.`,
  copy2:
    'Quality, innovation and professionalism guide every project — from architectural design and interiors to renovation, landscaping, hospitality and contracting. Same trusted team, renewed identity.',
  signature: '— MAPLE INFRA & INTERIORS',
  stats: [
    { value: 200, suffix: '+', label: 'Projects completed' },
    { value: 15, suffix: '', label: 'Years in practice' },
    { value: 13, suffix: '', label: 'Professionals' },
    { value: 3, suffix: '', label: 'Regions served' },
  ],
};

export default function Manifesto({
  content = DEFAULT_MANIFESTO,
  image = '/images/interior.png',
  imageAlt = 'Warm oak and travertine interior detail',
}) {
  const root = useRef(null);
  const copy = { ...DEFAULT_MANIFESTO, ...content, stats: content.stats?.length ? content.stats : DEFAULT_MANIFESTO.stats };

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

      gsap.fromTo(
        q('[data-parallax]'),
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-figure]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

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
  }, [copy.statement]);

  return (
    <section className="dm-manifesto" ref={root} id="studio">
      <div className="dm-wrap">
        <div className="dm-manifesto-head" style={{ borderBottom: 'none', marginBottom: '2rem', paddingBottom: 0 }}>
          <span className="dm-eyebrow">{copy.eyebrow}</span>
          <span className="dm-manifesto-index">{copy.index}</span>
        </div>

        <div className="dm-bento-grid">
          <div className="dm-bento-card dm-bento-large">
            <h2
              className="dm-statement"
              data-statement
              dangerouslySetInnerHTML={{ __html: copy.statement }}
            />
          </div>

          <div className="dm-bento-card dm-bento-glass">
            <p className="dm-bento-text">{copy.copy1}</p>
          </div>

          <figure className="dm-bento-card dm-bento-image" data-figure>
            <MapleImage
              src={image}
              alt={imageAlt}
              fill
              data-parallax
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </figure>

          <div className="dm-bento-card dm-bento-stats-container">
            <div className="dm-stats-grid">
              {copy.stats.map((stat) => (
                <div className="dm-stat-box" key={stat.label}>
                  <div className="dm-stat-num">
                    <span data-counter={stat.value} data-decimals={stat.decimals || 0}>
                      0
                    </span>
                    {stat.suffix ? <sup>{stat.suffix}</sup> : null}
                  </div>
                  <div className="dm-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dm-bento-card dm-bento-glass">
            <p className="dm-bento-text">{copy.copy2}</p>
            <p className="dm-signature" style={{ marginTop: 'auto' }}>
              {copy.signature}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
