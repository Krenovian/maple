'use client';
import { useState } from 'react';

export default function FaqList({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="dm-faq reveal-stagger">
      {items.map((item, i) => (
        <div className={`dm-faq-item ${open === i ? 'is-open' : ''}`} key={item.q}>
          <button
            type="button"
            className="dm-faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            {item.q}
            <i>+</i>
          </button>
          <div className="dm-faq-a">
            <div>{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
