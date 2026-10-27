import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackagePlus, 
  Hammer, 
  Camera, 
  ClipboardList, 
  AlertTriangle, 
  MapPin, 
  Check, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { settingsService } from '../../services/settingsService';
import { billsService } from '../../services/billsService';
import { stockService } from '../../services/stockService';
import { getItem, STORAGE_KEYS } from '../../services/storage';
import { Project, Bill, StockMovement, ProgressUpdate, Issue, Studio } from '../../types';
import { getActiveSiteProjectId, setActiveSiteProjectId } from '../../utils/siteState';
import { SupervisorCorrectDeliveryModal } from '../../components/site/SupervisorCorrectDeliveryModal';

interface TodayActivity {
  id: string;
  type: 'used' | 'received' | 'progress' | 'issue';
  title: string;
  time: string;
  room?: string;
}

export const SiteHomePage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [flaggedDeliveries, setFlaggedDeliveries] = useState<Bill[]>([]);
  const [todayActivities, setTodayActivities] = useState<TodayActivity[]>([]);
  const [showSitePickerModal, setShowSitePickerModal] = useState(false);

  // Correct Delivery Modal state
  const [correctingBill, setCorrectingBill] = useState<Bill | null>(null);
  const [confirmToast, setConfirmToast] = useState<string | null>(null);

  const isSupervisor = role === 'supervisor' || role === 'owner' || role === 'manager';

  const loadSiteData = async () => {
    try {
      const [studioData, allProjects, allBills, allMovements, allUpdates, allIssues] = await Promise.all([
        settingsService.getStudio(),
        projectsService.list(),
        billsService.list(),
        stockService.getMovements(),
        getItem<ProgressUpdate[]>(STORAGE_KEYS.PROGRESS_UPDATES, []),
        getItem<Issue[]>(STORAGE_KEYS.ISSUES, []),
      ]);

      setStudio(studioData);

      // Determine which projects this user has access to
      const activeOnly = allProjects.filter((p) => p.status === 'active');
      let userProjects: Project[] = [];

      if (role === 'owner' || role === 'manager') {
        userProjects = activeOnly;
      } else if (role === 'supervisor') {
        userProjects = activeOnly.filter(
          (p) => p.supervisorId === currentUser?.id || currentUser?.assignedProjectIds?.includes(p.id)
        );
        if (userProjects.length === 0) userProjects = activeOnly;
      } else {
        // Worker / Trade lead
        userProjects = activeOnly.filter((p) => currentUser?.assignedProjectIds?.includes(p.id));
        if (userProjects.length === 0 && activeOnly.length > 0) {
          userProjects = [activeOnly[0]];
        }
      }

      setAssignedProjects(userProjects);

      // Choose active project
      const savedProjectId = getActiveSiteProjectId();
      let currentActive: Project | null = null;
      if (savedProjectId) {
        currentActive = userProjects.find((p) => p.id === savedProjectId) || null;
      }
      if (!currentActive && userProjects.length > 0) {
        currentActive = userProjects[0];
        setActiveSiteProjectId(currentActive.id);
      }
      setActiveProject(currentActive);

      // Flagged deliveries for supervisors (needsTradeLeadCheck === true)
      if (isSupervisor) {
        const flagged = allBills.filter((b) => b.needsTradeLeadCheck);
        setFlaggedDeliveries(flagged);
      } else {
        setFlaggedDeliveries([]);
      }

      // Today's activities for this current user
      const todayStr = new Date().toISOString().split('T')[0];
      const activities: TodayActivity[] = [];

      // 1. Material used logged today by this person
      allMovements
        .filter((m) => m.type === 'used' && m.date.startsWith(todayStr))
        .filter((m) => m.workerId === currentUser?.id || m.workerName === currentUser?.name)
        .forEach((m) => {
          const time = new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          activities.push({
            id: m.id,
            type: 'used',
            title: `Logged ${m.quantity} used${m.roomName ? ` in ${m.roomName}` : ''}`,
            time,
            room: m.roomName,
          });
        });

      // 2. Deliveries recorded today by this person
      allBills
        .filter((b) => b.date === todayStr || (b.createdAt && b.createdAt.startsWith(todayStr)))
        .filter((b) => b.uploadedById === currentUser?.id || b.uploadedBy === currentUser?.name)
        .forEach((b) => {
          const itemCount = b.items?.length || 0;
          const time = b.createdAt
            ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Today';
          activities.push({
            id: b.id,
            type: 'received',
            title: `Recorded delivery from ${b.vendorName} (${itemCount} item${itemCount === 1 ? '' : 's'})`,
            time,
          });
        });

      // 3. Progress updates logged today by this person
      allUpdates
        .filter((u) => u.date.startsWith(todayStr))
        .filter((u) => u.authorId === currentUser?.id || u.authorName === currentUser?.name)
        .forEach((u) => {
          const time = new Date(u.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          activities.push({
            id: u.id,
            type: 'progress',
            title: `Updated ${u.roomName} ${u.trade} (${u.percentage}%)`,
            time,
            room: u.roomName,
          });
        });

      // 4. Issues reported today by this person
      allIssues
        .filter((iss) => iss.reportedAt.startsWith(todayStr))
        .filter((iss) => iss.reportedBy === currentUser?.name || iss.reportedBy === currentUser?.id)
        .forEach((iss) => {
          const time = new Date(iss.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          activities.push({
            id: iss.id,
            type: 'issue',
            title: `Reported problem: ${iss.description.slice(0, 32)}...`,
            time,
          });
        });

      setTodayActivities(activities);
    } catch (err) {
      console.error('Failed to load site home data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSiteData();

    const handleStorageChange = () => {
      loadSiteData();
    };

    window.addEventListener('studioos_storage_change', handleStorageChange);
    window.addEventListener('studioos_storage_reset', handleStorageChange);
    return () => {
      window.removeEventListener('studioos_storage_change', handleStorageChange);
      window.removeEventListener('studioos_storage_reset', handleStorageChange);
    };
  }, [currentUser?.id, role]);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setActiveSiteProjectId(project.id);
    setShowSitePickerModal(false);
  };

  const handleConfirmTradeLeadDelivery = async (billId: string) => {
    try {
      await billsService.confirmTradeLeadDelivery(billId, currentUser?.name || 'Supervisor');
      setConfirmToast('Delivery quantities confirmed');
      setTimeout(() => setConfirmToast(null), 3500);
      await loadSiteData();
    } catch (err) {
      console.error('Failed to confirm delivery:', err);
    }
  };

  // Check if project is newly assigned (created within 3 days or marked new)
  const isProjectNew = (proj: Project) => {
    const startMs = new Date(proj.startDate).getTime();
    const nowMs = Date.now();
    return Math.abs(nowMs - startMs) < 4 * 86400000;
  };

  const tradeLeadsCanRecordDeliveries = studio?.tradeLeadsCanRecordDeliveries ?? true;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Toast Notification */}
      {confirmToast && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto p-3.5 rounded-2xl bg-ink text-paper text-xs font-medium shadow-float flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-olive shrink-0" />
          <span>{confirmToast}</span>
        </div>
      )}

      {/* 1. Active Site Selector Card */}
      <section aria-label="Active Site" className="space-y-2">
        <div className="p-4 rounded-2xl bg-paper border border-line shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-muted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-olive" />
              <span>Active Site</span>
            </span>

            {/* If assigned to multiple sites, allow switching */}
            {assignedProjects.length > 1 && (
              <button
                type="button"
                onClick={() => setShowSitePickerModal(true)}
                className="h-9 px-3 rounded-xl border border-line bg-ivory text-ink text-xs font-medium hover:bg-sand/30 active:scale-95 transition-all inline-flex items-center gap-1.5"
                aria-label="Switch site"
              >
                <span>Switch site</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted" />
              </button>
            )}
          </div>

          <div className="mt-2.5">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-medium text-ink leading-tight">
                {activeProject?.name || 'No project assigned'}
              </h2>
              {activeProject && isProjectNew(activeProject) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-olive-soft text-olive border border-olive/30 shrink-0">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>New project added</span>
                </span>
              )}
            </div>

            <p className="text-xs text-muted mt-1 leading-snug">
              {activeProject?.address || 'Pune'}
            </p>
          </div>

          <div className="mt-3.5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
            <span className="text-muted">Today's focus</span>
            <span className="text-ink font-medium">
              {activeProject?.currentFocus || 'On-site execution'}
            </span>
          </div>
        </div>

        {/* Assigned Site Chips if multiple */}
        {assignedProjects.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {assignedProjects.map((p) => {
              const isSelected = activeProject?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProject(p)}
                  className={`h-10 px-3.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-ink text-paper border-ink shadow-xs'
                      : 'bg-paper text-ink border-line hover:bg-sand/30'
                  }`}
                >
                  <span>{p.name.replace(' Residence', '').replace(' Villa', '').replace(' Office', '')}</span>
                  {isProjectNew(p) && !isSelected && (
                    <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-olive inline-block" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Flagged Deliveries for Supervisor ("Needs check") */}
      {isSupervisor && flaggedDeliveries.length > 0 && (
        <section aria-label="Deliveries needing check" className="space-y-2">
          {flaggedDeliveries.map((bill) => (
            <div 
              key={bill.id} 
              className="p-4 rounded-2xl bg-amber-soft/50 border border-amber/40 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber/20 flex items-center justify-center text-amber shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-ink">
                      Delivery needs your check
                    </h3>
                    <p className="text-[11px] text-muted mt-0.5">
                      Recorded by <strong className="text-ink">{bill.uploadedBy}</strong>
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber/20 text-amber border border-amber/30">
                  Needs check
                </span>
              </div>

              {/* Delivery items details */}
              <div className="p-3 rounded-xl bg-paper/90 border border-line/70 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-muted text-[11px]">
                  <span>{bill.vendorName}</span>
                  <span>{bill.date}</span>
                </div>
                <div className="text-ink font-medium">
                  {bill.items?.map((it, idx) => (
                    <span key={it.id}>
                      {idx > 0 && ', '}
                      {it.quantity} {it.unit} {it.materialName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Confirm / Correct (tap targets >= 48px) */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleConfirmTradeLeadDelivery(bill.id)}
                  className="flex-1 h-12 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4 text-paper" />
                  <span>Confirm quantities</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectingBill(bill)}
                  className="h-12 px-4 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 active:scale-95 transition-all"
                >
                  Correct
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 3. Role-Based Action Tiles */}
      <section aria-label="Site Actions" className="space-y-2">
        <span className="text-[11px] uppercase tracking-wider text-muted font-semibold block px-1">
          Actions
        </span>

        {isSupervisor ? (
          /* SUPERVISOR TILES: Material received · Material used · Progress update · Stock check · Problems */
          <div className="grid grid-cols-1 gap-2.5">
            {/* Material Received */}
            <button
              type="button"
              onClick={() => navigate('/app/received')}
              className="w-full min-h-[58px] p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-olive-soft flex items-center justify-center text-olive shrink-0">
                  <PackagePlus className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-ink block leading-tight">
                    Material received
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Bill or challan photo
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Material Used */}
            <button
              type="button"
              onClick={() => navigate('/app/used')}
              className="w-full min-h-[58px] p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-sand/60 flex items-center justify-center text-ink shrink-0">
                  <Hammer className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-ink block leading-tight">
                    Material used
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Log items used today
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Progress Update */}
            <button
              type="button"
              onClick={() => navigate('/app/progress')}
              className="w-full min-h-[58px] p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-sand/60 flex items-center justify-center text-ink shrink-0">
                  <Camera className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-ink block leading-tight">
                    Progress update
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Photos &amp; status
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Stock Check */}
            <button
              type="button"
              onClick={() => navigate('/app/stock-check')}
              className="w-full min-h-[58px] p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-sand/60 flex items-center justify-center text-ink shrink-0">
                  <ClipboardList className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-ink block leading-tight">
                    Stock check
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Count site stock
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Report a Problem */}
            <button
              type="button"
              onClick={() => navigate('/app/problem')}
              className="w-full min-h-[58px] p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-rust-soft/30 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-rust-soft flex items-center justify-center text-rust shrink-0">
                  <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-ink block leading-tight">
                    Report a problem
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Flag an issue or delay
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          /* WORKER (TRADE LEAD) TILES: Material used · Work done · Material received (secondary, if permission on) · Report a problem */
          <div className="space-y-2.5">
            {/* 1. Material Used (Prominent Primary Tile) */}
            <button
              type="button"
              onClick={() => navigate('/app/used')}
              className="w-full min-h-[64px] p-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-olive-soft flex items-center justify-center text-olive shrink-0">
                  <Hammer className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-base font-semibold text-ink block leading-tight">
                    Material used
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Log items used today
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* 2. Work Done (Prominent Primary Tile) */}
            <button
              type="button"
              onClick={() => navigate('/app/progress')}
              className="w-full min-h-[64px] p-4 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-sand/60 flex items-center justify-center text-ink shrink-0">
                  <Camera className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-base font-semibold text-ink block leading-tight">
                    Work done
                  </span>
                  <span className="text-xs text-muted leading-tight mt-0.5 block">
                    Photos &amp; updates
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* 3. Material Received (Secondary smaller tile ONLY if permission enabled) */}
            {tradeLeadsCanRecordDeliveries && (
              <button
                type="button"
                onClick={() => navigate('/app/received')}
                className="w-full min-h-[50px] p-3 rounded-2xl bg-paper/60 border border-line/80 flex items-center justify-between hover:bg-sand/20 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sand/40 flex items-center justify-center text-muted group-hover:text-ink shrink-0">
                    <PackagePlus className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-medium text-ink block leading-tight">
                      Material received
                    </span>
                    <span className="text-[11px] text-muted leading-tight block">
                      Record delivery if supervisor is not on site
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </button>
            )}

            {/* 4. Report a Problem */}
            <button
              type="button"
              onClick={() => navigate('/app/problem')}
              className="w-full min-h-[52px] p-3 rounded-2xl bg-paper border border-line flex items-center justify-between hover:bg-rust-soft/30 active:scale-[0.99] transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rust-soft/60 flex items-center justify-center text-rust shrink-0">
                  <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold text-ink block leading-tight">
                    Report a problem
                  </span>
                  <span className="text-[11px] text-muted leading-tight block">
                    Flag an issue or blocker
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted" />
            </button>
          </div>
        )}
      </section>

      {/* 4. "Today" List of Logged Activity */}
      <section aria-label="Today's logs" className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
            Today's logs
          </span>
          <span className="text-[11px] font-medium text-muted">
            {todayActivities.length} {todayActivities.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="rounded-2xl bg-paper border border-line p-3.5 divide-y divide-line/60">
          {todayActivities.length > 0 ? (
            todayActivities.map((act) => (
              <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-sand/40 flex items-center justify-center text-ink shrink-0 mt-0.5">
                    {act.type === 'used' && <Hammer className="w-3.5 h-3.5" />}
                    {act.type === 'received' && <PackagePlus className="w-3.5 h-3.5" />}
                    {act.type === 'progress' && <Camera className="w-3.5 h-3.5" />}
                    {act.type === 'issue' && <AlertTriangle className="w-3.5 h-3.5 text-rust" />}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-ink leading-tight">{act.title}</p>
                    {act.room && (
                      <p className="text-[10px] text-muted mt-0.5">{act.room}</p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted shrink-0 tabular-nums">
                  {act.time}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center space-y-1">
              <p className="text-xs font-medium text-ink">Nothing logged yet today</p>
              <p className="text-[11px] text-muted">
                Use the actions above to record what happened on site.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Switch Site Modal (if assigned to multiple projects) */}
      {showSitePickerModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            onClick={() => setShowSitePickerModal(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
          />

          <div className="relative w-full max-w-sm bg-paper rounded-t-[28px] sm:rounded-3xl border border-line shadow-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Switch site</h3>
                <p className="text-xs text-muted mt-0.5">Select active project for this device</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSitePickerModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-muted hover:text-ink active:bg-sand/30"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {assignedProjects.map((p) => {
                const isSelected = activeProject?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProject(p)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-olive-soft/40 border-olive/50'
                        : 'bg-ivory border-line hover:bg-sand/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-ink">{p.name}</span>
                        {isProjectNew(p) && (
                          <span className="text-[10px] font-semibold text-olive bg-olive-soft px-1.5 py-0.2 rounded-full border border-olive/30">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5 truncate max-w-[220px]">
                        {p.address}
                      </p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-olive shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Correct Delivery Modal */}
      {correctingBill && (
        <SupervisorCorrectDeliveryModal
          isOpen={!!correctingBill}
          bill={correctingBill}
          onClose={() => setCorrectingBill(null)}
          onSuccess={() => {
            setConfirmToast('Delivery corrected and reconciled with stock');
            setTimeout(() => setConfirmToast(null), 3500);
            loadSiteData();
          }}
        />
      )}
    </div>
  );
};
