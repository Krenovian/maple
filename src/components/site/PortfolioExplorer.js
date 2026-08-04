'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pagination, usePagination } from '@/components/Pagination';

gsap.registerPlugin(ScrollTrigger);

function safe(str) {
  return String(str || '').toLowerCase();
}

function PortfolioStage({ projects }) {
  const root = useRef(null);
  const listKey = projects.map((p) => p.id).join('-');

  useLayoutEffect(() => {
    if (!projects.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const stage = q('[data-pe-stage]')[0];
      const panels = gsap.utils.toArray(q('[data-pe-panel]'));
      const progressEl = q('[data-pe-progress]')[0];
      const currentEl = q('[data-pe-current]')[0];
      if (!stage || !panels.length) return;

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 901px)', () => {
        if (reduced) return;

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
          const img = panel.querySelector('[data-pe-img]');
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

      mm.add('(max-width: 900px)', () => {
        gsap.set(panels, { clearProps: 'all' });
        panels.forEach((panel) => {
          gsap.from(panel, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 88%' },
          });
        });
      });

      return () => mm.revert();
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [listKey, projects.length]);

  if (!projects.length) return null;

  return (
    <div className="pe-stage-wrap" ref={root} key={listKey}>
      <div className="pe-stage" data-pe-stage>
        <div className="pe-stage-stack">
          {projects.map((project, i) => (
            <article className="pe-panel" data-pe-panel key={project.id}>
              <div className="pe-panel-media">
                <Image
                  src={project.image}
                  alt={project.imageAlt || project.title}
                  fill
                  data-pe-img
                  sizes="100vw"
                  priority={i === 0}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="pe-panel-veil" />
              <div className="pe-panel-giant" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="pe-panel-content">
                <div>
                  <div className="pe-panel-meta">
                    <span className="pe-panel-cat">{project.category}</span>
                    <span>
                      {project.location}
                      {project.year ? ` · ${project.year}` : ''}
                    </span>
                  </div>
                  <h3 className="pe-panel-title">{project.title}</h3>
                  <p className="pe-panel-desc">
                    {project.description ||
                      'A study in light, mass and material — designed for lasting everyday living.'}
                  </p>
                </div>

                <div className="pe-panel-side">
                  {project.area && (
                    <div className="pe-panel-stat">
                      <b>{String(project.area).replace(/[^\d,.]/g, '')}</b>
                      sq ft
                    </div>
                  )}
                  <Link href={`/portfolio/${project.slug}`} className="pe-panel-cta">
                    View project ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pe-stage-hud">
          <span className="pe-stage-count">
            <span data-pe-current>01</span>
            {' / '}
            {String(projects.length).padStart(2, '0')}
          </span>
          <div className="pe-stage-progress">
            <i data-pe-progress />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioExplorer({ projects }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const locations = useMemo(() => {
    const set = new Set(projects.map((p) => p.location).filter(Boolean));
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const years = useMemo(() => {
    const set = new Set(projects.map((p) => p.year).filter(Boolean));
    return ['All', ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, [projects]);

  const [mode, setMode] = useState('stage');
  const [filter, setFilter] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [year, setYear] = useState(searchParams.get('year') || 'All');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const topRef = useRef(null);
  const skipUrlWrite = useRef(true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('maple-portfolio-mode');
      if (saved === 'cards' || saved === 'stage') setMode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Sync from URL when navigating back/forward
  useEffect(() => {
    setFilter(searchParams.get('category') || 'All');
    setLocation(searchParams.get('location') || 'All');
    setYear(searchParams.get('year') || 'All');
    setQuery(searchParams.get('q') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  const writeUrl = useCallback(
    (next) => {
      const params = new URLSearchParams();
      if (next.filter && next.filter !== 'All') params.set('category', next.filter);
      if (next.location && next.location !== 'All') params.set('location', next.location);
      if (next.year && next.year !== 'All') params.set('year', next.year);
      if (next.query?.trim()) params.set('q', next.query.trim());
      if (next.sort && next.sort !== 'newest') params.set('sort', next.sort);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    if (skipUrlWrite.current) {
      skipUrlWrite.current = false;
      return;
    }
    writeUrl({ filter, location, year, query, sort });
  }, [filter, location, year, query, sort, writeUrl]);

  const setModePersist = (next) => {
    setMode(next);
    try {
      window.localStorage.setItem('maple-portfolio-mode', next);
    } catch {
      /* ignore */
    }
  };

  const filtered = useMemo(() => {
    let list = [...projects];
    if (filter !== 'All') list = list.filter((p) => p.category === filter);
    if (location !== 'All') list = list.filter((p) => p.location === location);
    if (year !== 'All') list = list.filter((p) => p.year === year);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          safe(p.title).includes(q) ||
          safe(p.location).includes(q) ||
          safe(p.description).includes(q) ||
          safe(p.category).includes(q)
      );
    }

    if (sort === 'newest') list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    if (sort === 'area') {
      list.sort(
        (a, b) =>
          Number(String(b.area || '0').replace(/[^\d.]/g, '')) -
          Number(String(a.area || '0').replace(/[^\d.]/g, ''))
      );
    }
    if (sort === 'az') list.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    return list;
  }, [projects, filter, location, year, query, sort]);

  const { page, setPage, totalPages, paged } = usePagination(
    filtered,
    10,
    `${filter}|${location}|${year}|${query}|${sort}`
  );

  useEffect(() => {
    if (mode === 'stage') {
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    }
  }, [mode, paged.length, page]);

  const goToPage = (next) => {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasActiveFilters =
    filter !== 'All' || location !== 'All' || year !== 'All' || query.trim() || sort !== 'newest';

  const clearFilters = () => {
    setFilter('All');
    setLocation('All');
    setYear('All');
    setQuery('');
    setSort('newest');
  };

  return (
    <div className="pe-explorer" ref={topRef}>
      <div className="dm-wrap">
        <div className="pe-control">
          <div className="pe-control-head">
            <div className="pe-control-meta">
              <span className="pe-control-kicker">Browse</span>
              <p className="pe-control-count">
                <strong>{filtered.length}</strong>
                <span> of {projects.length} projects</span>
              </p>
            </div>

            <div className="pe-mode" role="group" aria-label="View mode">
              <button
                type="button"
                className={`pe-mode-btn ${mode === 'stage' ? 'is-active' : ''}`}
                onClick={() => setModePersist('stage')}
                aria-pressed={mode === 'stage'}
              >
                Stage
              </button>
              <button
                type="button"
                className={`pe-mode-btn ${mode === 'cards' ? 'is-active' : ''}`}
                onClick={() => setModePersist('cards')}
                aria-pressed={mode === 'cards'}
              >
                Cards
              </button>
            </div>
          </div>

          <div className="pe-types" role="tablist" aria-label="Project typology">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={filter === c}
                className={`pe-type ${filter === c ? 'is-active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c === 'All' ? 'All work' : c}
              </button>
            ))}
          </div>

          <div className="pe-filters">
            <label className="pe-field">
              <span>Location</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Filter by location"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'Anywhere' : loc}
                  </option>
                ))}
              </select>
            </label>

            <label className="pe-field">
              <span>Year</span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                aria-label="Filter by year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y === 'All' ? 'Any year' : y}
                  </option>
                ))}
              </select>
            </label>

            <label className="pe-field">
              <span>Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort projects"
              >
                <option value="newest">Newest first</option>
                <option value="area">Largest area</option>
                <option value="az">A–Z title</option>
              </select>
            </label>

            <label className="pe-field pe-field-grow">
              <span>Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, place, or typology…"
                aria-label="Search projects"
              />
            </label>

            {hasActiveFilters && (
              <button type="button" className="pe-clear" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={goToPage}
            totalItems={filtered.length}
            pageSize={10}
            alwaysShow
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dm-wrap">
          <p className="pe-empty">
            No projects match those filters.{' '}
            <button type="button" className="pe-empty-clear" onClick={clearFilters}>
              Clear filters
            </button>
          </p>
        </div>
      ) : mode === 'stage' ? (
        <PortfolioStage projects={paged} />
      ) : (
        <div className="dm-wrap">
          <div className="dm-grid pe-grid">
            {paged.map((p) => (
              <article className="dm-card" key={p.id}>
                <Link href={`/portfolio/${p.slug}`} className="pe-card-btn">
                  <div className="dm-card-media">
                    <Image src={p.image} alt={p.imageAlt || p.title} width={800} height={550} />
                  </div>
                  <div className="dm-card-body">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="dm-card-meta">
                      <span>{p.category}</span>
                      <span>{p.location}</span>
                      {p.year && <span>{p.year}</span>}
                      {p.area && <span>{p.area}</span>}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
