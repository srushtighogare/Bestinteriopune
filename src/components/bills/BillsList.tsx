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
  ExternalLink,
  Edit3,
  MapPin,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';
import { Bill, Project } from '../../types';
import { billsService } from '../../services/billsService';
import { projectsService } from '../../services/projectsService';
import { formatCurrencyINR, formatRelativeTime } from '../../utils/calculations';
import { EditBillModal } from './EditBillModal';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') as 'to_review' | 'reviewed') || 'all';

  // Data
  const [bills, setBills] = useState<Bill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'to_review' | 'reviewed'>(initialStatus);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(projectId || 'all');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Load bills and projects
  const loadBillsData = async () => {
    setIsLoading(true);
    try {
      const [billsData, projectsData] = await Promise.all([
        billsService.list(projectId),
        projectsService.list(),
      ]);

      setBills(billsData);
      setProjects(projectsData);

      if (billsData.length > 0 && !selectedBillId) {
        setSelectedBillId(billsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load bills list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillsData();

    const handleStorageChange = () => {
      loadBillsData();
    };

    window.addEventListener('studioos_storage_change', handleStorageChange);
    window.addEventListener('studioos_storage_reset', handleStorageChange);
    return () => {
      window.removeEventListener('studioos_storage_change', handleStorageChange);
      window.removeEventListener('studioos_storage_reset', handleStorageChange);
    };
  }, [projectId]);

  // Sync URL status query param
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus === 'to_review' || urlStatus === 'reviewed') {
      setStatusFilter(urlStatus);
    }
  }, [searchParams]);

  // Project map for quick lookup
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach(p => map.set(p.id, p));
    return map;
  }, [projects]);

  // Extract unique vendors for vendor filter dropdown
  const uniqueVendors = useMemo(() => {
    const set = new Set<string>();
    bills.forEach(b => {
      if (b.vendorName) set.add(b.vendorName);
    });
    return Array.from(set).sort();
  }, [bills]);

  // Extract unique months for month filter dropdown
  const uniqueMonths = useMemo(() => {
    const monthMap = new Map<string, string>(); // '2026-10' => 'October 2026'
    bills.forEach(b => {
      if (b.date) {
        const parts = b.date.split('-');
        if (parts.length >= 2) {
          const key = `${parts[0]}-${parts[1]}`;
          if (!monthMap.has(key)) {
            const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
            const label = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            monthMap.set(key, label);
          }
        }
      }
    });

    return Array.from(monthMap.entries()).map(([key, label]) => ({
      key,
      label,
    }));
  }, [bills]);

  // Filter bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      // Status filter
      if (statusFilter !== 'all' && bill.status !== statusFilter) return false;

      // Project filter (if not locked to a specific project prop)
      if (!projectId && selectedProjectFilter !== 'all' && bill.projectId !== selectedProjectFilter) {
        return false;
      }

      // Vendor filter
      if (selectedVendorFilter !== 'all' && bill.vendorName !== selectedVendorFilter) {
        return false;
      }

      // Month filter
      if (selectedMonthFilter !== 'all' && bill.date) {
        const billMonthKey = bill.date.substring(0, 7); // 'YYYY-MM'
        if (billMonthKey !== selectedMonthFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesVendor = bill.vendorName.toLowerCase().includes(query);
        const matchesNumber = bill.billNumber ? bill.billNumber.toLowerCase().includes(query) : false;
        const matchesUploader = bill.uploadedBy.toLowerCase().includes(query);
        const matchesItem = bill.items.some(it => it.materialName.toLowerCase().includes(query));
        const matchesProj = (projectMap.get(bill.projectId)?.name || '').toLowerCase().includes(query);

        return matchesVendor || matchesNumber || matchesUploader || matchesItem || matchesProj;
      }

      return true;
    });
  }, [bills, statusFilter, selectedProjectFilter, selectedVendorFilter, selectedMonthFilter, searchQuery, projectId, projectMap]);

  // Selected bill object
  const selectedBill = useMemo(() => {
    const found = bills.find(b => b.id === selectedBillId);
    if (found) return found;
    return filteredBills[0] || null;
  }, [bills, selectedBillId, filteredBills]);

  // Compute total spent on filtered bills
  const totalFilteredAmount = useMemo(() => {
    return filteredBills.reduce((total, b) => {
      const billSum = b.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      return total + billSum;
    }, 0);
  }, [filteredBills]);

  // Mark bill as reviewed
  const handleMarkReviewed = async (billId: string) => {
    try {
      await billsService.markReviewed(billId);
      await loadBillsData();
    } catch (err) {
      console.error('Failed to mark bill as reviewed:', err);
    }
  };

  // Open Edit Bill Modal
  const handleOpenEditModal = (bill: Bill) => {
    setEditingBill(bill);
    setIsEditModalOpen(true);
  };

  // Download Bill Photo
  const handleDownloadPhoto = (photoUrl: string, fileName?: string) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = fileName || `bill-${Date.now()}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Count to-review
  const toReviewCount = useMemo(() => {
    return bills.filter(b => b.status === 'to_review').length;
  }, [bills]);

  return (
    <div className="space-y-6">
      
      {/* 1. Filters & Search Bar */}
      <div className="bg-paper p-4 rounded-card border border-line shadow-xs space-y-3.5">
        
        {/* Top Controls: Status chips & Monthly Total for owner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                const newP = new URLSearchParams(searchParams);
                newP.delete('status');
                setSearchParams(newP);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-ink text-paper shadow-xs'
                  : 'bg-sand/60 text-muted hover:text-ink hover:bg-sand'
              }`}
            >
              All bills ({bills.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setStatusFilter('to_review');
                const newP = new URLSearchParams(searchParams);
                newP.set('status', 'to_review');
                setSearchParams(newP);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                statusFilter === 'to_review'
                  ? 'bg-amber text-paper shadow-xs'
                  : 'bg-amber-soft text-amber hover:bg-amber-soft/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>To review ({toReviewCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStatusFilter('reviewed');
                const newP = new URLSearchParams(searchParams);
                newP.set('status', 'reviewed');
                setSearchParams(newP);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                statusFilter === 'reviewed'
                  ? 'bg-olive text-paper shadow-xs'
                  : 'bg-olive-soft text-olive hover:bg-olive-soft/80'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reviewed ({bills.filter(b => b.status === 'reviewed').length})</span>
            </button>
          </div>

          {/* Monthly Total for Owner / Manager-if-allowed */}
          {canSeeAmounts && (
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                {selectedMonthFilter !== 'all' 
                  ? `Total for ${uniqueMonths.find(m => m.key === selectedMonthFilter)?.label}`
                  : 'Total for selection'}
              </span>
              <span className="text-base sm:text-lg font-serif font-medium text-ink tabular-nums">
                {formatCurrencyINR(totalFilteredAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Second Row: Dropdown Filters (Project, Vendor, Month) & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-line/60 items-center">
          
          {/* Project Filter (only on global /bills page) */}
          {!projectId && (
            <div className="sm:col-span-3">
              <select
                value={selectedProjectFilter}
                onChange={e => setSelectedProjectFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink font-medium"
              >
                <option value="all">All sites</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Vendor Filter */}
          <div className={!projectId ? "sm:col-span-3" : "sm:col-span-4"}>
            <select
              value={selectedVendorFilter}
              onChange={e => setSelectedVendorFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
            >
              <option value="all">All vendors</option>
              {uniqueVendors.map(ven => (
                <option key={ven} value={ven}>{ven}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className={!projectId ? "sm:col-span-3" : "sm:col-span-4"}>
            <select
              value={selectedMonthFilter}
              onChange={e => setSelectedMonthFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
            >
              <option value="all">All months</option>
              {uniqueMonths.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className={!projectId ? "sm:col-span-3" : "sm:col-span-4"}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Main Layout: Left Bill List + Right Preview Panel */}
      {isLoading ? (
        <div className="p-16 text-center text-sm text-muted">Loading bills...</div>
      ) : filteredBills.length === 0 ? (
        <div className="p-12 rounded-card bg-ivory/50 border border-line text-center space-y-3">
          <FileText className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
          <p className="text-sm font-medium text-ink">No bills found</p>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || selectedProjectFilter !== 'all' || selectedVendorFilter !== 'all' || selectedMonthFilter !== 'all'
              ? 'Try changing your search terms or filter selections.'
              : 'No bills have been uploaded yet.'}
          </p>
          {(searchQuery || statusFilter !== 'all' || selectedProjectFilter !== 'all' || selectedVendorFilter !== 'all' || selectedMonthFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSelectedProjectFilter('all');
                setSelectedVendorFilter('all');
                setSelectedMonthFilter('all');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-line text-xs font-medium text-ink hover:bg-sand/40 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Bills List (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredBills.map((bill) => {
              const isSelected = selectedBill?.id === bill.id;
              const isToReview = bill.status === 'to_review';
              const billSum = bill.items.reduce((s, it) => s + (it.quantity * it.rate), 0);
              const billProject = projectMap.get(bill.projectId);

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
                    <div className="min-w-0 flex-1">
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

                      {/* Project badge and metadata */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                        {billProject && !projectId && (
                          <>
                            <span className="font-medium text-ink-2 bg-sand/60 px-1.5 py-0.5 rounded text-[11px]">
                              {billProject.name}
                            </span>
                            <span>·</span>
                          </>
                        )}
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

                    {/* Spend amount */}
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

          {/* Right Column: Full Bill Preview & Inspector (7 cols on lg) */}
          <div className="lg:col-span-7 bg-paper border border-line rounded-card p-6 shadow-sm sticky top-6">
            {selectedBill ? (
              <div className="space-y-6">
                
                {/* Header with Vendor, Project & Status */}
                <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                      Vendor Invoice
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                      {selectedBill.vendorName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted">
                      {projectMap.get(selectedBill.projectId) && (
                        <span className="font-medium text-ink flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-muted" />
                          <span>{projectMap.get(selectedBill.projectId)?.name}</span>
                        </span>
                      )}
                      {selectedBill.billNumber && (
                        <>
                          <span>·</span>
                          <span>Bill #{selectedBill.billNumber}</span>
                        </>
                      )}
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{selectedBill.date}</span>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>By {selectedBill.uploadedBy}</span>
                      </span>
                    </div>
                  </div>

                  {/* Review Action Top-Right */}
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
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-olive text-paper text-xs font-medium hover:bg-olive/90 transition-all shadow-xs"
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

                {/* Photo Preview Strip & Download Action */}
                {selectedBill.photoUrl && (
                  <div className="p-3.5 bg-ivory/60 rounded-xl border border-line flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-line bg-paper cursor-pointer relative group shrink-0 shadow-xs"
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
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-ink truncate">Original Receipt Document</p>
                        <p className="text-[11px] text-muted mt-0.5">Click photo to zoom and inspect handwriting</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/40 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-muted" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPhoto(selectedBill.photoUrl, `bill-${selectedBill.billNumber || selectedBill.id}.png`)}
                        className="px-3 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/40 transition-colors inline-flex items-center gap-1.5"
                        title="Download photo"
                      >
                        <Download className="w-3.5 h-3.5 text-muted" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Line Items Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-muted font-medium">
                      Line Items ({selectedBill.items.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(selectedBill)}
                      className="inline-flex items-center gap-1 text-xs text-olive font-medium hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit items</span>
                    </button>
                  </div>

                  <div className="border border-line rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-ivory/60 text-muted font-medium border-b border-line">
                        <tr>
                          <th className="py-2.5 px-3">Item</th>
                          <th className="py-2.5 px-3 text-right">Quantity</th>
                          {canSeeAmounts && (
                            <>
                              <th className="py-2.5 px-3 text-right">Rate</th>
                              <th className="py-2.5 px-3 text-right">Amount</th>
                            </>
                          )}
                          <th className="py-2.5 px-3 text-center">Site stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60 bg-paper">
                        {selectedBill.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-ivory/40 transition-colors">
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
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-sand/60 text-muted">
                                  Expense only
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      {canSeeAmounts && (
                        <tfoot className="bg-ivory/50 font-medium border-t border-line text-ink">
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

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(selectedBill)}
                      className="px-3.5 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-muted" />
                      <span>Edit items</span>
                    </button>

                    {selectedBill.photoUrl && (
                      <button
                        type="button"
                        onClick={() => handleDownloadPhoto(selectedBill.photoUrl, `bill-${selectedBill.billNumber || selectedBill.id}.png`)}
                        className="px-3.5 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-muted" />
                        <span>Download receipt</span>
                      </button>
                    )}
                  </div>

                  {selectedBill.status === 'to_review' && (
                    <button
                      type="button"
                      onClick={() => handleMarkReviewed(selectedBill.id)}
                      className="px-4 py-1.5 rounded-lg bg-olive text-paper text-xs font-medium hover:bg-olive/90 transition-all inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark reviewed</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-16 text-center text-sm text-muted">
                Select a bill from the left to view details and receipt.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. Photo Lightbox Modal */}
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
                type="button"
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadPhoto(selectedBill.photoUrl, `bill-${selectedBill.billNumber || selectedBill.id}.png`)}
                  className="inline-flex items-center gap-1 text-ink font-medium hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <a
                  href={selectedBill.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-ink font-medium hover:underline"
                >
                  <span>Open in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit Bill Modal */}
      {isEditModalOpen && editingBill && (
        <EditBillModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingBill(null);
          }}
          onSuccess={() => {
            loadBillsData();
          }}
          bill={editingBill}
        />
      )}

    </div>
  );
};
