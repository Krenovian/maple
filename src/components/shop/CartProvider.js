'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'maple-cart-v1';

function lineKey(item) {
  return `${item.productId}::${item.finish || ''}::${item.sample || ''}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const addItem = useCallback((product, opts = {}) => {
    const incoming = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price || '',
      image: product.image,
      finish: opts.finish || 'Natural',
      sample: opts.sample || 'A4 sample',
      qty: opts.qty || 1,
    };
    const key = lineKey(incoming);
    setItems((prev) => {
      const idx = prev.findIndex((p) => lineKey(p) === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + (opts.qty || 1) };
        return next;
      }
      return [...prev, incoming];
    });
    setOpen(true);
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev
        .map((item) => (lineKey(item) === key ? { ...item, qty: Math.max(1, qty) } : item))
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((item) => lineKey(item) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + (i.qty || 1), 0), [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      open,
      setOpen,
      addItem,
      updateQty,
      removeItem,
      clear,
      lineKey,
    }),
    [items, count, open, addItem, updateQty, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
