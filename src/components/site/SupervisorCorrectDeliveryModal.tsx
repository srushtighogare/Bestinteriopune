import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Bill, BillItem } from '../../types';
import { billsService } from '../../services/billsService';
import { useAuth } from '../../context/AuthContext';

interface SupervisorCorrectDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onSuccess: () => void;
}

export const SupervisorCorrectDeliveryModal: React.FC<SupervisorCorrectDeliveryModalProps> = ({
  isOpen,
  onClose,
  bill,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<BillItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bill) {
      setItems(bill.items ? [...bill.items] : []);
      setError(null);
    }
  }, [bill]);

  if (!isOpen || !bill) return null;

  const handleQuantityChange = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return {
            ...item,
            quantity: newQty,
            amount: newQty * (item.rate || 0),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    if (items.length <= 1) {
      setError('A delivery must have at least one material item.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setError(null);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      setError('Please keep at least one item.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await billsService.updateBill(bill.id, {
        items,
        needsTradeLeadCheck: false,
        tradeLeadCheckClearedAt: new Date().toISOString(),
        tradeLeadCheckClearedBy: currentUser?.name || 'Supervisor',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to correct delivery:', err);
      setError(err?.message || 'Failed to save corrected delivery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-paper rounded-t-[28px] sm:rounded-3xl border border-line shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-line bg-ivory/60 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-lg font-medium text-ink">Correct delivery items</h3>
            <p className="text-xs text-muted mt-0.5">
              Recorded by {bill.uploadedBy} · {bill.vendorName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full text-muted hover:text-ink active:bg-sand/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rust-soft/50 border border-rust/30 text-xs text-rust flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-muted">
            Adjust the quantities actually received on site against the delivery challan:
          </p>

          <div className="space-y-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-xl bg-ivory border border-line flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.materialName}</p>
                  <p className="text-xs text-muted capitalize">Unit: {item.unit}</p>
                </div>

                {/* Quantity Stepper with >= 48px tap targets */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-12 h-12 rounded-xl bg-paper border border-line flex items-center justify-center text-ink disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <span className="w-11 text-center font-semibold text-base text-ink tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="w-12 h-12 rounded-xl bg-paper border border-line flex items-center justify-center text-ink active:scale-95 transition-all"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-12 h-12 ml-1 rounded-xl flex items-center justify-center text-muted hover:text-rust active:bg-rust-soft/30 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions with 56px primary button */}
        <div className="p-4 border-t border-line bg-paper flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl border border-line bg-paper text-ink text-sm font-medium hover:bg-sand/30 active:scale-[0.99] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 h-14 rounded-2xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save delivery</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
