'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function MagneticButton({ href, children, className = '', strength = 0.4 }) {
  const el = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const node = el.current;
    const innerNode = inner.current;
    if (!node || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const moveX = gsap.quickTo(node, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const moveY = gsap.quickTo(node, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const innerX = gsap.quickTo(innerNode, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
    const innerY = gsap.quickTo(innerNode, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });

    const onMove = (e) => {
      const rect = node.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      moveX(dx * strength);
      moveY(dy * strength);
      innerX(dx * strength * 0.35);
      innerY(dy * strength * 0.35);
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
      innerX(0);
      innerY(0);
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <Link href={href} className={className} ref={el} data-cursor="true">
      <span ref={inner}>{children}</span>
    </Link>
  );
}
