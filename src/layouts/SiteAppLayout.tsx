import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Boxes, User, ArrowLeft, Monitor, LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { getSiteLanguage, SiteLanguage, t } from '../utils/i18n';

interface NavItem {
  key: string;
  to: string;
  icon: LucideIcon;
}

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { key: 'nav.home', to: '/app', icon: Home },
  { key: 'nav.stock', to: '/app/stock', icon: Boxes },
  { key: 'nav.me', to: '/app/me', icon: User },
];

export const SiteAppLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [deviceFrame, setDeviceFrame] = useState(true);
  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());

  useEffect(() => {
    const handleLang = () => setLang(getSiteLanguage());
    window.addEventListener('studioos_language_change', handleLang);
    return () => window.removeEventListener('studioos_language_change', handleLang);
  }, []);

  // Check if we are on a nested subpage with back navigation
  const isSubpage = location.pathname !== '/app' && 
                    location.pathname !== '/app/stock' && 
                    location.pathname !== '/app/me';

  const getSubpageTitle = () => {
    if (location.pathname === '/app/received') return t('recv.title', lang);
    if (location.pathname === '/app/used') return t('used.title', lang);
    if (location.pathname === '/app/progress') return t('prog.title', lang);
    if (location.pathname === '/app/problem') return t('prob.title', lang);
    if (location.pathname === '/app/stock-check') return t('home.stock_check', lang);
    return 'Site Action';
  };

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col items-center justify-start text-ink selection:bg-olive-soft">
      {/* Top desktop helper toolbar (only visible on wider screens to aid prototype evaluation) */}
      <aside aria-label="Demo controls" className="hidden md:flex w-full items-center justify-between px-6 py-2 bg-paper border-b border-line text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-olive animate-pulse" />
          <span className="font-medium text-ink">Site App (Mobile View)</span>
          <span className="text-muted/60">|</span>
          <span>Logged in as: <strong className="text-ink">{currentUser?.name || 'Worker'}</strong> ({currentUser?.role}{currentUser?.trade ? ` · ${currentUser.trade}` : ''})</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDeviceFrame(!deviceFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-line hover:bg-sand/30 text-ink transition-colors"
          >
            <span>{deviceFrame ? 'Frame: ON' : 'Frame: OFF'}</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-ink text-paper hover:bg-ink-2 transition-colors font-medium"
          >
            <Monitor className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Switch to Studio Console</span>
          </button>
        </div>
      </aside>

      {/* Mobile container: 375-430px wide, centered */}
      <div 
        className={cn(
          "w-full bg-ivory flex flex-col min-h-screen transition-all",
          deviceFrame ? "md:my-6 md:min-h-[844px] md:max-h-[90vh] md:max-w-[412px] md:rounded-[40px] md:shadow-float md:border-[8px] md:border-ink/80 md:overflow-hidden relative" : "max-w-md shadow-none"
        )}
      >
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-sm border-b border-line/70 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {isSubpage ? (
              <button
                onClick={() => navigate('/app')}
                className="w-12 h-12 -ml-2 flex items-center justify-center rounded-full active:bg-sand/50 text-ink transition-colors"
                aria-label="Go back to Home"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
            ) : (
              <img src="/logo.png" alt="Bestinterio" className="w-8 h-8 object-contain aspect-square" />
            )}
            <div>
              <h1 className="font-serif text-base font-semibold text-ink leading-tight">
                {isSubpage ? getSubpageTitle() : 'Bestinterio'}
              </h1>
              <p className="text-[11px] text-muted leading-tight font-medium">
                {currentUser?.name ? `Hi ${currentUser.name.split(' ')[0]}` : 'Site Operations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted bg-sand/30 border border-line/60 px-2.5 py-0.5 rounded-full tabular-nums">
              {formattedDate}
            </span>
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          <Outlet />
        </main>

        {/* Bottom Navigation (Fixed at bottom of mobile view, max 3 items: Home, Stock, Me) */}
        {!isSubpage && (
          <nav className="sticky bottom-0 left-0 right-0 z-30 bg-paper/95 backdrop-blur-md border-t border-line px-3 py-1 flex items-center justify-around shrink-0">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[72px] h-[52px] rounded-xl px-2 transition-all",
                    isActive
                      ? "text-olive font-semibold"
                      : "text-muted hover:text-ink"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 mb-1 transition-transform",
                      isActive ? "scale-110 text-olive" : "text-muted"
                    )}
                    strokeWidth={1.5}
                  />
                  <span className="text-[11px] leading-none">{t(item.key, lang)}</span>
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
