import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Check, 
  Calendar, 
  Building2, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  UserCheck,
  Eye,
  Lock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { settingsService } from '../../services/settingsService';
import { progressService } from '../../services/progressService';
import { stockService } from '../../services/stockService';
import { billsService } from '../../services/billsService';
import { 
  Bill, 
  Issue, 
  Material, 
  MaterialStockBalance, 
  ProgressUpdate, 
  Project, 
  ScopeGridCell, 
  StockMovement, 
  Studio, 
  TradeType 
} from '../../types';
import { 
  computeProjectProgress, 
  computeProjectSpend, 
  formatCurrencyINR 
} from '../../utils/calculations';

type SummaryMode = 'customer' | 'internal';
type DateRangeOption = 'this_week' | 'last_2_weeks' | 'this_month' | 'custom';

interface SummaryPhoto {
  id: string;
  url: string;
  roomName: string;
  trade: string;
  percentage: number;
  note?: string;
  date: string;
}

export const ProjectSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [cells, setCells] = useState<ScopeGridCell[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [balances, setBalances] = useState<MaterialStockBalance[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  // Permissions: owner or manager with managerCanSeeAmounts
  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // Mode: Default to customer if manager cannot see amounts; otherwise internal
  const [mode, setMode] = useState<SummaryMode>('internal');

  useEffect(() => {
    if (!canSeeAmounts) {
      setMode('customer');
    }
  }, [canSeeAmounts]);

  // Date Range Selection
  const [rangeOption, setRangeOption] = useState<DateRangeOption>('this_week');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Next week's plan editable text
  const [planText, setPlanText] = useState<string>('');
  const [hasEditedPlan, setHasEditedPlan] = useState(false);

  // Selected photo IDs
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());

  // Load baseline project data
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [
          proj,
          studioData,
          scopeCells,
          allUpdates,
          allIssues,
          allMovements,
          stockBal,
          allBills
        ] = await Promise.all([
          projectsService.get(id),
          settingsService.getStudio(),
          progressService.getScopeCells(id),
          progressService.listUpdates(id),
          progressService.listIssues(id),
          stockService.getMovements(id),
          stockService.getStockBalances(id),
          billsService.list(id),
        ]);

        setProject(proj);
        setStudio(studioData);
        setCells(scopeCells);
        setUpdates(allUpdates);
        setIssues(allIssues);
        setMovements(allMovements);
        setBalances(stockBal);
        setBills(allBills);

        // Prefill plan from in-progress cells if not already edited
        if (!hasEditedPlan) {
          const inProgressCells = scopeCells.filter(
            (c) => (c.status === 'in_progress' || (c.percentage > 0 && c.percentage < 100))
          );
          if (inProgressCells.length > 0) {
            const planLines = inProgressCells.map((c, i) => {
              const room = proj?.rooms.find((r) => r.id === c.roomId)?.name || 'Area';
              const tradeName = c.trade.replace('_', ' ');
              return `${i + 1}. Continue ${tradeName} in ${room} (currently ${c.percentage}% done).`;
            });
            planLines.push(`${planLines.length + 1}. Review delivered materials and schedule next milestone check.`);
            setPlanText(planLines.join('\n'));
          } else {
            setPlanText('1. Advance scheduled trade activities across assigned rooms as per milestone timeline.\n2. Complete site stock check and verify upcoming trade supplies.\n3. Conduct weekly progress review with site team.');
          }
        }
      } catch (err) {
        console.error('Failed to load summary sheet data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, hasEditedPlan]);

  // Compute active date range dates
  const { startDate, endDate, rangeLabel } = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    if (rangeOption === 'this_week') {
      start.setDate(end.getDate() - 7);
    } else if (rangeOption === 'last_2_weeks') {
      start.setDate(end.getDate() - 14);
    } else if (rangeOption === 'this_month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (rangeOption === 'custom') {
      start = new Date(customStartDate);
      const parsedEnd = new Date(customEndDate);
      parsedEnd.setHours(23, 59, 59, 999);
      return {
        startDate: start,
        endDate: parsedEnd,
        rangeLabel: `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${parsedEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      };
    }

    const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return {
      startDate: start,
      endDate: end,
      rangeLabel: `${fmt(start)} – ${fmt(end)}`,
    };
  }, [rangeOption, customStartDate, customEndDate]);

  // Overall Project Progress
  const overallProgress = useMemo(() => {
    return computeProjectProgress(cells);
  }, [cells]);

  // Trades in scope
  const trades: TradeType[] = useMemo(() => {
    if (project && project.tradesInScope && project.tradesInScope.length > 0) {
      return project.tradesInScope;
    }
    return ['carpentry', 'electrical', 'civil', 'painting', 'plumbing', 'false_ceiling'];
  }, [project]);

  // Flatten and filter photos from updates in this period
  const periodPhotos: SummaryPhoto[] = useMemo(() => {
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    const periodUpdates = updates.filter((u) => {
      const uMs = new Date(u.date).getTime();
      return uMs >= startMs && uMs <= endMs;
    });

    const photoList: SummaryPhoto[] = [];
    periodUpdates.forEach((u) => {
      if (u.photos && u.photos.length > 0) {
        u.photos.forEach((url, pIdx) => {
          photoList.push({
            id: `${u.id}-${pIdx}`,
            url,
            roomName: u.roomName,
            trade: u.trade.replace('_', ' '),
            percentage: u.percentage,
            note: u.note,
            date: new Date(u.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          });
        });
      }
    });

    // Fallback if no photos recorded in period: pull recent project photos
    if (photoList.length === 0 && updates.length > 0) {
      updates.slice(0, 3).forEach((u) => {
        if (u.photos && u.photos.length > 0) {
          u.photos.forEach((url, pIdx) => {
            photoList.push({
              id: `fallback-${u.id}-${pIdx}`,
              url,
              roomName: u.roomName,
              trade: u.trade.replace('_', ' '),
              percentage: u.percentage,
              note: u.note,
              date: new Date(u.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            });
          });
        }
      });
    }

    return photoList;
  }, [updates, startDate, endDate]);

  // Initialize selected photos (up to 6)
  useEffect(() => {
    if (periodPhotos.length > 0 && selectedPhotoIds.size === 0) {
      const initialIds = new Set(periodPhotos.slice(0, 6).map((p) => p.id));
      setSelectedPhotoIds(initialIds);
    }
  }, [periodPhotos]);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  // Filter Issues
  const displayedIssues = useMemo(() => {
    const openIssues = issues.filter((i) => i.status === 'open');
    if (mode === 'customer') {
      return openIssues.filter(
        (i) => i.type === 'design_question' || i.needsCustomerAction === true
      );
    }
    return openIssues;
  }, [issues, mode]);

  // Internal: Materials used in this period
  const periodMovements = useMemo(() => {
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    return movements.filter((m) => {
      if (m.type !== 'used') return false;
      const mMs = new Date(m.date).getTime();
      return mMs >= startMs && mMs <= endMs;
    });
  }, [movements, startDate, endDate]);

  // Internal: Running low / Attention stock
  const attentionStock = useMemo(() => {
    return balances.filter(
      (b) => b.status === 'running_low' || b.status === 'out_of_stock'
    );
  }, [balances]);

  // Internal: Bills in this period & Spend vs Budget
  const periodBills = useMemo(() => {
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    return bills.filter((b) => {
      const bMs = new Date(b.date).getTime();
      return bMs >= startMs && bMs <= endMs;
    });
  }, [bills, startDate, endDate]);

  const periodSpend = useMemo(() => {
    return periodBills.reduce((sum, b) => {
      const billTotal = b.items?.reduce((iSum, it) => iSum + (it.amount || 0), 0) || 0;
      return sum + billTotal;
    }, 0);
  }, [periodBills]);

  const totalSpentSoFar = useMemo(() => {
    return computeProjectSpend(bills, id);
  }, [bills, id]);

  const budgetRatio = useMemo(() => {
    if (!project?.budget || project.budget <= 0) return 0;
    return Math.min(100, Math.round((totalSpentSoFar / project.budget) * 100));
  }, [project, totalSpentSoFar]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !project) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-2 border-line border-t-ink rounded-full animate-spin" />
        <p className="text-xs text-muted">Generating summary sheet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. TOP CONTROLS BAR (PRINT:HIDDEN) */}
      <div className="print:hidden p-4 rounded-2xl bg-paper border border-line shadow-card space-y-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {project.name}</span>
          </button>

          {/* Download PDF button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="h-11 px-5 rounded-xl bg-ink text-paper text-xs font-semibold hover:bg-ink-2 active:scale-95 transition-all inline-flex items-center gap-2 shadow-soft"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Filters & Mode Switcher */}
        <div className="pt-3 border-t border-line/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Toggle: Internal / For Customer */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Version:</span>
            <div className="inline-flex p-1 rounded-xl bg-ivory border border-line">
              <button
                type="button"
                onClick={() => setMode('customer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'customer'
                    ? 'bg-paper text-ink shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                For customer
              </button>
              <button
                type="button"
                onClick={() => {
                  if (canSeeAmounts) setMode('internal');
                }}
                disabled={!canSeeAmounts}
                title={!canSeeAmounts ? 'Manager requires amounts permission in Settings' : 'Full internal summary with bills & spend'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                  mode === 'internal'
                    ? 'bg-paper text-ink shadow-xs'
                    : !canSeeAmounts
                    ? 'text-muted/40 cursor-not-allowed'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <span>Internal</span>
                {!canSeeAmounts && <Lock className="w-3 h-3 text-muted/50" />}
              </button>
            </div>
            {!canSeeAmounts && (
              <span className="text-[11px] text-muted italic">
                (Amounts permission required for Internal)
              </span>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted">Period:</span>
            <div className="inline-flex p-1 rounded-xl bg-ivory border border-line text-xs font-medium">
              <button
                type="button"
                onClick={() => setRangeOption('this_week')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rangeOption === 'this_week' ? 'bg-paper text-ink font-semibold shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                This week
              </button>
              <button
                type="button"
                onClick={() => setRangeOption('last_2_weeks')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rangeOption === 'last_2_weeks' ? 'bg-paper text-ink font-semibold shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                Last 2 weeks
              </button>
              <button
                type="button"
                onClick={() => setRangeOption('this_month')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rangeOption === 'this_month' ? 'bg-paper text-ink font-semibold shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                This month
              </button>
              <button
                type="button"
                onClick={() => setRangeOption('custom')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  rangeOption === 'custom' ? 'bg-paper text-ink font-semibold shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                Custom
              </button>
            </div>

            {rangeOption === 'custom' && (
              <div className="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-line bg-paper text-xs"
                />
                <span className="text-muted">–</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-line bg-paper text-xs"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. PRINT-READY A4 SUMMARY SHEET */}
      <div 
        id="printable-summary-sheet"
        className="max-w-4xl mx-auto bg-paper p-8 sm:p-12 rounded-card border border-line shadow-card print:p-0 print:border-none print:shadow-none print:max-w-none text-ink space-y-8"
      >
        {/* HEADER: Studio Profile + Project Metadata */}
        <header className="border-b border-ink/20 pb-6 space-y-6">
          <div className="flex items-start justify-between gap-6">
            {/* Studio Identity */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <img
                  src={studio?.logoUrl || '/logo.png'}
                  alt={studio?.name || 'Bestinterio'}
                  className="w-12 h-12 object-contain aspect-square"
                />
                <div>
                  <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink leading-tight">
                    {studio?.name || 'Bestinterio'}
                  </h1>
                  <p className="text-[11px] uppercase tracking-wider text-muted font-medium">
                    Interior Architecture &amp; Execution · Pune
                  </p>
                </div>
              </div>
              <div className="pt-1.5 text-xs text-muted leading-relaxed">
                <p>{studio?.address || 'Signature One, Senapati Bapat Road, Pune'}</p>
                <p>Phone: {studio?.phone || '+91 98220 54321'}</p>
              </div>
            </div>

            {/* Document Type Badge & Period */}
            <div className="text-right space-y-1.5">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                mode === 'customer'
                  ? 'bg-olive-soft text-olive border-olive/30'
                  : 'bg-sand/60 text-ink border-line'
              }`}>
                {mode === 'customer' ? 'Customer Site Progress Summary' : 'Internal Operational Summary'}
              </span>
              <p className="text-xs text-muted">
                Reporting period: <strong className="text-ink font-semibold">{rangeLabel}</strong>
              </p>
              <p className="text-[11px] text-muted">
                Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Project Details Strip */}
          <div className="p-4 rounded-xl bg-ivory border border-line grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted block tracking-wider">Project</span>
              <span className="font-semibold text-ink text-sm block mt-0.5">{project.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted block tracking-wider">Client</span>
              <span className="font-semibold text-ink text-sm block mt-0.5">{project.customerName || 'Private Client'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted block tracking-wider">Site Location</span>
              <span className="font-medium text-ink block mt-0.5 truncate">{project.address}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted block tracking-wider">Overall Completion</span>
              <span className="font-bold text-olive text-sm block mt-0.5 tabular-nums">{overallProgress}%</span>
            </div>
          </div>
        </header>

        {/* SECTION 1: ROOM × TRADE PROGRESS GRID (COMPACT, PRINT-FRIENDLY) */}
        <section className="space-y-3 break-inside-avoid">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-ink">
              1. Scope &amp; Progress Matrix
            </h2>
            <span className="text-xs text-muted">
              {overallProgress}% Overall Progress
            </span>
          </div>

          <div className="overflow-x-auto border border-line rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory border-b border-line">
                  <th className="p-2.5 font-semibold text-ink uppercase tracking-wider text-[11px]">Room / Area</th>
                  {trades.map((t) => (
                    <th key={t} className="p-2.5 font-semibold text-ink uppercase tracking-wider text-[11px] text-center capitalize">
                      {t.replace('_', ' ')}
                    </th>
                  ))}
                  <th className="p-2.5 font-semibold text-ink uppercase tracking-wider text-[11px] text-right">Room %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {project.rooms.map((room) => {
                  const roomCells = cells.filter((c) => c.roomId === room.id);
                  const roomProgress = roomCells.length > 0
                    ? Math.round(roomCells.reduce((sum, c) => sum + (c.percentage || 0), 0) / roomCells.length)
                    : 0;

                  return (
                    <tr key={room.id} className="hover:bg-sand/15">
                      <td className="p-2.5 font-medium text-ink whitespace-nowrap">{room.name}</td>
                      {trades.map((t) => {
                        const cell = cells.find((c) => c.roomId === room.id && c.trade === t);
                        if (!cell) {
                          return (
                            <td key={t} className="p-2.5 text-center text-muted/40 font-mono">
                              —
                            </td>
                          );
                        }

                        const pct = cell.percentage ?? 0;
                        return (
                          <td key={t} className="p-2.5 text-center font-mono">
                            {pct === 100 ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-olive">
                                <Check className="w-3 h-3 text-olive" strokeWidth={2.5} />
                                <span>100%</span>
                              </span>
                            ) : pct > 0 ? (
                              <span className="font-semibold text-ink">{pct}%</span>
                            ) : (
                              <span className="text-muted/60">0%</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2.5 text-right font-semibold text-ink tabular-nums">
                        {roomProgress}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: WORK DONE IN THIS PERIOD (PHOTOS WITH CAPTIONS) */}
        <section className="space-y-3 break-inside-avoid">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">
                2. Work Completed in this Period
              </h2>
              <p className="text-xs text-muted">
                Visual progress from the site team during {rangeLabel}
              </p>
            </div>
            <span className="text-xs text-muted print:hidden">
              {selectedPhotoIds.size} of {periodPhotos.length} photos selected
            </span>
          </div>

          {/* Photo Selection Grid */}
          {periodPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {periodPhotos.map((photo) => {
                const isSelected = selectedPhotoIds.has(photo.id);
                // When printing, only render selected photos!
                if (!isSelected) {
                  return (
                    <div key={photo.id} className="print:hidden p-3 rounded-xl border border-line bg-paper/60 opacity-50 flex items-center justify-between">
                      <span className="text-xs text-muted truncate">{photo.roomName} · {photo.trade}</span>
                      <button
                        type="button"
                        onClick={() => togglePhotoSelection(photo.id)}
                        className="text-xs font-semibold text-olive hover:underline"
                      >
                        + Include
                      </button>
                    </div>
                  );
                }

                return (
                  <div 
                    key={photo.id}
                    className="break-inside-avoid rounded-xl border border-line overflow-hidden bg-ivory shadow-xs"
                  >
                    <div className="relative aspect-[4/3] bg-sand/30 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={`${photo.roomName} ${photo.trade}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Checkbox for screen mode */}
                      <button
                        type="button"
                        onClick={() => togglePhotoSelection(photo.id)}
                        className="print:hidden absolute top-2 right-2 w-7 h-7 rounded-lg bg-ink/75 text-paper flex items-center justify-center hover:bg-ink transition-colors"
                        title="Click to omit from print"
                      >
                        <Check className="w-4 h-4 text-paper" strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="p-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-semibold text-ink">
                        <span>{photo.roomName}</span>
                        <span className="text-olive">{photo.percentage}%</span>
                      </div>
                      <p className="text-[11px] text-muted capitalize">{photo.trade} execution</p>
                      {photo.note && (
                        <p className="text-xs text-ink-2 pt-1 border-t border-line/60 line-clamp-2 leading-snug">
                          "{photo.note}"
                        </p>
                      )}
                      <p className="text-[10px] text-muted/70 pt-0.5">{photo.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-ivory border border-line text-center text-xs text-muted">
              No photos logged during this date range.
            </div>
          )}
        </section>

        {/* SECTION 3: NEXT WEEK'S PLAN (EDITABLE TEXTBOX) */}
        <section className="space-y-2 break-inside-avoid">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-ink">
              3. Next Week's Plan
            </h2>
            <span className="text-xs text-muted print:hidden">Editable before printing</span>
          </div>

          {/* Screen editable textarea */}
          <div className="print:hidden">
            <textarea
              value={planText}
              onChange={(e) => {
                setPlanText(e.target.value);
                setHasEditedPlan(true);
              }}
              rows={4}
              placeholder="Enter planned milestones for the upcoming week..."
              className="w-full p-4 rounded-xl border border-line bg-paper text-xs leading-relaxed text-ink focus:outline-none focus:border-ink transition-colors resize-none shadow-xs"
            />
          </div>

          {/* Print rendered formatted text */}
          <div className="hidden print:block p-4 rounded-xl bg-ivory border border-line text-xs leading-relaxed whitespace-pre-wrap font-sans text-ink">
            {planText}
          </div>
        </section>

        {/* SECTION 4: OPEN SITE ISSUES / CUSTOMER ACTIONS */}
        <section className="space-y-3 break-inside-avoid">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-ink">
              {mode === 'customer' ? '4. Items Needing Customer Action' : '4. Open Site Issues & Blockers'}
            </h2>
            <span className="text-xs text-muted">
              {displayedIssues.length} item{displayedIssues.length === 1 ? '' : 's'}
            </span>
          </div>

          {displayedIssues.length > 0 ? (
            <div className="divide-y divide-line/70 border border-line rounded-xl overflow-hidden bg-ivory/50">
              {displayedIssues.map((issue) => (
                <div key={issue.id} className="p-3.5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{issue.roomName || 'General'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-soft text-amber border border-amber/30">
                        {issue.type === 'design_question' ? 'Design decision needed' : issue.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-ink-2 leading-relaxed">{issue.description}</p>
                  </div>
                  <span className="text-[11px] text-muted shrink-0 tabular-nums">
                    Reported {new Date(issue.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-ivory border border-line text-xs text-muted">
              {mode === 'customer'
                ? 'No pending customer decisions needed at this stage.'
                : 'No open issues recorded for this site.'}
            </div>
          )}
        </section>

        {/* INTERNAL ONLY SECTIONS (PAGE BREAK / SECOND PAGE) */}
        {mode === 'internal' && (
          <div className="pt-6 border-t-2 border-dashed border-ink/20 space-y-8 break-before-page">
            <div className="flex items-center justify-between pb-2 border-b border-ink/10">
              <span className="text-xs uppercase font-bold tracking-wider text-muted">
                Studio Internal Records &amp; Stock Operations
              </span>
              <span className="text-xs text-muted">Confidential · Office &amp; Management Only</span>
            </div>

            {/* INTERNAL SECTION A: MATERIALS USED IN THIS PERIOD */}
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  5. Materials Installed in Period ({rangeLabel})
                </h3>
                <span className="text-xs text-muted">{periodMovements.length} log entries</span>
              </div>

              {periodMovements.length > 0 ? (
                <div className="border border-line rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ivory border-b border-line">
                      <tr>
                        <th className="p-2.5 font-semibold text-ink">Material</th>
                        <th className="p-2.5 font-semibold text-ink text-center">Quantity</th>
                        <th className="p-2.5 font-semibold text-ink">Room / Area</th>
                        <th className="p-2.5 font-semibold text-ink">Logged By</th>
                        <th className="p-2.5 font-semibold text-ink text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/70">
                      {periodMovements.map((m) => {
                        const mat = balances.find((b) => b.materialId === m.materialId);
                        return (
                          <tr key={m.id} className="hover:bg-sand/15">
                            <td className="p-2.5 font-medium text-ink">
                              {mat ? mat.materialName : 'Material'}
                              {mat?.shadeCode ? ` (${mat.shadeCode})` : ''}
                            </td>
                            <td className="p-2.5 text-center font-semibold text-ink tabular-nums">
                              {m.quantity} {mat?.unit || 'units'}
                            </td>
                            <td className="p-2.5 text-muted">{m.roomName || 'General'}</td>
                            <td className="p-2.5 text-muted">{m.workerName}</td>
                            <td className="p-2.5 text-right text-muted tabular-nums">
                              {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-ivory border border-line text-xs text-muted">
                  No materials recorded used during this date range.
                </div>
              )}
            </section>

            {/* INTERNAL SECTION B: ITEMS RUNNING LOW / OUT OF STOCK */}
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  6. Attention Stock at {project.name}
                </h3>
                <span className="text-xs text-muted">{attentionStock.length} items</span>
              </div>

              {attentionStock.length > 0 ? (
                <div className="border border-line rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ivory border-b border-line">
                      <tr>
                        <th className="p-2.5 font-semibold text-ink">Material</th>
                        <th className="p-2.5 font-semibold text-ink text-center">In Stock</th>
                        <th className="p-2.5 font-semibold text-ink text-center">Threshold</th>
                        <th className="p-2.5 font-semibold text-ink text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/70">
                      {attentionStock.map((b) => (
                        <tr key={b.materialId} className="hover:bg-sand/15">
                          <td className="p-2.5 font-medium text-ink">
                            {b.materialName} {b.shadeCode ? `(${b.shadeCode})` : ''}
                          </td>
                          <td className="p-2.5 text-center font-bold text-ink tabular-nums">
                            {b.inStock} {b.unit}s
                          </td>
                          <td className="p-2.5 text-center text-muted tabular-nums">
                            &le; {b.lowStockThreshold} {b.unit}s
                          </td>
                          <td className="p-2.5 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              b.status === 'out_of_stock'
                                ? 'bg-rust-soft text-rust border border-rust/40'
                                : 'bg-amber-soft text-amber border border-amber/40'
                            }`}>
                              {b.status === 'out_of_stock' ? 'Out of stock' : 'Running low'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-ivory border border-line text-xs text-muted">
                  All materials at this site are sufficiently stocked above reorder thresholds.
                </div>
              )}
            </section>

            {/* INTERNAL SECTION C: PERIOD BILLS & SPEND VS BUDGET */}
            <section className="space-y-4 break-inside-avoid">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    7. Site Expenses &amp; Budget Comparison
                  </h3>
                  <p className="text-xs text-muted">Bills received in period &amp; cumulative spend</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted block">Period Spend:</span>
                  <span className="font-serif text-lg font-bold text-ink tabular-nums">
                    {formatCurrencyINR(periodSpend)}
                  </span>
                </div>
              </div>

              {/* Budget Comparison Card */}
              {project.budget && project.budget > 0 ? (
                <div className="p-4 rounded-xl bg-ivory border border-line space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Cumulative Spend vs Budget</span>
                    <span>
                      {formatCurrencyINR(totalSpentSoFar)} / {formatCurrencyINR(project.budget)} ({budgetRatio}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-sand/60 overflow-hidden">
                    <div 
                      className={`h-full transition-all rounded-full ${
                        budgetRatio > 90 ? 'bg-rust' : budgetRatio > 70 ? 'bg-amber' : 'bg-olive'
                      }`}
                      style={{ width: `${budgetRatio}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted">
                    {project.budget - totalSpentSoFar > 0
                      ? `${formatCurrencyINR(project.budget - totalSpentSoFar)} remaining in budget`
                      : 'Project has exceeded target budget'}
                  </p>
                </div>
              ) : null}

              {/* Bills Table */}
              {periodBills.length > 0 ? (
                <div className="border border-line rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ivory border-b border-line">
                      <tr>
                        <th className="p-2.5 font-semibold text-ink">Vendor</th>
                        <th className="p-2.5 font-semibold text-ink">Bill / Challan No.</th>
                        <th className="p-2.5 font-semibold text-ink">Date</th>
                        <th className="p-2.5 font-semibold text-ink">Items</th>
                        <th className="p-2.5 font-semibold text-ink text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/70">
                      {periodBills.map((b) => {
                        const billTotal = b.items?.reduce((sum, it) => sum + (it.amount || 0), 0) || 0;
                        return (
                          <tr key={b.id} className="hover:bg-sand/15">
                            <td className="p-2.5 font-medium text-ink">{b.vendorName}</td>
                            <td className="p-2.5 text-muted">{b.billNumber || b.id.slice(0, 8)}</td>
                            <td className="p-2.5 text-muted tabular-nums">{b.date}</td>
                            <td className="p-2.5 text-muted truncate max-w-[200px]">
                              {b.items?.map((it) => `${it.quantity} ${it.unit} ${it.materialName}`).join(', ')}
                            </td>
                            <td className="p-2.5 text-right font-bold text-ink tabular-nums">
                              {formatCurrencyINR(billTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-ivory border border-line text-xs text-muted">
                  No bills recorded for this project during {rangeLabel}.
                </div>
              )}
            </section>
          </div>
        )}

        {/* FOOTER SIGN-OFF STRIP */}
        <footer className="pt-6 border-t border-line flex items-center justify-between text-xs text-muted break-inside-avoid">
          <div>
            <p className="font-semibold text-ink">Bestinterio Design &amp; Build</p>
            <p className="text-[11px] text-muted">Architecture, Interior Styling &amp; Site Operations</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-ink">Project Supervisor: {project.supervisorId ? 'Rajiv Deshmukh' : 'Bestinterio Operations'}</p>
            <p className="text-[11px] text-muted">Client Site: {project.address}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
