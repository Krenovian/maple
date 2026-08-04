'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const SKIP = [/^\/admin/, /^\/employee/, /^\/login/, /^\/api/];

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (SKIP.some((re) => re.test(pathname || ''))) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.querySelectorAll(
        '.reveal-blur, .reveal-up, .reveal-stagger, .reveal-scale, .reveal-clip, .reveal-left, .reveal-right, .dm-page-hero, [data-parallax], [data-line], [data-counter]'
      ).forEach((el) => {
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';
      });
      return;
    }

    // Wait a frame so route content is painted
    let ctx;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // Page hero entrance
        const heroes = document.querySelectorAll('.dm-page-hero');
        heroes.forEach((hero) => {
          const parts = hero.querySelectorAll('.dm-page-kicker, h1, p');
          gsap.fromTo(
            parts,
            { y: 48, opacity: 0, filter: 'blur(8px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.15,
              ease: 'power3.out',
              stagger: 0.12,
              delay: 0.05,
            }
          );
        });

        // Blur text
        document.querySelectorAll('.reveal-blur').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0, filter: 'blur(12px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.25,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            }
          );
        });

        // Fade up
        document.querySelectorAll('.reveal-up').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 56, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.05,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
            }
          );
        });

        // Scale in
        document.querySelectorAll('.reveal-scale').forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.92, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            }
          );
        });

        // Clip reveal (images / panels)
        document.querySelectorAll('.reveal-clip').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(12% 12% 12% 12%)', opacity: 0.4 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: 1.35,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        });

        // Slide from sides
        document.querySelectorAll('.reveal-left').forEach((el) => {
          gsap.fromTo(
            el,
            { x: -48, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.05,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            }
          );
        });
        document.querySelectorAll('.reveal-right').forEach((el) => {
          gsap.fromTo(
            el,
            { x: 48, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.05,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            }
          );
        });

        // Stagger grids / lists
        document.querySelectorAll('.reveal-stagger').forEach((grid) => {
          const children = grid.children;
          gsap.fromTo(
            children,
            { y: 42, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power2.out',
              stagger: 0.08,
              scrollTrigger: { trigger: grid, start: 'top 86%', toggleActions: 'play none none none' },
            }
          );
        });

        // Horizontal line draw
        document.querySelectorAll('[data-line]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power3.out',
              transformOrigin: el.dataset.line === 'right' ? 'right center' : 'left center',
              scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
            }
          );
        });

        // Soft parallax
        document.querySelectorAll('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 12;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement || el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        // Counters
        document.querySelectorAll('[data-counter]').forEach((el) => {
          const target = parseFloat(el.dataset.counter);
          if (Number.isNaN(target)) return;
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => {
              el.textContent = obj.v.toFixed(decimals);
            },
          });
        });

        // Sticky CTA pin fade (optional)
        document.querySelectorAll('[data-pin-fade]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0.35, scale: 0.98 },
            {
              opacity: 1,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 40%',
                scrub: true,
              },
            }
          );
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
