import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Calendar, 
  User as UserIcon, 
  Plus, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ProgressCellStatus, ProgressUpdate, ScopeGridCell, TradeType } from '../../types';
import { formatRelativeTime } from '../../utils/calculations';
import { progressService } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';

interface CellHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cell: ScopeGridCell | null;
  roomName: string;
  trade: TradeType;
  updates: ProgressUpdate[];
  onCellUpdated: () => void;
}

export const CellHistoryDrawer: React.FC<CellHistoryDrawerProps> = ({
  isOpen,
  onClose,
  cell,
  roomName,
  trade,
  updates,
  onCellUpdated,
}) => {
  const { currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen || !cell) return null;

  // Format trade label (e.g. false_ceiling -> False ceiling)
  const formatTradeName = (t: string) => {
    return t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Filter updates for this room and trade
  const cellUpdates = updates
    .filter(u => u.roomId === cell.roomId && u.trade === cell.trade)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleQuickStatusChange = async (newStatus: ProgressCellStatus, percentage: number) => {
    setIsUpdating(true);
    try {
      const authorId = currentUser?.id || 'b1eebc99-9c0b-4ef8-bb6d-000000000001';
      const authorName = currentUser?.name || 'Megha Jadhav';
      await progressService.recordUpdate({
        studioId: cell.studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        projectId: cell.projectId,
        roomId: cell.roomId,
        roomName,
        trade: cell.trade,
        authorId,
        authorName,
        status: newStatus,
        percentage,
        note: 'Updated from studio console',
        photos: [],
      });
      onCellUpdated();
    } catch (err) {
      console.error('Failed to update cell status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

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
                  Scope cell details
                </span>
                <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                  {roomName}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Trade: <span className="font-medium text-ink">{formatTradeName(trade)}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status Badge & Progress */}
            <div className="mt-4 p-3.5 rounded-xl bg-paper border border-line flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                  Current Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {cell.status === 'done' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-olive-soft text-olive">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done (100%)</span>
                    </span>
                  ) : cell.status === 'in_progress' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-soft text-amber">
                      <Clock className="w-3.5 h-3.5" />
                      <span>In progress ({cell.percentage}%)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand text-muted">
                      <span>Not started (0%)</span>
                    </span>
                  )}
                </div>
              </div>

              {cell.lastUpdated && (
                <div className="text-right text-[11px] text-muted">
                  <span>Updated {formatRelativeTime(cell.lastUpdated)}</span>
                  {cell.lastUpdatedBy && (
                    <span className="block text-ink-2 font-medium">
                      by {cell.lastUpdatedBy.split(' ')[0]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick status updater for Owner / Manager */}
            <div className="mt-4 pt-3 border-t border-line/60">
              <span className="text-[11px] text-muted font-medium block mb-2">
                Quick update status:
              </span>
              <div className="grid grid-cols-5 gap-1">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleQuickStatusChange('not_started', 0)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
                    cell.status === 'not_started'
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper text-muted border-line hover:border-sand-dark'
                  }`}
                >
                  Not started
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleQuickStatusChange('in_progress', 25)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
                    cell.status === 'in_progress' && cell.percentage === 25
                      ? 'bg-amber text-paper border-amber'
                      : 'bg-paper text-amber border-amber/30 hover:bg-amber-soft'
                  }`}
                >
                  25%
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleQuickStatusChange('in_progress', 50)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
                    cell.status === 'in_progress' && cell.percentage === 50
                      ? 'bg-amber text-paper border-amber'
                      : 'bg-paper text-amber border-amber/30 hover:bg-amber-soft'
                  }`}
                >
                  50%
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleQuickStatusChange('in_progress', 75)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
                    cell.status === 'in_progress' && cell.percentage === 75
                      ? 'bg-amber text-paper border-amber'
                      : 'bg-paper text-amber border-amber/30 hover:bg-amber-soft'
                  }`}
                >
                  75%
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleQuickStatusChange('done', 100)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
                    cell.status === 'done'
                      ? 'bg-olive text-paper border-olive'
                      : 'bg-paper text-olive border-olive/30 hover:bg-olive-soft'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          {/* Timeline of updates */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-muted font-medium">
              Update history ({cellUpdates.length})
            </h4>

            {cellUpdates.length === 0 ? (
              <div className="p-8 rounded-xl bg-sand/30 border border-line text-center space-y-2">
                <Clock className="w-6 h-6 text-muted mx-auto" strokeWidth={1.5} />
                <p className="text-xs font-medium text-ink">No updates recorded yet</p>
                <p className="text-[11px] text-muted">
                  Site supervisors and workers post updates from the site app when work is completed.
                </p>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-line/80">
                {cellUpdates.map((update, idx) => (
                  <div key={update.id} className="relative pl-7 space-y-2">
                    {/* Timeline bullet */}
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-paper bg-olive shadow-xs" />

                    <div className="p-3.5 rounded-xl border border-line bg-paper space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-medium text-xs text-ink block">
                            {update.authorName}
                          </span>
                          <span className="text-[11px] text-muted">
                            {formatRelativeTime(update.date)} · {new Date(update.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand text-ink tabular-nums">
                          {update.percentage}% complete
                        </span>
                      </div>

                      {update.note && (
                        <p className="text-xs text-ink-2 leading-relaxed bg-ivory/80 p-2.5 rounded-lg border border-line/60">
                          {update.note}
                        </p>
                      )}

                      {/* Photo attachments */}
                      {update.photos && update.photos.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-muted flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            <span>Attached photos ({update.photos.length})</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {update.photos.map((photo, pIdx) => (
                              <div
                                key={pIdx}
                                onClick={() => setSelectedPhoto(photo)}
                                className="w-16 h-16 rounded-lg overflow-hidden border border-line bg-sand/30 cursor-pointer relative group"
                              >
                                <img
                                  src={photo}
                                  alt="Work log"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Lightbox for cell update photo */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-60 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-paper rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-ink/70 text-paper flex items-center justify-center hover:bg-ink"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={selectedPhoto} 
              alt="Work site inspection" 
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
