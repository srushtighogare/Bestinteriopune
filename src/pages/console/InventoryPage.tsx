import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  ArrowUpDown, 
  Layers, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Info,
  SlidersHorizontal,
  Package,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { stockService } from '../../services/stockService';
import { projectsService } from '../../services/projectsService';
import { settingsService } from '../../services/settingsService';
import { Category, Material, MaterialStockBalance, Project, StockMovement, Studio, TradeType } from '../../types';
import { computeMaterialStockBalance, formatCurrencyINR } from '../../utils/calculations';
import { RecordMaterialReceivedDrawer } from '../../components/inventory/RecordMaterialReceivedDrawer';
import { MaterialHistoryDrawer } from '../../components/inventory/MaterialHistoryDrawer';
import { ImportExcelMockModal } from '../../components/inventory/ImportExcelMockModal';

export const InventoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);

  // Tab from URL (defaults to 'stock')
  const activeTab = (searchParams.get('tab') || 'stock') as 'stock' | 'catalogue';
  // Filter param from Home (e.g. ?filter=running_low or ?filter=out_of_stock or ?filter=low_stock)
  const filterParam = searchParams.get('filter');

  // Permission for financial figures
  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [rateMap, setRateMap] = useState<Record<string, number>>({});

  // Filter states
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running_low' | 'out_of_stock'>(() => {
    if (filterParam === 'running_low' || filterParam === 'low_stock') return 'running_low';
    if (filterParam === 'out_of_stock') return 'out_of_stock';
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Per-site popover state
  const [activeBreakdownMaterialId, setActiveBreakdownMaterialId] = useState<string | null>(null);

  // Drawers and Modals
  const [isReceivedDrawerOpen, setIsReceivedDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [historySelectedMaterial, setHistorySelectedMaterial] = useState<{
    material: Material;
    balance: MaterialStockBalance;
  } | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Catalogue management modals
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [renamingCategory, setRenamingCategory] = useState<Category | null>(null);

  // Form states for Add/Edit Material
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formName, setFormName] = useState('');
  const [formUnit, setFormUnit] = useState('sheet');
  const [formShadeCode, setFormShadeCode] = useState('');
  const [formLowStockThreshold, setFormLowStockThreshold] = useState('5');
  const [formRate, setFormRate] = useState('');

  // Form states for Category
  const [categoryFormName, setCategoryFormName] = useState('');
  const [categoryFormTrade, setCategoryFormTrade] = useState<TradeType | ''>('');

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [matList, catList, movList, projList, rates, studioData] = await Promise.all([
        stockService.listMaterials(),
        stockService.listCategories(),
        stockService.getMovements(),
        projectsService.list(),
        stockService.getMaterialRatesMap(),
        settingsService.getStudio(),
      ]);

      setMaterials(matList);
      setCategories(catList);
      setMovements(movList);
      setProjects(projList.filter(p => p.status === 'active'));
      setRateMap(rates);
      setStudio(studioData);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('studioos_storage_change', handleStorageChange);
    window.addEventListener('studioos_storage_reset', handleStorageChange);
    return () => {
      window.removeEventListener('studioos_storage_change', handleStorageChange);
      window.removeEventListener('studioos_storage_reset', handleStorageChange);
    };
  }, []);

  // Sync URL search params
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter === 'running_low' || urlFilter === 'low_stock') {
      setStatusFilter('running_low');
    } else if (urlFilter === 'out_of_stock') {
      setStatusFilter('out_of_stock');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'stock' | 'catalogue') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams);
  };

  // Map of categories by ID
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);

  // Compute stock balances for the selected site (or total across all sites)
  const stockBalances = useMemo(() => {
    return materials.map(mat => {
      const balance = computeMaterialStockBalance(
        mat, 
        movements, 
        selectedSiteId === 'all' ? undefined : selectedSiteId
      );
      balance.categoryName = categoryMap.get(mat.categoryId)?.name || 'General';
      return balance;
    });
  }, [materials, movements, selectedSiteId, categoryMap]);

  // Compute per-site breakdown for each material (used when selectedSiteId === 'all')
  const materialSiteBreakdowns = useMemo(() => {
    const map = new Map<string, { project: Project; inStock: number; status: string }[]>();
    materials.forEach(mat => {
      const breakdown = projects.map(proj => {
        const siteBalance = computeMaterialStockBalance(mat, movements, proj.id);
        return {
          project: proj,
          inStock: siteBalance.inStock,
          status: siteBalance.status,
        };
      });
      map.set(mat.id, breakdown);
    });
    return map;
  }, [materials, movements, projects]);

  // Filtered stock balances
  const filteredBalances = useMemo(() => {
    return stockBalances.filter(b => {
      const mat = materials.find(m => m.id === b.materialId);
      if (!mat) return false;

      // Category filter
      if (selectedCategory !== 'all' && mat.categoryId !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'running_low' && b.status !== 'running_low') return false;
      if (statusFilter === 'out_of_stock' && b.status !== 'out_of_stock') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = mat.name.toLowerCase().includes(query);
        const matchesShade = mat.shadeCode ? mat.shadeCode.toLowerCase().includes(query) : false;
        const matchesCat = b.categoryName.toLowerCase().includes(query);
        return matchesName || matchesShade || matchesCat;
      }

      return true;
    });
  }, [stockBalances, materials, selectedCategory, statusFilter, searchQuery]);

  // Overall counts for badges
  const totalRunningLow = useMemo(() => {
    return stockBalances.filter(b => b.status === 'running_low').length;
  }, [stockBalances]);

  const totalOutOfStock = useMemo(() => {
    return stockBalances.filter(b => b.status === 'out_of_stock').length;
  }, [stockBalances]);

  const totalValuation = useMemo(() => {
    if (!canSeeAmounts) return 0;
    return filteredBalances.reduce((sum, b) => {
      const rate = rateMap[b.materialId] || 0;
      return sum + (Math.max(0, b.inStock) * rate);
    }, 0);
  }, [filteredBalances, rateMap, canSeeAmounts]);

  // Row click handler: opens history drawer
  const handleRowClick = (matId: string) => {
    const mat = materials.find(m => m.id === matId);
    const bal = stockBalances.find(b => b.materialId === matId);
    if (mat && bal) {
      setHistorySelectedMaterial({ material: mat, balance: bal });
      setIsHistoryDrawerOpen(true);
    }
  };

  // Catalogue Handlers
  const handleOpenAddMaterial = (catId?: string) => {
    setEditingMaterial(null);
    setFormCategoryId(catId || (categories[0]?.id ?? ''));
    setFormName('');
    setFormUnit('sheet');
    setFormShadeCode('');
    setFormLowStockThreshold('5');
    setFormRate('');
    setIsAddMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (mat: Material) => {
    setEditingMaterial(mat);
    setFormCategoryId(mat.categoryId);
    setFormName(mat.name);
    setFormUnit(mat.unit);
    setFormShadeCode(mat.shadeCode || '');
    setFormLowStockThreshold(mat.lowStockThreshold.toString());
    setFormRate(mat.rate ? mat.rate.toString() : (rateMap[mat.id]?.toString() || ''));
    setIsAddMaterialModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId) return;

    try {
      const effectiveStudioId = studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const parsedRate = formRate ? parseFloat(formRate) : undefined;
      const parsedThreshold = parseInt(formLowStockThreshold) || 5;

      if (editingMaterial) {
        await stockService.updateMaterial(editingMaterial.id, {
          categoryId: formCategoryId,
          name: formName.trim(),
          unit: formUnit.trim().toLowerCase(),
          shadeCode: formShadeCode.trim() || undefined,
          lowStockThreshold: parsedThreshold,
          rate: parsedRate,
        });
      } else {
        await stockService.createMaterial({
          studioId: effectiveStudioId,
          categoryId: formCategoryId,
          name: formName.trim(),
          unit: formUnit.trim().toLowerCase(),
          shadeCode: formShadeCode.trim() || undefined,
          lowStockThreshold: parsedThreshold,
          rate: parsedRate,
        });
      }

      setIsAddMaterialModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Failed to save material:', err);
    }
  };

  const handleDeleteMaterial = async (mat: Material) => {
    const hasMovements = movements.some(m => m.materialId === mat.id);
    const confirmMsg = hasMovements
      ? `Material "${mat.name}" has stock movements logged in projects. Deleting it will remove it from future selections. Proceed?`
      : `Delete "${mat.name}" from catalogue?`;

    if (confirm(confirmMsg)) {
      try {
        await stockService.deleteMaterial(mat.id);
        await loadData();
      } catch (err) {
        console.error('Failed to delete material:', err);
      }
    }
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setCategoryFormName('');
    setCategoryFormTrade('');
    setIsAddCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormName.trim()) return;

    try {
      const effectiveStudioId = studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      await stockService.createCategory({
        studioId: effectiveStudioId,
        name: categoryFormName.trim(),
        trade: categoryFormTrade ? (categoryFormTrade as TradeType) : undefined,
      });

      setIsAddCategoryModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const handleOpenRenameCategory = (cat: Category) => {
    setRenamingCategory(cat);
    setCategoryFormName(cat.name);
  };

  const handleSaveRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingCategory || !categoryFormName.trim()) return;

    try {
      await stockService.updateCategory(renamingCategory.id, {
        name: categoryFormName.trim(),
      });
      setRenamingCategory(null);
      await loadData();
    } catch (err) {
      console.error('Failed to rename category:', err);
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...categories];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    try {
      await stockService.reorderCategories(reordered);
      await loadData();
    } catch (err) {
      console.error('Failed to reorder categories:', err);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const matsInCat = materials.filter(m => m.categoryId === cat.id);
    if (matsInCat.length > 0) {
      alert(`Cannot delete category "${cat.name}" because it contains ${matsInCat.length} materials. Reassign or delete those materials first.`);
      return;
    }

    if (confirm(`Delete category "${cat.name}"?`)) {
      try {
        await stockService.deleteCategory(cat.id);
        await loadData();
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  // Group materials by category for the Catalogue tab
  const groupedCatalogue = useMemo(() => {
    return categories.map(cat => ({
      category: cat,
      materials: materials.filter(m => m.categoryId === cat.id),
    }));
  }, [categories, materials]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. Header with exactly ONE primary action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-ink tracking-tight">
            Inventory
          </h1>
          <p className="text-sm text-muted mt-1">
            Materials in stock across all sites and master catalogue
          </p>
        </div>

        {/* The single primary button on /inventory */}
        <button
          type="button"
          onClick={() => setIsReceivedDrawerOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span>Record material received</span>
        </button>
      </div>

      {/* 2. Navigation Tabs (Stock vs Catalogue) */}
      <div className="flex items-center gap-6 border-b border-line text-sm font-medium">
        <button
          type="button"
          onClick={() => handleTabChange('stock')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'stock'
              ? 'border-ink text-ink font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stock</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sand/60 text-ink-2">
            {materials.length}
          </span>
          {totalRunningLow > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber" title={`${totalRunningLow} items running low`} />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('catalogue')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'catalogue'
              ? 'border-ink text-ink font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catalogue</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sand/60 text-ink-2">
            {categories.length} categories
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STOCK VIEW                                       */}
      {/* ======================================================== */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Site Selector, Category Chips, Status Filters & Search */}
          <div className="space-y-4">
            
            {/* Top Row: Site Selector & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Site selector dropdown */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase tracking-wider text-muted font-medium whitespace-nowrap">
                  Site:
                </span>
                <select
                  value={selectedSiteId}
                  onChange={e => setSelectedSiteId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-line bg-paper text-xs sm:text-sm font-medium text-ink focus:outline-none focus:border-ink shadow-xs transition-colors"
                >
                  <option value="all">All sites (Combined)</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search material, shade, or code..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-line bg-paper text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink shadow-xs transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: Category Chips & Status Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1 border-t border-line/50">
              
              {/* Category chips scrollable */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-ink text-paper shadow-xs'
                      : 'bg-paper text-muted hover:text-ink border border-line'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-ink text-paper shadow-xs'
                        : 'bg-paper text-muted hover:text-ink border border-line'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Status filter chips: All · Running low · Out of stock */}
              <div className="flex items-center gap-1.5 shrink-0 self-start lg:self-auto">
                <span className="text-[11px] text-muted font-medium uppercase tracking-wider mr-1">
                  Status:
                </span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === 'all'
                      ? 'bg-ink text-paper shadow-xs'
                      : 'bg-paper text-muted hover:text-ink border border-line'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('running_low')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    statusFilter === 'running_low'
                      ? 'bg-amber text-paper shadow-xs'
                      : 'bg-amber-soft/50 text-amber border border-amber/30 hover:border-amber/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                  <span>Running low</span>
                  {totalRunningLow > 0 && (
                    <span className="text-[10px] opacity-90 tabular-nums font-semibold">({totalRunningLow})</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('out_of_stock')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    statusFilter === 'out_of_stock'
                      ? 'bg-rust text-paper shadow-xs'
                      : 'bg-rust-soft/50 text-rust border border-rust/30 hover:border-rust/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rust" />
                  <span>Out of stock</span>
                  {totalOutOfStock > 0 && (
                    <span className="text-[10px] opacity-90 tabular-nums font-semibold">({totalOutOfStock})</span>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Active site notice banner when single site is selected */}
          {selectedSiteId !== 'all' && (
            <div className="p-3 rounded-xl bg-ivory border border-line flex items-center justify-between text-xs text-ink-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted shrink-0" />
                <span>
                  Showing stock for <strong>{projects.find(p => p.id === selectedSiteId)?.name}</strong> only.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSiteId('all')}
                className="text-xs text-muted hover:text-ink underline"
              >
                Reset to all sites
              </button>
            </div>
          )}

          {/* Stock Table Card */}
          <div className="bg-paper border border-line rounded-card overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-ivory/60 text-muted uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4 font-semibold">Material</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Unit</th>
                    <th className="py-3 px-4 font-semibold text-right">
                      {selectedSiteId === 'all' ? 'In Stock (All sites)' : 'In Stock'}
                    </th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    {canSeeAmounts && (
                      <>
                        <th className="py-3 px-4 font-semibold text-right">Unit Rate</th>
                        <th className="py-3 px-4 font-semibold text-right">Total Value</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {filteredBalances.length === 0 ? (
                    <tr>
                      <td colSpan={canSeeAmounts ? 7 : 5} className="py-12 text-center text-muted">
                        No materials found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBalances.map(balance => {
                      const mat = materials.find(m => m.id === balance.materialId);
                      if (!mat) return null;

                      const isOut = balance.status === 'out_of_stock';
                      const isLow = balance.status === 'running_low';
                      const siteBreakdown = materialSiteBreakdowns.get(mat.id) || [];
                      const rate = rateMap[mat.id] || 0;
                      const lineValuation = Math.max(0, balance.inStock) * rate;

                      const isBreakdownOpen = activeBreakdownMaterialId === mat.id;

                      return (
                        <tr
                          key={balance.materialId}
                          onClick={() => handleRowClick(balance.materialId)}
                          className="hover:bg-ivory/40 cursor-pointer transition-colors group"
                        >
                          {/* Material Name & Shade */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-ink group-hover:text-olive transition-colors text-sm">
                              {balance.materialName}
                            </div>
                            {balance.shadeCode && (
                              <div className="text-[11px] text-muted font-normal mt-0.5">
                                Shade / Code: <span className="text-ink-2 font-medium">{balance.shadeCode}</span>
                              </div>
                            )}
                          </td>

                          {/* Category Badge */}
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-sand/50 text-ink-2">
                              {balance.categoryName}
                            </span>
                          </td>

                          {/* Unit */}
                          <td className="py-3 px-4 text-muted capitalize">
                            {balance.unit}
                          </td>

                          {/* In Stock with Per-site Hover/Tap breakdown */}
                          <td 
                            className="py-3 px-4 text-right relative"
                            onClick={(e) => {
                              // If on all sites, allow toggling the breakdown popover on tap
                              if (selectedSiteId === 'all') {
                                e.stopPropagation();
                                setActiveBreakdownMaterialId(isBreakdownOpen ? null : mat.id);
                              }
                            }}
                          >
                            <div className="inline-flex items-center gap-1.5 relative group/breakdown">
                              <span className={`font-serif text-sm font-medium tabular-nums ${
                                isOut ? 'text-rust font-semibold' : isLow ? 'text-amber font-semibold' : 'text-ink'
                              }`}>
                                {balance.inStock}
                              </span>
                              <span className="text-[11px] text-muted">{balance.unit}</span>

                              {/* Per-site breakdown indicator icon when "All sites" selected */}
                              {selectedSiteId === 'all' && (
                                <button
                                  type="button"
                                  className="w-4 h-4 rounded-full bg-sand/60 text-ink-2 hover:bg-sand flex items-center justify-center text-[10px] ml-0.5"
                                  title="View per-site breakdown"
                                >
                                  i
                                </button>
                              )}

                              {/* Per-site Breakdown Tooltip / Popover (hover or tapped) */}
                              {selectedSiteId === 'all' && (
                                <div 
                                  className={`absolute right-0 top-full mt-1.5 z-30 w-56 p-3 rounded-xl bg-paper border border-line shadow-xl text-left transition-all ${
                                    isBreakdownOpen ? 'block' : 'hidden group-hover/breakdown:block'
                                  }`}
                                  onClick={e => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-between border-b border-line pb-1.5 mb-2">
                                    <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                                      Per-site Stock
                                    </span>
                                    {isBreakdownOpen && (
                                      <button 
                                        type="button"
                                        onClick={() => setActiveBreakdownMaterialId(null)}
                                        className="text-muted hover:text-ink"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="space-y-1.5 text-xs">
                                    {siteBreakdown.map(item => (
                                      <div key={item.project.id} className="flex items-center justify-between">
                                        <span className="text-ink truncate max-w-[120px]">
                                          {item.project.name}
                                        </span>
                                        <span className={`tabular-nums font-medium ${
                                          item.inStock <= 0 ? 'text-rust' : item.inStock <= mat.lowStockThreshold ? 'text-amber' : 'text-ink-2'
                                        }`}>
                                          {item.inStock} {mat.unit}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            {balance.hasOveruse ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rust-soft text-rust border border-rust/30">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Overused by {balance.overuseQty}</span>
                              </span>
                            ) : isOut ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rust-soft text-rust border border-rust/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-rust" />
                                <span>Out of stock</span>
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-soft text-amber border border-amber/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                                <span>Running low · {balance.inStock} left</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-olive-soft text-olive border border-olive/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                                <span>In stock</span>
                              </span>
                            )}
                          </td>

                          {/* Unit Rate (Owner / Manager-if-allowed) */}
                          {canSeeAmounts && (
                            <td className="py-3 px-4 text-right font-medium text-ink-2 tabular-nums">
                              {rate > 0 ? (
                                <span>{formatCurrencyINR(rate)} <span className="text-[10px] text-muted">/{balance.unit}</span></span>
                              ) : (
                                <span className="text-muted text-[11px]">—</span>
                              )}
                            </td>
                          )}

                          {/* Total Valuation (Owner / Manager-if-allowed) */}
                          {canSeeAmounts && (
                            <td className="py-3 px-4 text-right font-serif font-medium text-ink tabular-nums text-sm">
                              {lineValuation > 0 ? (
                                formatCurrencyINR(lineValuation)
                              ) : (
                                <span className="text-muted text-[11px]">—</span>
                              )}
                            </td>
                          )}

                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Table Footer with Valuation Summary */}
                {canSeeAmounts && filteredBalances.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-line bg-ivory/50 font-medium">
                      <td colSpan={5} className="py-3.5 px-4 text-right text-xs uppercase tracking-wider text-muted font-medium">
                        Filtered Inventory Valuation:
                      </td>
                      <td colSpan={2} className="py-3.5 px-4 text-right font-serif text-base font-medium text-ink tabular-nums">
                        {formatCurrencyINR(totalValuation)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CATALOGUE MANAGEMENT                             */}
      {/* ======================================================== */}
      {activeTab === 'catalogue' && (
        <div className="space-y-8">
          
          {/* Catalogue Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-paper border border-line">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-medium text-ink">
                Master Material Catalogue
              </h3>
              <p className="text-xs text-muted">
                Manage categories, material specifications, default units, and reorder levels
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Excel Import Mock Button */}
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-all shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-muted" />
                <span>Import from Excel</span>
              </button>

              {/* Add Category Button */}
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-muted" />
                <span>Add category</span>
              </button>

              {/* Add Material Button */}
              <button
                type="button"
                onClick={() => handleOpenAddMaterial()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 transition-all shadow-soft"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add material</span>
              </button>
            </div>
          </div>

          {/* Grouped Catalogue by Category */}
          <div className="space-y-6">
            {groupedCatalogue.map(({ category, materials: catMats }, catIdx) => (
              <div 
                key={category.id}
                className="bg-paper border border-line rounded-card overflow-hidden shadow-card"
              >
                {/* Category Header Bar with Reorder & Rename */}
                <div className="p-4 bg-ivory/60 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Reorder Buttons (Move Up / Down) */}
                    <div className="flex items-center border border-line rounded-lg bg-paper p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveCategory(catIdx, 'up')}
                        disabled={catIdx === 0}
                        className="p-1 rounded text-muted hover:text-ink hover:bg-sand/40 disabled:opacity-25 transition-colors"
                        title="Move category up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCategory(catIdx, 'down')}
                        disabled={catIdx === categories.length - 1}
                        className="p-1 rounded text-muted hover:text-ink hover:bg-sand/40 disabled:opacity-25 transition-colors"
                        title="Move category down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-lg font-medium text-ink">
                          {category.name}
                        </h4>
                        {category.trade && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand/60 text-ink-2 uppercase tracking-wider">
                            {category.trade}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted">
                        {catMats.length} material{catMats.length === 1 ? '' : 's'} defined
                      </span>
                    </div>
                  </div>

                  {/* Category Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenRenameCategory(category)}
                      className="px-2.5 py-1 rounded-lg border border-line bg-paper text-xs text-muted hover:text-ink transition-colors flex items-center gap-1"
                      title="Rename category"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Rename</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="p-1.5 rounded-lg border border-line bg-paper text-muted hover:text-rust transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddMaterial(category.id)}
                      className="px-2.5 py-1 rounded-lg bg-sand/60 text-ink text-xs font-medium hover:bg-sand transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to {category.name}</span>
                    </button>
                  </div>
                </div>

                {/* Materials Table within Category */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line/60 bg-paper text-muted uppercase tracking-wider text-[10px] font-semibold">
                        <th className="py-2.5 px-4 font-semibold">Material Name</th>
                        <th className="py-2.5 px-4 font-semibold">Shade / Code</th>
                        <th className="py-2.5 px-4 font-semibold">Unit</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Low Stock Alert Level</th>
                        {canSeeAmounts && (
                          <th className="py-2.5 px-4 font-semibold text-right">Estimated Rate</th>
                        )}
                        <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/40">
                      {catMats.length === 0 ? (
                        <tr>
                          <td colSpan={canSeeAmounts ? 6 : 5} className="py-6 text-center text-muted italic text-xs">
                            No materials in this category yet. Click "Add to {category.name}" to add one.
                          </td>
                        </tr>
                      ) : (
                        catMats.map(mat => {
                          const displayRate = mat.rate || rateMap[mat.id] || 0;

                          return (
                            <tr key={mat.id} className="hover:bg-ivory/30 transition-colors">
                              <td className="py-2.5 px-4 font-medium text-ink">
                                {mat.name}
                              </td>
                              <td className="py-2.5 px-4 text-muted">
                                {mat.shadeCode ? (
                                  <span className="font-medium text-ink-2">{mat.shadeCode}</span>
                                ) : (
                                  <span>—</span>
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-ink-2 capitalize">
                                {mat.unit}
                              </td>
                              <td className="py-2.5 px-4 text-right font-medium text-amber tabular-nums">
                                &le; {mat.lowStockThreshold} {mat.unit}
                              </td>
                              {canSeeAmounts && (
                                <td className="py-2.5 px-4 text-right font-medium text-ink-2 tabular-nums">
                                  {displayRate > 0 ? (
                                    <span>{formatCurrencyINR(displayRate)}</span>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>
                              )}
                              <td className="py-2.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditMaterial(mat)}
                                    className="p-1 rounded text-muted hover:text-ink hover:bg-sand/40 transition-colors"
                                    title="Edit material"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMaterial(mat)}
                                    className="p-1 rounded text-muted hover:text-rust hover:bg-rust-soft/50 transition-colors"
                                    title="Delete material"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWERS & MODALS                                         */}
      {/* ======================================================== */}

      {/* 1. Record Material Received Drawer */}
      <RecordMaterialReceivedDrawer
        isOpen={isReceivedDrawerOpen}
        onClose={() => setIsReceivedDrawerOpen(false)}
        onSuccess={() => {
          loadData();
        }}
        initialProjectId={selectedSiteId !== 'all' ? selectedSiteId : undefined}
      />

      {/* 2. Material Stock History Drawer */}
      <MaterialHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => {
          setIsHistoryDrawerOpen(false);
          setHistorySelectedMaterial(null);
        }}
        material={historySelectedMaterial?.material || null}
        balance={historySelectedMaterial?.balance || null}
        movements={movements}
        projectName={
          selectedSiteId === 'all' 
            ? 'All Sites' 
            : projects.find(p => p.id === selectedSiteId)?.name || 'This Site'
        }
      />

      {/* 3. Import from Excel Mock Modal */}
      <ImportExcelMockModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* 4. Add / Edit Material Modal */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setIsAddMaterialModalOpen(false)} 
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-serif text-xl font-medium text-ink">
                  {editingMaterial ? 'Edit Material' : 'Add Material to Catalogue'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-line bg-paper flex items-center justify-center text-muted hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
                {/* Category */}
                <div className="space-y-1">
                  <label className="font-medium text-ink block">Category <span className="text-rust">*</span></label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink font-medium focus:outline-none focus:border-ink"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="font-medium text-ink block">Material Name <span className="text-rust">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plywood 18mm BWP, Wall putty 20kg"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                  />
                </div>

                {/* Unit & Shade */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-ink block">Unit of measure <span className="text-rust">*</span></label>
                    <select
                      value={formUnit}
                      onChange={e => setFormUnit(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                    >
                      <option value="sheet">sheet</option>
                      <option value="sq ft">sq ft</option>
                      <option value="piece">piece</option>
                      <option value="bag">bag</option>
                      <option value="box">box</option>
                      <option value="coil">coil</option>
                      <option value="length">length</option>
                      <option value="tin">tin</option>
                      <option value="kg">kg</option>
                      <option value="litre">litre</option>
                      <option value="pair">pair</option>
                      <option value="roll">roll</option>
                      <option value="brass">brass</option>
                      <option value="set">set</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-ink block">Shade / Code (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Oak 5512, Teak"
                      value={formShadeCode}
                      onChange={e => setFormShadeCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>

                {/* Low Stock Alert Level & Estimated Rate */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-ink block">
                      Low-stock level <span className="text-rust">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formLowStockThreshold}
                      onChange={e => setFormLowStockThreshold(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                    />
                    <span className="text-[10px] text-muted block">Triggers "Running low" warning</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-ink block">
                      Default unit rate (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2800"
                      value={formRate}
                      onChange={e => setFormRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                    />
                    <span className="text-[10px] text-muted block">Visible to owner only</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddMaterialModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-sand/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-ink text-paper font-medium hover:bg-ink-2 shadow-soft transition-all"
                  >
                    {editingMaterial ? 'Save changes' : 'Add to catalogue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setIsAddCategoryModalOpen(false)} 
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-serif text-lg font-medium text-ink">
                  Add Material Category
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="w-7 h-7 rounded-lg border border-line flex items-center justify-center text-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-ink block">Category Name <span className="text-rust">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Glass & Mirrors, Hardware"
                    value={categoryFormName}
                    onChange={e => setCategoryFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-ink block">Associated Trade (optional)</label>
                  <select
                    value={categoryFormTrade}
                    onChange={e => setCategoryFormTrade(e.target.value as TradeType | '')}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="">None / General</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="electrical">Electrical</option>
                    <option value="civil">Civil</option>
                    <option value="painting">Painting</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="false_ceiling">False ceiling</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-line text-ink hover:bg-sand/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-ink text-paper font-medium hover:bg-ink-2 shadow-soft"
                  >
                    Create category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 6. Rename Category Modal */}
      {renamingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setRenamingCategory(null)} 
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-serif text-lg font-medium text-ink">
                  Rename Category
                </h3>
                <button
                  type="button"
                  onClick={() => setRenamingCategory(null)}
                  className="w-7 h-7 rounded-lg border border-line flex items-center justify-center text-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveRenameCategory} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-ink block">Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryFormName}
                    onChange={e => setCategoryFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRenamingCategory(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-line text-ink hover:bg-sand/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-ink text-paper font-medium hover:bg-ink-2 shadow-soft"
                  >
                    Save name
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
