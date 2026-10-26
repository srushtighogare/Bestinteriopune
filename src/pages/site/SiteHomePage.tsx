import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Hammer, Camera, ClipboardList, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SiteHomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isSupervisor = currentUser?.role === 'supervisor' || currentUser?.role === 'owner' || currentUser?.role === 'manager';

  return (
    <div className="space-y-5">
      {/* Site Selector Card */}
      <div className="p-4 rounded-2xl bg-paper border border-line shadow-soft">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted block mb-1">
          Active Site
        </span>
        <h2 className="font-serif text-lg font-medium text-ink">Mehta Residence</h2>
        <p className="text-xs text-muted mt-0.5">Panchshil Towers, Kharadi</p>
        <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
          <span className="text-muted">Today's focus</span>
          <span className="text-ink font-medium">Kitchen carpentry</span>
        </div>
      </div>

      {/* Action Tiles Grid */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-muted font-medium block px-1">
          Quick Actions
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {isSupervisor && (
            <button
              onClick={() => navigate('/app/received')}
              className="w-full h-14 px-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/30 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-olive-soft flex items-center justify-center text-olive">
                  <PackagePlus className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-ink">Material received</span>
              </div>
              <span className="text-xs text-muted">Bill / Challan</span>
            </button>
          )}

          <button
            onClick={() => navigate('/app/used')}
            className="w-full h-14 px-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/30 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sand/50 flex items-center justify-center text-ink">
                <Hammer className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-ink">Material used</span>
            </div>
            <span className="text-xs text-muted">Log items</span>
          </button>

          <button
            onClick={() => navigate('/app/progress')}
            className="w-full h-14 px-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/30 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sand/50 flex items-center justify-center text-ink">
                <Camera className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-ink">
                {isSupervisor ? 'Progress update' : 'Work done'}
              </span>
            </div>
            <span className="text-xs text-muted">Photos + notes</span>
          </button>

          {isSupervisor && (
            <button
              onClick={() => navigate('/app/stock-check')}
              className="w-full h-14 px-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/30 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sand/50 flex items-center justify-center text-ink">
                  <ClipboardList className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-ink">Stock check</span>
              </div>
              <span className="text-xs text-muted">Audit counts</span>
            </button>
          )}

          <button
            onClick={() => navigate('/app/problem')}
            className="w-full h-14 px-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-rust-soft/40 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rust-soft flex items-center justify-center text-rust">
                <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-ink">Report a problem</span>
            </div>
            <span className="text-xs text-muted">Issue</span>
          </button>
        </div>
      </div>

      {/* Activity Logged Today */}
      <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
        <h3 className="font-serif text-sm font-medium text-ink">Today's logs</h3>
        <p className="text-xs text-muted">
          Your logged actions for today will appear here. Full action handlers will be connected in Step 10.
        </p>
      </div>
    </div>
  );
};
