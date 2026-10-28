import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Minus, 
  Plus, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Layers, 
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { stockService } from '../../services/stockService';
import { projectsService } from '../../services/projectsService';
import { Category, Material, MaterialStockBalance, Project, Room } from '../../types';
import { getActiveSiteProjectId, setActiveSiteProjectId } from '../../utils/siteState';
import { getSiteLanguage, SiteLanguage, t } from '../../utils/i18n';

export const MaterialUsedPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stockBalances, setStockBalances] = useState<Map<string, number>>(new Map());

  // Active Room Selection
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedRoomName, setSelectedRoomName] = useState<string>('Living Room');

  // Quantities entered per material: { [materialId]: number }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Expanded Categories Accordion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Form Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const handleLang = () => setLang(getSiteLanguage());
    window.addEventListener('studioos_language_change', handleLang);
    return () => window.removeEventListener('studioos_language_change', handleLang);
  }, []);

  // Load Projects, Categories, Materials, and Stock Balances
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProjects, catList, matList] = await Promise.all([
          projectsService.list(),
          stockService.listCategories(),
          stockService.listMaterials(),
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
        setMaterials(matList);

        // Determine Active Project
        const savedProjectId = getActiveSiteProjectId();
        const active = userProjects.find((p) => p.id === savedProjectId) || userProjects[0];
        const projId = active ? active.id : '';
        setSelectedProjectId(projId);

        // Set Rooms from active project
        if (active && active.rooms && active.rooms.length > 0) {
          setSelectedRoomId(active.rooms[0].id);
          setSelectedRoomName(active.rooms[0].name);
        } else {
          setSelectedRoomId('general');
          setSelectedRoomName('Living Room');
        }

        // Compute stock balances for this project
        if (projId) {
          const balances = await stockService.getStockBalances(projId);
          const map = new Map<string, number>();
          balances.forEach((b) => map.set(b.materialId, b.inStock));
          setStockBalances(map);
        }

        // Expand worker's trade category by default!
        const initialExpanded = new Set<string>();
        if (role === 'worker' && currentUser?.trade) {
          catList.forEach((c) => {
            if (c.trade === currentUser.trade || c.name.toLowerCase().includes(currentUser.trade || '')) {
              initialExpanded.add(c.id);
            }
          });
        }
        // If nothing matched or supervisor, expand the first category
        if (initialExpanded.size === 0 && catList.length > 0) {
          initialExpanded.add(catList[0].id);
        }
        setExpandedCategories(initialExpanded);
      } catch (err) {
        console.error('Failed to load material used data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id, role]);

  // Update stock balances whenever selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchBalances = async () => {
      const balances = await stockService.getStockBalances(selectedProjectId);
      const map = new Map<string, number>();
      balances.forEach((b) => map.set(b.materialId, b.inStock));
      setStockBalances(map);

      // Update room selection if project changed
      const proj = projects.find((p) => p.id === selectedProjectId);
      if (proj && proj.rooms && proj.rooms.length > 0) {
        setSelectedRoomId(proj.rooms[0].id);
        setSelectedRoomName(proj.rooms[0].name);
      }
    };
    fetchBalances();
  }, [selectedProjectId, projects]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleQuantityChange = (materialId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[materialId] || 0;
      const nextVal = Math.max(0, current + delta);
      const updated = { ...prev };
      if (nextVal === 0) {
        delete updated[materialId];
      } else {
        updated[materialId] = nextVal;
      }
      return updated;
    });
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoomId(room.id);
    setSelectedRoomName(room.name);
  };

  // Summary of selected items
  const selectedEntries = useMemo(() => {
    return Object.entries(quantities).filter(([_, qty]) => qty > 0);
  }, [quantities]);

  const totalSelectedUnits = useMemo(() => {
    return selectedEntries.reduce((sum, [_, qty]) => sum + qty, 0);
  }, [selectedEntries]);

  // Count items with over-stock warnings
  const overstockCount = useMemo(() => {
    let count = 0;
    selectedEntries.forEach(([matId, qty]) => {
      const available = stockBalances.get(matId) || 0;
      if (qty > available) count++;
    });
    return count;
  }, [selectedEntries, stockBalances]);

  // Submit Handler
  const handleSubmit = async () => {
    if (selectedEntries.length === 0) {
      setError('Please select at least one material.');
      return;
    }

    if (!selectedProjectId) {
      setError('Please select a site.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const effectiveStudioId = activeProject?.studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      // Record each used item in stockService
      for (const [materialId, qty] of selectedEntries) {
        const mat = materials.find((m) => m.id === materialId);
        await stockService.recordUsed({
          studioId: effectiveStudioId,
          projectId: selectedProjectId,
          materialId,
          quantity: qty,
          workerId: currentUser?.id || 'worker-id',
          workerName: currentUser?.name || 'Site Lead',
          roomId: selectedRoomId || undefined,
          roomName: selectedRoomName || undefined,
          note: `Logged from site app for ${selectedRoomName}`,
        });
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/app');
      }, 900);
    } catch (err: any) {
      console.error('Failed to log material used:', err);
      setError(err?.message || 'Failed to submit materials used.');
      setIsSubmitting(false);
    }
  };

  // Group materials by category
  const categoriesWithMaterials = useMemo(() => {
    return categories.map((cat) => {
      const catMaterials = materials.filter((m) => m.categoryId === cat.id && !m.isArchived);
      return {
        ...cat,
        materials: catMaterials,
      };
    }).filter((cat) => cat.materials.length > 0);
  }, [categories, materials]);

  return (
    <div className="space-y-4 max-w-md mx-auto pb-32">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">{t('used.title', lang)}</h2>
        <p className="text-xs text-muted">
          {t('used.subtitle', lang)}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rust-soft/60 border border-rust/30 text-xs text-rust flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Project Selector (if multiple) */}
      {projects.length > 1 ? (
        <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
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
        <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
          <span className="text-xs text-muted">Logging for site:</span>
          <span className="text-sm font-semibold text-ink">{activeProject?.name}</span>
        </div>
      )}

      {/* 2. Room Chips Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-muted">
            {t('used.room_area', lang)}
          </span>
          <span className="text-xs text-ink font-medium">{t('used.selected_room', lang)}: {selectedRoomName}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {activeProject?.rooms && activeProject.rooms.length > 0 ? (
            activeProject.rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleRoomSelect(room)}
                  className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 transition-all border flex items-center justify-center ${
                    isSelected
                      ? 'bg-ink text-paper border-ink shadow-xs'
                      : 'bg-paper text-ink border-line hover:bg-sand/30'
                  }`}
                >
                  {room.name}
                </button>
              );
            })
          ) : (
            <div className="flex items-center gap-2">
              {['Living Room', 'Kitchen', 'Master Bedroom', 'Balcony'].map((rName, idx) => {
                const isSelected = selectedRoomName === rName;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedRoomId(`custom-${idx}`);
                      setSelectedRoomName(rName);
                    }}
                    className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 transition-all border flex items-center justify-center ${
                      isSelected
                        ? 'bg-ink text-paper border-ink shadow-xs'
                        : 'bg-paper text-ink border-line hover:bg-sand/30'
                    }`}
                  >
                    {rName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Accordion & Materials */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[11px] uppercase font-semibold tracking-wider text-muted block px-1">
          Materials by Category
        </span>

        <div className="space-y-2">
          {categoriesWithMaterials.map((cat) => {
            const isExpanded = expandedCategories.has(cat.id);
            const isWorkerTrade =
              role === 'worker' &&
              currentUser?.trade &&
              (cat.trade === currentUser.trade || cat.name.toLowerCase().includes(currentUser.trade));

            // Count how many items in this category have quantities > 0
            const itemsInCatCount = cat.materials.reduce((sum, m) => {
              return sum + (quantities[m.id] ? 1 : 0);
            }, 0);

            return (
              <div 
                key={cat.id} 
                className="rounded-2xl bg-paper border border-line overflow-hidden shadow-xs"
              >
                {/* Accordion Header (Tap target >= 48px) */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full min-h-[52px] px-4 py-3 bg-paper hover:bg-sand/20 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{cat.name}</span>
                    {isWorkerTrade && (
                      <span className="text-[10px] font-semibold bg-olive-soft text-olive border border-olive/30 px-2 py-0.5 rounded-full">
                        Your trade
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {itemsInCatCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-ink text-paper text-[10px] font-semibold">
                        {itemsInCatCount} selected
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded Materials List */}
                {isExpanded && (
                  <div className="p-3.5 pt-1 border-t border-line/60 bg-ivory/40 space-y-3">
                    {cat.materials.map((mat) => {
                      const qty = quantities[mat.id] || 0;
                      const currentStock = stockBalances.get(mat.id) ?? 0;
                      const isOverStock = qty > currentStock;

                      return (
                        <div
                          key={mat.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            qty > 0
                              ? isOverStock
                                ? 'bg-amber-soft/40 border-amber/40 shadow-xs'
                                : 'bg-olive-soft/20 border-olive/30 shadow-xs'
                              : 'bg-paper border-line/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-ink truncate leading-tight">
                                {mat.name}
                              </p>
                              {mat.shadeCode && (
                                <p className="text-xs text-muted truncate mt-0.5">
                                  {mat.shadeCode}
                                </p>
                              )}
                              <p className="text-[11px] mt-1">
                                {currentStock > 0 ? (
                                  <span className="text-muted">
                                    In stock: <strong className="text-ink font-semibold">{currentStock}</strong> {mat.unit}{currentStock === 1 ? '' : 's'}
                                  </span>
                                ) : (
                                  <span className="text-rust font-medium">Out of stock (0 {mat.unit}s)</span>
                                )}
                              </p>
                            </div>

                            {/* Stepper with >= 48px tap targets */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(mat.id, -1)}
                                disabled={qty <= 0}
                                className="w-12 h-12 rounded-xl bg-ivory border border-line flex items-center justify-center text-ink disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all"
                                aria-label={`Decrease ${mat.name}`}
                              >
                                <Minus className="w-4 h-4" strokeWidth={2} />
                              </button>
                              <span className="w-11 text-center font-bold text-base text-ink tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(mat.id, 1)}
                                className="w-12 h-12 rounded-xl bg-ivory border border-line flex items-center justify-center text-ink active:scale-95 transition-all"
                                aria-label={`Increase ${mat.name}`}
                              >
                                <Plus className="w-4 h-4" strokeWidth={2} />
                              </button>
                            </div>
                          </div>

                          {/* Over-Stock Amber Warning (Allows Submit!) */}
                          {isOverStock && (
                            <div className="mt-2.5 p-2.5 rounded-lg bg-amber/15 border border-amber/30 text-[11px] text-ink flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />
                              <p className="leading-snug">
                                {lang === 'hi' 
                                  ? `स्टॉक में केवल ${currentStock} ${mat.unit} उपलब्ध है। यदि कोई डिलीवरी छूटी है, तो अपने सुपरवाइजर को बताएं।`
                                  : `Only ${currentStock} ${mat.unit}${currentStock === 1 ? '' : 's'} in stock. If a delivery is missing, tell your supervisor.`}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar ("N items · Submit") with 56px primary button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-paper/95 backdrop-blur-md border-t border-line max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2 px-1 text-xs">
          <span className="text-muted">
            {selectedEntries.length > 0 ? (
              <>
                <strong className="text-ink">{selectedEntries.length}</strong> material{selectedEntries.length === 1 ? '' : 's'} ({totalSelectedUnits} units) · {selectedRoomName}
              </>
            ) : (
              'No materials selected'
            )}
          </span>

          {overstockCount > 0 && (
            <span className="text-amber text-[11px] font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{overstockCount} over stock</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedEntries.length === 0 || isSubmitting || isSuccess}
          className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-semibold hover:bg-ink-2 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-float disabled:opacity-40"
        >
          {isSubmitting ? (
            <span className="inline-block w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-olive" />
              <span>Material used recorded!</span>
            </>
          ) : (
            <span>
              {selectedEntries.length > 0
                ? `${t('used.submit_button', lang)} (${selectedEntries.length})`
                : t('used.select_items', lang)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
