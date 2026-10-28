import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Minus, 
  Plus, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { stockService } from '../../services/stockService';
import { Material, MaterialStockBalance, Project } from '../../types';
import { getActiveSiteProjectId, setActiveSiteProjectId } from '../../utils/siteState';

const ADJUSTMENT_REASONS = [
  'Missed entry',
  'Damaged',
  'Moved to another site',
  'Other',
];

export const StockCheckPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const isSupervisor = role === 'supervisor' || role === 'owner' || role === 'manager';

  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [balances, setBalances] = useState<MaterialStockBalance[]>([]);

  // Actual physical counts entered by supervisor: { [materialId]: number }
  const [actualCounts, setActualCounts] = useState<Record<string, number>>({});
  // Reasons selected per material difference: { [materialId]: string }
  const [reasons, setReasons] = useState<Record<string, string>>({});

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (!isSupervisor) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [allProjects, matList] = await Promise.all([
          projectsService.list(),
          stockService.listMaterials(),
        ]);

        const activeOnly = allProjects.filter((p) => p.status === 'active');
        let userProjects = activeOnly;
        if (role === 'supervisor') {
          userProjects = activeOnly.filter(
            (p) => p.supervisorId === currentUser?.id || currentUser?.assignedProjectIds?.includes(p.id)
          );
        }
        if (userProjects.length === 0) userProjects = activeOnly;

        setProjects(userProjects);
        setMaterials(matList.filter((m) => !m.isArchived));

        const savedProjectId = getActiveSiteProjectId();
        const active = userProjects.find((p) => p.id === savedProjectId) || userProjects[0];
        const projId = active ? active.id : '';
        setSelectedProjectId(projId);

        if (projId) {
          const balList = await stockService.getStockBalances(projId);
          setBalances(balList);

          // Initialize actual counts to match current inStock
          const counts: Record<string, number> = {};
          const rMap: Record<string, string> = {};
          balList.forEach((b) => {
            counts[b.materialId] = b.inStock;
            rMap[b.materialId] = 'Missed entry';
          });
          setActualCounts(counts);
          setReasons(rMap);
        }
      } catch (err) {
        console.error('Failed to load stock check data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id, role, isSupervisor]);

  // Reload balances when active project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchProjectBalances = async () => {
      const balList = await stockService.getStockBalances(selectedProjectId);
      setBalances(balList);
      const counts: Record<string, number> = {};
      const rMap: Record<string, string> = {};
      balList.forEach((b) => {
        counts[b.materialId] = b.inStock;
        rMap[b.materialId] = 'Missed entry';
      });
      setActualCounts(counts);
      setReasons(rMap);
    };
    fetchProjectBalances();
  }, [selectedProjectId]);

  // If worker tries to access, block with friendly explanation
  if (!isSupervisor) {
    return (
      <div className="space-y-4 max-w-md mx-auto pt-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-sand/50 flex items-center justify-center text-muted">
          <ShieldAlert className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-medium text-ink">Supervisor access only</h2>
          <p className="text-xs text-muted max-w-xs mx-auto">
            Stock check and discrepancy audits are managed by the site supervisor. As a trade lead, please log materials used or report problems.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="h-12 px-6 rounded-2xl bg-ink text-paper text-xs font-medium inline-flex items-center gap-2"
        >
          <span>Return to Site Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleCountChange = (materialId: string, delta: number) => {
    setActualCounts((prev) => {
      const current = prev[materialId] ?? 0;
      const nextVal = Math.max(0, current + delta);
      return { ...prev, [materialId]: nextVal };
    });
  };

  const handleReasonChange = (materialId: string, reason: string) => {
    setReasons((prev) => ({ ...prev, [materialId]: reason }));
  };

  // Find all materials with differences
  const differences = useMemo(() => {
    return balances.map((b) => {
      const actual = actualCounts[b.materialId] ?? b.inStock;
      const delta = actual - b.inStock;
      return {
        balance: b,
        actual,
        delta,
        hasDifference: delta !== 0,
      };
    });
  }, [balances, actualCounts]);

  const diffCount = useMemo(() => {
    return differences.filter((d) => d.hasDifference).length;
  }, [differences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a site.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const effectiveStudioId = activeProject?.studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      // Record adjustment for each difference
      for (const diff of differences) {
        if (diff.hasDifference) {
          const reason = reasons[diff.balance.materialId] || 'Missed entry';
          await stockService.recordAdjustment({
            studioId: effectiveStudioId,
            projectId: selectedProjectId,
            materialId: diff.balance.materialId,
            quantity: diff.delta,
            workerName: currentUser?.name || 'Supervisor',
            reason,
            note: `Stock check count: actual was ${diff.actual} vs app ${diff.balance.inStock}`,
          });
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/app');
      }, 900);
    } catch (err: any) {
      console.error('Failed to submit stock check:', err);
      setError(err?.message || 'Failed to save stock check adjustments.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto pb-32">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">Stock check</h2>
        <p className="text-xs text-muted">
          Compare app numbers with actual physical counts on site
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rust-soft/60 border border-rust/30 text-xs text-rust flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Project Selector (if multiple) */}
      {projects.length > 1 ? (
        <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-olive" />
            <span className="text-xs font-medium text-muted">Auditing site:</span>
          </div>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setActiveSiteProjectId(e.target.value);
            }}
            className="text-xs font-semibold text-ink bg-transparent focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
          <span className="text-xs text-muted">Auditing site:</span>
          <span className="text-sm font-semibold text-ink">{activeProject?.name}</span>
        </div>
      )}

      {/* Difference Overview Banner */}
      <div className="p-3.5 rounded-2xl bg-ivory border border-line flex items-center justify-between text-xs">
        <span className="text-muted">Differences to reconcile:</span>
        <span className={`font-semibold ${diffCount > 0 ? 'text-amber' : 'text-olive'}`}>
          {diffCount > 0 ? `${diffCount} material difference${diffCount === 1 ? '' : 's'}` : 'All counts match app'}
        </span>
      </div>

      {/* 2. Materials List: App says vs Actual count */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {differences.map((diff) => {
          const b = diff.balance;
          const actual = diff.actual;
          const delta = diff.delta;
          const isDifferent = diff.hasDifference;
          const selectedReason = reasons[b.materialId] || 'Missed entry';

          return (
            <div
              key={b.materialId}
              className={`p-4 rounded-2xl border transition-all ${
                isDifferent
                  ? 'bg-amber-soft/30 border-amber/40 shadow-xs'
                  : 'bg-paper border-line'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-ink truncate leading-tight">
                    {b.materialName}
                  </h3>
                  {b.shadeCode && (
                    <p className="text-xs text-muted truncate mt-0.5">{b.shadeCode}</p>
                  )}
                  <p className="text-xs text-muted mt-1.5 flex items-center gap-1.5">
                    <span>App says:</span>
                    <strong className="text-ink font-semibold">{b.inStock} {b.unit}s</strong>
                  </p>
                </div>

                {/* Actual Count Stepper (>= 48px tap targets) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCountChange(b.materialId, -1)}
                    disabled={actual <= 0}
                    className="w-12 h-12 rounded-xl bg-ivory border border-line flex items-center justify-center text-ink disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all"
                    aria-label={`Decrease count for ${b.materialName}`}
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <div className="w-14 text-center">
                    <span className="text-base font-bold text-ink tabular-nums block leading-none">
                      {actual}
                    </span>
                    <span className="text-[10px] text-muted block mt-0.5 capitalize">{b.unit}s</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCountChange(b.materialId, 1)}
                    className="w-12 h-12 rounded-xl bg-ivory border border-line flex items-center justify-center text-ink active:scale-95 transition-all"
                    aria-label={`Increase count for ${b.materialName}`}
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Highlighted Difference & Reason Chips */}
              {isDifferent && (
                <div className="mt-3 pt-3 border-t border-amber/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Discrepancy:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                      delta > 0
                        ? 'bg-olive-soft text-olive border border-olive/30'
                        : 'bg-rust-soft text-rust border border-rust/40'
                    }`}>
                      {delta > 0 ? `+${delta}` : delta} {b.unit}s
                    </span>
                  </div>

                  {/* Reason Chips (>= 48px tap target) */}
                  <div>
                    <label className="text-[11px] uppercase font-semibold tracking-wider text-muted block mb-1.5">
                      Reason for difference
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ADJUSTMENT_REASONS.map((r) => {
                        const isChosen = selectedReason === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleReasonChange(b.materialId, r)}
                            className={`min-h-[48px] h-12 px-2.5 rounded-xl text-xs font-medium transition-all border flex items-center justify-center text-center ${
                              isChosen
                                ? 'bg-ink text-paper border-ink shadow-xs'
                                : 'bg-paper text-ink border-line hover:bg-sand/30'
                            }`}
                          >
                            <span>{r}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Sticky Submit Button (56px) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-paper/95 backdrop-blur-md border-t border-line max-w-md mx-auto">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-semibold hover:bg-ink-2 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-float disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-olive" />
                <span>Stock check saved!</span>
              </>
            ) : (
              <span>
                {diffCount > 0
                  ? `Save stock check (${diffCount} adjustment${diffCount === 1 ? '' : 's'})`
                  : 'Save stock check (All match)'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
