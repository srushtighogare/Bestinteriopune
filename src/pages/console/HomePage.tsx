import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ArrowUpRight, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  FileText, 
  FolderKanban, 
  TrendingDown, 
  CheckCircle2, 
  Calendar,
  Building2,
  ChevronRight,
  Hammer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { stockService } from '../../services/stockService';
import { billsService } from '../../services/billsService';
import { progressService } from '../../services/progressService';
import { settingsService } from '../../services/settingsService';
import { teamService } from '../../services/teamService';
import { 
  Project, 
  Material, 
  StockMovement, 
  Bill, 
  ProgressUpdate, 
  ScopeGridCell, 
  Studio, 
  User 
} from '../../types';
import { 
  computeAttentionItems, 
  computeDaysSinceLastUpdate, 
  computeItemsRunningLowCount, 
  computeProjectProgress, 
  computeProjectSpend, 
  formatCurrencyINR, 
  formatRelativeTime, 
  AttentionItem 
} from '../../utils/calculations';

interface ActivityItem {
  id: string;
  date: string;
  actorName: string;
  actorAvatar?: string;
  sentence: string;
  projectName: string;
  projectId: string;
  photoUrl?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedTodayDate(): string {
  const today = new Date();
  const formatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);
  return `${formatted} · Pune`;
}

