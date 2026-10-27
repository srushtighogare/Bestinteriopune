import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Store, 
  Layers,
  FileText
} from 'lucide-react';
import { Bill, BillItem, Category, Material, Vendor } from '../../types';
import { billsService } from '../../services/billsService';
import { stockService } from '../../services/stockService';
import { computeMaterialStockBalance, formatCurrencyINR } from '../../utils/calculations';

interface EditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bill: Bill;
}

interface EditableItem {
  id: string;
  materialId: string;
  materialName: string;
  categoryId: string;
  quantity: number;
  unit: string;
  rate: number;
  addToStock: boolean;
}

export const EditBillModal: React.FC<EditBillModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bill,
}) => {
  const [billNumber, setBillNumber] = useState(bill.billNumber || '');
  const [billDate, setBillDate] = useState(bill.date);
  const [vendorName, setVendorName] = useState(bill.vendorName);
  const [vendorId, setVendorId] = useState(bill.vendorId);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [items, setItems] = useState<EditableItem[]>(() => {
    return bill.items.map(it => ({
      id: it.id || crypto.randomUUID(),
      materialId: it.materialId,
      materialName: it.materialName,
      categoryId: it.categoryId,
      quantity: it.quantity,
      unit: it.unit,
      rate: it.rate,
      addToStock: it.addToStock,
    }));
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [negativeStockWarning, setNegativeStockWarning] = useState<string | null>(null);
  const [bypassNegativeStockWarning, setBypassNegativeStockWarning] = useState<boolean>(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [venList, matList, catList] = await Promise.all([
          billsService.listVendors(),
          stockService.listMaterials(),
          stockService.listCategories(),
        ]);
        setVendors(venList);
        setMaterials(matList);
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load metadata for bill editor:', err);
      }
    };

    if (isOpen) {
      loadMetadata();
      setBillNumber(bill.billNumber || '');
      setBillDate(bill.date);
      setVendorName(bill.vendorName);
      setVendorId(bill.vendorId);
      setItems(bill.items.map(it => ({ ...it })));
      setError(null);
    }
  }, [isOpen, bill]);

  const handleItemChange = (index: number, field: keyof EditableItem, val: any) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };

      // If material changed, update unit and name
      if (field === 'materialId') {
        const found = materials.find(m => m.id === val);
        if (found) {
          copy[index].materialName = found.name + (found.shadeCode ? ` (${found.shadeCode})` : '');
          copy[index].unit = found.unit;
          copy[index].categoryId = found.categoryId;
        }
      }
      return copy;
    });
  };

  const handleAddItem = () => {
    const defaultMat = materials[0];
    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        materialId: defaultMat ? defaultMat.id : '',
        materialName: defaultMat ? defaultMat.name : 'New item',
        categoryId: defaultMat ? defaultMat.categoryId : '',
        quantity: 1,
        unit: defaultMat ? defaultMat.unit : 'unit',
        rate: 0,
        addToStock: true,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('A bill must contain at least one line item.');
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.quantity * it.rate), 0);
  }, [items]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (items.some(it => !it.materialName.trim() || it.quantity <= 0)) {
      setError('Please provide valid descriptions and quantities for all items.');
      return;
    }

    // Check if reducing a quantity would make site stock negative
    if (!bypassNegativeStockWarning) {
      try {
        const movements = await stockService.getMovements(bill.projectId);
        const negativeWarnings: string[] = [];

        for (const newItem of items) {
          if (!newItem.materialId || !newItem.addToStock) continue;
          const oldItem = bill.items.find(bi => bi.id === newItem.id || bi.materialId === newItem.materialId);
          if (oldItem && oldItem.addToStock && newItem.quantity < oldItem.quantity) {
            const reduction = oldItem.quantity - newItem.quantity;
            const mat = materials.find(m => m.id === newItem.materialId);
            if (mat) {
              const currentBal = computeMaterialStockBalance(mat, movements, bill.projectId);
              if (currentBal.inStock - reduction < 0) {
                negativeWarnings.push(
                  `Reducing "${newItem.materialName}" from ${oldItem.quantity} to ${newItem.quantity} ${newItem.unit} will drive site stock negative (${currentBal.inStock - reduction} ${newItem.unit}), because ${currentBal.used} ${newItem.unit} was already logged as used on site.`
                );
              }
            }
          }
        }

        if (negativeWarnings.length > 0) {
          setNegativeStockWarning(negativeWarnings.join('\n\n'));
          return;
        }
      } catch (err) {
        console.warn('Stock check failed:', err);
      }
    }

    setIsSubmitting(true);
    try {
      const updatedBillItems: BillItem[] = items.map(it => ({
        id: it.id,
        studioId: bill.studioId,
        billId: bill.id,
        materialId: it.materialId,
        materialName: it.materialName,
        categoryId: it.categoryId,
        quantity: it.quantity,
        unit: it.unit,
        rate: it.rate,
        amount: it.quantity * it.rate,
        addToStock: it.addToStock,
      }));

      await billsService.updateBill(bill.id, {
        billNumber: billNumber.trim() || undefined,
        date: billDate,
        vendorId,
        vendorName,
        items: updatedBillItems,
      });

      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to update bill items:', err);
      setError(err?.message || 'Failed to update bill.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-line pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium block">
                Edit Invoice Details
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                Edit bill items & rates
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Updates line amounts and synchronizes site stock movements
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-line flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rust-soft text-rust border border-rust/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {negativeStockWarning && (
            <div className="p-4 rounded-xl bg-rust-soft border border-rust/40 text-xs space-y-3 shadow-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rust">Warning: Negative Site Stock</p>
                  <p className="text-ink-2 leading-relaxed whitespace-pre-line">
                    {negativeStockWarning}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setNegativeStockWarning(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-line bg-paper text-ink font-medium hover:bg-sand/30"
                >
                  Review quantities
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBypassNegativeStockWarning(true);
                    setNegativeStockWarning(null);
                    setTimeout(() => handleSubmit(), 50);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rust text-paper font-medium hover:bg-rust/90 shadow-xs"
                >
                  Confirm reduction anyway
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Vendor & Bill Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-ivory/50 border border-line">
              <div className="space-y-1">
                <label className="font-medium text-ink block">Vendor</label>
                <select
                  value={vendorId}
                  onChange={e => {
                    setVendorId(e.target.value);
                    const v = vendors.find(item => item.id === e.target.value);
                    if (v) setVendorName(v.name);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-ink"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-ink block">Bill Number</label>
                <input
                  type="text"
                  value={billNumber}
                  onChange={e => setBillNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-ink block">Bill Date</label>
                <input
                  type="date"
                  value={billDate}
                  onChange={e => setBillDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-ink"
                />
              </div>
            </div>

            {/* Line items list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-1.5">
                <h4 className="font-medium text-ink uppercase text-[11px] tracking-wider">
                  Line Items ({items.length})
                </h4>
                <span className="text-[11px] text-muted">Adjust quantity, rates, and stock status</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const lineTotal = item.quantity * item.rate;

                  return (
                    <div 
                      key={item.id}
                      className="p-3.5 rounded-xl border border-line bg-paper space-y-2 text-xs hover:border-sand-dark transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <label className="text-[10px] text-muted block mb-0.5">Item Name / Material</label>
                          <select
                            value={item.materialId}
                            onChange={e => handleItemChange(idx, 'materialId', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-paper font-medium text-ink text-xs"
                          >
                            {materials.map(m => (
                              <option key={m.id} value={m.id}>
                                {m.name} {m.shadeCode ? `(${m.shadeCode})` : ''} · {m.unit}
                              </option>
                            ))}
                          </select>
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded text-muted hover:text-rust self-center mt-3"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center pt-2 border-t border-line/50">
                        <div>
                          <label className="text-[10px] text-muted block mb-0.5">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 1)}
                            className="w-full px-2.5 py-1 rounded-lg border border-line text-ink tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-muted block mb-0.5">Unit</label>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                            className="w-full px-2.5 py-1 rounded-lg border border-line text-ink"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-muted block mb-0.5">Rate (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={e => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 rounded-lg border border-line text-ink tabular-nums text-right"
                          />
                        </div>

                        <div className="text-right">
                          <label className="text-[10px] text-muted block mb-0.5">Total</label>
                          <span className="font-serif font-medium text-ink tabular-nums block py-1">
                            {formatCurrencyINR(lineTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1.5 flex items-center justify-between text-[11px] text-muted">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.addToStock}
                            onChange={e => handleItemChange(idx, 'addToStock', e.target.checked)}
                            className="w-3.5 h-3.5 text-olive rounded border-line focus:ring-olive"
                          />
                          <span>Add to site inventory balance</span>
                        </label>
                        {item.addToStock ? (
                          <span className="text-olive font-medium">✓ Logs stock movement</span>
                        ) : (
                          <span className="text-muted">Expense only</span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2 rounded-xl border border-dashed border-line hover:border-sand-dark text-xs font-medium text-ink flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-muted" />
                <span>+ Add another line item</span>
              </button>
            </div>

            {/* Total and Footer Actions */}
            <div className="pt-4 border-t border-line flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                  Adjusted Bill Total
                </span>
                <span className="font-serif text-lg font-medium text-ink tabular-nums">
                  {formatCurrencyINR(totalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-line bg-paper text-ink font-medium hover:bg-sand/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-ink text-paper font-medium hover:bg-ink-2 shadow-soft disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
