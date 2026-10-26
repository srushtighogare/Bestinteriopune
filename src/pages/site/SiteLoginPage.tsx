import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcherModal } from '../../components/DemoSwitcherModal';
import { ShieldAlert, RotateCcw, Monitor } from 'lucide-react';
import { teamService } from '../../services/teamService';
import { User } from '../../types';

export const SiteLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    trustedUser, 
    setTrustedUser, 
    verifyAndLoginWithPin, 
    isLockedOut, 
    resetLockout,
    isDemoMode 
  } = useAuth();

  const [mode, setMode] = useState<'unlock' | 'phone_entry'>('unlock');
  const [phoneInput, setPhoneInput] = useState('9850022334'); // default Gurmukh Singh
  const [selectedUser, setSelectedUser] = useState<User | null>(trustedUser);
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'deactivated') {
      setErrorMessage('Your access has been removed. Contact Bestinterio.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (trustedUser) {
      setSelectedUser(trustedUser);
      setMode('unlock');
    } else {
      setMode('phone_entry');
    }
  }, [trustedUser]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const user = await teamService.getByPhone(phoneInput);
    if (!user) {
      setErrorMessage('Phone number not found in Bestinterio team records.');
      return;
    }
    if (user.status === 'deactivated') {
      setErrorMessage('Your access has been removed. Contact Bestinterio.');
      return;
    }
    setSelectedUser(user);
    setMode('unlock');
  };

  const handleDigit = async (digit: string) => {
    if (pin.length < 4 && !isLockedOut) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === 4) {
        // Trigger verification
        const result = await verifyAndLoginWithPin(nextPin, selectedUser);
        if (result.success) {
          setTimeout(() => {
            navigate('/app');
          }, 150);
        } else {
          setIsShaking(true);
          setErrorMessage(result.message || 'Incorrect PIN');
          setTimeout(() => {
            setPin('');
            setIsShaking(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between p-6 max-w-md mx-auto relative selection:bg-olive-soft">
      {/* Top quiet link to console login */}
      <div className="flex justify-between items-center text-xs text-muted">
        <span>Site App PIN</span>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 hover:text-ink transition-colors"
        >
          <Monitor className="w-3.5 h-3.5 text-olive" strokeWidth={1.5} />
          <span>Console login →</span>
        </button>
      </div>

      <div className="w-full my-auto py-6 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="Bestinterio"
            className="w-16 h-16 mx-auto object-contain aspect-square drop-shadow-xs"
          />
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">
              {mode === 'unlock' && selectedUser
                ? `Welcome back, ${selectedUser.name.split(' ')[0]}`
                : 'Sign in to Site App'}
            </h1>
            <p className="text-xs text-muted mt-1">
              {mode === 'unlock' && selectedUser
                ? 'Enter your 4-digit PIN to unlock'
                : 'Enter your registered phone number'}
            </p>
          </div>
        </div>

        {/* Lockout Screen Message */}
        {isLockedOut ? (
          <div className="p-5 rounded-2xl bg-rust-soft/70 border border-rust/40 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rust-soft text-rust flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-lg font-medium text-rust">Account Locked</h2>
            <p className="text-xs text-ink-2 leading-relaxed">
              Too many tries. Try again in 15 minutes or ask your supervisor to reset your PIN.
            </p>
            {isDemoMode && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    resetLockout();
                    setErrorMessage(null);
                    setPin('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink font-medium hover:bg-sand/30 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                  <span>Reset demo lockout (meeting demo)</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Phone entry mode */}
            {mode === 'phone_entry' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rust-soft text-rust text-xs text-center border border-rust/30">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="98500 22334"
                    className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-base text-ink focus:outline-none focus:border-olive"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
                >
                  Continue
                </button>
              </form>
            ) : (
              /* PIN Unlock Mode */
              <div className="space-y-5">
                {/* 4 dots indicator */}
                <div className={`flex justify-center gap-4 py-2 ${isShaking ? 'animate-bounce' : ''}`}>
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                        pin.length > idx 
                          ? 'bg-ink border-ink scale-110 shadow-xs' 
                          : 'bg-paper border-line'
                      }`}
                    />
                  ))}
                </div>

                {errorMessage && (
                  <p className="text-xs text-rust text-center font-medium px-2 leading-relaxed">
                    {errorMessage}
                  </p>
                )}

                {/* Numeric PIN Pad */}
                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleDigit(digit)}
                      className="h-14 rounded-2xl bg-paper border border-line text-xl font-medium text-ink active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center tabular-nums"
                    >
                      {digit}
                    </button>
                  ))}
                  <div className="h-14" />
                  <button
                    type="button"
                    onClick={() => handleDigit('0')}
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

                {/* Switch phone link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('phone_entry');
                      setTrustedUser(null);
                      setPin('');
                      setErrorMessage(null);
                    }}
                    className="text-xs text-muted hover:text-ink transition-colors"
                  >
                    Not {selectedUser?.name.split(' ')[0]}? Sign in with another number
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Demo Switcher Trigger */}
        <div className="pt-4 border-t border-line/60 text-center">
          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="text-xs text-muted hover:text-ink font-medium underline underline-offset-4 transition-colors"
          >
            Demo: sign in as…
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-muted">
        Prototype for discussion · StudioOS Site
      </footer>

      {/* Demo Switcher Modal */}
      <DemoSwitcherModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
};
