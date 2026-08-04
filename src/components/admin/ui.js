'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export function Modal({ title, onClose, children }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="ad-modal-overlay" onClick={onClose} role="presentation" data-lenis-prevent>
      <div
        className="ad-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      >
        <div className="ad-modal-scroll">
          <h2>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="dm-form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function useAdminMutate() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      router.refresh();
      return true;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { busy, error, setError, run };
}

export async function apiJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
