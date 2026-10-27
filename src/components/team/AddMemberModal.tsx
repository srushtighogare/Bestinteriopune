import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  UserPlus, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Shield,
  Smartphone
} from 'lucide-react';
import { User, UserRole, TradeType, Project } from '../../types';
import { teamService } from '../../services/teamService';
import { formatPhone } from '../../utils/formatters';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: User) => void;
  projects: Project[];
  studioId?: string;
}

const TRADES: { id: TradeType; label: string }[] = [
  { id: 'carpentry', label: 'Carpentry' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'civil', label: 'Civil' },
  { id: 'painting', label: 'Painting' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'false_ceiling', label: 'False ceiling' },
  { id: 'other', label: 'Other' },
];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projects,
  studioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
}) => {
  const [step, setStep] = useState<'form' | 'share'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [trade, setTrade] = useState<TradeType>('carpentry');
  const [assignedProjectIds, setAssignedProjectIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Created user info for share step
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep('form');
    setName('');
    setPhone('');
    setRole('worker');
    setTrade('carpentry');
    setAssignedProjectIds([]);
    setError(null);
    setCreatedUser(null);
    setCopied(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleToggleProject = (pId: string) => {
    setAssignedProjectIds(prev => 
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    );
  };

  const handleSelectAllProjects = () => {
    if (assignedProjectIds.length === projects.length) {
      setAssignedProjectIds([]);
    } else {
      setAssignedProjectIds(projects.map(p => p.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter the team member’s name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check if phone already exists
    const existing = await teamService.getByPhone(cleanPhone);
    if (existing) {
      setError(`A team member with phone ${cleanPhone} already exists (${existing.name}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const inviteCode = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newUser = await teamService.create({
        studioId,
        name: cleanName,
        phone: cleanPhone.slice(-10),
        role,
        trade: role === 'worker' ? trade : undefined,
        assignedProjectIds,
        status: 'invited',
        inviteCode,
      });

      setCreatedUser(newUser);
      setStep('share');
      onSuccess(newUser);
    } catch (err: any) {
      console.error('Failed to add team member:', err);
      setError(err?.message || 'Failed to create team member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp and invite URL generation
  const inviteUrl = createdUser ? teamService.generateInviteLink(createdUser.inviteCode || '') : '';
  const cleanPhone = createdUser?.phone.replace(/\D/g, '') || '';
  const inviteMessage = `Hi ${createdUser?.name}, you have been invited to join Bestinterio on StudioOS. Open your site app here to set your PIN: ${inviteUrl}`;
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(inviteMessage)}`;

  const handleCopyLink = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-paper border border-line rounded-card shadow-2xl overflow-hidden p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-line pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium block">
                {step === 'form' ? 'Add to Studio Team' : 'Invite Ready'}
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink mt-0.5">
                {step === 'form' ? 'Add member' : `Share invite with ${createdUser?.name}`}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {step === 'form' 
                  ? 'They will receive an invite link to set their 4-digit site PIN' 
                  : 'Send the onboarding link directly on WhatsApp or copy the URL'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
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

          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink flex items-center gap-1.5">
                  <span>Full name</span>
                  <span className="text-rust">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-muted" />
                  <span>Phone number (WhatsApp)</span>
                  <span className="text-rust">*</span>
                </label>
                <div className="flex rounded-xl border border-line overflow-hidden focus-within:border-ink transition-colors">
                  <span className="px-3 py-2 bg-ivory text-xs text-muted font-medium border-r border-line flex items-center select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98220 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-paper text-sm text-ink placeholder:text-muted/60 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-muted">
                  Used for login and to share their personal invite link via WhatsApp.
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-muted" />
                  <span>Role</span>
                  <span className="text-rust">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['manager', 'supervisor', 'worker'] as UserRole[]).map((r) => {
                    const isSelected = role === r;
                    const label = r === 'manager' ? 'Manager' : r === 'supervisor' ? 'Supervisor' : 'Worker';
                    const desc = r === 'manager' ? 'Studio ops' : r === 'supervisor' ? 'Site lead' : 'Site trade';
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-ink bg-sand/30 shadow-xs'
                            : 'border-line bg-paper hover:bg-sand/15 text-muted'
                        }`}
                      >
                        <p className={`text-xs font-medium ${isSelected ? 'text-ink' : 'text-ink-2'}`}>
                          {label}
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trade Selection (only for workers) */}
              {role === 'worker' && (
                <div className="space-y-2 p-3.5 rounded-xl border border-line bg-ivory/50">
                  <label className="text-xs font-medium text-ink flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-muted" />
                    <span>Trade specialization</span>
                    <span className="text-rust">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {TRADES.map((t) => {
                      const isSelected = trade === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTrade(t.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-center ${
                            isSelected
                              ? 'bg-ink text-paper shadow-xs'
                              : 'bg-paper border border-line text-ink-2 hover:bg-sand/20'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Assign Projects */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-ink">
                    Assign to projects ({assignedProjectIds.length} selected)
                  </label>
                  {projects.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllProjects}
                      className="text-[11px] text-muted hover:text-ink transition-colors underline"
                    >
                      {assignedProjectIds.length === projects.length ? 'Deselect all' : 'Select all'}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {projects.map((p) => {
                    const isChecked = assignedProjectIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-ink/50 bg-sand/20'
                            : 'border-line/70 bg-paper hover:bg-sand/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleProject(p.id)}
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
                <p className="text-[11px] text-muted">
                  You can also assign or unassign projects at any time without sending a new invite.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft transition-all disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Creating...' : 'Create & generate invite'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Share Step */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-olive-soft border border-olive/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-ink">
                    {createdUser?.name} was added to the studio
                  </p>
                  <p className="text-[11px] text-ink-2">
                    Their status is <strong className="text-ink">Invited</strong>. Send them their invite link to choose a 4-digit PIN.
                  </p>
                </div>
              </div>

              {/* Summary box */}
              <div className="p-3.5 rounded-xl border border-line bg-ivory/40 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted">Phone:</span>
                  <span className="font-medium text-ink">{formatPhone(createdUser?.phone || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Role:</span>
                  <span className="font-medium text-ink capitalize">
                    {createdUser?.role}
                    {createdUser?.trade ? ` (${createdUser.trade})` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Assigned projects:</span>
                  <span className="font-medium text-ink">
                    {assignedProjectIds.length} {assignedProjectIds.length === 1 ? 'project' : 'projects'}
                  </span>
                </div>
              </div>

              {/* Invite Link Preview & Copy */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink">Invite link</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-line bg-sand/15">
                  <p className="text-xs font-mono text-ink-2 truncate flex-1 select-all">
                    {inviteUrl}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
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

              {/* Primary Actions for Share */}
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
                  onClick={handleClose}
                  className="w-full py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};