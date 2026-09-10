'use client';

import MapleImage from '@/components/MapleImage';
import Link from 'next/link';

export default function CategoryShowcase({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <div className="tdc-category-showcase">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${encodeURIComponent(category.name)}`}
          className="tdc-category-card"
        >
          <div className="tdc-category-media">
            {category.image ? (
              <MapleImage
                src={category.image}
                alt={category.imageAlt || category.name}
                fill
                sizes="(max-width: 700px) 50vw, 20vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="tdc-category-fallback">{category.name.slice(0, 1)}</div>
            )}
          </div>
          <div className="tdc-category-body">
            <strong>{category.name}</strong>
            {category.children?.length ? (
              <span>
                {category.children.slice(0, 3).map((child) => child.name).join(' · ')}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
