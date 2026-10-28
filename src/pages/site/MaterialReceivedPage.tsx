import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  FileText, 
  Calendar, 
  Package,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { stockService } from '../../services/stockService';
import { billsService } from '../../services/billsService';
import { projectsService } from '../../services/projectsService';
import { settingsService } from '../../services/settingsService';
import { Category, Material, Project, Vendor } from '../../types';
import { getActiveSiteProjectId } from '../../utils/siteState';
import { getSiteLanguage, SiteLanguage, t } from '../../utils/i18n';

interface ReceivedItemEntry {
  id: string;
  categoryId: string;
  materialId: string;
  quantity: number;
}

export const MaterialReceivedPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLang = () => setLang(getSiteLanguage());
    window.addEventListener('studioos_language_change', handleLang);
    return () => window.removeEventListener('studioos_language_change', handleLang);
  }, []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [billNumber, setBillNumber] = useState<string>('');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [hasNoBill, setHasNoBill] = useState<boolean>(false);

  // Items
  const [items, setItems] = useState<ReceivedItemEntry[]>([
    {
      id: crypto.randomUUID(),
      categoryId: '',
      materialId: '',
      quantity: 5,
    }
  ]);

  // Inline Vendor Quick Add
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check duplicate delivery
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const isWorker = role === 'worker';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProjects, catList, matList, venList] = await Promise.all([
          projectsService.list(),
          stockService.listCategories(),
          stockService.listMaterials(),
          billsService.listVendors(),
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
        setVendors(venList);

        // Active project selection
        const savedProjectId = getActiveSiteProjectId();
        const activeProj = userProjects.find((p) => p.id === savedProjectId) || userProjects[0];
        if (activeProj) {
          setSelectedProjectId(activeProj.id);
        }

        // Set default category: worker's trade category if worker, or first category
        let defaultCatId = catList.length > 0 ? catList[0].id : '';
        if (isWorker && currentUser?.trade) {
          const tradeCat = catList.find(
            (c) => c.trade === currentUser.trade || c.name.toLowerCase().includes(currentUser.trade || '')
          );
          if (tradeCat) defaultCatId = tradeCat.id;
        }

        const defaultMat = matList.find((m) => m.categoryId === defaultCatId);
        setItems([
          {
            id: crypto.randomUUID(),
            categoryId: defaultCatId,
            materialId: defaultMat ? defaultMat.id : '',
            quantity: 5,
          }
        ]);

        if (venList.length > 0) {
          setSelectedVendorId(venList[0].id);
        }
      } catch (err) {
        console.error('Failed to load received page data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id, role]);

  // Check duplicate delivery whenever project, vendor, or date changes
  useEffect(() => {
    const checkDuplicates = async () => {
      if (!selectedProjectId || !selectedVendorId || !billDate) {
        setDuplicateWarning(null);
        return;
      }

      try {
        const bills = await billsService.list(selectedProjectId);
        const targetMs = new Date(billDate).getTime();
        const existing = bills.find((b) => {
          if (b.vendorId !== selectedVendorId) return false;
          const bMs = new Date(b.date).getTime();
          return Math.abs(bMs - targetMs) <= 2 * 86400000;
        });

        if (existing) {
          setDuplicateWarning(
            `A delivery from ${existing.vendorName} was already recorded on ${existing.date} by ${existing.uploadedBy}. Check challan to avoid double-counting.`
          );
        } else {
          setDuplicateWarning(null);
        }
      } catch {
        setDuplicateWarning(null);
      }
    };

    checkDuplicates();
  }, [selectedProjectId, selectedVendorId, billDate]);

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
        setHasNoBill(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    setPhotoUrl('/bills/bill-sample-1.svg');
    setHasNoBill(false);
  };

  // Add Item
  const handleAddItem = () => {
    let defCatId = categories.length > 0 ? categories[0].id : '';
    if (isWorker && currentUser?.trade) {
      const tradeCat = categories.find(
        (c) => c.trade === currentUser.trade || c.name.toLowerCase().includes(currentUser.trade || '')
      );
      if (tradeCat) defCatId = tradeCat.id;
    }
    const defMat = materials.find((m) => m.categoryId === defCatId);
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        categoryId: defCatId,
        materialId: defMat ? defMat.id : '',
        quantity: 5,
      }
    ]);
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Update item field
  const handleItemChange = (id: string, field: 'categoryId' | 'materialId' | 'quantity', value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === 'categoryId') {
            const firstMatInCat = materials.find((m) => m.categoryId === value);
            return {
              ...item,
              categoryId: value,
              materialId: firstMatInCat ? firstMatInCat.id : '',
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Quick add vendor
  const handleCreateVendor = async () => {
    if (!newVendorName.trim()) return;
    try {
      const created = await billsService.createVendor(
        newVendorName.trim(),
        'General',
        newVendorPhone.trim() || undefined
      );
      setVendors((prev) => [...prev, created]);
      setSelectedVendorId(created.id);
      setIsAddingVendor(false);
      setNewVendorName('');
      setNewVendorPhone('');
    } catch (err) {
      console.error('Failed to create vendor:', err);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a site');
      return;
    }

    if (items.length === 0 || items.some((it) => !it.materialId || it.quantity <= 0)) {
      setError('Please select valid materials and quantities.');
      return;
    }

    if (!photoUrl && !hasNoBill) {
      setError('Please attach a photo of the bill/challan, or check "No challan received".');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const activeProj = projects.find((p) => p.id === selectedProjectId);
      const effectiveStudioId = activeProj?.studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const currentVendor = vendors.find((v) => v.id === selectedVendorId);

      const billItems = items.map((it) => {
        const mat = materials.find((m) => m.id === it.materialId);
        return {
          studioId: effectiveStudioId,
          materialId: it.materialId,
          materialName: mat ? (mat.shadeCode ? `${mat.name} (${mat.shadeCode})` : mat.name) : 'Material',
          categoryId: it.categoryId,
          quantity: it.quantity,
          unit: mat ? mat.unit : 'unit',
          rate: 0, // No rates on site app!
          amount: 0, // No amounts on site app!
          addToStock: true, // Creates received movement linked to this bill
        };
      });

      const fallbackBillNumber = billNumber.trim() || `CH-${Math.floor(1000 + Math.random() * 9000)}`;

      await billsService.upload({
        studioId: effectiveStudioId,
        projectId: selectedProjectId,
        vendorId: selectedVendorId || 'vendor-direct',
        vendorName: currentVendor ? currentVendor.name : 'Material Supplier',
        billNumber: fallbackBillNumber,
        date: billDate,
        photoUrl: photoUrl || '/bills/bill-sample-1.svg',
        uploadedBy: currentUser?.name || (isWorker ? 'Trade Lead' : 'Supervisor'),
        uploadedById: currentUser?.id || 'user-default',
        items: billItems,
        needsTradeLeadCheck: isWorker, // Worker deliveries get flagged for supervisor check
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/app');
      }, 900);
    } catch (err: any) {
      console.error('Failed to record delivery:', err);
      setError(err?.message || 'Failed to record delivery. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-5 max-w-md mx-auto pb-28">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">{t('recv.title', lang)}</h2>
        <p className="text-xs text-muted">
          {t('recv.subtitle', lang)}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rust-soft/60 border border-rust/30 text-xs text-rust flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Trade-Lead Notice */}
      {isWorker && (
        <div className="p-3.5 rounded-2xl bg-amber-soft/50 border border-amber/40 text-xs text-ink flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Recording as trade lead</p>
            <p className="text-muted text-[11px] mt-0.5 leading-snug">
              This delivery will be marked for your site supervisor to check on their next visit.
            </p>
          </div>
        </div>
      )}

      {/* Duplicate warning */}
      {duplicateWarning && (
        <div className="p-3.5 rounded-2xl bg-amber-soft/60 border border-amber/40 text-xs text-ink flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">{duplicateWarning}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Project Selector (if assigned to multiple) */}
        {projects.length > 1 ? (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
              Site / Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full h-12 px-3.5 rounded-2xl border border-line bg-paper text-sm font-medium text-ink focus:outline-none focus:border-ink transition-colors"
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
            <span className="text-xs text-muted">Delivery for:</span>
            <span className="text-sm font-semibold text-ink">{selectedProject?.name}</span>
          </div>
        )}

        {/* 2. Photo of Bill / Challan */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
            {t('recv.challan_photo', lang)}
          </label>

          {photoUrl ? (
            <div className="relative rounded-2xl border border-line bg-paper overflow-hidden p-2 text-center">
              <img
                src={photoUrl}
                alt="Delivery photo preview"
                className="w-full h-44 object-contain rounded-xl bg-ivory"
              />
              <div className="mt-2 flex items-center justify-between px-2">
                <span className="text-xs text-muted flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-olive" />
                  <span>Photo attached</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-xs font-medium text-rust hover:underline"
                >
                  Remove / Retake
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-line bg-paper/60 p-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand/40 flex items-center justify-center text-ink mx-auto">
                <Camera className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink">Take photo of challan</p>
                <p className="text-[11px] text-muted mt-0.5">Use camera or upload file</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <label className="w-full sm:w-auto h-12 px-4 rounded-xl bg-ink text-paper text-xs font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
                  <Camera className="w-4 h-4" />
                  <span>Take photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleUseSamplePhoto}
                  className="w-full sm:w-auto h-12 px-4 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 active:scale-95 transition-all"
                >
                  Use sample challan
                </button>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2.5 pt-1 px-1 cursor-pointer">
            <input
              type="checkbox"
              checked={hasNoBill}
              onChange={(e) => {
                setHasNoBill(e.target.checked);
                if (e.target.checked) setPhotoUrl('');
              }}
              className="w-4 h-4 rounded border-line text-ink focus:ring-ink"
            />
            <span className="text-xs text-muted">No bill/challan received with delivery</span>
          </label>
        </div>

        {/* 3. Vendor & Challan Details */}
        <div className="space-y-3 p-4 rounded-2xl bg-paper border border-line">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Supplier / Vendor
            </label>
            {!isAddingVendor && (
              <button
                type="button"
                onClick={() => setIsAddingVendor(true)}
                className="text-xs font-medium text-olive hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add new</span>
              </button>
            )}
          </div>

          {isAddingVendor ? (
            <div className="p-3 rounded-xl bg-ivory border border-line space-y-2">
              <input
                type="text"
                value={newVendorName}
                onChange={(e) => setNewVendorName(e.target.value)}
                placeholder="Vendor or shop name"
                className="w-full h-11 px-3 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
              />
              <input
                type="text"
                value={newVendorPhone}
                onChange={(e) => setNewVendorPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full h-11 px-3 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingVendor(false)}
                  className="px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateVendor}
                  className="px-3.5 py-1.5 rounded-lg bg-ink text-paper text-xs font-medium"
                >
                  Save vendor
                </button>
              </div>
            </div>
          ) : (
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="w-full h-12 px-3 rounded-xl border border-line bg-ivory text-xs font-medium text-ink focus:outline-none focus:border-ink"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          )}

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="text-[11px] text-muted block mb-1">Challan / Bill No.</label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="e.g. CH-8901"
                className="w-full h-12 px-3 rounded-xl border border-line bg-ivory text-xs text-ink focus:outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted block mb-1">Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border border-line bg-ivory text-xs text-ink focus:outline-none focus:border-ink"
              />
            </div>
          </div>
        </div>

        {/* 4. Delivered Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Delivered Materials
            </span>
            <span className="text-xs text-muted">{items.length} item{items.length === 1 ? '' : 's'}</span>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const itemMaterials = materials.filter((m) => m.categoryId === item.categoryId);
              const selectedMat = materials.find((m) => m.id === item.materialId);

              return (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-paper border border-line space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink">Item #{index + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-rust transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Picker */}
                  <div>
                    <label className="text-[11px] text-muted block mb-1">Category</label>
                    <select
                      value={item.categoryId}
                      onChange={(e) => handleItemChange(item.id, 'categoryId', e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-line bg-ivory text-xs font-medium text-ink focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Material Picker */}
                  <div>
                    <label className="text-[11px] text-muted block mb-1">Material</label>
                    <select
                      value={item.materialId}
                      onChange={(e) => handleItemChange(item.id, 'materialId', e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-line bg-ivory text-xs font-medium text-ink focus:outline-none"
                    >
                      {itemMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.shadeCode ? `(${m.shadeCode})` : ''} · {m.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Stepper with >= 48px tap targets */}
                  <div className="pt-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted">Quantity received</span>
                      <p className="text-[11px] font-medium text-ink capitalize">
                        Unit: {selectedMat?.unit || 'units'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleItemChange(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="w-12 h-12 rounded-xl bg-ivory border border-line flex items-center justify-center text-ink disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 h-12 rounded-xl border border-line bg-ivory text-center font-semibold text-base text-ink tabular-nums focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleItemChange(item.id, 'quantity', item.quantity + 1)}
                        className="w-12 h-12 rounded-xl bg-ivory border border-line flex items-center justify-center text-ink active:scale-95 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full h-12 rounded-2xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add another item</span>
          </button>
        </div>

        {/* Sticky Submit Button: Primary 56px */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-paper/95 backdrop-blur-md border-t border-line flex items-center justify-center max-w-md mx-auto">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-medium hover:bg-ink-2 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-float disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-olive" />
                <span>Delivery saved!</span>
              </>
            ) : (
              <span>{t('recv.submit_button', lang)} ({items.length} item{items.length === 1 ? '' : 's'})</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
