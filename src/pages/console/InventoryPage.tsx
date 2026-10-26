import React from 'react';
import { Plus } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Inventory</h1>
          <p className="text-sm text-muted mt-1">
            Materials in stock across all sites and master catalogue
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span>Record material received</span>
        </button>
      </div>

      <div className="p-6 rounded-card bg-paper border border-line">
        <p className="text-sm text-muted">
          Inventory view and catalogue management will be implemented in Step 6.
        </p>
      </div>
    </div>
  );
};
