import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { User } from '../../types';
import { teamService } from '../../services/teamService';
import { formatPhone } from '../../utils/formatters';

interface ShareInviteModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const inviteCode = user.inviteCode || user.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const inviteUrl = teamService.generateInviteLink(inviteCode);
  const cleanPhone = user.phone.replace(/\D/g, '');
  const message = `Hi ${user.name}, you have been invited to join Bestinterio on StudioOS. Open your site app here to set your PIN: ${inviteUrl}`;
  const whatsappUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
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
                Onboarding Invitation
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                Share invite with {user.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Send the onboarding link to {formatPhone(user.phone)}
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

          <div className="space-y-5">
            {/* Note */}
            <div className="p-3.5 rounded-xl border border-line bg-ivory/50 flex items-start gap-2.5">
              <Share2 className="w-4 h-4 text-muted shrink-0 mt-0.5" />
              <p className="text-xs text-ink-2 leading-relaxed">
                When <strong className="text-ink">{user.name}</strong> opens this link, they will verify their phone and choose their 4-digit PIN for the site app.
              </p>
            </div>

            {/* Link Preview and Copy */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Invite link</label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-line bg-sand/15">
                <p className="text-xs font-mono text-ink-2 truncate flex-1 select-all">
                  {inviteUrl}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 shrink-0 transition-colors shadow-xs"
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