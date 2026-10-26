import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MaterialUsedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">Material used</h2>
        <p className="text-xs text-muted">Select materials used today at Mehta Residence</p>
      </div>

      <div className="p-4 rounded-2xl bg-paper border border-line space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-line/60">
          <div>
            <p className="text-sm font-medium text-ink">Plywood 18mm BWP</p>
            <p className="text-xs text-muted">In stock: 12 sheets</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-ink tabular-nums">0</span>
          </div>
        </div>
        <p className="text-xs text-muted">
          Worker &amp; supervisor material logger with room selectors will be wired in Step 10.
        </p>
      </div>

      <button
        onClick={() => navigate('/app')}
        className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-medium flex items-center justify-center shadow-soft"
      >
        Done
      </button>
    </div>
  );
};
