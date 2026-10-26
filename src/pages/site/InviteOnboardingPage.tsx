import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const InviteOnboardingPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="text-center pt-8 space-y-4">
        <img src="/logo.svg" alt="Bestinterio" className="w-14 h-14 mx-auto rounded-2xl" />
        <h1 className="font-serif text-2xl font-medium text-ink">Welcome to StudioOS</h1>
        <p className="text-sm text-muted">
          Bestinterio has invited you to join the site operations team. (Invite code: {code})
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-paper border border-line space-y-4">
        <p className="text-xs text-muted leading-relaxed">
          The 4-digit PIN setup and home screen PWA installation flow will be fully built in Step 2.
        </p>
        <button
          onClick={() => navigate('/app')}
          className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-medium flex items-center justify-center shadow-soft"
        >
          Enter Site App
        </button>
      </div>

      <footer className="text-center text-xs text-muted pb-4">
        Bestinterio · Site Operations
      </footer>
    </div>
  );
};
