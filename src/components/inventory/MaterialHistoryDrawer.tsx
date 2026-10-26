import React from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  SlidersHorizontal, 
  Calendar, 
  User as UserIcon, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Material, MaterialStockBalance, StockMovement } from '../../types';
import { formatRelativeTime } from '../../utils/calculations';

interface MaterialHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  balance: MaterialStockBalance | null;
  movements: StockMovement[];
  projectName: string;
}

export const MaterialHistoryDrawer: React.FC<MaterialHistoryDrawerProps> = ({
  isOpen,
  onClose,
  material,
  balance,
  movements,
  projectName,
}) => {
  if (!isOpen || !material) return null;

  // Filter movements for this material
  const matMovements = movements
    .filter(m => m.materialId === material.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-paper border-l border-line shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-line bg-ivory/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted font-medium">
                  Material Stock History
                </span>
                <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                  {material.name}
                </h3>
                {material.shadeCode && (
                  <p className="text-xs text-muted mt-0.5">
                    Shade / Code: <span className="font-medium text-ink">{material.shadeCode}</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Site Stock Snapshot */}
            <div className="mt-4 grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-paper border border-line text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                  Received
                </span>
                <span className="font-serif text-base font-medium text-ink tabular-nums">
                  {balance?.received ?? 0} {material.unit}
                </span>
              </div>
              <div className="border-x border-line">
                <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                  Used
                </span>
                <span className="font-serif text-base font-medium text-ink tabular-nums">
                  {balance?.used ?? 0} {material.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                  In Stock
                </span>
                <span className={`font-serif text-base font-medium tabular-nums ${
                  (balance?.inStock ?? 0) <= 0 
                    ? 'text-rust' 
                    : (balance?.inStock ?? 0) <= material.lowStockThreshold 
                    ? 'text-amber' 
                    : 'text-olive'
                }`}>
                  {balance?.inStock ?? 0} {material.unit}
                </span>
              </div>
            </div>

            {balance?.hasOveruse && (
              <div className="mt-3 p-2.5 rounded-lg bg-rust-soft border border-rust/30 flex items-center gap-2 text-xs text-rust font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Overused by {balance.overuseQty} {material.unit} — more used than in stock.</span>
              </div>
            )}
          </div>

          {/* Movement history list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider text-muted font-medium">
                Movements at {projectName} ({matMovements.length})
              </h4>
              <span className="text-[11px] text-muted">
                Low threshold: {material.lowStockThreshold} {material.unit}
              </span>
            </div>

            {matMovements.length === 0 ? (
              <div className="p-8 rounded-xl bg-sand/30 border border-line text-center space-y-2">
                <SlidersHorizontal className="w-6 h-6 text-muted mx-auto" strokeWidth={1.5} />
                <p className="text-xs font-medium text-ink">No movements logged yet</p>
                <p className="text-[11px] text-muted">
                  Material entries are created when bills are uploaded or workers log material used.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {matMovements.map(m => {
                  const isReceived = m.type === 'received';
                  const isUsed = m.type === 'used';

                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl border border-line bg-paper space-y-2 text-xs hover:border-sand-dark transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isReceived 
                              ? 'bg-olive-soft text-olive' 
                              : isUsed 
                              ? 'bg-sand text-ink-2' 
                              : 'bg-amber-soft text-amber'
                          }`}>
                            {isReceived && <ArrowDownLeft className="w-3.5 h-3.5" />}
                            {isUsed && <ArrowUpRight className="w-3.5 h-3.5" />}
                            {!isReceived && !isUsed && <SlidersHorizontal className="w-3.5 h-3.5" />}
                          </div>

                          <div>
                            <span className="font-medium text-ink">
                              {isReceived ? 'Material received' : isUsed ? 'Material used' : 'Stock check adjustment'}
                            </span>
                            <span className="text-[11px] text-muted block">
                              {formatRelativeTime(m.date)} · {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>

                        <span className={`font-serif font-medium text-sm tabular-nums ${
                          isReceived ? 'text-olive' : isUsed ? 'text-ink' : 'text-amber'
                        }`}>
                          {isReceived ? `+${m.quantity}` : `-${m.quantity}`} {material.unit}
                        </span>
                      </div>

                      {/* Detail notes & author */}
                      <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="w-3 h-3 text-muted" />
                          <span>Logged by {m.workerName || 'Supervisor'}</span>
                        </div>

                        {m.roomName && (
                          <span className="bg-sand/60 px-2 py-0.5 rounded text-ink-2 font-medium">
                            {m.roomName}
                          </span>
                        )}

                        {m.billId && (
                          <span className="inline-flex items-center gap-1 text-ink-2 font-medium">
                            <FileText className="w-3 h-3 text-muted" />
                            <span>Linked to Bill</span>
                          </span>
                        )}
                      </div>

                      {m.reason && (
                        <p className="text-[11px] text-ink-2 bg-ivory p-2 rounded border border-line/60">
                          Reason: {m.reason}
                        </p>
                      )}

                      {m.note && (
                        <p className="text-[11px] text-muted italic">
                          "{m.note}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-line bg-ivory/50 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/40 transition-colors"
            >
              Close panel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
