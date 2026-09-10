'use client';
import { SERVICE_INTEGRATED } from '@/lib/services';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, SplitText);

const MARKS = ['South India', 'Qatar'];

export default function Closing({
  quoteImage = '/images/bedroom.png',
  quoteImageAlt = 'Completed residence interior',
  testimonial = {
    quote:
      'They did not build us a house. They built a way of living with the light, the rain and the trees that were already here.',
    attribution: 'Private residence · Malappuram, Kerala',
  },
}) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const splits = [];

      const build = () => {
        // Testimonial quote reveal
        const quote = q('[data-quote]')[0];
        if (quote) {
          const s = SplitText.create(quote, { type: 'words', wordsClass: 'dm-word' });
          splits.push(s);
          gsap.to(s.words, {
            opacity: 1,
            ease: 'none',
            stagger: 0.4,
            scrollTrigger: { trigger: quote, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 },
          });
        }

        // CTA title masked char reveal
        const cta = q('[data-cta-title]')[0];
        if (cta) {
          const s = SplitText.create(cta, { type: 'lines,chars', mask: 'lines' });
          splits.push(s);
          gsap.from(s.chars, {
            yPercent: 115,
            duration: 1.4,
            ease: 'expo.out',
            stagger: 0.018,
            scrollTrigger: { trigger: cta, start: 'top 85%' },
          });
        }
      };

      if (document.fonts?.status === 'loaded') build();
      else document.fonts.ready.then(build);

      // Quote image parallax
      gsap.fromTo(
        q('[data-quote-img]'),
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: q('[data-quote-figure]')[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // CTA fade-ins
      gsap.from(q('[data-cta-fade]'), {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: q('[data-cta-fade]')[0], start: 'top 88%' },
      });

      return () => splits.forEach((s) => s.revert());
    }, root);

    return () => ctx.revert();
  }, [testimonial.quote]);

  return (
    <div ref={root}>
      {/* Testimonial section */}
      <section className="dm-quote">
        <div className="dm-wrap dm-quote-inner">
          <div>
            <blockquote className="dm-quote-text" data-quote>
              {testimonial.quote}
            </blockquote>
            <div className="dm-quote-by">{testimonial.attribution}</div>
          </div>
          <figure className="dm-quote-figure" data-quote-figure>
            <Image
              src={quoteImage}
              alt={quoteImageAlt}
              width={900}
              height={1200}
              data-quote-img
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </figure>
        </div>
      </section>

      {/* CTA section — dark, full-bleed */}
      <section className="dm-cta">
        <div className="dm-cta-bg" aria-hidden="true" />

        <div className="dm-wrap dm-cta-inner">
          {/* Left: heading + sub + button */}
          <div className="dm-cta-left">
            <span className="dm-eyebrow" data-cta-fade>New Commissions Open</span>
            <h2 className="dm-cta-title" data-cta-title>
              Build your<br /><em>vision</em>
            </h2>
            <p className="dm-cta-sub" data-cta-fade>
              {SERVICE_INTEGRATED}. Based in Maranchery, Malappuram, with projects delivered
              across Kerala, Bengaluru and Qatar.
            </p>
            <MagneticButton href="/contact" className="dm-magnetic" data-cta-fade>
              Start a project
            </MagneticButton>
          </div>

          {/* Right: location tags stacked */}
          <div className="dm-cta-right" data-cta-fade>
            <p className="dm-cta-right-label">Our reach</p>
            <ul className="dm-cta-cities">
              {MARKS.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
