import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  ShieldAlert 
} from 'lucide-react';
import { User } from '../../types';
import { teamService } from '../../services/teamService';
import { formatPhone } from '../../utils/formatters';

interface ResetPinModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      handleGenerate();
    } else {
      setInviteUrl('');
      setUpdatedUser(null);
      setCopied(false);
      setError(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await teamService.resetPin(user.id);
      if (res) {
        setInviteUrl(res.inviteUrl);
        setUpdatedUser(res.user);
        onSuccess(res.user);
      } else {
        setError('Failed to generate reset link.');
      }
    } catch (err: any) {
      console.error('Failed to reset PIN:', err);
      setError(err?.message || 'Error generating PIN reset link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanPhone = user.phone.replace(/\D/g, '');
  const message = `Hi ${user.name}, here is your link to reset your PIN for Bestinterio on StudioOS: ${inviteUrl}`;
  const whatsappUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
                Security & Access
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                Reset PIN for {user.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Share this link with them to choose a new 4-digit site PIN
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

          <div className="space-y-5">
            {/* Info note */}
            <div className="p-3.5 rounded-xl border border-line bg-ivory/50 flex items-start gap-2.5">
              <Key className="w-4 h-4 text-muted shrink-0 mt-0.5" />
              <div className="text-xs text-ink-2 space-y-1">
                <p>
                  A PIN reset link has been generated for <strong className="text-ink">{user.name}</strong> ({formatPhone(user.phone)}).
                </p>
                <p className="text-muted text-[11px]">
                  When opened on their phone, they will be prompted to set a new PIN. Existing project memberships are preserved.
                </p>
              </div>
            </div>

            {/* Link Preview and Copy */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Reset link</label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-line bg-sand/15">
                <p className="text-xs font-mono text-ink-2 truncate flex-1 select-all">
                  {isGenerating ? 'Generating reset link...' : inviteUrl}
                </p>
                <button
                  type="button"
                  disabled={isGenerating || !inviteUrl}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 shrink-0 transition-colors shadow-xs disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-olive" />
                      <span className="text-olive">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 border-t border-line">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-olive text-paper text-xs font-medium hover:bg-olive/90 shadow-soft transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
              >
                Done
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};