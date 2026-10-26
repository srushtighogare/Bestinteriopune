import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Upload, AlertCircle, Check } from 'lucide-react';

interface ImportExcelMockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExcelMockModal: React.FC<ImportExcelMockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showDemoNote, setShowDemoNote] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-olive-soft text-olive flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">
                  Import Catalogue from Excel
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Bulk import materials, categories and thresholds
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Template Download Bar */}
          <div className="p-3.5 rounded-xl bg-ivory border border-line flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-medium text-ink block">Need a formatted template?</span>
              <span className="text-[11px] text-muted">Includes column headers and sample materials.</span>
            </div>
            <button
              type="button"
              onClick={() => alert('Demo template: In Phase 1, this downloads "Bestinterio_Catalogue_Template.xlsx" with sample items.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-paper text-ink font-medium hover:bg-sand/30 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-muted" />
              <span>Download template</span>
            </button>
          </div>

          {/* Dropzone */}
          <div 
            onClick={() => setSelectedFile('Bestinterio_Master_Materials_2026.xlsx')}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              selectedFile ? 'border-olive bg-olive-soft/20' : 'border-line hover:border-sand-dark bg-paper'
            }`}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-olive-soft text-olive flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-ink">{selectedFile}</p>
                <p className="text-xs text-muted">File ready for validation · 48 material entries detected</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setShowDemoNote(false);
                  }}
                  className="text-xs text-rust hover:underline pt-1 inline-block"
                >
                  Choose another file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
                <p className="text-xs font-medium text-ink">
                  Click to browse or drag and drop spreadsheet
                </p>
                <p className="text-[11px] text-muted">
                  Supports .xlsx, .xls, and .csv files up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Supported Format Specification */}
          <div className="space-y-2 text-xs text-muted">
            <span className="font-medium text-ink uppercase text-[10px] tracking-wider block">
              Supported Columns
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Category', 'Material Name', 'Unit', 'Shade / Code', 'Low-Stock Level', 'Estimated Rate'].map((col) => (
                <span key={col} className="px-2 py-0.5 rounded bg-sand/40 border border-line text-ink-2 text-[11px]">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {showDemoNote && (
            <div className="p-3.5 rounded-xl bg-sand/40 border border-line text-xs text-ink-2 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
              <span>
                <strong>Demo mock:</strong> In Phase 1 with Supabase, this will validate and batch-insert your spreadsheet records into the studio catalogue.
              </span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setShowDemoNote(true)}
              disabled={!selectedFile}
              className="px-5 py-2 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 disabled:opacity-40 transition-all shadow-soft"
            >
              Import materials
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
