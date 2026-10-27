import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Camera, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Store,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { stockService } from '../../services/stockService';
import { billsService } from '../../services/billsService';
import { projectsService } from '../../services/projectsService';
import { settingsService } from '../../services/settingsService';
import { Category, Material, Project, Studio, Vendor } from '../../types';
import { formatCurrencyINR } from '../../utils/calculations';

interface RecordMaterialReceivedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialProjectId?: string;
}

interface MaterialEntryItem {
  id: string;
  categoryId: string;
  materialId: string;
  quantity: number;
  rate: number;
}

export const RecordMaterialReceivedDrawer: React.FC<RecordMaterialReceivedDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialProjectId,
}) => {
  const { currentUser, role } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);

  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // Form states
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [rateMap, setRateMap] = useState<Record<string, number>>({});

  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || '');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [billNumber, setBillNumber] = useState<string>('');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [hasNoBill, setHasNoBill] = useState<boolean>(false);

  // Items
  const [items, setItems] = useState<MaterialEntryItem[]>([
    {
      id: crypto.randomUUID(),
      categoryId: '',
      materialId: '',
      quantity: 1,
      rate: 0,
    }
  ]);

  // Vendor quick-add modal state
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load baseline options
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [projList, catList, matList, venList, rates, studioData] = await Promise.all([
          projectsService.list(),
          stockService.listCategories(),
          stockService.listMaterials(),
          billsService.listVendors(),
          stockService.getMaterialRatesMap(),
          settingsService.getStudio(),
        ]);

        const activeProjects = projList.filter(p => p.status === 'active');
        setProjects(activeProjects);
        setCategories(catList);
        setMaterials(matList);
        setVendors(venList);
        setRateMap(rates);
        setStudio(studioData);

        if (initialProjectId) {
          setSelectedProjectId(initialProjectId);
        } else if (activeProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(activeProjects[0].id);
        }

        if (venList.length > 0 && !selectedVendorId) {
          setSelectedVendorId(venList[0].id);
        }

        // Initialize first item default category if available
        if (catList.length > 0 && items[0] && !items[0].categoryId) {
          const firstCat = catList[0];
          const firstMat = matList.find(m => m.categoryId === firstCat.id);
          setItems([{
            id: crypto.randomUUID(),
            categoryId: firstCat.id,
            materialId: firstMat ? firstMat.id : '',
            quantity: 5,
            rate: canSeeAmounts && firstMat ? (rates[firstMat.id] || firstMat.rate || 0) : 0,
          }]);
        }
      } catch (err) {
        console.error('Failed to load received drawer data:', err);
      }
    };

    loadData();
    setIsSuccess(false);
    setError(null);
  }, [isOpen, initialProjectId]);

  // Keep selectedProjectId in sync when initialProjectId changes
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  // Material selection per item
  const handleCategoryChange = (index: number, catId: string) => {
    const matForCat = materials.filter(m => m.categoryId === catId);
    const defaultMat = matForCat[0];
    const defaultRate = canSeeAmounts && defaultMat ? (rateMap[defaultMat.id] || defaultMat.rate || 0) : 0;

    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        categoryId: catId,
        materialId: defaultMat ? defaultMat.id : '',
        rate: defaultRate,
      };
      return copy;
    });
  };

  const handleMaterialChange = (index: number, matId: string) => {
    const selectedMat = materials.find(m => m.id === matId);
    const defaultRate = canSeeAmounts && selectedMat ? (rateMap[selectedMat.id] || selectedMat.rate || 0) : 0;

    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        materialId: matId,
        rate: defaultRate,
      };
      return copy;
    });
  };

  const handleQuantityChange = (index: number, delta: number) => {
    setItems(prev => {
      const copy = [...prev];
      const newQty = Math.max(1, (copy[index].quantity || 0) + delta);
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const handleSetQuantity = (index: number, val: number) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity: Math.max(1, val) };
      return copy;
    });
  };

  const handleRateChange = (index: number, rateVal: number) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], rate: Math.max(0, rateVal) };
      return copy;
    });
  };

  const handleAddItem = () => {
    const defaultCat = categories[0];
    const defaultMat = defaultCat ? materials.find(m => m.categoryId === defaultCat.id) : undefined;
    const defaultRate = canSeeAmounts && defaultMat ? (rateMap[defaultMat.id] || defaultMat.rate || 0) : 0;

    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        categoryId: defaultCat ? defaultCat.id : '',
        materialId: defaultMat ? defaultMat.id : '',
        quantity: 5,
        rate: defaultRate,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Add Vendor Handler
  const handleQuickAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    try {
      const created = await billsService.createVendor(
        newVendorName.trim(),
        newVendorCategory.trim() || undefined,
        newVendorPhone.trim() || undefined
      );
      setVendors(prev => [...prev, created]);
      setSelectedVendorId(created.id);
      setIsAddingVendor(false);
      setNewVendorName('');
      setNewVendorCategory('');
      setNewVendorPhone('');
    } catch (err) {
      console.error('Failed to create vendor:', err);
    }
  };

  // Photo upload mock
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPhotoUrl(preview);
      setHasNoBill(false);
    }
  };

  const handleSelectSampleBill = (samplePath: string) => {
    setPhotoUrl(samplePath);
    setHasNoBill(false);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedProjectId) {
      setError('Please select a project / site.');
      return;
    }

    if (items.some(item => !item.materialId || item.quantity <= 0)) {
      setError('Please select valid materials and quantities for all items.');
      return;
    }

    const currentProject = projects.find(p => p.id === selectedProjectId);
    const currentVendor = vendors.find(v => v.id === selectedVendorId);

    setIsSubmitting(true);
    try {
      // 1. Prevent double-counting: ALWAYS create ONE bill record with status "to_review"
      // and let billsService.upload automatically record stock movements linked to that bill.
      const effectiveStudioId = studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const fallbackBillNumber = billNumber.trim() || `REC-${billDate.replace(/-/g, '').slice(2)}-${Math.floor(100 + Math.random() * 900)}`;

      const billItems = items.map(item => {
        const mat = materials.find(m => m.id === item.materialId);
        const itemRate = canSeeAmounts ? (item.rate || 0) : 0;
        return {
          studioId: effectiveStudioId,
          materialId: item.materialId,
          materialName: mat ? (mat.shadeCode ? `${mat.name} (${mat.shadeCode})` : mat.name) : 'Material',
          categoryId: item.categoryId,
          quantity: item.quantity,
          unit: mat ? mat.unit : 'unit',
          rate: itemRate,
          amount: item.quantity * itemRate,
          addToStock: true, // Creates received movement linked to this bill
        };
      });

      await billsService.upload({
        studioId: effectiveStudioId,
        projectId: selectedProjectId,
        vendorId: selectedVendorId || 'vendor-direct',
        vendorName: currentVendor ? currentVendor.name : 'Direct Material Delivery',
        billNumber: fallbackBillNumber,
        date: billDate,
        photoUrl: photoUrl || '/bills/bill-sample-1.svg',
        uploadedBy: currentUser?.name || 'Supervisor',
        uploadedById: currentUser?.id || 'user-default',
        items: billItems,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
        onClose();
      }, 900);

    } catch (err: any) {
      console.error('Failed to record material received:', err);
      setError(err?.message || 'Failed to record materials. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-xl bg-paper border-l border-line shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-line bg-ivory/60 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium">
                Inventory Intake
              </span>
              <h2 className="font-serif text-2xl font-medium text-ink mt-0.5">
                Record material received
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Increases site stock and adds entries to stock movement history
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form id="record-received-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rust-soft text-rust border border-rust/30 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Target Site / Project */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink block">
                Destination Site / Project <span className="text-rust">*</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm text-ink focus:outline-none focus:border-ink transition-colors"
              >
                <option value="" disabled>Select project site...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.customerName})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Bill Photo Attachment / Sample */}
            <div className="space-y-2 p-4 rounded-xl border border-line bg-ivory/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-ink flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-muted" />
                  <span>Bill photo or invoice</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setHasNoBill(!hasNoBill);
                    if (!hasNoBill) setPhotoUrl('');
                  }}
                  className={`text-xs transition-colors ${hasNoBill ? 'font-medium text-olive underline' : 'text-muted hover:text-ink'}`}
                >
                  {hasNoBill ? '✓ No bill (cash / direct delivery)' : 'No bill yet?'}
                </button>
              </div>

              {!hasNoBill && (
                <div className="space-y-3">
                  {photoUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-line bg-paper h-32 flex items-center justify-center group">
                      <img src={photoUrl} alt="Bill preview" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-ink/75 text-paper hover:bg-ink transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-4 border border-dashed border-line rounded-xl bg-paper hover:bg-sand/20 cursor-pointer transition-colors text-center">
                      <Upload className="w-6 h-6 text-muted mb-1" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-ink">Upload bill photo / receipt</span>
                      <span className="text-[11px] text-muted mt-0.5">PNG, JPG, or PDF scan</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoSelect} 
                        className="hidden" 
                      />
                    </label>
                  )}

                  {/* Demo quick sample picker */}
                  {!photoUrl && (
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <span>Or pick demo bill:</span>
                      <button
                        type="button"
                        onClick={() => handleSelectSampleBill('/bills/bill-sample-1.svg')}
                        className="px-2 py-0.5 rounded-lg border border-line bg-paper hover:bg-sand/40 text-ink-2 font-medium"
                      >
                        Sample Bill 1 (Plywood)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectSampleBill('/bills/bill-sample-2.svg')}
                        className="px-2 py-0.5 rounded-lg border border-line bg-paper hover:bg-sand/40 text-ink-2 font-medium"
                      >
                        Sample Bill 2 (Hardware)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Vendor & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-ink">Vendor</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingVendor(true)}
                    className="text-[11px] text-olive font-medium hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add new</span>
                  </button>
                </div>
                <select
                  value={selectedVendorId}
                  onChange={e => setSelectedVendorId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink transition-colors"
                >
                  <option value="">Select vendor...</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} {v.category ? `(${v.category})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink">Bill / Challan number</label>
                <input
                  type="text"
                  placeholder="e.g. SPL/26/0890"
                  value={billNumber}
                  onChange={e => setBillNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>

            {/* Inline Quick Add Vendor Form */}
            {isAddingVendor && (
              <div className="p-4 rounded-xl border border-olive/30 bg-olive-soft/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-olive" />
                    <span>Quick Add Vendor</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingVendor(false)}
                    className="text-xs text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Vendor name *"
                    value={newVendorName}
                    onChange={e => setNewVendorName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Plywood)"
                    value={newVendorCategory}
                    onChange={e => setNewVendorCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={newVendorPhone}
                    onChange={e => setNewVendorPhone(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleQuickAddVendor}
                    disabled={!newVendorName.trim()}
                    className="px-3 py-1 rounded-lg bg-olive text-paper text-xs font-medium disabled:opacity-50"
                  >
                    Save vendor
                  </button>
                </div>
              </div>
            )}

            {/* 4. Materials List Stepper */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="text-xs uppercase tracking-wider text-muted font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Materials Received ({items.length})</span>
                </h3>
                <span className="text-[11px] text-muted">Select material & specify received quantity</span>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const filteredMats = materials.filter(m => !item.categoryId || m.categoryId === item.categoryId);
                  const selectedMat = materials.find(m => m.id === item.materialId);

                  return (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-line bg-paper space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted">
                          Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-muted hover:text-rust transition-colors p-1"
                            title="Remove this item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Category */}
                        <div className="space-y-1">
                          <label className="text-[11px] text-muted block">Category</label>
                          <select
                            value={item.categoryId}
                            onChange={e => handleCategoryChange(idx, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                          >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Material */}
                        <div className="space-y-1">
                          <label className="text-[11px] text-muted block">Material <span className="text-rust">*</span></label>
                          <select
                            value={item.materialId}
                            onChange={e => handleMaterialChange(idx, e.target.value)}
                            required
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink font-medium"
                          >
                            <option value="" disabled>Select material...</option>
                            {filteredMats.map(m => (
                              <option key={m.id} value={m.id}>
                                {m.name} {m.shadeCode ? `(${m.shadeCode})` : ''} · {m.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Quantity Stepper & Quick Add */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-line/50">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-muted">Quantity ({selectedMat ? selectedMat.unit : 'units'}):</label>
                          <div className="inline-flex items-center rounded-lg border border-line bg-ivory/60 p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, -1)}
                              className="w-7 h-7 flex items-center justify-center text-ink hover:bg-sand/50 rounded text-sm font-semibold transition-colors"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => handleSetQuantity(idx, parseInt(e.target.value) || 1)}
                              className="w-14 text-center text-xs font-medium bg-transparent focus:outline-none tabular-nums"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, 1)}
                              className="w-7 h-7 flex items-center justify-center text-ink hover:bg-sand/50 rounded text-sm font-semibold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Quick Chips */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-[10px] text-muted">Quick:</span>
                          {[1, 5, 10, 25].map(q => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => handleQuantityChange(idx, q)}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-sand/50 hover:bg-sand text-ink transition-colors"
                            >
                              +{q}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Unit Rate (only if canSeeAmounts) */}
                      {canSeeAmounts && (
                        <div className="pt-2 border-t border-line/40 flex items-center justify-between text-xs text-muted">
                          <div className="flex items-center gap-2">
                            <span>Rate / unit:</span>
                            <div className="relative inline-flex items-center">
                              <span className="absolute left-2.5 text-xs text-muted">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={item.rate || ''}
                                onChange={e => handleRateChange(idx, parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-24 pl-6 pr-2 py-1 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink tabular-nums"
                              />
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-muted">Line total: </span>
                            <span className="font-serif font-medium text-ink tabular-nums">
                              {formatCurrencyINR(item.quantity * (item.rate || 0))}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 rounded-xl border border-dashed border-line hover:border-sand-dark bg-paper hover:bg-ivory/50 text-xs font-medium text-ink flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-muted" />
                <span>+ Add another material</span>
              </button>
            </div>

            {/* 5. Date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink">Received date</label>
                <input
                  type="date"
                  value={billDate}
                  onChange={e => setBillDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink">Delivery note / vehicle (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Tempo MH12 AB 9988, driver Ramesh"
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                />
              </div>
            </div>

          </form>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-line bg-ivory/60 flex items-center justify-between gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="record-received-form"
              disabled={isSubmitting || isSuccess}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft disabled:opacity-50 transition-all"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-olive" />
                  <span>Stock updated successfully</span>
                </>
              ) : isSubmitting ? (
                <span>Recording material...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Record material received</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
