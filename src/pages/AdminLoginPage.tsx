import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export function AdminLoginPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-5">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-line bg-surface p-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Owner Only</p>
          <h1 className="mt-1 font-serif text-2xl font-medium text-ink">Admin Sign In</h1>
        </div>

        {error && (
          <div role="alert" className="rounded-lg bg-red-500/10 p-3 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link to="/" className="block text-center text-xs text-muted hover:text-ink">
          ← Back to public portfolio
        </Link>
      </div>
    </div>
  );
}
