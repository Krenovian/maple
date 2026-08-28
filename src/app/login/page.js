'use client';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      const session = await getSession();
      const dest = session?.user?.role === 'EMPLOYEE' ? '/employee' : '/admin';
      router.push(dest);
      router.refresh();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <Image src="/images/logo-mark.png" alt="MAPLE INFRA & INTERIORS" width={36} height={36} style={{ borderRadius: 6 }} />
            <span style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', color: '#fff' }}>maple</span>
          </Link>
        </div>

        <h1>Workspace</h1>
        <p>Sign in to manage projects, catalog and inquiries.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="dm-form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="admin@demaple.com" />
          </div>
          <div className="dm-form-group">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}
