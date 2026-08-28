'use client';

export default function PromoBar({ lines = [] }) {
  const items = lines.filter(Boolean);
  if (!items.length) return null;

  const track = [...items, ...items];

  return (
    <div className="tdc-promo-bar" aria-label="Shop promotions">
      <div className="tdc-promo-track">
        {track.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
    </div>
  );
}
