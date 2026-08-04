'use client';
import { useEffect, useMemo, useState } from 'react';

function pageWindow(total, current, siblings = 1) {
  if (total <= 1) return [1];
  const pages = new Set([1, total, current]);
  for (let i = current - siblings; i <= current + siblings; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function Pagination({
  page,
  totalPages,
  onChange,
  totalItems = 0,
  pageSize = 10,
  className = '',
  alwaysShow = false,
}) {
  const pages = pageWindow(Math.max(totalPages, 1), page);
  const items = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push({ type: 'gap', key: `gap-${p}` });
    items.push({ type: 'page', value: p, key: `p-${p}` });
  });

  if (!alwaysShow && totalPages <= 1 && totalItems <= pageSize) return null;

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className={`dm-pagination-wrap ${className}`.trim()}>
      {totalItems > 0 && (
        <p className="dm-pagination-range">
          Showing {start}–{end} of {totalItems}
          {totalPages > 1 ? ` · Page ${page}/${totalPages}` : ''}
        </p>
      )}
      <nav className="dm-pagination" aria-label="Pagination">
        <button
          type="button"
          className="dm-page-btn"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          ← Prev
        </button>
        <div className="dm-page-nums">
          {items.map((item) =>
            item.type === 'gap' ? (
              <span key={item.key} className="dm-page-gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item.key}
                type="button"
                className={`dm-page-num ${page === item.value ? 'is-active' : ''}`}
                onClick={() => onChange(item.value)}
                aria-current={page === item.value ? 'page' : undefined}
              >
                {String(item.value).padStart(2, '0')}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          className="dm-page-btn"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          Next →
        </button>
      </nav>
    </div>
  );
}

/** Client-side list pagination helper. */
export function usePagination(list, pageSize = 10, resetKey) {
  const [page, setPage] = useState(1);
  const totalItems = list?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [resetKey, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return (list || []).slice(start, start + pageSize);
  }, [list, currentPage, pageSize]);

  return {
    page: currentPage,
    setPage,
    pageSize,
    totalPages,
    totalItems,
    paged,
  };
}
