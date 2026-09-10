'use client';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARQUEE_WORDS } from '@/lib/services';

gsap.registerPlugin(ScrollTrigger);

function Group({ ariaHidden }) {
  return (
    <div className="dm-marquee-group" aria-hidden={ariaHidden}>
      {MARQUEE_WORDS.map((w) => (
        <span className="dm-marquee-item" key={w}>
          {w}
          <i className="dm-marquee-dot" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const track = self.selector('[data-marquee-track]')[0];
      if (!track) return;

      const loop = gsap.timeline({ repeat: -1 }).to(track, {
        xPercent: -50,
        duration: 26,
        ease: 'none',
      });

      // Skew is applied to the groups, not the track, so it never competes
      // with the looping x tween on the same element.
      const groups = self.selector('.dm-marquee-group');
      let direction = 1;

      const settle = gsap
        .delayedCall(0.5, () => {
          gsap.to(loop, { timeScale: direction, duration: 0.9, overwrite: true });
          gsap.to(groups, { skewX: 0, duration: 0.7, ease: 'power3.out', overwrite: true });
        })
        .pause();

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (selfST) => {
          const v = selfST.getVelocity();
          if (!v) return;
          const dir = v > 0 ? 1 : -1;
          if (dir !== direction) {
            direction = dir;
            loop.timeScale(dir);
          }
          gsap.to(loop, {
            timeScale: dir * gsap.utils.clamp(1, 6, Math.abs(v) / 260),
            duration: 0.25,
            overwrite: true,
          });
          gsap.to(groups, {
            skewX: gsap.utils.clamp(-7, 7, -v / 340),
            duration: 0.3,
            overwrite: true,
          });
          settle.restart(true);
        },
      });

      return () => {
        st.kill();
        settle.kill();
        loop.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="dm-marquee" ref={root}>
      <div className="dm-marquee-track" data-marquee-track>
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  );
}