export const HomePage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [allCells, setAllCells] = useState<ScopeGridCell[]>([]);
  const [team, setTeam] = useState<User[]>([]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        studioData,
        projectsData,
        materialsData,
        movementsData,
        billsData,
        updatesData,
        teamData
      ] = await Promise.all([
        settingsService.getStudio(),
        projectsService.list(),
        stockService.listMaterials(),
        stockService.getMovements(),
        billsService.list(),
        progressService.listUpdates(),
        teamService.list(),
      ]);

      // Load all scope cells for active projects to compute progress
      const cellPromises = projectsData
        .filter(p => p.status === 'active')
        .map(p => progressService.getScopeCells(p.id));
      const cellsNested = await Promise.all(cellPromises);
      const flattenedCells = cellsNested.flat();

      setStudio(studioData);
      setProjects(projectsData);
      setMaterials(materialsData);
      setMovements(movementsData);
      setBills(billsData);
      setUpdates(updatesData);
      setAllCells(flattenedCells);
      setTeam(teamData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleStorageReset = () => {
      loadDashboardData();
    };

    window.addEventListener('studioos_storage_reset', handleStorageReset);
    return () => {
      window.removeEventListener('studioos_storage_reset', handleStorageReset);
    };
  }, []);

  // Permission check for amounts (Owner always sees; Manager follows studio setting; Others never)
  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // Active projects list
  const activeProjects = useMemo(() => {
    return projects.filter(p => p.status === 'active');
  }, [projects]);

  // 1. Summary card values (strictly computed from data, max 4 cards)
  const activeProjectsCount = activeProjects.length;

  const itemsRunningLowCount = useMemo(() => {
    return computeItemsRunningLowCount(projects, materials, movements);
  }, [projects, materials, movements]);

  const billsToReviewCount = useMemo(() => {
    return bills.filter(b => b.status === 'to_review').length;
  }, [bills]);

  const staleProjects = useMemo(() => {
    return activeProjects
      .map(p => ({
        project: p,
        days: computeDaysSinceLastUpdate(p.id, updates)
      }))
      .filter((item): item is { project: Project; days: number } => item.days !== null && item.days >= 3);
  }, [activeProjects, updates]);

  const staleSitesCount = staleProjects.length;

  // 2. Needs your attention list (strictly plain language from Section 7 & 5.1)
  const attentionItems: AttentionItem[] = useMemo(() => {
    return computeAttentionItems(projects, materials, movements, bills, updates);
  }, [projects, materials, movements, bills, updates]);

  // Map of team members by id for quick avatar/name lookup
  const teamMap = useMemo(() => {
    const map = new Map<string, User>();
    team.forEach(u => map.set(u.id, u));
    return map;
  }, [team]);

  // Map of projects by id
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach(p => map.set(p.id, p));
    return map;
  }, [projects]);

  // Map of materials by id
  const materialMap = useMemo(() => {
    const map = new Map<string, Material>();
    materials.forEach(m => map.set(m.id, m));
    return map;
  }, [materials]);

  // 3. Project progress & spend map per project
  const projectStats = useMemo(() => {
    const stats = new Map<string, { progress: number; spend: number; daysSinceUpdate: number | null; statusType: 'on_track' | 'needs_attention' | 'delayed' }>();

    activeProjects.forEach(proj => {
      const projCells = allCells.filter(c => c.projectId === proj.id);
      const progress = computeProjectProgress(projCells);
      const spend = computeProjectSpend(bills, proj.id);
      const days = computeDaysSinceLastUpdate(proj.id, updates);

      // Determine operational status
      let statusType: 'on_track' | 'needs_attention' | 'delayed' = 'on_track';
      const isPastTarget = new Date(proj.targetDate).getTime() < new Date().setHours(0,0,0,0);
      const hasStale = days !== null && days >= 3;
      const hasAttention = attentionItems.some(item => item.projectId === proj.id);

      if (isPastTarget) {
        statusType = 'delayed';
      } else if (hasStale || hasAttention) {
        statusType = 'needs_attention';
      }

      stats.set(proj.id, { progress, spend, daysSinceUpdate: days, statusType });
    });

    return stats;
  }, [activeProjects, allCells, bills, updates, attentionItems]);

  // 4. Recent activity feed (last 8 events across progress updates, stock movements, and bills)
  const recentActivities: ActivityItem[] = useMemo(() => {
    const events: ActivityItem[] = [];

    // Progress updates
    updates.forEach(u => {
      const proj = projectMap.get(u.projectId);
      const actor = teamMap.get(u.authorId);
      events.push({
        id: `update-${u.id}`,
        date: u.date,
        actorName: u.authorName,
        actorAvatar: actor?.avatarUrl,
        sentence: `${u.authorName} updated ${u.roomName} ${u.trade} (${u.percentage}%) at ${proj?.name || 'Site'}`,
        projectName: proj?.name || 'Project',
        projectId: u.projectId,
        photoUrl: u.photos && u.photos.length > 0 ? u.photos[0] : undefined,
      });
    });

    // Stock movements
    movements.forEach(m => {
      const proj = projectMap.get(m.projectId);
      const mat = materialMap.get(m.materialId);
      const actor = teamMap.get(m.workerId || '');
      const matName = mat ? (mat.shadeCode ? `${mat.name} (${mat.shadeCode})` : mat.name) : 'materials';
      const unit = mat?.unit ? ` ${mat.unit}` : '';

      const workerName = m.workerName || 'Team member';
      let sentence = '';
      if (m.type === 'received') {
        sentence = `${workerName} recorded ${m.quantity}${unit} of ${matName} received at ${proj?.name || 'Site'}`;
      } else if (m.type === 'used') {
        sentence = `${workerName} logged ${m.quantity}${unit} of ${matName} used at ${proj?.name || 'Site'}`;
      } else if (m.type === 'adjustment') {
        sentence = `${workerName} adjusted stock of ${matName} at ${proj?.name || 'Site'}`;
      }

      events.push({
        id: `stock-${m.id}`,
        date: m.date,
        actorName: workerName,
        actorAvatar: actor?.avatarUrl,
        sentence,
        projectName: proj?.name || 'Project',
        projectId: m.projectId,
      });
    });

    // Bills
    bills.forEach(b => {
      const proj = projectMap.get(b.projectId);
      const actor = teamMap.get(b.uploadedById);
      events.push({
        id: `bill-${b.id}`,
        date: b.createdAt,
        actorName: b.uploadedBy,
        actorAvatar: actor?.avatarUrl,
        sentence: `${b.uploadedBy} uploaded a bill from ${b.vendorName} for ${proj?.name || 'Site'}`,
        projectName: proj?.name || 'Project',
        projectId: b.projectId,
        photoUrl: b.photoUrl,
      });
    });

    // Sort descending by date and slice to 8 events
    return events
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [updates, movements, bills, projectMap, teamMap, materialMap]);

  const userName = currentUser?.name?.split(' ')[0] || 'Megha';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header with exactly ONE primary action button */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-muted mt-1 font-sans">
            {getFormattedTodayDate()}
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 active:scale-[0.98] shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>New project</span>
          </button>
        </div>
      </header>

      {/* 2. Maximum 4 Summary Cards (Section 5.1 & Section 10) */}
      <section aria-label="Summary overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active projects */}
        <div 
          onClick={() => navigate('/projects')}
          className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Active projects
            </span>
            <FolderKanban className="w-4 h-4 text-muted group-hover:text-ink transition-colors" strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
            {isLoading ? '—' : activeProjectsCount}
          </span>
          <span className="text-xs text-muted mt-1 block">
            Sites in progress
          </span>
        </div>

        {/* Card 2: Items running low */}
        <div 
          onClick={() => navigate('/inventory?filter=running_low')}
          className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Items running low
            </span>
            <TrendingDown className={`w-4 h-4 ${itemsRunningLowCount > 0 ? 'text-amber' : 'text-muted'}`} strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
            {isLoading ? '—' : itemsRunningLowCount}
          </span>
          <span className="text-xs text-muted mt-1 block">
            Needs restocking soon
          </span>
        </div>

        {/* Card 3: Bills to review */}
        <div 
          onClick={() => navigate('/bills?status=to_review')}
          className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Bills to review
            </span>
            <FileText className={`w-4 h-4 ${billsToReviewCount > 0 ? 'text-amber' : 'text-muted'}`} strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
            {isLoading ? '—' : billsToReviewCount}
          </span>
          <span className="text-xs text-muted mt-1 block">
            Uploaded by supervisors
          </span>
        </div>

        {/* Card 4: Sites with no update in 3+ days */}
        <div 
          onClick={() => {
            if (staleProjects.length > 0) {
              navigate(`/projects/${staleProjects[0].project.id}?tab=progress`);
            } else {
              navigate('/projects');
            }
          }}
          className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">
              Sites with no update in 3+ days
            </span>
            <Clock className={`w-4 h-4 ${staleSitesCount > 0 ? 'text-amber' : 'text-muted'}`} strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
            {isLoading ? '—' : staleSitesCount}
          </span>
          <span className="text-xs text-muted mt-1 block">
            {staleSitesCount > 0 ? `${staleProjects[0].project.name} (${staleProjects[0].days} days)` : 'All sites up to date'}
          </span>
        </div>
      </section>

      {/* Main Content Layout: 2 Columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Needs your attention + Projects overview */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 3. "Needs your attention" list (most important block) */}
          <section aria-label="Needs your attention" className="p-6 rounded-card bg-paper border border-line shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium text-ink tracking-tight">
                  Needs your attention
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Items requiring decisions or follow-up today
                </p>
              </div>
              {attentionItems.length > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sand text-ink-2 tabular-nums">
                  {attentionItems.length} items
                </span>
              )}
            </div>

            {attentionItems.length === 0 ? (
              <div className="p-6 rounded-xl bg-ivory/60 border border-line text-center space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-olive mx-auto" strokeWidth={1.5} />
                <p className="text-sm font-medium text-ink">All sites are running smoothly</p>
                <p className="text-xs text-muted">Nothing needs your attention right now.</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {attentionItems.map((item) => {
                  const isRust = item.severity === 'rust';
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => navigate(item.link)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                          isRust 
                            ? 'bg-rust-soft/50 border-rust/30 hover:bg-rust-soft/80 hover:border-rust/50' 
                            : 'bg-amber-soft/50 border-amber/30 hover:bg-amber-soft/80 hover:border-amber/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isRust ? 'bg-rust/10 text-rust' : 'bg-amber/10 text-amber'}`}>
                            {item.type === 'out_of_stock' && <AlertCircle className="w-4 h-4" strokeWidth={1.75} />}
                            {item.type === 'overused' && <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />}
                            {item.type === 'running_low' && <TrendingDown className="w-4 h-4" strokeWidth={1.75} />}
                            {item.type === 'stale_site' && <Clock className="w-4 h-4" strokeWidth={1.75} />}
                            {item.type === 'bills_review' && <FileText className="w-4 h-4" strokeWidth={1.75} />}
                          </div>
                          <span className="text-sm text-ink font-medium leading-relaxed truncate sm:whitespace-normal">
                            {item.text}
                          </span>
                        </div>
                        <div className="flex items-center shrink-0 text-muted group-hover:text-ink transition-colors">
                          <span className="text-xs hidden sm:inline mr-1">View</span>
                          <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isRust ? 'text-rust' : 'text-amber'}`} strokeWidth={1.5} />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* 4. Projects overview (Cards per active project) */}
          <section aria-label="Active projects overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium text-ink tracking-tight">
                  Active projects
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Live site progress, focus, and schedule status
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="text-xs font-medium text-muted hover:text-ink transition-colors flex items-center gap-1"
              >
                <span>All projects</span>
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeProjects.map((project) => {
                const stats = projectStats.get(project.id) || { progress: 0, spend: 0, daysSinceUpdate: null, statusType: 'on_track' };
                const isNeedsAttention = stats.statusType === 'needs_attention';

                // Find latest update for this project
                const latestUpdate = updates
                  .filter(u => u.projectId === project.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                return (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="group bg-paper border border-line rounded-card overflow-hidden hover:border-sand-dark hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Cover image & status chip */}
                    <div className="relative h-44 w-full bg-sand/40 overflow-hidden">
                      <img 
                        src={project.coverImage} 
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-black/10" />

                      {/* Status Chip */}
                      <div className="absolute top-3 right-3">
                        {stats.statusType === 'delayed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rust-soft text-rust border border-rust/40 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-rust" />
                            <span>Delayed</span>
                          </span>
                        ) : isNeedsAttention ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-soft text-amber border border-amber/40 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                            <span>Needs attention</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-olive-soft text-olive border border-olive/30 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                            <span>On track</span>
                          </span>
                        )}
                      </div>

                      {/* Project title and customer overlay */}
                      <div className="absolute bottom-3 left-4 right-4 text-paper">
                        <h3 className="font-serif text-lg font-medium text-white leading-tight drop-shadow-sm">
                          {project.name}
                        </h3>
                        <p className="text-xs text-white/80 mt-0.5 truncate drop-shadow-xs">
                          {project.customerName} · {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      {/* Overall Progress with thin olive bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted font-medium">Overall progress</span>
                          <span className="font-medium text-ink tabular-nums">{stats.progress}%</span>
                        </div>
                        <div className="w-full bg-sand/60 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-olive h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${stats.progress}%` }} 
                          />
                        </div>
                      </div>

                      {/* Current focus */}
                      {project.currentFocus && (
                        <div className="text-xs bg-ivory/80 border border-line/60 rounded-xl p-3 flex items-start gap-2 text-ink-2">
                          <Hammer className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div className="leading-relaxed">
                            <span className="font-medium text-ink mr-1">Focus:</span>
                            <span>{project.currentFocus}</span>
                          </div>
                        </div>
                      )}

                      {/* Financial Spend vs Budget (Owner / permitted Manager only) */}
                      {canSeeAmounts && (
                        <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
                          <span className="text-muted">Spent so far</span>
                          <span className="font-medium text-ink tabular-nums">
                            {formatCurrencyINR(stats.spend)}
                            {project.budget ? ` / ${formatCurrencyINR(project.budget)}` : ''}
                          </span>
                        </div>
                      )}

                      {/* Last update footer */}
                      <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                          <span className="truncate">
                            {latestUpdate 
                              ? `Updated ${formatRelativeTime(latestUpdate.date)} by ${latestUpdate.authorName.split(' ')[0]}`
                              : 'No updates recorded yet'}
                          </span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-ink transition-colors shrink-0" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Recent Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          <section aria-label="Recent activity" className="p-6 rounded-card bg-paper border border-line shadow-card space-y-5">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink tracking-tight">
                Recent activity
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Last 8 updates and site events
              </p>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act, index) => {
                return (
                  <div 
                    key={act.id} 
                    onClick={() => navigate(`/projects/${act.projectId}`)}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    {/* Actor Avatar / Initials */}
                    <div className="relative shrink-0 mt-0.5">
                      {act.actorAvatar ? (
                        <img 
                          src={act.actorAvatar} 
                          alt={act.actorName} 
                          className="w-8 h-8 rounded-full object-cover border border-line" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-sand text-ink text-xs font-medium flex items-center justify-center border border-line">
                          {act.actorName.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Activity Text and Time */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-ink-2 leading-relaxed group-hover:text-ink transition-colors">
                        {act.sentence}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-muted tabular-nums">
                          {formatRelativeTime(act.date)}
                        </span>
                        <span className="text-[10px] text-muted font-medium bg-sand/60 px-1.5 py-0.5 rounded">
                          {act.projectName}
                        </span>
                      </div>
                    </div>

                    {/* Optional small photo preview thumbnail */}
                    {act.photoUrl && (
                      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-line bg-sand/30">
                        <img 
                          src={act.photoUrl} 
                          alt="preview" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick site status note */}
          <div className="p-4 rounded-2xl bg-sand/40 border border-line text-xs text-muted space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Bestinterio · Studio Operations</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All metrics update dynamically from supervisor logs and bills. Owner sees ₹ spend; manager visibility follows studio settings.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
