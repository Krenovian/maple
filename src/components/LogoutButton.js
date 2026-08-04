'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton({ className = 'btn btn-outline btn-sm', style }) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Sign Out
    </button>
  );
}
