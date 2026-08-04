'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    gsap.set([dotEl, ringEl], { xPercent: 0, yPercent: 0, opacity: 0 });

    const moveDotX = gsap.quickTo(dotEl, 'x', { duration: 0.15, ease: 'power3.out' });
    const moveDotY = gsap.quickTo(dotEl, 'y', { duration: 0.15, ease: 'power3.out' });
    const moveRingX = gsap.quickTo(ringEl, 'x', { duration: 0.55, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ringEl, 'y', { duration: 0.55, ease: 'power3.out' });

    let visible = false;
    const onMove = (e) => {
      if (!visible) {
        visible = true;
        gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.4 });
      }
      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.3 });
    };

    const setState = (target) => {
      const text = target?.dataset?.cursor;
      if (target) {
        if (label.current) label.current.textContent = text && text !== 'true' ? text : '';
        ringEl.classList.toggle('is-label', Boolean(text && text !== 'true'));
        gsap.to(ringEl, { scale: text && text !== 'true' ? 1.9 : 1.6, duration: 0.5, ease: 'power3.out' });
        gsap.to(dotEl, { scale: 0, duration: 0.4, ease: 'power3.out' });
      } else {
        ringEl.classList.remove('is-label');
        gsap.to(ringEl, { scale: 1, duration: 0.5, ease: 'power3.out' });
        gsap.to(dotEl, { scale: 1, duration: 0.4, ease: 'power3.out' });
      }
    };

    const onOver = (e) => {
      const hit = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      setState(hit);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <div className="dm-cursor" ref={dot} aria-hidden="true" />
      <div className="dm-cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} />
      </div>
    </>
  );
}
