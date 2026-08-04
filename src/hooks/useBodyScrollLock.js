'use client';
import { useEffect } from 'react';

let lockCount = 0;
let savedHtmlOverflow = '';
let savedBodyOverflow = '';
let savedBodyPaddingRight = '';

function getScrollbarWidth() {
  if (typeof window === 'undefined') return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

function lockScroll() {
  if (typeof document === 'undefined') return;

  if (lockCount === 0) {
    savedHtmlOverflow = document.documentElement.style.overflow;
    savedBodyOverflow = document.body.style.overflow;
    savedBodyPaddingRight = document.body.style.paddingRight;

    const pad = getScrollbarWidth();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');
    if (pad > 0) {
      document.body.style.paddingRight = `${pad}px`;
    }

    // Prefer nested-scroll attributes over lenis.stop() —
    // stop() still preventDefaults wheel and blocks modal scrolling.
    try {
      window.__lenis?.stop?.();
    } catch {
      /* ignore */
    }
  }

  lockCount += 1;
}

function unlockScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.documentElement.style.overflow = savedHtmlOverflow;
  document.body.style.overflow = savedBodyOverflow;
  document.body.style.paddingRight = savedBodyPaddingRight;
  document.documentElement.classList.remove('scroll-locked');
  document.body.classList.remove('scroll-locked');

  try {
    window.__lenis?.start?.();
  } catch {
    /* ignore */
  }
}

/** Lock page + Lenis while a modal/drawer is open. Nested locks are counted. */
export function useBodyScrollLock(locked = true) {
  useEffect(() => {
    if (!locked) return undefined;
    lockScroll();
    return () => unlockScroll();
  }, [locked]);
}

/**
 * Mark an element so Lenis won't steal its wheel/touch events.
 * Use on modal roots — required because lenis.stop() still preventDefaults.
 */
export const LENIS_PREVENT_PROPS = {
  'data-lenis-prevent': true,
  'data-lenis-prevent-wheel': true,
  'data-lenis-prevent-touch': true,
};
