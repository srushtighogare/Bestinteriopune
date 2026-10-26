import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Calendar, 
  Hammer, 
  ArrowUpRight, 
  Check, 
  Filter,
  User as UserIcon
} from 'lucide-react';
import { Issue, ProgressUpdate, Project, ScopeGridCell, TradeType } from '../../types';
import { computeProjectProgress, computeRoomProgress, formatRelativeTime } from '../../utils/calculations';
import { CellHistoryDrawer } from './CellHistoryDrawer';
import { progressService } from '../../services/progressService';

interface RoomTradeGridProps {
  project: Project;
  cells: ScopeGridCell[];
  updates: ProgressUpdate[];
  issues: Issue[];
  onDataRefresh: () => void;
}

export const RoomTradeGrid: React.FC<RoomTradeGridProps> = ({
  project,
  cells,
  updates,
  issues,
  onDataRefresh,
}) => {
  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    cell: ScopeGridCell;
    roomName: string;
    trade: TradeType;
  } | null>(null);

  const [activeBottomSection, setActiveBottomSection] = useState<'updates' | 'issues'>('updates');
  const [issueFilter, setIssueFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Compute overall progress % strictly from cells
  const overallProgress = useMemo(() => {
    return computeProjectProgress(cells);
  }, [cells]);

  // Trades in scope for this project
  const trades: TradeType[] = useMemo(() => {
    if (project.tradesInScope && project.tradesInScope.length > 0) {
      return project.tradesInScope;
    }
    return ['carpentry', 'electrical', 'civil', 'painting', 'plumbing', 'false_ceiling'];
  }, [project.tradesInScope]);

  // Format trade label
  const formatTradeName = (t: string) => {
    return t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Find cell for (roomId, trade)
  const getCell = (roomId: string, trade: TradeType): ScopeGridCell | undefined => {
    return cells.find(c => c.roomId === roomId && c.trade === trade);
  };

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      if (issueFilter === 'all') return true;
      return i.status === issueFilter;
    });
  }, [issues, issueFilter]);

  const handleResolveIssue = async (issueId: string) => {
    try {
      await progressService.resolveIssue(issueId);
      onDataRefresh();
    } catch (err) {
      console.error('Failed to resolve issue:', err);
    }
  };

  const openIssuesCount = issues.filter(i => i.status === 'open').length;

  return (
    <div className="space-y-8">
      {/* 1. Overall Progress Header Card */}
      <div className="p-6 rounded-card bg-paper border border-line shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-medium">
                Overall site progress
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-3xl font-medium text-ink tabular-nums">
                  {overallProgress}%
                </span>
                <span className="text-xs text-muted">
                  computed from {cells.length} scope cells across {project.rooms.length} rooms
                </span>
              </div>
            </div>
            
            {project.currentFocus && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ivory border border-line text-xs text-ink-2">
                <Hammer className="w-3.5 h-3.5 text-muted shrink-0" />
                <span>Focus: <strong className="font-medium text-ink">{project.currentFocus}</strong></span>
              </div>
            )}
          </div>

          {/* Thin olive progress bar */}
          <div className="w-full bg-sand/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-olive h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Room completion stat pills */}
        <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-line md:pl-6">
          <div className="text-center px-2">
            <span className="text-lg font-serif font-medium text-olive tabular-nums block">
              {cells.filter(c => c.status === 'done').length}
            </span>
            <span className="text-[11px] text-muted block">Cells Done</span>
          </div>
          <div className="w-px h-8 bg-line" />
          <div className="text-center px-2">
            <span className="text-lg font-serif font-medium text-amber tabular-nums block">
              {cells.filter(c => c.status === 'in_progress').length}
            </span>
            <span className="text-[11px] text-muted block">In Progress</span>
          </div>
          <div className="w-px h-8 bg-line" />
          <div className="text-center px-2">
            <span className="text-lg font-serif font-medium text-muted tabular-nums block">
              {cells.filter(c => c.status === 'not_started').length}
            </span>
            <span className="text-[11px] text-muted block">Not Started</span>
          </div>
        </div>
      </div>

      {/* 2. The Room × Trade Grid */}
      <div className="p-6 rounded-card bg-paper border border-line shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-line">
          <div>
            <h3 className="font-serif text-xl font-medium text-ink tracking-tight">
              Room × Trade Scope Grid
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Click any cell to inspect its history, dated photos, and worker updates
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-olive" />
              <span>Done (100%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber" />
              <span>In progress</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sand-dark" />
              <span>Not started</span>
            </span>
          </div>
        </div>

        {/* Responsive Grid Container with horizontal scroll on narrow screens */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted font-medium">
                <th className="py-3 px-4 w-44 sticky left-0 bg-paper z-10">Room</th>
                {trades.map(trade => (
                  <th key={trade} className="py-3 px-3 text-center min-w-[100px]">
                    {formatTradeName(trade)}
                  </th>
                ))}
                <th className="py-3 px-4 text-right w-24">Room %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {project.rooms.map(room => {
                const roomPct = computeRoomProgress(cells, room.id);

                return (
                  <tr key={room.id} className="hover:bg-sand/20 transition-colors group">
                    {/* Room Name Column */}
                    <td className="py-3.5 px-4 font-serif font-medium text-sm text-ink sticky left-0 bg-paper group-hover:bg-sand/20 transition-colors z-10 border-r border-line/40">
                      {room.name}
                    </td>

                    {/* Trade Cells */}
                    {trades.map(trade => {
                      const cell = getCell(room.id, trade);
                      const status = cell?.status || 'not_started';
                      const pct = cell?.percentage || 0;

                      return (
                        <td key={trade} className="py-2.5 px-2 text-center">
                          {cell ? (
                            <button
                              type="button"
                              onClick={() => setSelectedCellInfo({ cell, roomName: room.name, trade })}
                              className={`w-full py-2 px-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 group/cell cursor-pointer ${
                                status === 'done'
                                  ? 'bg-olive-soft border-olive/30 text-olive hover:bg-olive hover:text-paper hover:border-olive shadow-xs'
                                  : status === 'in_progress'
                                  ? 'bg-amber-soft border-amber/40 text-amber hover:bg-amber hover:text-paper hover:border-amber shadow-xs'
                                  : 'bg-sand/30 border-line text-muted hover:border-sand-dark hover:bg-sand/60'
                              }`}
                            >
                              {status === 'done' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>100%</span>
                                </>
                              ) : status === 'in_progress' ? (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{pct}%</span>
                                </>
                              ) : (
                                <span className="text-[11px] text-muted group-hover/cell:text-ink">
                                  —
                                </span>
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] text-sand-dark select-none">
                              n/a
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Room Progress % */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-serif font-medium text-xs text-ink tabular-nums">
                          {roomPct}%
                        </span>
                        <div className="w-12 bg-sand/60 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-olive h-1.5 rounded-full"
                            style={{ width: `${roomPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Below Grid: Updates Timeline & Issues List */}
      <div className="p-6 rounded-card bg-paper border border-line shadow-card space-y-6">
        {/* Toggle between Updates and Issues */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveBottomSection('updates')}
              className={`pb-1 text-sm font-medium transition-all border-b-2 ${
                activeBottomSection === 'updates'
                  ? 'border-ink text-ink font-semibold'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Updates timeline ({updates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveBottomSection('issues')}
              className={`pb-1 text-sm font-medium transition-all border-b-2 inline-flex items-center gap-1.5 ${
                activeBottomSection === 'issues'
                  ? 'border-ink text-ink font-semibold'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <span>Site issues</span>
              {openIssuesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-soft text-amber">
                  {openIssuesCount} open
                </span>
              )}
            </button>
          </div>

          {activeBottomSection === 'issues' && (
            <div className="flex items-center gap-1 bg-sand/40 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIssueFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  issueFilter === 'all' ? 'bg-paper text-ink shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                All ({issues.length})
              </button>
              <button
                type="button"
                onClick={() => setIssueFilter('open')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  issueFilter === 'open' ? 'bg-paper text-amber shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                Open ({openIssuesCount})
              </button>
              <button
                type="button"
                onClick={() => setIssueFilter('resolved')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  issueFilter === 'resolved' ? 'bg-paper text-olive shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                Resolved ({issues.filter(i => i.status === 'resolved').length})
              </button>
            </div>
          )}
        </div>

        {/* Updates Timeline Section */}
        {activeBottomSection === 'updates' && (
          <div className="space-y-4">
            {updates.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted bg-ivory/50 rounded-xl border border-line">
                No updates logged for this project yet.
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map(update => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl border border-line bg-paper hover:border-sand-dark transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sand text-ink text-xs font-medium flex items-center justify-center border border-line shrink-0">
                          {update.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs text-ink">{update.authorName}</span>
                            <span className="text-[11px] text-muted">·</span>
                            <span className="text-xs font-medium text-ink-2">{update.roomName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand text-ink-2">
                              {formatTradeName(update.trade)}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted">
                            {formatRelativeTime(update.date)} · {new Date(update.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-olive-soft text-olive self-start sm:self-auto">
                        <Check className="w-3 h-3" />
                        <span>{update.percentage}% complete</span>
                      </span>
                    </div>

                    {update.note && (
                      <p className="text-xs text-ink-2 leading-relaxed bg-ivory/60 p-3 rounded-lg border border-line/60">
                        {update.note}
                      </p>
                    )}

                    {/* Photos */}
                    {update.photos && update.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {update.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedPhoto(photo)}
                            className="w-20 h-20 rounded-xl overflow-hidden border border-line bg-sand/30 cursor-pointer relative group"
                          >
                            <img 
                              src={photo} 
                              alt="Work log" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-paper">
                              <Camera className="w-4 h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Issues List Section */}
        {activeBottomSection === 'issues' && (
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted bg-ivory/50 rounded-xl border border-line">
                No issues matching this filter.
              </div>
            ) : (
              filteredIssues.map(issue => {
                const isOpen = issue.status === 'open';

                return (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ${
                      isOpen 
                        ? 'bg-amber-soft/30 border-amber/30 hover:border-amber/50' 
                        : 'bg-paper border-line hover:border-sand-dark'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isOpen ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber text-paper">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Open</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-olive-soft text-olive">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Resolved</span>
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand text-ink-2 capitalize">
                          {issue.type.replace('_', ' ')}
                        </span>

                        {issue.roomName && (
                          <span className="text-xs font-medium text-ink">
                            {issue.roomName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-ink font-medium leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-muted">
                        <span>Reported by {issue.reportedBy}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(issue.reportedAt)}</span>
                      </div>
                    </div>

                    {isOpen && (
                      <button
                        type="button"
                        onClick={() => handleResolveIssue(issue.id)}
                        className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:bg-olive-soft hover:text-olive hover:border-olive/30 transition-all shrink-0 self-start sm:self-center"
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Cell History Drawer */}
      {selectedCellInfo && (
        <CellHistoryDrawer
          isOpen={Boolean(selectedCellInfo)}
          onClose={() => setSelectedCellInfo(null)}
          cell={selectedCellInfo.cell}
          roomName={selectedCellInfo.roomName}
          trade={selectedCellInfo.trade}
          updates={updates}
          onCellUpdated={() => {
            onDataRefresh();
            // Update selected cell info with latest cell from storage
            progressService.getScopeCells(project.id).then(newCells => {
              const updatedCell = newCells.find(
                c => c.roomId === selectedCellInfo.cell.roomId && c.trade === selectedCellInfo.cell.trade
              );
              if (updatedCell) {
                setSelectedCellInfo(prev => prev ? { ...prev, cell: updatedCell } : null);
              }
            });
          }}
        />
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-60 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-paper rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-ink/70 text-paper flex items-center justify-center hover:bg-ink"
            >
              ✕
            </button>
            <img 
              src={selectedPhoto} 
              alt="Site photo" 
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
