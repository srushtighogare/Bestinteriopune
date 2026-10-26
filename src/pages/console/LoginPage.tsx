import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchUserRole, standardLogin } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    standardLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between p-6">
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/app/login')}
          className="text-xs text-muted hover:text-ink transition-colors"
        >
          Site App Login →
        </button>
      </div>

      <div className="max-w-md w-full mx-auto p-8 rounded-card bg-paper border border-line shadow-soft space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="Bestinterio" className="w-12 h-12 mx-auto rounded-2xl" />
          <h1 className="font-serif text-2xl font-medium text-ink">Sign in to Bestinterio</h1>
          <p className="text-xs text-muted">Interior Studio Operations System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              defaultValue="megha@bestinterio.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-ivory/50 text-sm text-ink focus:outline-none focus:border-olive"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-ivory/50 text-sm text-ink focus:outline-none focus:border-olive"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
          >
            Sign in
          </button>
        </form>

        <div className="pt-4 border-t border-line/60 text-center">
          <p className="text-xs text-muted mb-2">Demo: sign in as</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { switchUserRole('owner'); navigate('/'); }}
              className="text-xs px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/60 text-ink"
            >
              Owner
            </button>
            <button
              onClick={() => { switchUserRole('manager'); navigate('/'); }}
              className="text-xs px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/60 text-ink"
            >
              Manager
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-muted">
        Prototype for discussion · StudioOS v0.1.0
      </footer>
    </div>
  );
};
