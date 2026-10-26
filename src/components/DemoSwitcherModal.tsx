import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, X, Check, Shield, Wrench, HardHat, UserX, LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface DemoUserOption {
  id: string;
  name: string;
  roleTitle: string;
  subtitle: string;
  role: 'owner' | 'manager' | 'supervisor' | 'worker';
  targetPath: '/' | '/app';
  icon: LucideIcon;
  isDeactivated?: boolean;
}

const DEMO_USERS: DemoUserOption[] = [
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000001',
    name: 'Megha Jadhav',
    roleTitle: 'Studio Owner',
    subtitle: 'Full console access, rates, bills spend, team & settings',
    role: 'owner',
    targetPath: '/',
    icon: Shield,
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000002',
    name: 'Neha Kulkarni',
    roleTitle: 'Studio Manager',
    subtitle: 'Projects, inventory, bills review, site progress oversight',
    role: 'manager',
    targetPath: '/',
    icon: User,
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    name: 'Rajiv Deshmukh',
    roleTitle: 'Site Supervisor',
    subtitle: 'Assigned to all 3 sites. Material received, progress grid, stock checks (no rates)',
    role: 'supervisor',
    targetPath: '/app',
    icon: HardHat,
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
    name: 'Gurmukh Singh',
    roleTitle: 'Carpenter Lead',
    subtitle: 'Mehta Residence & Baner Villa. Material used, work done photos (no rates)',
    role: 'worker',
    targetPath: '/app',
    icon: Wrench,
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
    name: 'Imran Shaikh',
    roleTitle: 'Electrician Lead',
    subtitle: 'Mehta Residence & Kharadi Office. Electrical materials, progress updates',
    role: 'worker',
    targetPath: '/app',
    icon: Wrench,
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000008',
    name: 'Arun Shinde',
    roleTitle: 'Deactivated Member (Test)',
    subtitle: 'Demonstrates immediate access revocation rule',
    role: 'worker',
    targetPath: '/app',
    icon: UserX,
    isDeactivated: true,
  },
];

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUserById } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = async (userOpt: DemoUserOption) => {
    await setCurrentUserById(userOpt.id, true);
    onClose();
    navigate(userOpt.targetPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-paper rounded-2xl border border-line shadow-float overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-ivory/60">
          <div>
            <h3 className="font-serif text-lg font-medium text-ink">Demo: sign in as…</h3>
            <p className="text-xs text-muted">Select a persona to test the prototype in client meeting</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-sand/30 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto">
          {DEMO_USERS.map((userOpt) => {
            const Icon = userOpt.icon;
            const isSelected = currentUser?.id === userOpt.id;

            return (
              <button
                key={userOpt.id}
                onClick={() => handleSelect(userOpt)}
                className={cn(
                  "w-full p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all",
                  userOpt.isDeactivated 
                    ? "bg-rust-soft/30 border-rust/30 hover:bg-rust-soft/60" 
                    : isSelected 
                      ? "bg-olive-soft/70 border-olive" 
                      : "bg-paper hover:bg-sand/30 border-line"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    userOpt.isDeactivated ? "bg-rust-soft text-rust" : "bg-sand/40 text-ink"
                  )}>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-medium text-ink">{userOpt.name}</span>
                      <span className="text-[10px] uppercase font-semibold text-muted tracking-wider bg-sand/30 px-1.5 py-0.5 rounded">
                        {userOpt.roleTitle}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-snug">{userOpt.subtitle}</p>
                    <span className="text-[10px] text-olive font-medium mt-1 inline-block">
                      Opens in {userOpt.targetPath === '/' ? 'Studio Console (Desktop)' : 'Site App (Phone)'}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-olive shrink-0 mt-1" strokeWidth={2} />
                )}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-line bg-ivory/40 text-center">
          <p className="text-[11px] text-muted">
            All roles read from local mock storage. Numbers recalculate per user permissions.
          </p>
        </div>
      </div>
    </div>
  );
};
