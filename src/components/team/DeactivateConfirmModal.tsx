import React, { useState } from 'react';
import { X, AlertTriangle, UserX, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { teamService } from '../../services/teamService';
import { formatPhone } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

interface DeactivateConfirmModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (deactivatedUser: User) => void;
}

export const DeactivateConfirmModal: React.FC<DeactivateConfirmModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const isOwner = user.role === 'owner';
  const isSelf = currentUser?.id === user.id;

  const handleConfirm = async () => {
    if (isOwner) {
      setError("The studio owner can't be deactivated.");
      return;
    }
    if (isSelf) {
      setError('You cannot deactivate your own account.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await teamService.deactivate(user.id, currentUser?.id);
      if (updated) {
        onSuccess(updated);
        onClose();
      } else {
        setError('Failed to deactivate team member.');
      }
    } catch (err: any) {
      console.error('Failed to deactivate user:', err);
      setError(err?.message || 'Error deactivating user.');
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
        <div className="relative w-full max-w-md bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-5">
          
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rust-soft border border-rust/30 flex items-center justify-center text-rust shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-medium text-ink">
                Deactivate {user.name}?
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {user.role.toUpperCase()} {user.trade ? `· ${user.trade}` : ''} · {formatPhone(user.phone)}
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

          {isOwner ? (
            <div className="p-3.5 rounded-xl border border-line bg-sand/20 text-xs text-ink-2">
              Megha Jadhav is the registered studio owner. The studio owner can't be deactivated.
            </div>
          ) : isSelf ? (
            <div className="p-3.5 rounded-xl border border-line bg-sand/20 text-xs text-ink-2">
              You cannot deactivate your own account while signed in. Ask another administrator if your role needs adjusting.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-rust/20 bg-rust-soft/50 text-xs text-ink-2 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-rust">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Immediate access removal</span>
                </div>
                <p className="leading-relaxed">
                  <strong className="text-ink">{user.name}</strong> will be immediately signed out of StudioOS on all devices and will lose access to all assigned projects.
                </p>
                <p className="text-muted text-[11px] pt-1">
                  Their logged activity, progress updates, and history will remain intact. You can reactivate them at any time from this table.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
            >
              Cancel
            </button>
            {!isOwner && !isSelf && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-rust text-paper text-xs font-medium hover:bg-rust/90 shadow-soft transition-all disabled:opacity-50"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Deactivating...' : 'Deactivate member'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};