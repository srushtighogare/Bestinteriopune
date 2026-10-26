import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Calendar, 
  Hammer, 
  User as UserIcon, 
  Clock, 
  ArrowUpRight, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { progressService } from '../../services/progressService';
import { billsService } from '../../services/billsService';
import { teamService } from '../../services/teamService';
import { settingsService } from '../../services/settingsService';
import { 
  Project, 
  ProjectStatus, 
  ScopeGridCell, 
  Bill, 
  ProgressUpdate, 
  User, 
  Studio 
} from '../../types';
import { 
  computeProjectProgress, 
  computeProjectSpend, 
  computeDaysSinceLastUpdate, 
  formatCurrencyINR, 
  formatRelativeTime 
} from '../../utils/calculations';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [cells, setCells] = useState<ScopeGridCell[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [studio, setStudio] = useState<Studio | null>(null);

  // Filters & View toggle
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, billsData, updatesData, teamData, studioData] = await Promise.all([
        projectsService.list(),
        billsService.list(),
        progressService.listUpdates(),
        teamService.list(),
        settingsService.getStudio(),
      ]);

      // Load all scope cells
      const cellPromises = projectsData.map(p => progressService.getScopeCells(p.id));
      const cellsNested = await Promise.all(cellPromises);

      setProjects(projectsData);
      setCells(cellsNested.flat());
      setBills(billsData);
      setUpdates(updatesData);
      setTeam(teamData);
      setStudio(studioData);
    } catch (err) {
      console.error('Failed to load projects list data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageReset = () => {
      loadData();
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

  // Team lookup map
  const teamMap = useMemo(() => {
    const map = new Map<string, User>();
    team.forEach(u => map.set(u.id, u));
    return map;
  }, [team]);

  // Project computed stats map
  const statsMap = useMemo(() => {
    const map = new Map<string, {
      progress: number;
      spend: number;
      lastUpdate: ProgressUpdate | null;
      daysSinceUpdate: number | null;
      supervisor: User | null;
    }>();

    projects.forEach(p => {
      const projectCells = cells.filter(c => c.projectId === p.id);
      const progress = computeProjectProgress(projectCells);
      const spend = computeProjectSpend(bills, p.id);
      const projectUpdates = updates
        .filter(u => u.projectId === p.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastUpdate = projectUpdates.length > 0 ? projectUpdates[0] : null;
      const daysSinceUpdate = computeDaysSinceLastUpdate(p.id, updates);
      const supervisor = teamMap.get(p.supervisorId) || null;

      map.set(p.id, { progress, spend, lastUpdate, daysSinceUpdate, supervisor });
    });

    return map;
  }, [projects, cells, bills, updates, teamMap]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header with exactly ONE primary action button */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-muted mt-1 font-sans">
            Active residential and commercial sites in Pune
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span>New project</span>
        </button>
      </header>

      {/* 2. Controls Bar: Filter Chips, Search, Cards/List Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-paper p-4 rounded-xl border border-line">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'active'
                ? 'bg-ink text-paper shadow-xs'
                : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
            }`}
          >
            Active ({projects.filter(p => p.status === 'active').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'all'
                ? 'bg-ink text-paper shadow-xs'
                : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('on_hold')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'on_hold'
                ? 'bg-amber text-paper shadow-xs'
                : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
            }`}
          >
            On hold ({projects.filter(p => p.status === 'on_hold').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'completed'
                ? 'bg-olive text-paper shadow-xs'
                : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
            }`}
          >
            Completed ({projects.filter(p => p.status === 'completed').length})
          </button>
        </div>

        {/* Search & Layout Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search site, client, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Cards / List View Toggle */}
          <div className="flex items-center bg-sand/60 p-1 rounded-lg border border-line/60 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'cards' 
                  ? 'bg-paper text-ink shadow-xs' 
                  : 'text-muted hover:text-ink'
              }`}
              title="Cards view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-paper text-ink shadow-xs' 
                  : 'text-muted hover:text-ink'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Projects View Area */}
      {isLoading ? (
        <div className="p-16 text-center text-sm text-muted">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 rounded-xl bg-ivory/50 border border-line text-center space-y-3">
          <Building2 className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
          <p className="text-sm font-medium text-ink">No projects found</p>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'active'
              ? 'Try changing your search terms or filter selection.'
              : 'You have not added any projects yet.'}
          </p>
          {(searchQuery || statusFilter !== 'active') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-line text-xs font-medium text-ink hover:bg-sand/40"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View (Section 5.2) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const stats = statsMap.get(project.id) || {
              progress: 0,
              spend: 0,
              lastUpdate: null,
              daysSinceUpdate: null,
              supervisor: null,
            };

            const hasNoUpdates = stats.lastUpdate === null;
            const isDelayed = !hasNoUpdates && project.status !== 'completed' && project.status !== 'on_hold' && new Date(project.targetDate).getTime() < new Date().setHours(0,0,0,0);
            const isNeedsAttention = !hasNoUpdates && stats.daysSinceUpdate !== null && stats.daysSinceUpdate >= 3;

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
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-black/15" />

                  {/* Status Chip */}
                  <div className="absolute top-3 right-3">
                    {project.status === 'on_hold' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sand text-ink-2 border border-line shadow-xs">
                        <span>On hold</span>
                      </span>
                    ) : project.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-olive-soft text-olive border border-olive/30 shadow-xs">
                        <span>Completed</span>
                      </span>
                    ) : hasNoUpdates ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sand text-ink-2 border border-line shadow-xs">
                        <span>Not started yet</span>
                      </span>
                    ) : isDelayed ? (
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

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-paper">
                    <span className="text-[10px] uppercase tracking-wider text-white/80 font-medium block">
                      {project.type}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-white leading-tight drop-shadow-sm mt-0.5">
                      {project.name}
                    </h3>
                    <p className="text-xs text-white/85 mt-0.5 truncate">
                      {project.customerName} · {project.address.split(',')[0]}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Progress bar */}
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

                  {/* Financial Spend vs Budget */}
                  {canSeeAmounts && (
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
                      <span className="text-muted">Spent so far</span>
                      <span className="font-medium text-ink tabular-nums">
                        {formatCurrencyINR(stats.spend)}
                        {project.budget ? ` / ${formatCurrencyINR(project.budget)}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Supervisor & Last update footer */}
                  <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                    <div className="flex items-center gap-1.5 truncate">
                      {stats.supervisor?.avatarUrl ? (
                        <img 
                          src={stats.supervisor.avatarUrl} 
                          alt={stats.supervisor.name} 
                          className="w-5 h-5 rounded-full object-cover border border-line shrink-0" 
                        />
                      ) : (
                        <UserIcon className="w-3.5 h-3.5 text-muted shrink-0" />
                      )}
                      <span className="truncate">
                        {stats.supervisor ? stats.supervisor.name.split(' ')[0] : 'Supervisor'}
                      </span>
                      <span>·</span>
                      <span className="truncate">
                        {stats.lastUpdate 
                          ? formatRelativeTime(stats.lastUpdate.date)
                          : 'No updates'}
                      </span>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-ink transition-colors shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View (Section 5.2: Project · Customer · Progress · Supervisor · Last update · Status) */
        <div className="bg-paper border border-line rounded-card overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-sand/40 text-muted font-medium border-b border-line">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Progress</th>
                  {canSeeAmounts && <th className="py-3 px-4 text-right">Spend</th>}
                  <th className="py-3 px-4">Supervisor</th>
                  <th className="py-3 px-4">Last update</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {filteredProjects.map(project => {
                  const stats = statsMap.get(project.id) || {
                    progress: 0,
                    spend: 0,
                    lastUpdate: null,
                    daysSinceUpdate: null,
                    supervisor: null,
                  };

                  const hasNoUpdates = stats.lastUpdate === null;
                  const isDelayed = !hasNoUpdates && project.status === 'active' && new Date(project.targetDate).getTime() < new Date().setHours(0,0,0,0);
                  const isNeedsAttention = !hasNoUpdates && stats.daysSinceUpdate !== null && stats.daysSinceUpdate >= 3;

                  return (
                    <tr 
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="hover:bg-sand/20 transition-colors cursor-pointer group"
                    >
                      {/* Project info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={project.coverImage} 
                            alt={project.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-line shrink-0" 
                          />
                          <div>
                            <span className="font-serif font-medium text-sm text-ink group-hover:text-olive transition-colors block">
                              {project.name}
                            </span>
                            <span className="text-[11px] text-muted">
                              {project.type.charAt(0).toUpperCase() + project.type.slice(1)} · {project.address.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4 text-ink-2 font-medium">
                        {project.customerName}
                      </td>

                      {/* Progress */}
                      <td className="py-3 px-4">
                        <div className="w-32 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-ink tabular-nums">{stats.progress}%</span>
                          </div>
                          <div className="w-full bg-sand/60 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-olive h-1.5 rounded-full" 
                              style={{ width: `${stats.progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* Spend (owner / permitted manager only) */}
                      {canSeeAmounts && (
                        <td className="py-3 px-4 text-right tabular-nums">
                          <span className="font-medium text-ink block">
                            {formatCurrencyINR(stats.spend)}
                          </span>
                          {project.budget && (
                            <span className="text-[10px] text-muted block">
                              of {formatCurrencyINR(project.budget)}
                            </span>
                          )}
                        </td>
                      )}

                      {/* Supervisor */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {stats.supervisor?.avatarUrl ? (
                            <img 
                              src={stats.supervisor.avatarUrl} 
                              alt={stats.supervisor.name} 
                              className="w-5 h-5 rounded-full object-cover border border-line shrink-0" 
                            />
                          ) : (
                            <UserIcon className="w-4 h-4 text-muted" />
                          )}
                          <span className="text-ink-2">
                            {stats.supervisor ? stats.supervisor.name : 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      {/* Last update */}
                      <td className="py-3 px-4 text-muted tabular-nums">
                        {stats.lastUpdate 
                          ? `${formatRelativeTime(stats.lastUpdate.date)} by ${stats.lastUpdate.authorName.split(' ')[0]}`
                          : 'No updates'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right">
                        {project.status === 'on_hold' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sand text-ink-2">
                            On hold
                          </span>
                        ) : project.status === 'completed' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-olive-soft text-olive">
                            Completed
                          </span>
                        ) : hasNoUpdates ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sand text-ink-2">
                            Not started yet
                          </span>
                        ) : isDelayed ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rust-soft text-rust">
                            Delayed
                          </span>
                        ) : isNeedsAttention ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-soft text-amber">
                            Needs attention
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-olive-soft text-olive">
                            On track
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
