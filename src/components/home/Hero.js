'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { managedUploadImageProps } from '@/lib/imageProps';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { onIntroDone } from './intro';

gsap.registerPlugin(ScrollTrigger, SplitText);

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/portfolio', label: 'Projects' },
  { href: '/blog', label: 'Journal' },
  { href: '/services', label: 'Services' },
];

const HERO_LOOP_MS = 5500;

export default function Hero({
  heroImage = '/images/hero.png',
  heroImages = [],
  heroImageAlt = 'Residence by MAPLE INFRA & INTERIORS',
}) {
  const root = useRef(null);
  const title = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    const raw = heroImages?.length ? heroImages : [heroImage];
    const unique = [];
    for (const src of raw) {
      if (src && !unique.includes(src)) unique.push(src);
    }
    return unique.length ? unique : ['/images/hero.png'];
  }, [heroImage, heroImages]);

  const hasLoop = slides.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  useEffect(() => {
    slides.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [slides]);

  useEffect(() => {
    if (!hasLoop) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, HERO_LOOP_MS);

    return () => window.clearInterval(timer);
  }, [hasLoop, slides.length]);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const media = q('[data-hero-media]')[0];
      const titleEl = title.current;

      gsap.set(titleEl, { autoAlpha: 0 });

      let split;
      const play = () => {
        const build = () => {
          split = SplitText.create(titleEl, { type: 'lines' });
          gsap.set(titleEl, { autoAlpha: 1 });

          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
          tl.from(split.lines, {
            y: 40,
            opacity: 0,
            duration: 1.8,
            stagger: 0.15,
            ease: 'power3.out',
            force3D: true,
            onComplete: () => split.revert(),
          })
            .fromTo(
              media,
              { clipPath: 'inset(22% 14% 22% 14%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.9, ease: 'expo.inOut' },
              0
            )
            .fromTo(
              media,
              { scale: 1.08 },
              { scale: 1, duration: 2.4, ease: 'expo.out' },
              0
            )
            .from(
              q('.dm-hero-badge'),
              { scale: 0.8, opacity: 0, duration: 1.2, stagger: 0.15 },
              0.55
            );
        };

        if (document.fonts?.status === 'loaded') build();
        else document.fonts.ready.then(build);
      };

      const off = onIntroDone(play);

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          })
          .to(media, { yPercent: 14, ease: 'none' }, 0)
          .to(titleEl, { yPercent: -55, opacity: 0, ease: 'none' }, 0)
          .to(q('.dm-hero-badge'), { y: -60, opacity: 0, ease: 'none', stagger: 0.1 }, 0)
          .to(q('[data-hero-bar]'), { y: -40, opacity: 0, ease: 'none' }, 0)
          .to(q('[data-hero-veil]'), { opacity: 1, ease: 'none' }, 0);

        gsap.fromTo(
          root.current,
          { scale: 1, borderRadius: 0 },
          {
            scale: 0.94,
            borderRadius: 40,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: '65% top',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      return () => {
        off();
        split?.revert();
        mm.revert();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dm-hero" ref={root}>
      <div className="dm-hero-media" data-hero-media>
        {slides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`dm-hero-slide${i === activeIndex ? ' is-active' : ''}`}
            data-hero-slide
            aria-hidden={i !== activeIndex}
          >
            <Image
              src={src}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
              {...managedUploadImageProps(src)}
              data-hero-img
            />
          </div>
        ))}
      </div>
      <div className="dm-hero-veil" data-hero-veil />
      <div className="dm-hero-grain" />

      <div className="dm-hero-inner dm-wrap">
        <header className="dm-topbar" data-hero-bar>
          <Link href="/" className="dm-topbar-logo" data-cursor="true">
            <Image src="/images/logo-mark.png" alt="" width={34} height={34} />
            <span>maple</span>
          </Link>

          <nav className="dm-topbar-nav">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} data-cursor="true">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="dm-topbar-actions">
            <Link href="/contact" className="dm-topbar-cta" data-cursor="true">
              <span>Start a project</span>
            </Link>
            <Link href="/products" className="dm-topbar-shop" data-cursor="true">
              <svg className="dm-topbar-shop-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h12l-1.2 12.5a1 1 0 0 1-1 .9H8.2a1 1 0 0 1-1-.9L6 7Z" />
                <path d="M9 7V5.5A3 3 0 0 1 12 3a3 3 0 0 1 3 2.5V7" />
              </svg>
              <span>Shop</span>
            </Link>
          </div>
        </header>

        <div className="dm-hero-center">
          <h1 className="dm-hero-title-massive" ref={title}>
            Crafting
            <br />
            <em>timeless</em> spaces
          </h1>
        </div>

        <Link href="/products" className="dm-hero-badge dm-badge-left dm-hero-shop" data-cursor="true">
          <span className="dm-hero-shop-kicker">Shop</span>
          <strong className="dm-hero-shop-title">Studio products</strong>
          <p>Finishes and fittings from live Maple projects — browse, sample, and enquire.</p>
          <span className="dm-hero-shop-cta">Open shop →</span>
        </Link>

        <div className="dm-orizon-group">
          <Link href="/products" className="dm-orizon-circle" aria-label="Open shop" data-cursor="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 17V7H7"/>
            </svg>
          </Link>

          <div className="dm-hero-badge dm-badge-right dm-orizon-card">
            <span>Est. <strong>2011</strong></span>
            <span>South India <strong>· Qatar</strong></span>
            <span>10°44&apos;N 75°58&apos;E</span>
          </div>
        </div>
      </div>
    </section>
  );
}
