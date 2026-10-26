import React from 'react';

export const StockListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">Site Stock</h2>
        <p className="text-xs text-muted">Materials available at Mehta Residence</p>
      </div>

      <div className="p-4 rounded-2xl bg-paper border border-line space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-line/60">
          <div>
            <p className="text-sm font-medium text-ink">Plywood 18mm BWP</p>
            <p className="text-xs text-muted">Carpentry</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-sand/40 text-ink font-medium">
            12 sheets
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-line/60">
          <div>
            <p className="text-sm font-medium text-ink">Laminate 1mm (Oak 5512)</p>
            <p className="text-xs text-muted">Carpentry</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-rust-soft text-rust font-medium">
            Out of stock
          </span>
        </div>
      </div>
    </div>
  );
};
