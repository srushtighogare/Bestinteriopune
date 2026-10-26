import React, { useState } from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';
import { resetDemoData } from '../../services/storage';

export const SettingsPage: React.FC = () => {
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to clean factory state? Any changes made during the session will be restored to initial mock data.')) {
      resetDemoData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-line pb-6">
        <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Settings</h1>
        <p className="text-sm text-muted mt-1">
          Studio profile, catalogues, room templates, and demo controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="px-3 py-2 rounded-xl bg-olive-soft text-olive font-medium text-sm">Demo Controls</div>
          <div className="px-3 py-2 text-muted text-sm">Studio Profile</div>
          <div className="px-3 py-2 text-muted text-sm">Material Catalogue</div>
          <div className="px-3 py-2 text-muted text-sm">Room Templates</div>
          <div className="px-3 py-2 text-muted text-sm">Trades</div>
          <div className="px-3 py-2 text-muted text-sm">Permissions</div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-card bg-paper border border-line space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-olive" strokeWidth={1.5} />
              <h2 className="font-serif text-xl font-medium text-ink">Demo Management</h2>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">
              StudioOS runs completely in local prototype mode. All changes, including recorded materials, uploaded bills, and progress updates persist in your browser's local storage.
            </p>
            
            <div className="pt-4 border-t border-line">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-ivory hover:bg-sand/40 text-ink text-sm font-medium transition-all shadow-xs"
              >
                {resetDone ? (
                  <>
                    <Check className="w-4 h-4 text-olive" strokeWidth={1.5} />
                    <span className="text-olive">Demo data restored</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 text-muted" strokeWidth={1.5} />
                    <span>Reset demo data</span>
                  </>
                )}
              </button>
              <p className="text-xs text-muted mt-2">
                Restores Mehta Residence, Baner Villa, and Kharadi Office to initial October 2026 baseline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
