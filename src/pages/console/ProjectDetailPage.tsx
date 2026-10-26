import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-line bg-paper text-ink-2 hover:text-ink hover:bg-sand/30"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">
              {id === 'proj-baner' ? 'Baner Villa' : id === 'proj-kharadi' ? 'Kharadi Office' : 'Mehta Residence'}
            </h1>
            <p className="text-sm text-muted mt-1">Project Detail Shell · ID: {id}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/projects/${id}/summary`)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
        >
          <FileText className="w-4 h-4" strokeWidth={1.5} />
          <span>Download summary</span>
        </button>
      </div>

      <div className="p-6 rounded-card bg-paper border border-line">
        <div className="flex items-center gap-4 border-b border-line pb-3 text-sm font-medium text-muted">
          <span className="text-olive border-b-2 border-olive pb-3 -mb-3 font-semibold">Overview</span>
          <span className="hover:text-ink cursor-pointer">Progress</span>
          <span className="hover:text-ink cursor-pointer">Inventory</span>
          <span className="hover:text-ink cursor-pointer">Bills</span>
          <span className="hover:text-ink cursor-pointer">Team</span>
        </div>
        <div className="py-8 text-center text-muted text-sm">
          Project Room × Trade grid and inventory tabs will be built in Step 4.
        </div>
      </div>
    </div>
  );
};
