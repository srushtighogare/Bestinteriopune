import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Download, 
  Calendar, 
  User as UserIcon,
  X,
  ExternalLink
} from 'lucide-react';
import { Bill } from '../../types';
import { billsService } from '../../services/billsService';
import { formatCurrencyINR, formatRelativeTime } from '../../utils/calculations';

interface BillsListProps {
  projectId?: string;
  canSeeAmounts: boolean;
  onUploadClick?: () => void;
}

export const BillsList: React.FC<BillsListProps> = ({
  projectId,
  canSeeAmounts,
  onUploadClick,
}) => {
  const [searchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') as 'to_review' | 'reviewed') || 'all';

  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'to_review' | 'reviewed'>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const loadBills = async () => {
    setIsLoading(true);
    try {
      const data = await billsService.list(projectId);
      setBills(data);
      if (data.length > 0 && !selectedBillId) {
        setSelectedBillId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBills();

    const handleStorageReset = () => {
      loadBills();
    };

    window.addEventListener('studioos_storage_reset', handleStorageReset);
    return () => {
      window.removeEventListener('studioos_storage_reset', handleStorageReset);
    };
  }, [projectId]);

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus === 'to_review' || urlStatus === 'reviewed') {
      setStatusFilter(urlStatus);
    }
  }, [searchParams]);

  // Filter bills by search and status
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
      const matchesSearch = 
        bill.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bill.billNumber && bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        bill.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.items.some(item => item.materialName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [bills, statusFilter, searchQuery]);

  // Selected bill
  const selectedBill = useMemo(() => {
    return bills.find(b => b.id === selectedBillId) || filteredBills[0] || null;
  }, [bills, selectedBillId, filteredBills]);

  // Compute total spent on filtered bills
  const totalAmount = useMemo(() => {
    return filteredBills.reduce((total, b) => {
      const billSum = b.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      return total + billSum;
    }, 0);
  }, [filteredBills]);

  const handleMarkReviewed = async (billId: string) => {
    try {
      await billsService.markReviewed(billId);
      await loadBills();
    } catch (err) {
      console.error('Failed to mark bill as reviewed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-paper p-4 rounded-xl border border-line">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'all'
                ? 'bg-ink text-paper'
                : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
            }`}
          >
            All bills ({bills.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('to_review')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'to_review'
                ? 'bg-amber text-paper'
                : 'bg-amber-soft text-amber hover:bg-amber-soft/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>To review ({bills.filter(b => b.status === 'to_review').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('reviewed')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              statusFilter === 'reviewed'
                ? 'bg-olive text-paper'
                : 'bg-olive-soft text-olive hover:bg-olive-soft/80'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Reviewed ({bills.filter(b => b.status === 'reviewed').length})</span>
          </button>
        </div>

        {/* Search & Total Spend */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {canSeeAmounts && (
            <div className="text-right shrink-0 hidden md:block">
              <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                Total for filter
              </span>
              <span className="text-sm font-serif font-medium text-ink tabular-nums">
                {formatCurrencyINR(totalAmount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Layout: Left Bill List + Right Preview Panel */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted">Loading bills...</div>
      ) : filteredBills.length === 0 ? (
        <div className="p-12 rounded-xl bg-ivory/50 border border-line text-center space-y-3">
          <FileText className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
          <p className="text-sm font-medium text-ink">No bills found</p>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing your search terms or filter selection.'
              : 'No bills have been uploaded for this project yet.'}
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-line text-xs font-medium text-ink hover:bg-sand/40"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Bills List (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredBills.map((bill) => {
              const isSelected = selectedBill?.id === bill.id;
              const isToReview = bill.status === 'to_review';
              const billSum = bill.items.reduce((s, it) => s + (it.quantity * it.rate), 0);

              return (
                <div
                  key={bill.id}
                  onClick={() => setSelectedBillId(bill.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-paper border-ink shadow-sm ring-1 ring-ink/10'
                      : 'bg-paper border-line hover:border-sand-dark hover:bg-sand/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-medium text-ink text-sm truncate">
                          {bill.vendorName}
                        </span>
                        {isToReview ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-soft text-amber shrink-0">
                            <Clock className="w-2.5 h-2.5" />
                            <span>To review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-olive-soft text-olive shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Reviewed</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <span className="tabular-nums">{bill.date}</span>
                        {bill.billNumber && (
                          <>
                            <span>·</span>
                            <span>#{bill.billNumber}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{bill.items.length} item{bill.items.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {canSeeAmounts && (
                      <div className="text-right shrink-0">
                        <span className="font-serif font-medium text-sm text-ink tabular-nums block">
                          {formatCurrencyINR(billSum)}
                        </span>
                        <span className="text-[10px] text-muted block mt-0.5">
                          {formatRelativeTime(bill.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Line items preview pills */}
                  <div className="mt-2.5 pt-2 border-t border-line/60 flex flex-wrap gap-1.5">
                    {bill.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-[11px] bg-sand/60 text-ink-2 px-2 py-0.5 rounded">
                        {item.materialName} ({item.quantity} {item.unit})
                      </span>
                    ))}
                    {bill.items.length > 3 && (
                      <span className="text-[11px] text-muted px-1.5 py-0.5">
                        +{bill.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Bill Detail & Preview (7 cols on lg) */}
          <div className="lg:col-span-7 bg-paper border border-line rounded-card p-6 shadow-sm sticky top-6">
            {selectedBill ? (
              <div className="space-y-6">
                {/* Header with Vendor & Status */}
                <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                      Vendor
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                      {selectedBill.vendorName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted">
                      {selectedBill.billNumber && (
                        <span>Bill #{selectedBill.billNumber}</span>
                      )}
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{selectedBill.date}</span>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Uploaded by {selectedBill.uploadedBy}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {selectedBill.status === 'to_review' ? (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-soft text-amber border border-amber/30">
                          <Clock className="w-3 h-3" />
                          <span>Waiting for review</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMarkReviewed(selectedBill.id)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-olive text-paper text-xs font-medium hover:bg-olive/90 transition-all shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark reviewed</span>
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-olive-soft text-olive border border-olive/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Reviewed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Photo Preview Thumbnail & Zoom Option */}
                {selectedBill.photoUrl && (
                  <div className="p-3 bg-sand/30 rounded-xl border border-line flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="w-14 h-14 rounded-lg overflow-hidden border border-line bg-paper cursor-pointer relative group shrink-0"
                      >
                        <img 
                          src={selectedBill.photoUrl} 
                          alt="Bill preview" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-paper">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ink">Bill photo attached</p>
                        <p className="text-[11px] text-muted mt-0.5">Click to view full receipt or zoom</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/40 transition-colors inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted" />
                      <span>View photo</span>
                    </button>
                  </div>
                )}

                {/* Line Items Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-muted font-medium">
                      Line items ({selectedBill.items.length})
                    </h4>
                    {canSeeAmounts && (
                      <span className="text-xs text-muted">
                        All rates exclude GST
                      </span>
                    )}
                  </div>

                  <div className="border border-line rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-sand/40 text-muted font-medium border-b border-line">
                        <tr>
                          <th className="py-2.5 px-3">Item</th>
                          <th className="py-2.5 px-3 text-right">Quantity</th>
                          {canSeeAmounts && (
                            <>
                              <th className="py-2.5 px-3 text-right">Rate</th>
                              <th className="py-2.5 px-3 text-right">Amount</th>
                            </>
                          )}
                          <th className="py-2.5 px-3 text-center">Stock status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60">
                        {selectedBill.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-sand/20 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-ink">
                              {item.materialName}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-ink">
                              {item.quantity} {item.unit}
                            </td>
                            {canSeeAmounts && (
                              <>
                                <td className="py-2.5 px-3 text-right tabular-nums text-muted">
                                  {formatCurrencyINR(item.rate)}
                                </td>
                                <td className="py-2.5 px-3 text-right tabular-nums font-medium text-ink">
                                  {formatCurrencyINR(item.quantity * item.rate)}
                                </td>
                              </>
                            )}
                            <td className="py-2.5 px-3 text-center">
                              {item.addToStock ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-olive-soft text-olive">
                                  Added to site stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-sand text-muted">
                                  Expense only
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {canSeeAmounts && (
                        <tfoot className="bg-sand/30 font-medium border-t border-line text-ink">
                          <tr>
                            <td colSpan={3} className="py-3 px-3 text-right font-serif text-sm">
                              Bill Total:
                            </td>
                            <td className="py-3 px-3 text-right font-serif text-base font-medium tabular-nums text-ink">
                              {formatCurrencyINR(
                                selectedBill.items.reduce((s, it) => s + (it.quantity * it.rate), 0)
                              )}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-sm text-muted">
                Select a bill from the left to view details and receipt.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bill Photo Lightbox Modal */}
      {isPhotoModalOpen && selectedBill?.photoUrl && (
        <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-paper rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper">
              <div>
                <h4 className="font-serif font-medium text-ink">
                  {selectedBill.vendorName} · Bill Receipt
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Uploaded on {selectedBill.date} by {selectedBill.uploadedBy}
                </p>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-sand/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-sand/20">
              <img 
                src={selectedBill.photoUrl} 
                alt="Full bill" 
                className="max-h-[70vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="p-3 border-t border-line bg-paper flex items-center justify-between text-xs text-muted">
              <span>Receipt image</span>
              <a
                href={selectedBill.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-ink font-medium hover:underline"
              >
                <span>Open original in new tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
