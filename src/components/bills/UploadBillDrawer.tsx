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
  FileText,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { billsService } from '../../services/billsService';
import { stockService } from '../../services/stockService';
import { projectsService } from '../../services/projectsService';
import { settingsService } from '../../services/settingsService';
import { Category, Material, Project, Studio, Vendor } from '../../types';
import { formatCurrencyINR } from '../../utils/calculations';

interface UploadBillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialProjectId?: string;
}

interface BillLineItemInput {
  id: string;
  categoryId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  rate: number;
  addToStock: boolean;
}

export const UploadBillDrawer: React.FC<UploadBillDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialProjectId,
}) => {
  const { currentUser } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);

  // Reference data
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [rateMap, setRateMap] = useState<Record<string, number>>({});

  // Form states
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || '');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [billNumber, setBillNumber] = useState<string>('');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [compressionInfo, setCompressionInfo] = useState<{ originalSize: string; compressedSize: string } | null>(null);

  // Global "Add these items to site stock" toggle - ON BY DEFAULT as requested
  const [globalAddToStock, setGlobalAddToStock] = useState<boolean>(true);

  // Line items
  const [items, setItems] = useState<BillLineItemInput[]>([
    {
      id: crypto.randomUUID(),
      categoryId: '',
      materialId: '',
      materialName: '',
      quantity: 1,
      unit: 'sheet',
      rate: 0,
      addToStock: true,
    }
  ]);

  // Quick add vendor inline modal
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    existingBill: any;
    message: string;
  } | null>(null);
  const [bypassDuplicateCheck, setBypassDuplicateCheck] = useState<boolean>(false);

  // Load reference data
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

        const activeProjs = projList.filter(p => p.status === 'active');
        setProjects(activeProjs);
        setCategories(catList);
        setMaterials(matList);
        setVendors(venList);
        setRateMap(rates);
        setStudio(studioData);

        if (initialProjectId) {
          setSelectedProjectId(initialProjectId);
        } else if (activeProjs.length > 0 && !selectedProjectId) {
          setSelectedProjectId(activeProjs[0].id);
        }

        if (venList.length > 0 && !selectedVendorId) {
          setSelectedVendorId(venList[0].id);
        }

        // Initialize first item default category & material
        if (catList.length > 0 && items[0] && !items[0].categoryId) {
          const firstCat = catList[0];
          const firstMat = matList.find(m => m.categoryId === firstCat.id);
          setItems([{
            id: crypto.randomUUID(),
            categoryId: firstCat.id,
            materialId: firstMat ? firstMat.id : '',
            materialName: firstMat ? firstMat.name : '',
            quantity: 10,
            unit: firstMat ? firstMat.unit : 'sheet',
            rate: firstMat ? (rates[firstMat.id] || firstMat.rate || 1200) : 1200,
            addToStock: true,
          }]);
        }
      } catch (err) {
        console.error('Failed to load bill drawer data:', err);
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

  // Handle Photo selection with mock compression
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const originalMB = (file.size / (1024 * 1024)).toFixed(1);
      const compressedKB = Math.round(file.size / (1024 * 8));
      const preview = URL.createObjectURL(file);
      setPhotoUrl(preview);
      setCompressionInfo({
        originalSize: `${originalMB} MB`,
        compressedSize: `${compressedKB > 0 ? compressedKB : 240} KB`,
      });
    }
  };

  const handlePickSampleBill = (url: string, sampleName: string) => {
    setPhotoUrl(url);
    setCompressionInfo({
      originalSize: '3.2 MB',
      compressedSize: '290 KB',
    });
    if (!billNumber) {
      setBillNumber(sampleName === 'Plywood' ? 'SPL/26/1088' : 'OM/OCT/102');
    }
  };

  // Item change handlers
  const handleCategoryChange = (index: number, catId: string) => {
    const matForCat = materials.filter(m => m.categoryId === catId);
    const defaultMat = matForCat[0];
    const defaultRate = defaultMat ? (rateMap[defaultMat.id] || defaultMat.rate || 0) : 0;

    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        categoryId: catId,
        materialId: defaultMat ? defaultMat.id : '',
        materialName: defaultMat ? defaultMat.name : '',
        unit: defaultMat ? defaultMat.unit : 'unit',
        rate: defaultRate,
      };
      return copy;
    });
  };

  const handleMaterialChange = (index: number, matId: string) => {
    const selectedMat = materials.find(m => m.id === matId);
    const defaultRate = selectedMat ? (rateMap[selectedMat.id] || selectedMat.rate || 0) : 0;

    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        materialId: matId,
        materialName: selectedMat ? selectedMat.name : '',
        unit: selectedMat ? selectedMat.unit : 'unit',
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

  const handleItemAddToStockChange = (index: number, checked: boolean) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], addToStock: checked };
      return copy;
    });
  };

  // Sync global toggle across all items
  const handleGlobalToggleChange = (checked: boolean) => {
    setGlobalAddToStock(checked);
    setItems(prev => prev.map(item => ({ ...item, addToStock: checked })));
  };

  const handleAddItem = () => {
    const defaultCat = categories[0];
    const defaultMat = defaultCat ? materials.find(m => m.categoryId === defaultCat.id) : undefined;
    const defaultRate = defaultMat ? (rateMap[defaultMat.id] || defaultMat.rate || 0) : 0;

    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        categoryId: defaultCat ? defaultCat.id : '',
        materialId: defaultMat ? defaultMat.id : '',
        materialName: defaultMat ? defaultMat.name : '',
        quantity: 5,
        unit: defaultMat ? defaultMat.unit : 'sheet',
        rate: defaultRate,
        addToStock: globalAddToStock,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Quick Add Vendor
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

  // Compute Bill Total
  const billTotalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * (item.rate || 0)), 0);
  }, [items]);

  // Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!selectedProjectId) {
      setError('Please select a project site for this bill.');
      return;
    }

    if (!selectedVendorId) {
      setError('Please select a vendor.');
      return;
    }

    if (items.some(it => !it.materialId || it.quantity <= 0)) {
      setError('Please select valid materials and quantities for all items.');
      return;
    }

    const currentVendor = vendors.find(v => v.id === selectedVendorId);
    const effectiveStudioId = studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // Duplicate delivery check: same project + vendor + date (±2 days) with overlapping materials
    if (!bypassDuplicateCheck) {
      try {
        const existingBills = await billsService.list(selectedProjectId);
        const targetDate = new Date(billDate).getTime();
        const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

        const duplicate = existingBills.find(b => {
          if (b.projectId !== selectedProjectId) return false;
          const matchVendor = b.vendorId === selectedVendorId || 
            b.vendorName.toLowerCase() === (currentVendor?.name || '').toLowerCase();
          if (!matchVendor) return false;

          const bDate = new Date(b.date).getTime();
          if (isNaN(bDate) || isNaN(targetDate)) return false;
          if (Math.abs(bDate - targetDate) > twoDaysMs) return false;

          // Check overlapping materials
          return b.items.some(bItem => 
            items.some(it => it.materialId && it.materialId === bItem.materialId)
          );
        });

        if (duplicate) {
          setDuplicateWarning({
            existingBill: duplicate,
            message: `This looks like a delivery already recorded on ${duplicate.date} by ${duplicate.uploadedBy}. Open that bill instead?`,
          });
          return;
        }
      } catch (err) {
        console.warn('Duplicate check failed, proceeding:', err);
      }
    }

    setIsSubmitting(true);
    try {
      const billPayloadItems = items.map(item => {
        const mat = materials.find(m => m.id === item.materialId);
        return {
          studioId: effectiveStudioId,
          materialId: item.materialId,
          materialName: mat ? (mat.shadeCode ? `${mat.name} (${mat.shadeCode})` : mat.name) : item.materialName || 'Material',
          categoryId: item.categoryId,
          quantity: item.quantity,
          unit: mat ? mat.unit : item.unit,
          rate: item.rate,
          amount: item.quantity * item.rate,
          addToStock: item.addToStock,
        };
      });

      // Upload bill: if addToStock is true on an item, billsService.upload automatically records received stock movement!
      await billsService.upload({
        studioId: effectiveStudioId,
        projectId: selectedProjectId,
        vendorId: selectedVendorId,
        vendorName: currentVendor ? currentVendor.name : 'Vendor',
        billNumber: billNumber.trim() || `INV-${Date.now().toString().slice(-4)}`,
        date: billDate,
        photoUrl: photoUrl || '/bills/bill-sample-1.svg',
        uploadedBy: currentUser?.name || 'Megha Jadhav',
        uploadedById: currentUser?.id || 'user-default',
        items: billPayloadItems,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
        onClose();
      }, 900);

    } catch (err: any) {
      console.error('Failed to upload bill:', err);
      setError(err?.message || 'Failed to upload bill. Please try again.');
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
        <div className="w-screen max-w-2xl bg-paper border-l border-line shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-line bg-ivory/60 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium">
                Accounts & Invoices
              </span>
              <h2 className="font-serif text-2xl font-medium text-ink mt-0.5">
                Upload bill
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Vendor invoices, materials received, and expense tracking
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
          <form id="upload-bill-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rust-soft text-rust border border-rust/30 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {duplicateWarning && (
              <div className="p-4 rounded-xl bg-amber-soft border border-amber/40 text-xs space-y-3 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-ink">Possible duplicate delivery found</p>
                    <p className="text-ink-2 leading-relaxed">
                      {duplicateWarning.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const url = new URL(window.location.href);
                      url.pathname = '/bills';
                      url.searchParams.set('selected', duplicateWarning.existingBill.id);
                      window.location.href = url.toString();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-ink text-paper font-medium hover:bg-ink-2 shadow-xs transition-colors"
                  >
                    Open existing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBypassDuplicateCheck(true);
                      setDuplicateWarning(null);
                      setTimeout(() => handleSubmit(), 50);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-line bg-paper text-ink font-medium hover:bg-sand/40 transition-colors"
                  >
                    Save as new anyway
                  </button>
                </div>
              </div>
            )}

            {/* 1. Photo Upload with Auto-compression Preview */}
            <div className="space-y-2 p-4 rounded-xl border border-line bg-ivory/40">
              <label className="text-xs font-medium text-ink flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-muted" />
                <span>Bill photo or invoice document <span className="text-rust">*</span></span>
              </label>

              {photoUrl ? (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-line bg-paper h-40 flex items-center justify-center group">
                    <img src={photoUrl} alt="Bill preview" className="w-full h-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setCompressionInfo(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-ink/80 text-paper hover:bg-ink transition-all shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {compressionInfo && (
                    <div className="p-2.5 rounded-lg bg-olive-soft/40 border border-olive/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-olive font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Client-side compression active</span>
                      </div>
                      <span className="text-[11px] text-ink-2">
                        {compressionInfo.originalSize} &rarr; <strong>{compressionInfo.compressedSize}</strong> (fast mobile load)
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-line rounded-xl bg-paper hover:bg-sand/20 cursor-pointer transition-colors text-center">
                    <Upload className="w-7 h-7 text-muted mb-1.5" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-ink">Upload bill photo or scan</span>
                    <span className="text-[11px] text-muted mt-0.5">Images are compressed automatically for fast mobile access</span>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={handlePhotoSelect} 
                      className="hidden" 
                    />
                  </label>

                  {/* Quick Pick Samples for Demo */}
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span>Or use sample bill:</span>
                    <button
                      type="button"
                      onClick={() => handlePickSampleBill('/bills/bill-sample-1.svg', 'Plywood')}
                      className="px-2.5 py-1 rounded-lg border border-line bg-paper hover:bg-sand/40 text-ink-2 font-medium transition-colors"
                    >
                      Sample 1: Plywood & Laminates
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePickSampleBill('/bills/bill-sample-2.svg', 'Hardware')}
                      className="px-2.5 py-1 rounded-lg border border-line bg-paper hover:bg-sand/40 text-ink-2 font-medium transition-colors"
                    >
                      Sample 2: Hardware & Switches
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Destination Project & Vendor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink block">
                  Project site <span className="text-rust">*</span>
                </label>
                <select
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-xs sm:text-sm font-medium text-ink focus:outline-none focus:border-ink transition-colors"
                >
                  <option value="" disabled>Select project site...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.customerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-ink">
                    Vendor <span className="text-rust">*</span>
                  </label>
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
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-xs sm:text-sm font-medium text-ink focus:outline-none focus:border-ink transition-colors"
                >
                  <option value="" disabled>Select vendor...</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} {v.category ? `(${v.category})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inline Quick Add Vendor Form */}
            {isAddingVendor && (
              <div className="p-4 rounded-xl border border-olive/30 bg-olive-soft/30 space-y-3">
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
                    className="px-3 py-1 rounded-lg bg-olive text-paper text-xs font-medium disabled:opacity-50 shadow-xs"
                  >
                    Save vendor
                  </button>
                </div>
              </div>
            )}

            {/* 3. Date & Bill Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink">Bill / Invoice date</label>
                <input
                  type="date"
                  value={billDate}
                  onChange={e => setBillDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink">Bill / Invoice number</label>
                <input
                  type="text"
                  placeholder="e.g. SPL/26/1044"
                  value={billNumber}
                  onChange={e => setBillNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* 4. "Add these items to site stock" Global Toggle (ON by default) */}
            <div className="p-4 rounded-xl border border-line bg-ivory/50 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <label htmlFor="global-stock-toggle" className="text-xs font-medium text-ink cursor-pointer flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-olive" />
                  <span>Add these items to site stock</span>
                </label>
                <p className="text-[11px] text-muted">
                  When enabled, stock levels for these materials increase at the selected project site and appear in stock movement logs.
                </p>
              </div>

              <input
                id="global-stock-toggle"
                type="checkbox"
                checked={globalAddToStock}
                onChange={e => handleGlobalToggleChange(e.target.checked)}
                className="w-4 h-4 text-olive rounded border-line focus:ring-olive mt-0.5 cursor-pointer"
              />
            </div>

            {/* 5. Line items: Category -> Material -> Qty -> Rate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="text-xs uppercase tracking-wider text-muted font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bill Line Items ({items.length})</span>
                </h3>
                <span className="text-[11px] text-muted">Enter items and unit rates</span>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const filteredMats = materials.filter(m => !item.categoryId || m.categoryId === item.categoryId);
                  const selectedMat = materials.find(m => m.id === item.materialId);
                  const lineTotal = item.quantity * (item.rate || 0);

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
                            title="Remove line item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Category & Material selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        <div className="space-y-1">
                          <label className="text-[11px] text-muted block">
                            Material <span className="text-rust">*</span>
                          </label>
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

                      {/* Quantity & Rate */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-line/50">
                        {/* Quantity Stepper */}
                        <div className="sm:col-span-6 flex items-center gap-2">
                          <label className="text-[11px] text-muted">
                            Qty ({selectedMat ? selectedMat.unit : 'unit'}):
                          </label>
                          <div className="inline-flex items-center rounded-lg border border-line bg-ivory/60 p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, -1)}
                              className="w-6 h-6 flex items-center justify-center text-ink hover:bg-sand/50 rounded text-xs font-semibold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => handleSetQuantity(idx, parseInt(e.target.value) || 1)}
                              className="w-12 text-center text-xs font-medium bg-transparent focus:outline-none tabular-nums"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, 1)}
                              className="w-6 h-6 flex items-center justify-center text-ink hover:bg-sand/50 rounded text-xs font-semibold"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-1 text-xs">
                            {[1, 5, 10].map(q => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => handleQuantityChange(idx, q)}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sand/50 hover:bg-sand text-ink"
                              >
                                +{q}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Rate Input */}
                        <div className="sm:col-span-3 flex items-center gap-1.5">
                          <label className="text-[11px] text-muted">Rate (₹):</label>
                          <input
                            type="number"
                            min="0"
                            value={item.rate || ''}
                            onChange={e => handleRateChange(idx, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-20 px-2 py-1 rounded-lg border border-line bg-paper text-xs text-ink text-right tabular-nums focus:outline-none focus:border-ink"
                          />
                        </div>

                        {/* Line Total */}
                        <div className="sm:col-span-3 text-right">
                          <span className="text-[10px] text-muted block">Amount:</span>
                          <span className="font-serif font-medium text-xs text-ink tabular-nums">
                            {formatCurrencyINR(lineTotal)}
                          </span>
                        </div>
                      </div>

                      {/* Per-item stock toggle */}
                      <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.addToStock}
                            onChange={e => handleItemAddToStockChange(idx, e.target.checked)}
                            className="w-3.5 h-3.5 text-olive rounded border-line focus:ring-olive"
                          />
                          <span>Add to site inventory</span>
                        </label>
                        {item.addToStock && (
                          <span className="text-olive font-medium">✓ Will increase stock</span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Add another item */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 rounded-xl border border-dashed border-line hover:border-sand-dark bg-paper hover:bg-ivory/50 text-xs font-medium text-ink flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-muted" />
                <span>+ Add another item</span>
              </button>
            </div>

          </form>

          {/* Drawer Footer with Bill Total & Submit Button */}
          <div className="p-6 border-t border-line bg-ivory/60 flex items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                Total Bill Amount
              </span>
              <span className="font-serif text-xl font-medium text-ink tabular-nums">
                {formatCurrencyINR(billTotalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="upload-bill-form"
                disabled={isSubmitting || isSuccess}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft disabled:opacity-50 transition-all"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-olive" />
                    <span>Bill uploaded & stock updated</span>
                  </>
                ) : isSubmitting ? (
                  <span>Saving bill...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Upload and save bill</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
