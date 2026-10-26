import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

export const ProjectSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4 print:hidden">
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="flex items-center gap-2 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Back to project</span>
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft"
        >
          <Printer className="w-4 h-4" strokeWidth={1.5} />
          <span>Print / PDF</span>
        </button>
      </div>

      <div className="p-8 rounded-card bg-paper border border-line max-w-4xl mx-auto shadow-soft">
        <div className="border-b border-line pb-4 flex justify-between items-start">
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">Weekly Site Summary</h1>
            <p className="text-xs text-muted mt-1">Bestinterio · Project: {id}</p>
          </div>
          <img src="/logo.png" alt="Bestinterio" className="w-14 h-14 object-contain aspect-square" />
        </div>
        <div className="py-12 text-center text-muted text-sm">
          Print-ready A4 Summary Sheet (Internal &amp; Customer versions) will be completed in Step 11.
        </div>
      </div>
    </div>
  );
};
