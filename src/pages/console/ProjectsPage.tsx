import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Projects</h1>
          <p className="text-sm text-muted mt-1">
            Active residential and commercial sites
          </p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span>New project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'proj-mehta', name: 'Mehta Residence', client: 'Anil & Priya Mehta', type: '3BHK Apartment', progress: 55 },
          { id: 'proj-baner', name: 'Baner Villa', client: 'Sharma family', type: 'Villa', progress: 40 },
          { id: 'proj-kharadi', name: 'Kharadi Office', client: 'Lumen Analytics', type: 'Commercial', progress: 15 },
        ].map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="p-5 rounded-card bg-paper border border-line hover:border-olive/50 cursor-pointer transition-all shadow-soft group"
          >
            <span className="text-[11px] uppercase tracking-wider text-muted font-medium">{p.type}</span>
            <h3 className="font-serif text-xl font-medium text-ink mt-1 group-hover:text-olive transition-colors">{p.name}</h3>
            <p className="text-xs text-muted mt-1">{p.client}</p>
            <div className="mt-4 pt-4 border-t border-line/60 flex items-center justify-between">
              <span className="text-xs text-ink-2">Progress</span>
              <span className="text-sm font-serif font-medium text-olive">{p.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
