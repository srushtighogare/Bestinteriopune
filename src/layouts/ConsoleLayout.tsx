import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Boxes, 
  Receipt, 
  Users, 
  Settings, 
  LogOut, 
  Smartphone,
  Menu,
  X,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Projects', to: '/projects', icon: Briefcase },
  { label: 'Inventory', to: '/inventory', icon: Boxes },
  { label: 'Bills', to: '/bills', icon: Receipt },
  { label: 'Team', to: '/team', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export const ConsoleLayout: React.FC = () => {
  const { currentUser, role, isDemoMode, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row text-ink selection:bg-olive-soft selection:text-ink">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-paper border-b border-line sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Bestinterio" className="w-8 h-8 object-contain aspect-square" />
          <span className="font-serif text-lg font-medium text-ink">Bestinterio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app')}
            className="text-xs text-muted hover:text-ink px-2 py-1 transition-colors font-medium"
          >
            Site app →
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink-2 hover:text-ink rounded-lg focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop 240px, tablet collapsible, mobile overlay) */}
      <aside
        className={cn(
          "fixed md:sticky top-0 bottom-0 left-0 z-30 flex flex-col w-60 bg-paper border-r border-line transition-transform duration-200 ease-in-out md:translate-x-0 md:h-screen print:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-line/60">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Bestinterio" className="w-9 h-9 object-contain aspect-square" />
            <div>
              <h1 className="font-serif text-xl font-medium tracking-tight text-ink leading-tight">Bestinterio</h1>
              <p className="text-[11px] uppercase tracking-wider text-muted font-sans font-medium">StudioOS</p>
            </div>
          </div>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-muted hover:text-ink"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-olive-soft text-olive font-semibold shadow-soft"
                    : "text-ink-2 hover:bg-sand/40 hover:text-ink"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-olive" : "text-muted"
                  )}
                  strokeWidth={1.5}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Switch to site app link */}
        <div className="px-5 py-2.5 border-t border-line/40">
          <button
            onClick={() => navigate('/app')}
            className="text-xs text-muted hover:text-ink transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>Open Site App (Mobile) →</span>
          </button>
        </div>

        {/* User profile at bottom */}
        <div className="p-3 border-t border-line bg-paper/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-ivory/40 border border-line/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                alt={currentUser?.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink truncate">{currentUser?.name || "Megha Jadhav"}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted font-medium capitalize">
                  {currentUser?.role || role}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign out"
              className="p-1.5 text-muted hover:text-rust rounded-lg hover:bg-paper transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-20 bg-ink/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 print:p-0 print:m-0 print:w-full">
        <div className="flex-1 w-full max-w-[1240px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 print:p-0 print:max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
