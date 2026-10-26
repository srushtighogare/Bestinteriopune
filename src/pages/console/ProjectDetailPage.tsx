import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  MapPin, 
  User as UserIcon, 
  Hammer, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  Camera, 
  Search, 
  TrendingDown, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Layers,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { progressService } from '../../services/progressService';
import { stockService } from '../../services/stockService';
import { billsService } from '../../services/billsService';
import { teamService } from '../../services/teamService';
import { settingsService } from '../../services/settingsService';
import { 
  Project, 
  ScopeGridCell, 
  ProgressUpdate, 
  Issue, 
  Material, 
  Category, 
  StockMovement, 
  MaterialStockBalance, 
  Bill, 
  User, 
  Studio 
} from '../../types';
import { 
  computeProjectProgress, 
  computeProjectSpend, 
  computeMaterialStockBalance, 
  computeDaysSinceLastUpdate, 
  formatCurrencyINR, 
  formatRelativeTime 
} from '../../utils/calculations';
import { RoomTradeGrid } from '../../components/progress/RoomTradeGrid';
import { BillsList } from '../../components/bills/BillsList';
import { MaterialHistoryDrawer } from '../../components/inventory/MaterialHistoryDrawer';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useAuth();

  // Active tab from URL search params (defaults to 'overview')
  const activeTab = (searchParams.get('tab') || 'overview') as 'overview' | 'progress' | 'inventory' | 'bills' | 'team';
  const inventoryFilterParam = (searchParams.get('filter') || 'all') as 'all' | 'running_low' | 'out_of_stock';

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [cells, setCells] = useState<ScopeGridCell[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [studio, setStudio] = useState<Studio | null>(null);

  // Inventory state
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'running_low' | 'out_of_stock'>(inventoryFilterParam);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selectedMaterial, setSelectedMaterial] = useState<{
    material: Material;
    balance: MaterialStockBalance;
  } | null>(null);

  // Assign team modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserIdToAssign, setSelectedUserIdToAssign] = useState<string>('');

  // Photo viewer lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const loadProjectData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [
        projectData,
        cellsData,
        updatesData,
        issuesData,
        materialsData,
        categoriesData,
        movementsData,
        billsData,
        teamData,
        studioData
      ] = await Promise.all([
        projectsService.get(id),
        progressService.getScopeCells(id),
        progressService.listUpdates(id),
        progressService.listIssues(id),
        stockService.listMaterials(),
        stockService.listCategories(),
        stockService.getMovements(id),
        billsService.list(id),
        teamService.list(),
        settingsService.getStudio(),
      ]);

      setProject(projectData);
      setCells(cellsData);
      setUpdates(updatesData);
      setIssues(issuesData);
      setMaterials(materialsData);
      setCategories(categoriesData);
      setMovements(movementsData);
      setBills(billsData);
      setTeam(teamData);
      setStudio(studioData);
    } catch (err) {
      console.error('Failed to load project detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();

    const handleStorageReset = () => {
      loadProjectData();
    };

    window.addEventListener('studioos_storage_reset', handleStorageReset);
    return () => {
      window.removeEventListener('studioos_storage_reset', handleStorageReset);
    };
  }, [id]);

  // Sync inventory filter param
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter === 'running_low' || urlFilter === 'out_of_stock') {
      setInventoryFilter(urlFilter);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'overview' | 'progress' | 'inventory' | 'bills' | 'team') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams);
  };

  // Permission for amounts
  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // Computed metrics
  const progressPercent = useMemo(() => {
    return computeProjectProgress(cells);
  }, [cells]);

  const totalSpend = useMemo(() => {
    return computeProjectSpend(bills, id);
  }, [bills, id]);

  const daysSinceUpdate = useMemo(() => {
    if (!id) return null;
    return computeDaysSinceLastUpdate(id, updates);
  }, [id, updates]);

  // Team members assigned to this project
  const assignedTeam = useMemo(() => {
    if (!id || !project) return [];
    return team.filter(u => 
      u.assignedProjectIds.includes(id) || u.id === project.supervisorId
    );
  }, [team, id, project]);

  const supervisor = useMemo(() => {
    if (!project) return null;
    return team.find(u => u.id === project.supervisorId) || null;
  }, [team, project]);

  // Unassigned team members for assignment modal
  const unassignedTeam = useMemo(() => {
    if (!id || !project) return [];
    return team.filter(u => 
      !u.assignedProjectIds.includes(id) && u.id !== project.supervisorId && u.status === 'active'
    );
  }, [team, id, project]);

  // Inventory balances for this project
  const stockBalances = useMemo(() => {
    if (!id) return [];
    return materials.map(mat => {
      return computeMaterialStockBalance(mat, movements, id);
    });
  }, [materials, movements, id]);

  const runningLowCount = useMemo(() => {
    return stockBalances.filter(b => b.status === 'running_low' || b.status === 'out_of_stock').length;
  }, [stockBalances]);

  // Category map
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);

  // Material map
  const materialMap = useMemo(() => {
    const map = new Map<string, Material>();
    materials.forEach(m => map.set(m.id, m));
    return map;
  }, [materials]);

  // Grouped inventory by category
  const groupedInventory = useMemo(() => {
    const groups: {
      category: Category;
      items: { material: Material; balance: MaterialStockBalance }[];
    }[] = [];

    // Filter balances first
    const filteredBalances = stockBalances.filter(b => {
      const mat = materialMap.get(b.materialId);
      if (!mat) return false;

      // Status filter
      if (inventoryFilter === 'running_low' && b.status !== 'running_low') return false;
      if (inventoryFilter === 'out_of_stock' && b.status !== 'out_of_stock') return false;

      // Search query
      if (inventorySearch.trim()) {
        const query = inventorySearch.toLowerCase();
        const matchesName = mat.name.toLowerCase().includes(query);
        const matchesShade = mat.shadeCode ? mat.shadeCode.toLowerCase().includes(query) : false;
        return matchesName || matchesShade;
      }

      return true;
    });

    categories.forEach(cat => {
      const catBalances = filteredBalances
        .map(b => ({
          material: materialMap.get(b.materialId)!,
          balance: b,
        }))
        .filter(item => item.material && item.material.categoryId === cat.id);

      if (catBalances.length > 0) {
        groups.push({
          category: cat,
          items: catBalances,
        });
      }
    });

    return groups;
  }, [categories, stockBalances, materialMap, inventoryFilter, inventorySearch]);

  // Toggle category collapse
  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Assign team member handler
  const handleAssignTeamMember = async () => {
    if (!id || !selectedUserIdToAssign) return;
    try {
      const user = team.find(u => u.id === selectedUserIdToAssign);
      if (!user) return;

      const updatedProjects = Array.from(new Set([...user.assignedProjectIds, id]));
      await teamService.update(user.id, { assignedProjectIds: updatedProjects });
      setIsAssignModalOpen(false);
      setSelectedUserIdToAssign('');
      await loadProjectData();
    } catch (err) {
      console.error('Failed to assign team member:', err);
    }
  };

  // Remove team member handler
  const handleRemoveTeamMember = async (userId: string) => {
    if (!id) return;
    const user = team.find(u => u.id === userId);
    if (!user) return;

    if (user.id === project?.supervisorId) {
      alert('This user is the designated supervisor for this project. Please assign a new supervisor first in Settings.');
      return;
    }

    if (confirm(`Remove ${user.name} from this project?`)) {
      try {
        const updatedProjects = user.assignedProjectIds.filter(pId => pId !== id);
        await teamService.update(user.id, { assignedProjectIds: updatedProjects });
        await loadProjectData();
      } catch (err) {
        console.error('Failed to remove team member:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-sm text-muted max-w-7xl mx-auto">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center text-sm text-muted max-w-xl mx-auto space-y-4">
        <p className="font-serif text-2xl font-medium text-ink">Project not found</p>
        <p className="text-xs text-muted">The requested project could not be found or has been removed.</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-medium"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const isNeedsAttention = daysSinceUpdate !== null && daysSinceUpdate >= 3;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header with Cover Banner & ONE primary action button */}
      <div className="space-y-6">
        {/* Back navigation & Primary Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-ink transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>All projects</span>
          </button>

          {/* EXACTLY ONE Primary Action Button on Project Detail */}
          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}/summary`)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" strokeWidth={1.75} />
            <span>Download summary</span>
          </button>
        </div>

        {/* Project Header Card with Cover Strip */}
        <div className="bg-paper border border-line rounded-card overflow-hidden shadow-card">
          {/* Cover Image Strip */}
          <div className="relative h-48 sm:h-56 w-full bg-sand/40 overflow-hidden">
            <img 
              src={project.coverImage} 
              alt={project.name}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />

            {/* Status chip top right */}
            <div className="absolute top-4 right-4">
              {project.status === 'on_hold' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sand text-ink-2 border border-line shadow-xs">
                  <span>On hold</span>
                </span>
              ) : project.status === 'completed' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-olive-soft text-olive border border-olive/30 shadow-xs">
                  <span>Completed</span>
                </span>
              ) : isNeedsAttention ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-soft text-amber border border-amber/40 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  <span>Needs attention</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-olive-soft text-olive border border-olive/30 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-olive" />
                  <span>On track</span>
                </span>
              )}
            </div>

            {/* Project identity title on cover bottom */}
            <div className="absolute bottom-4 left-6 right-6 text-paper">
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium block">
                {project.type}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight drop-shadow-sm mt-0.5">
                {project.name}
              </h1>
              <p className="text-sm text-white/90 mt-1 flex flex-wrap items-center gap-3">
                <span className="font-medium">{project.customerName}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white/75" />
                  <span>{project.address}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Info Strip Below Cover */}
          <div className="p-6 bg-paper flex flex-wrap items-center justify-between gap-6 border-t border-line/60">
            {/* Timeline */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sand/60 text-ink-2 flex items-center justify-center border border-line/60">
                <Calendar className="w-4 h-4 text-muted" />
              </div>
              <div className="text-xs">
                <span className="text-muted block">Schedule timeline</span>
                <span className="font-medium text-ink">
                  {new Date(project.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' → '}
                  {new Date(project.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Supervisor */}
            <div className="flex items-center gap-3">
              {supervisor?.avatarUrl ? (
                <img 
                  src={supervisor.avatarUrl} 
                  alt={supervisor.name} 
                  className="w-9 h-9 rounded-xl object-cover border border-line" 
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-sand text-ink text-xs font-medium flex items-center justify-center border border-line">
                  {supervisor ? supervisor.name.charAt(0) : 'S'}
                </div>
              )}
              <div className="text-xs">
                <span className="text-muted block">Site supervisor</span>
                <span className="font-medium text-ink">
                  {supervisor ? supervisor.name : 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Team Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {assignedTeam.slice(0, 4).map(member => (
                  <div key={member.id} className="inline-block ring-2 ring-paper rounded-full">
                    {member.avatarUrl ? (
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full object-cover" 
                        title={`${member.name} (${member.role})`}
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-full bg-sand text-ink text-[11px] font-medium flex items-center justify-center border border-line"
                        title={member.name}
                      >
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <span className="text-muted block">Assigned team</span>
                <span className="font-medium text-ink">
                  {assignedTeam.length} members
                </span>
              </div>
            </div>

            {/* Overall Progress Gauge */}
            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <span className="text-muted block">Overall Progress</span>
                <span className="font-serif text-xl font-medium text-olive tabular-nums">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-sand/80 flex items-center justify-center relative">
                <span className="text-[11px] font-serif font-medium text-ink">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="border-b border-line">
        <nav className="flex items-center gap-8 -mb-px overflow-x-auto text-sm font-medium">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('progress')}
            className={`pb-3 border-b-2 transition-all shrink-0 inline-flex items-center gap-2 ${
              activeTab === 'progress'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <span>Progress</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sand text-ink-2">
              {progressPercent}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('inventory')}
            className={`pb-3 border-b-2 transition-all shrink-0 inline-flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <span>Inventory</span>
            {runningLowCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-soft text-amber">
                {runningLowCount} low
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('bills')}
            className={`pb-3 border-b-2 transition-all shrink-0 inline-flex items-center gap-2 ${
              activeTab === 'bills'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <span>Bills</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sand text-ink-2">
              {bills.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('team')}
            className={`pb-3 border-b-2 transition-all shrink-0 inline-flex items-center gap-2 ${
              activeTab === 'team'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <span>Team</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sand text-ink-2">
              {assignedTeam.length}
            </span>
          </button>
        </nav>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Progress Card */}
            <div 
              onClick={() => handleTabChange('progress')}
              className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark cursor-pointer transition-all shadow-xs"
            >
              <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                Overall Progress
              </span>
              <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
                {progressPercent}%
              </span>
              <div className="w-full bg-sand/60 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-olive h-1.5 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Financial Spend vs Budget (Owner / permitted manager only) */}
            <div 
              onClick={() => handleTabChange('bills')}
              className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark cursor-pointer transition-all shadow-xs"
            >
              <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                Spent so far
              </span>
              <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
                {canSeeAmounts ? formatCurrencyINR(totalSpend) : '—'}
              </span>
              <span className="text-xs text-muted mt-1 block">
                {canSeeAmounts && project.budget 
                  ? `Budget: ${formatCurrencyINR(project.budget)}`
                  : `${bills.length} bills recorded`}
              </span>
            </div>

            {/* Materials Needing Attention */}
            <div 
              onClick={() => handleTabChange('inventory')}
              className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark cursor-pointer transition-all shadow-xs"
            >
              <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                Stock needing attention
              </span>
              <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
                {runningLowCount}
              </span>
              <span className="text-xs text-muted mt-1 block">
                {runningLowCount > 0 ? 'Items low or out of stock' : 'Stock levels healthy'}
              </span>
            </div>

            {/* Open Issues */}
            <div 
              onClick={() => handleTabChange('progress')}
              className="p-5 rounded-card bg-paper border border-line hover:border-sand-dark cursor-pointer transition-all shadow-xs"
            >
              <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                Open site issues
              </span>
              <span className="text-3xl font-serif font-medium text-ink mt-2 block tabular-nums">
                {issues.filter(i => i.status === 'open').length}
              </span>
              <span className="text-xs text-muted mt-1 block">
                {issues.filter(i => i.status === 'open').length > 0 ? 'Requires attention' : 'No blockers'}
              </span>
            </div>
          </div>

          {/* Current Focus Note */}
          {project.currentFocus && (
            <div className="p-4 rounded-2xl bg-ivory border border-line flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sand/60 text-ink">
                  <Hammer className="w-4 h-4 text-muted" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                    Current Site Focus
                  </span>
                  <p className="text-sm font-medium text-ink mt-0.5">
                    {project.currentFocus}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTabChange('progress')}
                className="text-xs font-medium text-ink hover:text-olive transition-colors inline-flex items-center gap-1"
              >
                <span>View scope</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* This Week's Updates Photo Strip */}
          <div className="p-6 rounded-card bg-paper border border-line shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-ink tracking-tight">
                  This week's updates
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Recent photo logs and progress from site supervisors
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTabChange('progress')}
                className="text-xs font-medium text-muted hover:text-ink transition-colors flex items-center gap-1"
              >
                <span>All {updates.length} updates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {updates.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted bg-ivory/50 rounded-xl border border-line">
                No progress updates posted yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {updates.slice(0, 4).map(u => {
                  const photo = u.photos && u.photos.length > 0 ? u.photos[0] : null;

                  return (
                    <div 
                      key={u.id}
                      onClick={() => photo && setLightboxPhoto(photo)}
                      className="group bg-paper border border-line rounded-xl overflow-hidden hover:border-sand-dark transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-32 w-full bg-sand/30 overflow-hidden">
                        {photo ? (
                          <img 
                            src={photo} 
                            alt={u.roomName} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted">
                            <Camera className="w-6 h-6" strokeWidth={1.5} />
                          </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium bg-ink/75 text-paper">
                          {u.percentage}%
                        </span>
                      </div>

                      <div className="p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between font-medium text-ink">
                          <span>{u.roomName}</span>
                          <span className="text-[11px] text-muted capitalize">{u.trade}</span>
                        </div>
                        <p className="text-[11px] text-muted truncate">
                          {formatRelativeTime(u.date)} by {u.authorName.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Previews: Open Issues & Running Low Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Open Issues Preview */}
            <div className="p-6 rounded-card bg-paper border border-line shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-medium text-ink">
                    Open site issues ({issues.filter(i => i.status === 'open').length})
                  </h4>
                  <p className="text-xs text-muted mt-0.5">Reported by supervisors on site</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('progress')}
                  className="text-xs text-muted hover:text-ink font-medium"
                >
                  View all
                </button>
              </div>

              {issues.filter(i => i.status === 'open').length === 0 ? (
                <div className="p-6 rounded-xl bg-ivory/50 border border-line text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-olive mx-auto" />
                  <p className="text-xs font-medium text-ink">No open site issues</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {issues.filter(i => i.status === 'open').slice(0, 3).map(issue => (
                    <li 
                      key={issue.id}
                      onClick={() => handleTabChange('progress')}
                      className="p-3 rounded-xl border border-line hover:border-sand-dark bg-paper cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-ink">{issue.roomName || 'General'}</span>
                        <span className="text-[10px] text-muted capitalize">{issue.type.replace('_', ' ')}</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">{issue.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Running Low Stock Preview */}
            <div className="p-6 rounded-card bg-paper border border-line shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-medium text-ink">
                    Materials running low ({runningLowCount})
                  </h4>
                  <p className="text-xs text-muted mt-0.5">Restock needed for this site</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('inventory')}
                  className="text-xs text-muted hover:text-ink font-medium"
                >
                  View inventory
                </button>
              </div>

              {runningLowCount === 0 ? (
                <div className="p-6 rounded-xl bg-ivory/50 border border-line text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-olive mx-auto" />
                  <p className="text-xs font-medium text-ink">All materials in stock</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {stockBalances.filter(b => b.status === 'running_low' || b.status === 'out_of_stock').slice(0, 3).map(balance => {
                    const mat = materialMap.get(balance.materialId);
                    const isOos = balance.status === 'out_of_stock';

                    return (
                      <li 
                        key={balance.materialId}
                        onClick={() => {
                          handleTabChange('inventory');
                          if (mat) setSelectedMaterial({ material: mat, balance });
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isOos 
                            ? 'bg-rust-soft/50 border-rust/30 hover:border-rust/60' 
                            : 'bg-amber-soft/50 border-amber/30 hover:border-amber/60'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium text-ink">
                            {balance.materialName} {balance.shadeCode ? `(${balance.shadeCode})` : ''}
                          </p>
                          <p className="text-[11px] text-muted">
                            {balance.inStock} {balance.unit} in stock (threshold: {balance.lowStockThreshold})
                          </p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          isOos ? 'bg-rust text-paper' : 'bg-amber text-paper'
                        }`}>
                          {isOos ? 'Out of stock' : 'Running low'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROGRESS (Room × Trade Grid) */}
      {activeTab === 'progress' && (
        <RoomTradeGrid
          project={project}
          cells={cells}
          updates={updates}
          issues={issues}
          onDataRefresh={loadProjectData}
        />
      )}

      {/* TAB 3: INVENTORY (This site's stock grouped by category) */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-paper p-4 rounded-xl border border-line">
            {/* Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setInventoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  inventoryFilter === 'all'
                    ? 'bg-ink text-paper shadow-xs'
                    : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
                }`}
              >
                All materials ({stockBalances.length})
              </button>
              <button
                type="button"
                onClick={() => setInventoryFilter('running_low')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  inventoryFilter === 'running_low'
                    ? 'bg-amber text-paper shadow-xs'
                    : 'bg-amber-soft text-amber hover:bg-amber-soft/80'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Running low ({stockBalances.filter(b => b.status === 'running_low').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setInventoryFilter('out_of_stock')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  inventoryFilter === 'out_of_stock'
                    ? 'bg-rust text-paper shadow-xs'
                    : 'bg-rust-soft text-rust hover:bg-rust-soft/80'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of stock ({stockBalances.filter(b => b.status === 'out_of_stock').length})</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search material or shade..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>

          {/* Grouped Category Inventory Blocks */}
          {groupedInventory.length === 0 ? (
            <div className="p-12 rounded-xl bg-ivory/50 border border-line text-center space-y-3">
              <Layers className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
              <p className="text-sm font-medium text-ink">No materials found</p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                No materials match the current filter or search criteria for this site.
              </p>
              {(inventorySearch || inventoryFilter !== 'all') && (
                <button
                  onClick={() => {
                    setInventorySearch('');
                    setInventoryFilter('all');
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-line text-xs font-medium text-ink hover:bg-sand/40"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {groupedInventory.map(group => {
                const isCollapsed = collapsedCategories[group.category.id];

                return (
                  <div 
                    key={group.category.id} 
                    className="bg-paper border border-line rounded-card overflow-hidden shadow-xs"
                  >
                    {/* Collapsible Category Header */}
                    <div 
                      onClick={() => toggleCategoryCollapse(group.category.id)}
                      className="p-4 bg-sand/30 flex items-center justify-between cursor-pointer hover:bg-sand/50 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-medium text-sm text-ink">
                          {group.category.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-paper text-muted border border-line/60">
                          {group.items.length} item{group.items.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted">
                        <span className="text-[11px]">Click row for history</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          isCollapsed ? '-rotate-90' : 'rotate-0'
                        }`} />
                      </div>
                    </div>

                    {/* Table of Materials in Category */}
                    {!isCollapsed && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[650px]">
                          <thead className="bg-sand/10 text-muted font-medium border-b border-line">
                            <tr>
                              <th className="py-2.5 px-4">Material & Shade</th>
                              <th className="py-2.5 px-4 text-center">Unit</th>
                              <th className="py-2.5 px-4 text-right">Received</th>
                              <th className="py-2.5 px-4 text-right">Used</th>
                              <th className="py-2.5 px-4 text-right">In Stock</th>
                              <th className="py-2.5 px-4 text-center">Status</th>
                              <th className="py-2.5 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line/60">
                            {group.items.map(({ material, balance }) => {
                              const isOos = balance.status === 'out_of_stock';
                              const isLow = balance.status === 'running_low';

                              return (
                                <tr
                                  key={material.id}
                                  onClick={() => setSelectedMaterial({ material, balance })}
                                  className="hover:bg-sand/20 transition-colors cursor-pointer group"
                                >
                                  {/* Name & Shade */}
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-ink group-hover:text-olive transition-colors">
                                      {material.name}
                                    </div>
                                    {material.shadeCode && (
                                      <div className="text-[11px] text-muted">
                                        Shade: {material.shadeCode}
                                      </div>
                                    )}
                                  </td>

                                  {/* Unit */}
                                  <td className="py-3 px-4 text-center text-muted">
                                    {material.unit}
                                  </td>

                                  {/* Received */}
                                  <td className="py-3 px-4 text-right tabular-nums text-muted">
                                    {balance.received}
                                  </td>

                                  {/* Used */}
                                  <td className="py-3 px-4 text-right tabular-nums text-muted">
                                    {balance.used}
                                  </td>

                                  {/* In Stock */}
                                  <td className="py-3 px-4 text-right tabular-nums">
                                    <span className={`font-serif text-sm font-medium ${
                                      isOos ? 'text-rust font-semibold' : isLow ? 'text-amber font-semibold' : 'text-ink'
                                    }`}>
                                      {balance.inStock}
                                    </span>
                                  </td>

                                  {/* Status Chip */}
                                  <td className="py-3 px-4 text-center">
                                    {isOos ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rust-soft text-rust border border-rust/30">
                                        <AlertCircle className="w-2.5 h-2.5" />
                                        <span>Out of stock</span>
                                      </span>
                                    ) : isLow ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-soft text-amber border border-amber/30">
                                        <TrendingDown className="w-2.5 h-2.5" />
                                        <span>Running low</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-olive-soft text-olive border border-olive/30">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        <span>In stock</span>
                                      </span>
                                    )}
                                  </td>

                                  {/* Action arrow */}
                                  <td className="py-3 px-4 text-right">
                                    <span className="text-[11px] text-muted group-hover:text-ink inline-flex items-center gap-0.5">
                                      <span>History</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Material Movement History Drawer */}
          {selectedMaterial && (
            <MaterialHistoryDrawer
              isOpen={Boolean(selectedMaterial)}
              onClose={() => setSelectedMaterial(null)}
              material={selectedMaterial.material}
              balance={selectedMaterial.balance}
              movements={movements}
              projectName={project.name}
            />
          )}
        </div>
      )}

      {/* TAB 4: BILLS (Shared Reusable Component from Step 7) */}
      {activeTab === 'bills' && (
        <BillsList
          projectId={project.id}
          canSeeAmounts={canSeeAmounts}
        />
      )}

      {/* TAB 5: TEAM */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-paper p-4 rounded-xl border border-line">
            <div>
              <h3 className="font-serif text-lg font-medium text-ink">
                Assigned Team Members ({assignedTeam.length})
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Team members with access to log work done and material usage for this site
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-paper border border-line text-xs font-medium text-ink hover:bg-sand/40 hover:border-sand-dark transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign team member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedTeam.map(member => {
              const isSupervisor = member.id === project.supervisorId;

              return (
                <div
                  key={member.id}
                  className="p-5 rounded-card bg-paper border border-line shadow-xs flex flex-col justify-between space-y-4 hover:border-sand-dark transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {member.avatarUrl ? (
                        <img 
                          src={member.avatarUrl} 
                          alt={member.name} 
                          className="w-11 h-11 rounded-full object-cover border border-line shrink-0" 
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-sand text-ink text-sm font-medium flex items-center justify-center border border-line shrink-0">
                          {member.name.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif font-medium text-sm text-ink">
                            {member.name}
                          </h4>
                          {isSupervisor && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-olive-soft text-olive">
                              Lead
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted capitalize mt-0.5">
                          {member.role} {member.trade ? `· ${member.trade}` : ''}
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand text-ink-2 capitalize">
                      {member.status}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                    <span className="tabular-nums">{member.phone}</span>

                    {!isSupervisor && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="text-xs text-muted hover:text-rust transition-colors inline-flex items-center gap-1"
                        title="Remove from project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assign Member Modal */}
          {isAssignModalOpen && (
            <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-paper rounded-2xl max-w-md w-full p-6 space-y-5 border border-line shadow-2xl">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-ink">
                      Assign Team Member
                    </h4>
                    <p className="text-xs text-muted mt-0.5">
                      Select an existing member of Bestinterio to work at {project.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
                    className="text-muted hover:text-ink text-sm p-1"
                  >
                    ✕
                  </button>
                </div>

                {unassignedTeam.length === 0 ? (
                  <p className="text-xs text-muted py-4 text-center">
                    All studio team members are currently assigned to this project.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-ink block">
                      Choose member:
                    </label>
                    <select
                      value={selectedUserIdToAssign}
                      onChange={(e) => setSelectedUserIdToAssign(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                    >
                      <option value="">Select team member...</option>
                      {unassignedTeam.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role}{u.trade ? ` - ${u.trade}` : ''})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-line text-xs font-medium text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!selectedUserIdToAssign}
                    onClick={handleAssignTeamMember}
                    className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 disabled:opacity-50"
                  >
                    Assign to site
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Lightbox for update photos */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-60 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-paper rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-ink/70 text-paper flex items-center justify-center hover:bg-ink"
            >
              ✕
            </button>
            <img 
              src={lightboxPhoto} 
              alt="Site photo" 
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
