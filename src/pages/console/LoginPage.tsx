import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcherModal } from '../../components/DemoSwitcherModal';
import { Smartphone, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { standardLogin } = useAuth();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: 'megha@bestinterio.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await standardLogin(data.identifier);
      navigate('/');
    } catch {
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between p-6 sm:p-8 relative selection:bg-olive-soft selection:text-ink">
      {/* Background subtle architectural drafting lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#2A2925 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top bar with quiet link to Site App */}
      <div className="w-full max-w-md mx-auto flex justify-end z-10">
        <button
          onClick={() => navigate('/app/login')}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-sand/30"
        >
          <Smartphone className="w-3.5 h-3.5 text-olive" strokeWidth={1.5} />
          <span>Site app login →</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto p-8 sm:p-10 rounded-2xl bg-paper border border-line shadow-soft space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <img
            src="/logo.png"
            alt="Bestinterio"
            className="w-16 h-16 mx-auto object-contain aspect-square drop-shadow-xs"
          />
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight">
              Sign in to Bestinterio
            </h1>
            <p className="text-xs text-muted mt-1 font-sans">
              Studio operations for interior design projects
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rust-soft text-rust text-xs text-center border border-rust/30">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
              Email or Phone
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('identifier')}
                placeholder="megha@bestinterio.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-line bg-ivory/40 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-olive focus:bg-paper transition-all"
              />
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3" strokeWidth={1.5} />
            </div>
            {errors.identifier && (
              <p className="text-xs text-rust mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-line bg-ivory/40 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-olive focus:bg-paper transition-all"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3 top-3" strokeWidth={1.5} />
            </div>
            {errors.password && (
              <p className="text-xs text-rust mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 active:scale-[0.99] shadow-soft transition-all"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

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

      {/* Footer strictly meeting Section 10 rule */}
      <footer className="text-center text-xs text-muted z-10">
        Prototype for discussion · StudioOS v0.1.0
      </footer>

      {/* Demo Switcher Modal */}
      <DemoSwitcherModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
};
