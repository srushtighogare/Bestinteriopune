import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  Archive, 
  Check, 
  AlertCircle, 
  X,
  Package
} from 'lucide-react';
import { Category, Material, StockMovement, TradeType, Studio } from '../../types';
import { stockService } from '../../services/stockService';
import { settingsService } from '../../services/settingsService';
import { getItem, setItem, STORAGE_KEYS } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { formatCurrencyINR } from '../../utils/calculations';
import { ImportExcelMockModal } from '../inventory/ImportExcelMockModal';

interface CatalogueManagementProps {
  onUpdated?: () => void;
}

export const CatalogueManagement: React.FC<CatalogueManagementProps> = ({ onUpdated }) => {
  const { role } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Permissions for rate visibility
  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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

  const loadData = async () => {
    try {
      const [cats, mats, moves, st] = await Promise.all([
        stockService.listCategories(),
        stockService.listMaterials(true),
        stockService.getMovements(),
        settingsService.getStudio(),
      ]);
      setCategories(cats);
      setMaterials(mats);
      setMovements(moves);
      setStudio(st);
    } catch (err) {
      console.error('Failed to load catalogue data:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail || detail.key === STORAGE_KEYS.CATEGORIES || detail.key === STORAGE_KEYS.MATERIALS || detail.key === STORAGE_KEYS.STUDIO) {
        loadData();
      }
    };

    window.addEventListener('studioos_storage_change', handleStorageChange);
    window.addEventListener('studioos_storage_reset', handleStorageChange);
    return () => {
      window.removeEventListener('studioos_storage_change', handleStorageChange);
      window.removeEventListener('studioos_storage_reset', handleStorageChange);
    };
  }, []);

  // Group materials by category
  const groupedCatalogue = useMemo(() => {
    return categories.map(cat => ({
      category: cat,
      materials: materials.filter(m => m.categoryId === cat.id),
    }));
  }, [categories, materials]);

  // Reorder Category
  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    newCategories.forEach((cat, idx) => {
      cat.order = idx + 1;
    });

    setCategories(newCategories);
    setItem(STORAGE_KEYS.CATEGORIES, newCategories);
    if (onUpdated) onUpdated();
  };

  // Open Add Material
  const handleOpenAddMaterial = (preselectedCatId?: string) => {
    setEditingMaterial(null);
    setFormCategoryId(preselectedCatId || categories[0]?.id || '');
    setFormName('');
    setFormUnit('sheet');
    setFormShadeCode('');
    setFormLowStockThreshold('5');
    setFormRate('');
    setIsAddMaterialModalOpen(true);
  };

  // Open Edit Material
  const handleOpenEditMaterial = (mat: Material) => {
    setEditingMaterial(mat);
    setFormCategoryId(mat.categoryId);
    setFormName(mat.name);
    setFormUnit(mat.unit);
    setFormShadeCode(mat.shadeCode || '');
    setFormLowStockThreshold(mat.lowStockThreshold.toString());
    setFormRate(mat.rate ? mat.rate.toString() : '');
    setIsAddMaterialModalOpen(true);
  };

  // Save Material (Add or Edit)
  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId) return;

    const rateNum = formRate ? parseFloat(formRate) : undefined;
    const thresholdNum = parseInt(formLowStockThreshold, 10) || 5;

    if (editingMaterial) {
      await stockService.updateMaterial(editingMaterial.id, {
        categoryId: formCategoryId,
        name: formName.trim(),
        unit: formUnit,
        shadeCode: formShadeCode.trim() || undefined,
        lowStockThreshold: thresholdNum,
        rate: rateNum,
      });
    } else {
      await stockService.createMaterial({
        studioId: studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        categoryId: formCategoryId,
        name: formName.trim(),
        unit: formUnit,
        shadeCode: formShadeCode.trim() || undefined,
        lowStockThreshold: thresholdNum,
        rate: rateNum,
      });
    }

    setIsAddMaterialModalOpen(false);
    await loadData();
    if (onUpdated) onUpdated();
  };

  // Archive or Delete Material
  const handleDeleteOrArchiveMaterial = async (mat: Material) => {
    const hasMovements = movements.some(m => m.materialId === mat.id);
    if (hasMovements) {
      const confirmArchive = window.confirm(
        `"${mat.name}" has stock movements logged on sites, so it cannot be deleted permanently.\n\nWould you like to Archive it instead? This hides it from pickers while preserving all past project history.`
      );
      if (confirmArchive) {
        await stockService.updateMaterial(mat.id, { isArchived: true });
        await loadData();
        if (onUpdated) onUpdated();
      }
      return;
    }

    const confirmDelete = window.confirm(`Permanently remove "${mat.name}" from the catalogue?`);
    if (confirmDelete) {
      await stockService.deleteMaterial(mat.id);
      await loadData();
      if (onUpdated) onUpdated();
    }
  };

  // Restore Archived Material
  const handleUnarchiveMaterial = async (mat: Material) => {
    await stockService.updateMaterial(mat.id, { isArchived: false });
    await loadData();
    if (onUpdated) onUpdated();
  };

  // Open Add Category
  const handleOpenAddCategory = () => {
    setCategoryFormName('');
    setCategoryFormTrade('');
    setIsAddCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormName.trim()) return;

    await stockService.createCategory({
      studioId: studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: categoryFormName.trim(),
      trade: categoryFormTrade || undefined,
    });

    setIsAddCategoryModalOpen(false);
    await loadData();
    if (onUpdated) onUpdated();
  };

  // Rename Category
  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingCategory || !categoryFormName.trim()) return;

    await stockService.updateCategory(renamingCategory.id, {
      name: categoryFormName.trim(),
      trade: categoryFormTrade || undefined,
    });

    setRenamingCategory(null);
    await loadData();
    if (onUpdated) onUpdated();
  };

  return (
    <div className="space-y-6">
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
                {/* Reorder Buttons */}
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRenamingCategory(category);
                    setCategoryFormName(category.name);
                    setCategoryFormTrade(category.trade || '');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3 text-muted" />
                  <span>Rename</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddMaterial(category.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add item</span>
                </button>
              </div>
            </div>

            {/* Materials Table */}
            {catMats.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted">
                No materials defined in this category yet. Click "Add item" to add one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-ivory/30 text-muted uppercase text-[10px] tracking-wider select-none">
                      <th className="py-2.5 px-4 font-medium">Material</th>
                      <th className="py-2.5 px-3 font-medium">Shade / Code</th>
                      <th className="py-2.5 px-3 font-medium">Unit</th>
                      <th className="py-2.5 px-3 font-medium">Low-Stock Level</th>
                      {canSeeAmounts && (
                        <th className="py-2.5 px-3 font-medium">Default Rate</th>
                      )}
                      <th className="py-2.5 px-3 font-medium">Status</th>
                      <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {catMats.map(mat => (
                      <tr key={mat.id} className={`hover:bg-sand/15 transition-colors ${mat.isArchived ? 'opacity-50 bg-sand/10' : ''}`}>
                        <td className="py-3 px-4 font-medium text-ink">
                          {mat.name}
                        </td>
                        <td className="py-3 px-3 text-muted">
                          {mat.shadeCode || '—'}
                        </td>
                        <td className="py-3 px-3 text-ink-2 font-mono">
                          {mat.unit}
                        </td>
                        <td className="py-3 px-3 text-ink-2 font-mono">
                          {mat.lowStockThreshold} {mat.unit}
                        </td>
                        {canSeeAmounts && (
                          <td className="py-3 px-3 font-mono text-ink">
                            {mat.rate ? formatCurrencyINR(mat.rate) : '—'}
                          </td>
                        )}
                        <td className="py-3 px-3">
                          {mat.isArchived ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand/80 text-muted">
                              Archived
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-olive-soft text-olive">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {mat.isArchived ? (
                              <button
                                type="button"
                                onClick={() => handleUnarchiveMaterial(mat)}
                                className="px-2 py-1 rounded text-xs text-olive hover:underline"
                              >
                                Restore
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMaterial(mat)}
                                  className="w-7 h-7 rounded-lg border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors"
                                  title="Edit material"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrArchiveMaterial(mat)}
                                  className="w-7 h-7 rounded-lg border border-line bg-paper flex items-center justify-center text-muted hover:text-rust hover:bg-rust-soft transition-colors"
                                  title="Delete or archive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Excel Import Modal */}
      <ImportExcelMockModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Add / Edit Material Modal */}
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

      {/* Add Category Modal */}
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

      {/* Rename Category Modal */}
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

              <form onSubmit={handleRenameCategory} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-ink block">Category Name <span className="text-rust">*</span></label>
                  <input
                    type="text"
                    required
                    value={categoryFormName}
                    onChange={e => setCategoryFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
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