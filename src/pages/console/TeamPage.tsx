import React from 'react';
import { UserPlus } from 'lucide-react';

export const TeamPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Team</h1>
          <p className="text-sm text-muted mt-1">
            Studio team members, supervisors, and site trade leads
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
        >
          <UserPlus className="w-4 h-4" strokeWidth={1.5} />
          <span>Add member</span>
        </button>
      </div>

      <div className="p-6 rounded-card bg-paper border border-line">
        <p className="text-sm text-muted">
          Team table, WhatsApp invitation sharing, and PIN management will be implemented in Step 8.
        </p>
      </div>
    </div>
  );
};
