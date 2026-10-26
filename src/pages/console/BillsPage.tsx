import React from 'react';
import { Upload } from 'lucide-react';

export const BillsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Bills</h1>
          <p className="text-sm text-muted mt-1">
            Vendor invoices and material challans
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
        >
          <Upload className="w-4 h-4" strokeWidth={1.5} />
          <span>Upload bill</span>
        </button>
      </div>

      <div className="p-6 rounded-card bg-paper border border-line">
        <p className="text-sm text-muted">
          Bills list and interactive GST bill viewer will be implemented in Step 7.
        </p>
      </div>
    </div>
  );
};
