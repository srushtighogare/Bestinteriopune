import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, currentUser } = useAuth();

  const handleReturn = () => {
    if (!currentUser) {
      navigate('/login');
    } else if (role === 'worker' || role === 'supervisor') {
      navigate('/app');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center text-ink selection:bg-olive-soft">
      <div className="max-w-md w-full p-8 rounded-card bg-paper border border-line shadow-card space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-sand/40 border border-line flex items-center justify-center mx-auto text-ink">
          <Compass className="w-7 h-7 text-muted" strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            404 · Page Not Found
          </span>
          <h1 className="font-serif text-2xl font-medium text-ink">
            Looking for something on site?
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            The page you're looking for doesn't exist, may have moved, or the link might be expired.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReturn}
            className="w-full h-11 px-5 rounded-xl bg-ink text-paper text-xs font-semibold hover:bg-ink-2 active:scale-95 transition-all inline-flex items-center justify-center gap-2 shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {role === 'worker' || role === 'supervisor' ? 'Site Home' : 'Home'}</span>
          </button>
        </div>
      </div>

      <p className="mt-8 text-[11px] text-muted/60">
        Bestinterio · StudioOS
      </p>
    </div>
  );
};
