import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, UserCheck, Shield, HardHat, Wrench, Building2, Check } from 'lucide-react';
import { projectsService } from '../../services/projectsService';
import { Project } from '../../types';

export const SiteMePage: React.FC = () => {
  const { currentUser, setCurrentUserById, logout } = useAuth();
  const navigate = useNavigate();
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);

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
    <div className="space-y-5 max-w-md mx-auto">
      {/* Profile Card */}
      <div className="p-5 rounded-2xl bg-paper border border-line text-center space-y-3 shadow-xs">
        <img
          src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"}
          alt={currentUser?.name || "User"}
          className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-line shadow-xs"
        />
        <div>
          <h2 className="font-serif text-xl font-medium text-ink">{currentUser?.name || 'Site User'}</h2>
          <p className="text-xs text-muted capitalize mt-0.5">
            {currentUser?.trade ? `${currentUser.trade} Lead · ` : ''}{currentUser?.role || 'Site Lead'}
          </p>
          <p className="text-xs text-muted mt-1">+91 {currentUser?.phone || '9850022334'}</p>
        </div>
      </div>

      {/* Assigned Sites Card */}
      <div className="p-4 rounded-2xl bg-paper border border-line space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
            Assigned Sites
          </span>
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

      {/* Switch Demo Role (Quick Tester) */}
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
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
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

      {/* Sign Out */}
      <button
        onClick={() => {
          logout();
          navigate('/app/login');
        }}
        className="w-full h-14 rounded-2xl border border-line bg-paper hover:bg-rust-soft/30 text-rust text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.5} />
        <span>Sign out</span>
      </button>
    </div>
  );
};
