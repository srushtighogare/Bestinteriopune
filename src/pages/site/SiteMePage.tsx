import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  UserCheck, 
  Shield, 
  HardHat, 
  Wrench, 
  Building2, 
  Check, 
  Languages, 
  Download, 
  Smartphone,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import { projectsService } from '../../services/projectsService';
import { Project } from '../../types';
import { getSiteLanguage, setSiteLanguage, SiteLanguage, t } from '../../utils/i18n';

export const SiteMePage: React.FC = () => {
  const { currentUser, setCurrentUserById, logout } = useAuth();
  const navigate = useNavigate();

  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const handleLang = () => setLang(getSiteLanguage());
    window.addEventListener('studioos_language_change', handleLang);
    return () => window.removeEventListener('studioos_language_change', handleLang);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await projectsService.list();
        const activeOnly = allProjects.filter((p) => p.status === 'active');
        if (currentUser?.role === 'owner' || currentUser?.role === 'manager') {
          setAssignedProjects(activeOnly);
        } else if (currentUser?.role === 'supervisor') {
          const sup = activeOnly.filter(
            (p) => p.supervisorId === currentUser.id || currentUser.assignedProjectIds?.includes(p.id)
          );
          setAssignedProjects(sup.length > 0 ? sup : activeOnly);
        } else {
          setAssignedProjects(
            activeOnly.filter((p) => currentUser?.assignedProjectIds?.includes(p.id))
          );
        }
      } catch (err) {
        console.error('Failed to load user projects:', err);
      }
    };
    fetchProjects();
  }, [currentUser]);

  const handleLanguageChange = (newLang: SiteLanguage) => {
    setLang(newLang);
    setSiteLanguage(newLang);
  };

  const demoSiteUsers = [
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      name: 'Rajiv Deshmukh',
      role: 'Site Supervisor',
      icon: HardHat,
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
      name: 'Gurmukh Singh',
      role: 'Carpenter Lead',
      icon: Wrench,
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
      name: 'Imran Shaikh',
      role: 'Electrician Lead',
      icon: Wrench,
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000006',
      name: 'Santosh Pawar',
      role: 'Civil Lead (1 site)',
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12">
      {/* 1. Profile Card */}
      <div className="p-5 rounded-2xl bg-paper border border-line text-center space-y-3 shadow-xs">
        <img
          src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"}
          alt={currentUser?.name || "User"}
          className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-line shadow-xs"
        />
        <div>
          <h2 className="font-serif text-xl font-medium text-ink">{currentUser?.name || 'Site User'}</h2>
          <p className="text-xs text-muted capitalize mt-0.5">
            {currentUser?.trade ? `${currentUser.trade} Lead · ` : ''}{currentUser?.role || 'Site Member'}
          </p>
          <p className="text-xs text-muted mt-1">+91 {currentUser?.phone || '9850022334'}</p>
        </div>
      </div>

      {/* 2. Language Toggle: English / हिंदी / मराठी (>= 48px tap targets) */}
      <div className="p-4 rounded-2xl bg-paper border border-line space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-olive" />
            <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
              {t('me.language', lang)}
            </span>
          </div>
          <span className="text-[10px] text-muted">Tap to switch</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`min-h-[48px] h-12 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center ${
              lang === 'en'
                ? 'bg-ink text-paper border-ink shadow-xs'
                : 'bg-ivory text-ink border-line hover:bg-sand/30'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('hi')}
            className={`min-h-[48px] h-12 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center ${
              lang === 'hi'
                ? 'bg-ink text-paper border-ink shadow-xs'
                : 'bg-ivory text-ink border-line hover:bg-sand/30'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('mr')}
            className={`min-h-[48px] h-12 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center ${
              lang === 'mr'
                ? 'bg-ink text-paper border-ink shadow-xs'
                : 'bg-ivory text-ink border-line hover:bg-sand/30'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* 3. Assigned Sites Card */}
      <div className="p-4 rounded-2xl bg-paper border border-line space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-olive" />
            <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
              {t('me.assigned_sites', lang)}
            </span>
          </div>
          <span className="text-[11px] text-muted font-medium">
            {assignedProjects.length} site{assignedProjects.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="space-y-1.5">
          {assignedProjects.map((p) => (
            <div key={p.id} className="p-2.5 rounded-xl bg-ivory border border-line/60 flex items-center justify-between text-xs">
              <span className="font-medium text-ink">{p.name}</span>
              <span className="text-[10px] text-muted">{p.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. "Install app" Help (Android + iPhone steps) */}
      <div className="p-4 rounded-2xl bg-paper border border-line space-y-3 shadow-xs">
        <button
          type="button"
          onClick={() => setShowInstallHelp(!showInstallHelp)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-olive" />
            <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
              {t('me.install_app', lang)}
            </span>
          </div>
          {showInstallHelp ? (
            <ChevronDown className="w-4 h-4 text-muted" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted" />
          )}
        </button>

        {showInstallHelp && (
          <div className="pt-2 border-t border-line/60 space-y-3 text-xs">
            {/* Android */}
            <div className="p-3 rounded-xl bg-ivory border border-line/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                <Smartphone className="w-3.5 h-3.5 text-muted" />
                <span>Android (Google Chrome)</span>
              </div>
              <ol className="list-decimal list-inside text-muted space-y-1 pl-1 text-[11px] leading-relaxed">
                <li>Tap the <strong>three dots (⋮)</strong> in Chrome at the top right.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>Confirm by tapping <strong>Install</strong>.</li>
              </ol>
            </div>

            {/* iPhone */}
            <div className="p-3 rounded-xl bg-ivory border border-line/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                <Smartphone className="w-3.5 h-3.5 text-muted" />
                <span>iPhone (Apple Safari)</span>
              </div>
              <ol className="list-decimal list-inside text-muted space-y-1 pl-1 text-[11px] leading-relaxed">
                <li>Tap the <strong>Share button</strong> (square with arrow up) at the bottom.</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                <li>Tap <strong>Add</strong> in the top right corner.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* 5. Switch Demo Role (Quick Tester) */}
      <div className="p-4 rounded-2xl bg-paper border border-line space-y-2.5 shadow-xs">
        <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
          Switch Site Role (Demo Mode)
        </span>
        <div className="grid grid-cols-1 gap-2">
          {demoSiteUsers.map((u) => {
            const isSelected = currentUser?.id === u.id;
            const Icon = u.icon;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setCurrentUserById(u.id, true)}
                className={`min-h-[48px] p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isSelected
                    ? 'bg-olive-soft/40 border-olive/50 font-semibold text-ink'
                    : 'bg-ivory border-line text-ink hover:bg-sand/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-muted" />
                  <div className="text-left">
                    <p className="leading-tight font-medium text-ink">{u.name}</p>
                    <p className="text-[10px] text-muted leading-tight">{u.role}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-olive" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Sign Out Button (56px) */}
      <button
        onClick={() => {
          logout();
          navigate('/app/login');
        }}
        className="w-full h-14 rounded-2xl border border-line bg-paper hover:bg-rust-soft/30 text-rust text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-xs"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.5} />
        <span>{t('me.sign_out', lang)}</span>
      </button>
    </div>
  );
};
