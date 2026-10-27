import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkObviousPin } from '../../utils/validation';
import { teamService } from '../../services/teamService';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';
import { 
  ArrowRight, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  CheckCircle2, 
  ShieldCheck,
  Clock
} from 'lucide-react';

export const InviteOnboardingPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { setCurrentUserById } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [inviteUser, setInviteUser] = useState<User | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [createdPin, setCreatedPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const users = await teamService.list();
      
      if (!code) {
        // Fallback to Gurmukh for demo route without param
        const gurmukh = users.find(u => u.name.includes('Gurmukh')) || users[3];
        setInviteUser(gurmukh);
        return;
      }

      // Check if code is expired
      const isCodeExpired = users.some(u => u.expiredInviteCodes?.includes(code));
      if (isCodeExpired) {
        setIsExpired(true);
        return;
      }

      // Match by active inviteCode or exact slug
      const match = users.find(u => 
        u.inviteCode === code || 
        (u.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === code.toLowerCase() && !u.expiredInviteCodes?.includes(code))
      );

      if (match) {
        setInviteUser(match);
      } else {
        // Unrecognized or expired code
        setIsExpired(true);
      }
    };
    fetchUser();
  }, [code]);

  const firstName = inviteUser?.name?.split(' ')[0] || 'Gurmukh';

  // Step 2: Handle Create PIN digit
  const handleCreateDigit = (digit: string) => {
    if (createdPin.length < 4) {
      const next = createdPin + digit;
      setCreatedPin(next);
      setPinError(null);

      if (next.length === 4) {
        // Check obvious PIN rules
        const check = checkObviousPin(next, inviteUser?.phone);
        if (check.isObvious) {
          setIsShaking(true);
          setPinError(check.message || 'Please choose a less obvious PIN');
          setTimeout(() => {
            setCreatedPin('');
            setIsShaking(false);
          }, 700);
        } else {
          // Proceed to confirm
          setTimeout(() => {
            setStep(3);
          }, 200);
        }
      }
    }
  };

  // Step 3: Handle Confirm PIN digit
  const handleConfirmDigit = async (digit: string) => {
    if (confirmPin.length < 4) {
      const next = confirmPin + digit;
      setConfirmPin(next);
      setPinError(null);

      if (next.length === 4) {
        if (next !== createdPin) {
          setIsShaking(true);
          setPinError('PINs do not match. Please try again.');
          setTimeout(() => {
            setConfirmPin('');
            setIsShaking(false);
          }, 700);
        } else {
          // Successfully verified! Save PIN and activate user
          if (inviteUser) {
            await teamService.setPin(inviteUser.id, next);
          }
          setTimeout(() => {
            setStep(4);
          }, 250);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 2) {
      setCreatedPin(prev => prev.slice(0, -1));
      setPinError(null);
    } else if (step === 3) {
      setConfirmPin(prev => prev.slice(0, -1));
      setPinError(null);
    }
  };

  const handleFinishOnboarding = async () => {
    if (inviteUser) {
      await setCurrentUserById(inviteUser.id, true);
    }
    navigate('/app');
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-between p-6 max-w-md mx-auto relative selection:bg-olive-soft">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-serif text-sm font-medium text-ink">Bestinterio</span>
          <span className="bg-sand/40 px-2 py-0.5 rounded-full text-[11px] font-medium text-muted">
            Invite Link
          </span>
        </div>

        <div className="w-full my-auto py-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber/15 border border-amber/30 text-amber flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="space-y-2 max-w-xs mx-auto">
            <h1 className="font-serif text-2xl font-medium text-ink leading-tight">
              This invite link has expired.
            </h1>
            <p className="text-sm text-ink-2 leading-relaxed">
              Ask your studio for a new one.
            </p>
            <p className="text-xs text-muted pt-2 leading-relaxed">
              For security, invite links expire once a PIN has been reset or a new invite link has been created.
            </p>
          </div>
          <div className="pt-4 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => navigate('/app/login')}
              className="w-full h-14 rounded-2xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 transition-all shadow-soft flex items-center justify-center gap-2"
            >
              <span>Go to sign in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] text-muted">
            Bestinterio · StudioOS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between p-6 max-w-md mx-auto relative selection:bg-olive-soft">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-serif text-sm font-medium text-ink">Bestinterio</span>
        <span className="bg-sand/40 px-2 py-0.5 rounded-full text-[11px] font-medium text-ink">
          Step {step} of 4
        </span>
      </div>

      {/* Dynamic Content */}
      <div className="w-full my-auto py-6">
        {step === 1 && (
          <div className="space-y-6 text-center">
            <img
              src="/logo.png"
              alt="Bestinterio"
              className="w-20 h-20 mx-auto object-contain aspect-square drop-shadow-xs"
            />
            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-ink leading-tight">
                Welcome, {firstName}
              </h1>
              <p className="text-sm text-ink-2 leading-relaxed">
                Bestinterio has added you to StudioOS for site operations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-paper border border-line text-left space-y-3 shadow-soft">
              <div className="flex items-center justify-between pb-3 border-b border-line/60">
                <span className="text-xs uppercase tracking-wider text-muted font-medium">Role</span>
                <span className="text-xs font-semibold text-ink bg-olive-soft px-2.5 py-0.5 rounded-full capitalize">
                  {inviteUser?.trade ? `${inviteUser.trade} Lead` : 'Site Supervisor'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-line/60">
                <span className="text-xs uppercase tracking-wider text-muted font-medium">Mobile</span>
                <span className="text-xs font-medium text-ink tabular-nums">
                  +91 {inviteUser?.phone || '9850022334'}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted font-medium block mb-1">
                  Assigned Sites
                </span>
                <p className="text-xs text-ink font-medium">
                  Mehta Residence &amp; Baner Villa
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full h-14 rounded-2xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 active:scale-[0.99] shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <span>Create your 4-digit PIN</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-sand/40 text-ink flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-olive" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-medium text-ink">Create your 4-digit PIN</h1>
              <p className="text-xs text-muted mt-1">
                You will use this PIN to quickly unlock StudioOS on your phone
              </p>
            </div>

            {/* 4 dots indicator */}
            <div className={`flex justify-center gap-4 py-2 ${isShaking ? 'animate-bounce' : ''}`}>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                    createdPin.length > idx 
                      ? 'bg-ink border-ink scale-110 shadow-xs' 
                      : 'bg-paper border-line'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-amber-soft text-amber text-xs font-medium border border-amber/30">
                {pinError}
              </div>
            )}

            {/* Numeric PIN Pad */}
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleCreateDigit(digit)}
                  className="h-14 rounded-2xl bg-paper border border-line text-xl font-medium text-ink active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center tabular-nums"
                >
                  {digit}
                </button>
              ))}
              <div className="h-14" />
              <button
                type="button"
                onClick={() => handleCreateDigit('0')}
                className="h-14 rounded-2xl bg-paper border border-line text-xl font-medium text-ink active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center tabular-nums"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 rounded-2xl bg-paper border border-line text-xs font-medium text-muted active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-sand/40 text-ink flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-olive" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-medium text-ink">Confirm your PIN</h1>
              <p className="text-xs text-muted mt-1">Re-enter your 4-digit PIN</p>
            </div>

            {/* 4 dots indicator */}
            <div className={`flex justify-center gap-4 py-2 ${isShaking ? 'animate-bounce' : ''}`}>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                    confirmPin.length > idx 
                      ? 'bg-ink border-ink scale-110 shadow-xs' 
                      : 'bg-paper border-line'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-rust-soft text-rust text-xs font-medium border border-rust/30">
                {pinError}
              </div>
            )}

            {/* Numeric PIN Pad */}
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleConfirmDigit(digit)}
                  className="h-14 rounded-2xl bg-paper border border-line text-xl font-medium text-ink active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center tabular-nums"
                >
                  {digit}
                </button>
              ))}
              <div className="h-14" />
              <button
                type="button"
                onClick={() => handleConfirmDigit('0')}
                className="h-14 rounded-2xl bg-paper border border-line text-xl font-medium text-ink active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center tabular-nums"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 rounded-2xl bg-paper border border-line text-xs font-medium text-muted active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-olive-soft text-olive flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h1 className="font-serif text-2xl font-medium text-ink">PIN Created!</h1>
              <p className="text-xs text-muted">
                Add StudioOS to your home screen for quick 1-tap access on site
              </p>
            </div>

            {/* Illustrated steps for Chrome & Safari */}
            <div className="p-5 rounded-2xl bg-paper border border-line text-left space-y-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sand/40 flex items-center justify-center shrink-0 mt-0.5">
                  <MoreVertical className="w-4 h-4 text-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-ink">On Android (Chrome)</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Tap the <strong>three dots menu (⋮)</strong> top-right &rarr; Tap <strong>"Add to Home screen"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-line/60">
                <div className="w-8 h-8 rounded-lg bg-sand/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4 text-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-ink">On iPhone (Safari)</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Tap the <strong>Share icon</strong> at bottom &rarr; Scroll and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full h-14 rounded-2xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 active:scale-[0.99] shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <span>Open StudioOS</span>
              <Smartphone className="w-4 h-4 text-olive" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-muted">
        Bestinterio · Site Operations
      </footer>
    </div>
  );
};
