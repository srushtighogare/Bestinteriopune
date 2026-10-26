import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <button
          onClick={() => navigate('/projects')}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-line bg-paper text-ink-2 hover:text-ink hover:bg-sand/30"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">New Project</h1>
          <p className="text-sm text-muted mt-1">Wizard: Basics → Rooms → Scope → Team → Review</p>
        </div>
      </div>

      <div className="p-8 rounded-card bg-paper border border-line">
        <p className="text-sm text-muted">
          New project wizard (Step 5.9 of brief) placeholder. The 6-step creation flow will be implemented in Step 5.
        </p>
      </div>
    </div>
  );
};
