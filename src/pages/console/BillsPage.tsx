import React, { useState, useEffect, useMemo } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { settingsService } from '../../services/settingsService';
import { Studio } from '../../types';
import { BillsList } from '../../components/bills/BillsList';
import { UploadBillDrawer } from '../../components/bills/UploadBillDrawer';

export const BillsPage: React.FC = () => {
  const { role } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    settingsService.getStudio().then(setStudio);
  }, []);

  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header with exactly ONE primary action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-ink tracking-tight">
            Bills
          </h1>
          <p className="text-sm text-muted mt-1 font-sans">
            Vendor invoices and material receipts across all projects
          </p>
        </div>

        {/* Single primary button on /bills */}
        <button
          type="button"
          onClick={() => setIsUploadDrawerOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" strokeWidth={1.5} />
          <span>Upload bill</span>
        </button>
      </div>

      {/* 2. Shared BillsList Component */}
      <BillsList 
        key={refreshKey}
        canSeeAmounts={canSeeAmounts} 
        onUploadClick={() => setIsUploadDrawerOpen(true)}
      />

      {/* 3. Upload Bill Side Panel Drawer */}
      <UploadBillDrawer
        isOpen={isUploadDrawerOpen}
        onClose={() => setIsUploadDrawerOpen(false)}
        onSuccess={() => {
          setRefreshKey(k => k + 1);
        }}
      />
    </div>
  );
};
