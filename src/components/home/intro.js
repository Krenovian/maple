'use client';

/**
 * Coordinates the preloader with the hero intro. Using a shared flag rather than
 * DOM events avoids a race when the hero mounts after the preloader finishes.
 */
let finished = false;
const listeners = new Set();

export function markIntroDone() {
  if (finished) return;
  finished = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntroDone(fn) {
  if (finished) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
