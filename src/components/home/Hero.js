'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import HeroMenuButton from '@/components/HeroMenuButton';
import { onIntroDone } from './intro';

gsap.registerPlugin(ScrollTrigger, SplitText);

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Shop' },
];

export default function Hero() {
  const root = useRef(null);
  const title = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const media = q('[data-hero-media]')[0];
      const titleEl = title.current;

      gsap.set(titleEl, { autoAlpha: 0 });

      // --- Intro, gated on the preloader and on webfonts being measurable ---
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
              q('[data-hero-img]'),
              { scale: 1.32 },
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

      // --- Scroll: layered parallax + card morph on exit ---
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
        <Image
          src="/images/hero.png"
          alt="Residence by MAPLE INFRA & INTERIORS"
          fill
          priority
          sizes="100vw"
          data-hero-img
        />
      </div>
      <div className="dm-hero-veil" data-hero-veil />
      <div className="dm-hero-grain" />

      <div className="dm-hero-inner dm-wrap">
        <header className="dm-topbar" data-hero-bar>
          <Link href="/" className="dm-topbar-logo" data-cursor="true">
            <Image src="/images/logo-leaf.png" alt="" width={34} height={34} />
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
            <HeroMenuButton />
          </div>
        </header>

        {/* Center alignment for GenZ cinematic impact */}
        <div className="dm-hero-center">
          <h1 className="dm-hero-title-massive" ref={title}>
            Crafting
            <br />
            <em>timeless</em> spaces
          </h1>
        </div>

        {/* Shop callout */}
        <Link href="/products" className="dm-hero-badge dm-badge-left dm-hero-shop" data-cursor="true">
          <span className="dm-hero-shop-kicker">Shop</span>
          <strong className="dm-hero-shop-title">Studio products</strong>
          <p>Finishes and fittings from live Maple projects — browse, sample, and enquire on WhatsApp.</p>
          <span className="dm-hero-shop-cta">Open shop →</span>
        </Link>

        {/* Orizon-style grouped right badge */}
        <div className="dm-orizon-group">
          <Link href="/products" className="dm-orizon-circle" aria-label="Open shop" data-cursor="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 17V7H7"/>
            </svg>
          </Link>

          <div className="dm-hero-badge dm-badge-right dm-orizon-card">
            <span>Est. <strong>2011</strong></span>
            <span>Malappuram <strong>· Kerala</strong></span>
            <span>10°44&apos;N 75°58&apos;E</span>
          </div>
        </div>

      </div>
    </section>
  );
}
