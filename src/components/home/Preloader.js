'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markIntroDone } from './intro';

const SESSION_KEY = 'dm-intro-seen';

export default function Preloader() {
  const root = useRef(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = sessionStorage.getItem(SESSION_KEY);

    if (seen || reduced) {
      setDone(true);
      markIntroDone();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, '1');
    const lenis = window.__lenis;
    lenis?.stop();
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const countEl = el.querySelector('[data-count]');

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          lenis?.start();
          markIntroDone();
          setDone(true);
        },
      });

      tl.from('[data-pre-word] span', {
        yPercent: 115,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.045,
      })
        .to(
          counter,
          {
            value: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countEl) countEl.textContent = String(Math.round(counter.value)).padStart(3, '0');
            },
          },
          0
        )
        .to('[data-pre-bar]', { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0)
        .to('[data-pre-inner]', { yPercent: -110, duration: 1, ease: 'expo.inOut' }, '+=0.15')
        .to(
          el,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.1,
            ease: 'expo.inOut',
          },
          '<0.1'
        );
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div className="dm-preloader" ref={root} style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <div className="dm-preloader-inner" data-pre-inner>
        <div className="dm-preloader-word" data-pre-word>
          {'maple'.split('').map((c, i) => (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {c}
            </span>
          ))}
        </div>
        <div className="dm-preloader-count" data-count>
          000
        </div>
      </div>
      <i className="dm-preloader-bar" data-pre-bar />
    </div>
  );
}
