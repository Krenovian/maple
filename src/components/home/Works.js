'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Works({ projects = [] }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!projects.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context((self) => {
      const q = self.selector;

      gsap.from(q('[data-works-fade]'), {
        y: 40,
        opacity: 0,
        duration: 1.15,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: q('[data-works-head]')[0], start: 'top 85%' },
      });

      const stage = q('[data-works-stage]')[0];
      const panels = gsap.utils.toArray(q('[data-panel]'));
      const progressEl = q('[data-progress]')[0];
      const currentEl = q('[data-current]')[0];
      if (!stage || !panels.length) return;

      // Stack panels; only the first is visible initially.
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 901px)', () => {
        if (reduced) return;

        // One viewport of scroll per project — pin and switch on scrub.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${panels.length * window.innerHeight * 0.95}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (value) => {
                const steps = Math.max(panels.length - 1, 1);
                return Math.round(value * steps) / steps;
              },
              duration: { min: 0.12, max: 0.4 },
              ease: 'power1.inOut',
            },
            onUpdate: (self) => {
              const steps = Math.max(panels.length - 1, 1);
              const idx = Math.min(panels.length - 1, Math.round(self.progress * steps));
              if (currentEl) currentEl.textContent = String(idx + 1).padStart(2, '0');
              if (progressEl) gsap.set(progressEl, { scaleX: self.progress });
            },
          },
        });

        panels.forEach((panel, i) => {
          const img = panel.querySelector('[data-work-img]');
          if (img) gsap.set(img, { scale: 1.1 });

          // Settle on this project
          if (img) {
            tl.fromTo(
              img,
              { scale: 1.12 },
              { scale: 1, duration: 0.85, ease: 'none' },
              i === 0 ? 0 : '>'
            );
          } else {
            tl.to({}, { duration: 0.85 });
          }

          // Crossfade into the next project
          if (i < panels.length - 1) {
            tl.to(panel, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' });
            tl.fromTo(
              panels[i + 1],
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.4, ease: 'power2.inOut' },
              '<'
            );
          }
        });

        return () => tl.scrollTrigger?.kill();
      });

      // Mobile: vertical stack, no pin — still reveal one by one.
      mm.add('(max-width: 900px)', () => {
        gsap.set(panels, { clearProps: 'all' });
        panels.forEach((panel) => {
          gsap.from(panel, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 85%' },
          });
        });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section className="dm-works" ref={root} id="projects">
      <div className="dm-wrap">
        <div className="dm-works-head" data-works-head>
          <h2 data-works-fade>
            Selected
            <br />
            <em>works</em>
          </h2>
          <p data-works-fade>
            Scroll to move through each project — one at a time.
          </p>
        </div>
      </div>

      <div className="dm-works-stage" data-works-stage>
        <div className="dm-works-stack">
          {projects.map((project, i) => (
            <article className="dm-feature" data-panel key={project.id}>
              <div className="dm-feature-media">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  data-work-img
                  sizes="100vw"
                  priority={i === 0}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="dm-feature-veil" />
              <div className="dm-feature-giant" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="dm-feature-content">
                <div>
                  <div className="dm-feature-meta">
                    <span className="dm-feature-cat">{project.category}</span>
                    <span>
                      {project.location}
                      {project.year ? ` · ${project.year}` : ''}
                    </span>
                  </div>
                  <h3 className="dm-feature-title">{project.title}</h3>
                  <p className="dm-feature-desc">
                    {project.description ||
                      'A study in light, mass and material — designed as a lasting way of living with the landscape.'}
                  </p>
                </div>

                <div className="dm-feature-side">
                  {project.area && (
                    <div className="dm-feature-stat">
                      <b>{project.area.replace(/[^\d,.]/g, '')}</b>
                      sq ft
                    </div>
                  )}
                  <Link href={`/portfolio/${project.slug}`} className="dm-feature-cta" data-cursor="view">
                    View project ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="dm-works-hud">
          <span className="dm-eyebrow">
            <span data-current>01</span>
            {' / '}
            {String(projects.length).padStart(2, '0')}
          </span>
          <div className="dm-progress">
            <i data-progress />
          </div>
        </div>
      </div>

      <div className="dm-wrap">
        <div className="dm-works-outro">
          <p>
            {projects.length} featured {projects.length === 1 ? 'project' : 'projects'} from the
            current studio cycle.
          </p>
          <Link href="/portfolio" className="dm-feature-cta" data-cursor="true">
            All projects ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
