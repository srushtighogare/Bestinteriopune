import React, { useState, useEffect } from 'react';
import { X, Check, FolderCheck, AlertCircle, Building2 } from 'lucide-react';
import { User, Project } from '../../types';
import { teamService } from '../../services/teamService';

interface ChangeProjectsModalProps {
  isOpen: boolean;
  user: User | null;
  projects: Project[];
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const ChangeProjectsModal: React.FC<ChangeProjectsModalProps> = ({
  isOpen,
  user,
  projects,
  onClose,
  onSuccess,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSelectedIds(user.assignedProjectIds || []);
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleToggle = (projectId: string) => {
    setSelectedIds(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(p => p.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await teamService.updateProjects(user.id, selectedIds);
      if (updated) {
        onSuccess(updated);
        onClose();
      } else {
        setError('Failed to update assigned projects.');
      }
    } catch (err: any) {
      console.error('Failed to update projects:', err);
      setError(err?.message || 'Error updating assigned projects.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="flex items-start justify-between border-b border-line pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium block">
                Project Membership
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                Change projects for {user.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Updates take effect immediately on their site app without needing a new invite
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Note banner */}
            <div className="p-3.5 rounded-xl border border-line bg-ivory/50 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-muted shrink-0 mt-0.5" />
              <p className="text-xs text-ink-2 leading-relaxed">
                Project access comes from project membership. When you assign <strong className="text-ink">{user.name}</strong> to another project, it will appear on their site app home automatically. No new invite link is required.
              </p>
            </div>

            {/* Project List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink">
                  Assigned projects ({selectedIds.length} of {projects.length})
                </span>
                {projects.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] text-muted hover:text-ink transition-colors underline"
                  >
                    {selectedIds.length === projects.length ? 'Deselect all' : 'Select all'}
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {projects.map((p) => {
                  const isChecked = selectedIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-ink/50 bg-sand/20'
                          : 'border-line/70 bg-paper hover:bg-sand/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(p.id)}
                          className="rounded border-line text-ink focus:ring-0 focus:outline-none w-4 h-4 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                          <p className="text-[10px] text-muted truncate">{p.customerName || p.address}</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded-md bg-sand/40 text-muted shrink-0">
                        {p.type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft transition-all disabled:opacity-50"
              >
                <FolderCheck className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Save changes'}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};