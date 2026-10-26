import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page Header with One Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Megha'}
          </h1>
          <p className="text-sm text-muted mt-1 font-sans">
            Monday, 26 October 2026 · Pune
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            <span>New project</span>
          </button>
        </div>
      </div>

      {/* Placeholder Overview Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active projects', value: '3' },
          { label: 'Items running low', value: '3' },
          { label: 'Bills to review', value: '2' },
          { label: 'Sites with no update in 3+ days', value: '1' },
        ].map((card, i) => (
          <div key={i} className="p-5 rounded-card bg-paper border border-line">
            <span className="text-xs uppercase tracking-wider text-muted font-medium block">{card.label}</span>
            <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-card bg-paper border border-line">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-medium text-ink">Needs your attention</h2>
          <span className="text-xs text-muted">Section 5.1 shell</span>
        </div>
        <ul className="space-y-3">
          <li className="p-3.5 rounded-xl bg-rust-soft/50 border border-rust/30 flex items-center justify-between text-sm text-ink">
            <span>Laminate 1mm (Oak 5512) is out of stock at Mehta Residence</span>
            <ArrowUpRight className="w-4 h-4 text-rust" strokeWidth={1.5} />
          </li>
          <li className="p-3.5 rounded-xl bg-amber-soft/50 border border-amber/30 flex items-center justify-between text-sm text-ink">
            <span>Kharadi Office has had no update for 4 days</span>
            <ArrowUpRight className="w-4 h-4 text-amber" strokeWidth={1.5} />
          </li>
          <li className="p-3.5 rounded-xl bg-amber-soft/50 border border-amber/30 flex items-center justify-between text-sm text-ink">
            <span>2 bills uploaded yesterday are waiting for review</span>
            <ArrowUpRight className="w-4 h-4 text-amber" strokeWidth={1.5} />
          </li>
        </ul>
      </div>
    </div>
  );
};
