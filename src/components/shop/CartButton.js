'use client';
import { useCart } from './CartProvider';

export default function CartButton({ className = '' }) {
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      className={`cart-fab ${className}`}
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} items`}
    >
      <span className="cart-fab-label">Cart</span>
      <span className="cart-fab-count">{count}</span>
    </button>
  );
}
