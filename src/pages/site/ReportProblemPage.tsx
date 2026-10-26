import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ReportProblemPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">Report a problem</h2>
        <p className="text-xs text-muted">Flag missing materials, site delays, or design questions</p>
      </div>

      <div className="p-4 rounded-2xl bg-paper border border-line space-y-3">
        <p className="text-xs text-muted">
          Issue categorisation and photo attachment will be implemented in Step 10.
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
