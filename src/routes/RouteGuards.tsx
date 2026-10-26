import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';

/**
 * Route guard for Studio Console (Owner and Manager only)
 * Workers and supervisors can NEVER open console routes.
 */
export const ConsoleGuard: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in -> go to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Deactivated user -> block immediately
  if (currentUser.status === 'deactivated') {
    return <Navigate to="/app/login?error=deactivated" replace />;
  }

  // Workers and Supervisors can never access the console
  if (currentUser.role === 'worker' || currentUser.role === 'supervisor') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 rounded-card bg-paper border border-line shadow-soft text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-soft text-amber flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-medium text-ink">Site App Access Only</h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Studio Console is reserved for Studio Owners and Managers. Your account ({currentUser.name}) is configured for the Site App.
            </p>
          </div>
          <a
            href="/app"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all"
          >
            <span>Open Site App</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

/**
 * Route guard for Site App
 */
export const SiteAppGuard: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand/30 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/app/login" replace />;
  }

  if (currentUser.status === 'deactivated') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 rounded-card bg-paper border border-rust/40 shadow-soft text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rust-soft text-rust flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-medium text-rust">Access Removed</h2>
            <p className="text-xs text-ink-2 mt-2 leading-relaxed">
              Your access has been removed. Contact Bestinterio.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = '/app/login';
            }}
            className="w-full py-2.5 rounded-xl border border-line bg-paper text-xs text-muted hover:text-ink transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
