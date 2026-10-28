import React, { useState, useEffect, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  PackageX,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { stockService } from '../../services/stockService';
import { Category, Material, MaterialStockBalance, Project, StockLevelStatus } from '../../types';
import { getActiveSiteProjectId, setActiveSiteProjectId } from '../../utils/siteState';
import { getSiteLanguage, SiteLanguage, t } from '../../utils/i18n';

type FilterTab = 'all' | 'in_stock' | 'running_low' | 'out_of_stock';

export const StockListPage: React.FC = () => {
  const { currentUser, role } = useAuth();

  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [balances, setBalances] = useState<MaterialStockBalance[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleLang = () => setLang(getSiteLanguage());
    window.addEventListener('studioos_language_change', handleLang);
    return () => window.removeEventListener('studioos_language_change', handleLang);
  }, []);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  const loadData = async () => {
    try {
      const [allProjects, catList] = await Promise.all([
        projectsService.list(),
        stockService.listCategories(),
      ]);

      const activeOnly = allProjects.filter((p) => p.status === 'active');
      let userProjects = activeOnly;

      if (role === 'supervisor') {
        userProjects = activeOnly.filter(
          (p) => p.supervisorId === currentUser?.id || currentUser?.assignedProjectIds?.includes(p.id)
        );
      } else if (role === 'worker') {
        userProjects = activeOnly.filter((p) => currentUser?.assignedProjectIds?.includes(p.id));
      }
      if (userProjects.length === 0) userProjects = activeOnly;

      setProjects(userProjects);
      setCategories(catList);

      const savedProjectId = getActiveSiteProjectId();
      const active = userProjects.find((p) => p.id === savedProjectId) || userProjects[0];
      const projId = active ? active.id : '';
      setSelectedProjectId(projId);

      if (projId) {
        const balList = await stockService.getStockBalances(projId);
        setBalances(balList);
      }

      // Default expand all categories
      setExpandedCategories(new Set(catList.map((c) => c.id)));
    } catch (err) {
      console.error('Failed to load site stock data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      if (selectedProjectId) {
        stockService.getStockBalances(selectedProjectId).then(setBalances);
      }
    };
    window.addEventListener('studioos_storage_change', handleStorageChange);
    return () => window.removeEventListener('studioos_storage_change', handleStorageChange);
  }, [currentUser?.id, role]);

  useEffect(() => {
    if (!selectedProjectId) return;
    stockService.getStockBalances(selectedProjectId).then(setBalances);
  }, [selectedProjectId]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // Filter balances based on query and status filter
  const filteredBalances = useMemo(() => {
    return balances.filter((b) => {
      // Status filter
      if (activeFilter !== 'all' && b.status !== activeFilter) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = b.materialName.toLowerCase().includes(q);
        const matchShade = b.shadeCode ? b.shadeCode.toLowerCase().includes(q) : false;
        const matchCat = b.categoryName ? b.categoryName.toLowerCase().includes(q) : false;
        if (!matchName && !matchShade && !matchCat) return false;
      }

      return true;
    });
  }, [balances, activeFilter, searchQuery]);

  // Group filtered balances by category
  const categoriesWithStock = useMemo(() => {
    return categories
      .map((cat) => {
        const catBalances = filteredBalances.filter((b) => b.categoryId === cat.id);
        return {
          ...cat,
          balances: catBalances,
        };
      })
      .filter((cat) => cat.balances.length > 0);
  }, [categories, filteredBalances]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: balances.length,
      in_stock: balances.filter((b) => b.status === 'in_stock').length,
      running_low: balances.filter((b) => b.status === 'running_low').length,
      out_of_stock: balances.filter((b) => b.status === 'out_of_stock').length,
    };
  }, [balances]);

  return (
    <div className="space-y-4 max-w-md mx-auto pb-10">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">Site Stock</h2>
        <p className="text-xs text-muted">
          Available materials and quantities on site
        </p>
      </div>

      {/* 1. Project Selector (if multiple) */}
      {projects.length > 1 ? (
        <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-olive" />
            <span className="text-xs font-medium text-muted">Site:</span>
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
        <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between shadow-xs">
          <span className="text-xs text-muted">Stock at:</span>
          <span className="text-sm font-semibold text-ink">{activeProject?.name}</span>
        </div>
      )}

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search materials or shade..."
          className="w-full h-12 pl-10 pr-4 rounded-2xl border border-line bg-paper text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink px-1.5 py-0.5 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Filter Chips: All · In stock · Running low · Out of stock (>= 48px tap targets) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`h-12 min-h-[48px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-ink text-paper border-ink shadow-xs'
              : 'bg-paper text-ink border-line hover:bg-sand/30'
          }`}
        >
          <span>All</span>
          <span className="text-[10px] opacity-75">({counts.all})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('in_stock')}
          className={`h-12 min-h-[48px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
            activeFilter === 'in_stock'
              ? 'bg-olive text-paper border-olive shadow-xs'
              : 'bg-paper text-ink border-line hover:bg-sand/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-olive-soft" />
          <span>In stock</span>
          <span className="text-[10px] opacity-75">({counts.in_stock})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('running_low')}
          className={`h-12 min-h-[48px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
            activeFilter === 'running_low'
              ? 'bg-amber text-paper border-amber shadow-xs'
              : 'bg-paper text-ink border-line hover:bg-sand/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-soft" />
          <span>Running low</span>
          <span className="text-[10px] opacity-75">({counts.running_low})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('out_of_stock')}
          className={`h-12 min-h-[48px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
            activeFilter === 'out_of_stock'
              ? 'bg-rust text-paper border-rust shadow-xs'
              : 'bg-paper text-ink border-line hover:bg-sand/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rust-soft" />
          <span>Out of stock</span>
          <span className="text-[10px] opacity-75">({counts.out_of_stock})</span>
        </button>
      </div>

      {/* 4. Grouped Stock Accordion */}
      <div className="space-y-2.5 pt-1">
        {categoriesWithStock.length > 0 ? (
          categoriesWithStock.map((cat) => {
            const isExpanded = expandedCategories.has(cat.id);
            return (
              <div
                key={cat.id}
                className="rounded-2xl bg-paper border border-line overflow-hidden shadow-xs"
              >
                {/* Header (>= 48px tap target) */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full min-h-[48px] h-12 px-4 py-2.5 bg-paper hover:bg-sand/20 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-medium text-muted bg-sand/40 px-2 py-0.5 rounded-full">
                      {cat.balances.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted" />
                  )}
                </button>

                {/* Items */}
                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-line/60 bg-ivory/30 divide-y divide-line/60">
                    {cat.balances.map((b) => {
                      const isOutOfStock = b.status === 'out_of_stock' || b.inStock <= 0;
                      const isRunningLow = b.status === 'running_low';

                      return (
                        <div
                          key={b.materialId}
                          className="py-3 first:pt-2.5 last:pb-1 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink truncate leading-tight">
                              {b.materialName}
                            </p>
                            {b.shadeCode && (
                              <p className="text-xs text-muted truncate mt-0.5">
                                {b.shadeCode}
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-ink tabular-nums block leading-tight">
                              {b.inStock} <span className="text-xs font-normal text-muted">{b.unit}s</span>
                            </span>

                            {/* Status Chip */}
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                                isOutOfStock
                                  ? 'bg-rust-soft text-rust border border-rust/40'
                                  : isRunningLow
                                  ? 'bg-amber-soft text-amber border border-amber/40'
                                  : 'bg-olive-soft text-olive border border-olive/30'
                              }`}
                            >
                              {isOutOfStock ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-rust" />
                                  <span>Out of stock</span>
                                </>
                              ) : isRunningLow ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                                  <span>Running low</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                                  <span>In stock</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-2xl bg-paper border border-line text-center space-y-2">
            <PackageX className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
            <p className="text-xs font-medium text-ink">No materials match your filter</p>
            <p className="text-[11px] text-muted">
              Try choosing "All" or clearing your search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
