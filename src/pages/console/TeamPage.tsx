import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Key, 
  FolderCheck, 
  UserX, 
  UserCheck, 
  MessageCircle, 
  Phone, 
  Building2, 
  Clock, 
  Check, 
  Filter,
  Shield,
  Briefcase,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { projectsService } from '../../services/projectsService';
import { User, Project, UserRole } from '../../types';
import { formatPhone, formatRelativeTime } from '../../utils/formatters';
import { AddMemberModal } from '../../components/team/AddMemberModal';
import { ChangeProjectsModal } from '../../components/team/ChangeProjectsModal';
import { ResetPinModal } from '../../components/team/ResetPinModal';
import { DeactivateConfirmModal } from '../../components/team/DeactivateConfirmModal';
import { ShareInviteModal } from '../../components/team/ShareInviteModal';

const formatTradeName = (trade?: string) => {
  if (!trade) return '—';
  switch (trade) {
    case 'carpentry': return 'Carpentry';
    case 'electrical': return 'Electrical';
    case 'civil': return 'Civil';
    case 'painting': return 'Painting';
    case 'plumbing': return 'Plumbing';
    case 'false_ceiling': return 'False ceiling';
    case 'other': return 'Other';
    default: return trade.charAt(0).toUpperCase() + trade.slice(1).replace(/_/g, ' ');
  }
};

const formatRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'owner':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-ink text-paper">Owner</span>;
    case 'manager':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-sand/60 text-ink border border-line">Manager</span>;
    case 'supervisor':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-olive/15 text-olive border border-olive/30">Supervisor</span>;
    case 'worker':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber/15 text-amber border border-amber/30">Worker</span>;
  }
};

const formatStatusBadge = (status: 'active' | 'invited' | 'deactivated') => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-olive/10 text-olive border border-olive/30">
          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
          Active
        </span>
      );
    case 'invited':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber/10 text-amber border border-amber/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber" />
          Invited
        </span>
      );
    case 'deactivated':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rust-soft text-rust border border-rust/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rust" />
          Deactivated
        </span>
      );
  }
};

export const TeamPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'manager' | 'supervisor' | 'worker'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'invited' | 'deactivated'>('all');

  // Active Dropdown row ID
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForProjects, setSelectedUserForProjects] = useState<User | null>(null);
  const [selectedUserForResetPin, setSelectedUserForResetPin] = useState<User | null>(null);
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState<User | null>(null);
  const [selectedUserForShareInvite, setSelectedUserForShareInvite] = useState<User | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [uList, pList] = await Promise.all([
        teamService.list(),
        projectsService.list(),
      ]);
      setUsers(uList);
      setProjects(pList);
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('studioos_storage_change', handleStorageChange);
    window.addEventListener('studioos_storage_reset', handleStorageChange);

    return () => {
      window.removeEventListener('studioos_storage_change', handleStorageChange);
      window.removeEventListener('studioos_storage_reset', handleStorageChange);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleDocClick = () => {
      setActiveMenuUserId(null);
    };
    document.addEventListener('click', handleDocClick);
    return () => {
      document.removeEventListener('click', handleDocClick);
    };
  }, []);

  // Quick project lookup map
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach(p => map.set(p.id, p));
    return map;
  }, [projects]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Role filter
      if (roleFilter !== 'all') {
        if (roleFilter === 'manager' && (u.role !== 'manager' && u.role !== 'owner')) return false;
        if (roleFilter !== 'manager' && u.role !== roleFilter) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(query);
        const matchPhone = u.phone.includes(query);
        const matchTrade = u.trade ? formatTradeName(u.trade).toLowerCase().includes(query) : false;
        const matchRole = u.role.toLowerCase().includes(query);
        const matchProject = u.assignedProjectIds.some(pId => {
          const p = projectMap.get(pId);
          return p ? p.name.toLowerCase().includes(query) : false;
        });

        if (!matchName && !matchPhone && !matchTrade && !matchRole && !matchProject) {
          return false;
        }
      }

      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery, projectMap]);

  // Handle Reactivate action directly
  const handleReactivate = async (u: User) => {
    try {
      await teamService.reactivate(u.id);
      loadData();
    } catch (err) {
      console.error('Failed to reactivate user:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header: Title + ONLY ONE Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Team</h1>
          <p className="text-sm text-muted mt-1">
            Studio team members, supervisors, and site trade leads
          </p>
        </div>

        {/* Exactly one primary button on this page */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" strokeWidth={1.5} />
          <span>Add member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-line bg-paper shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name, phone, trade, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-line bg-ivory/40 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] text-muted font-medium uppercase tracking-wider mr-1">Role:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'manager', label: 'Studio' },
              { id: 'supervisor', label: 'Supervisors' },
              { id: 'worker', label: 'Workers' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  roleFilter === tab.id
                    ? 'bg-ink text-paper'
                    : 'bg-sand/20 text-ink-2 hover:bg-sand/40 border border-line/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] text-muted font-medium uppercase tracking-wider mr-1">Status:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'invited', label: 'Invited' },
              { id: 'deactivated', label: 'Deactivated' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-ink text-paper'
                    : 'bg-sand/20 text-ink-2 hover:bg-sand/40 border border-line/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Members Count and Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted px-1">
          <span>
            Showing <strong className="text-ink">{filteredUsers.length}</strong> of {users.length} team members
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-xl border border-line bg-paper shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line bg-ivory/60 text-muted uppercase text-[10px] tracking-wider select-none">
                <th className="py-3 px-4 font-medium">Member</th>
                <th className="py-3 px-3 font-medium">Role</th>
                <th className="py-3 px-3 font-medium">Trade</th>
                <th className="py-3 px-3 font-medium">Phone</th>
                <th className="py-3 px-4 font-medium">Assigned Projects</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Last active</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredUsers.map((user) => {
                const isCurrentUser = currentUser?.id === user.id;
                const initials = user.name
                  .split(' ')
                  .map(part => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                const isMenuOpen = activeMenuUserId === user.id;

                return (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-sand/15 transition-colors ${
                      user.status === 'deactivated' ? 'opacity-65 bg-sand/5' : ''
                    }`}
                  >
                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-sand/40 border border-line flex items-center justify-center font-medium text-ink shrink-0 text-[11px]">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-ink truncate flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] font-normal text-muted">(You)</span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {formatPhone(user.phone)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-3">
                      {formatRoleBadge(user.role)}
                    </td>

                    {/* Trade */}
                    <td className="py-3.5 px-3 text-ink-2 font-medium">
                      {formatTradeName(user.trade)}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-3">
                      <a
                        href={`tel:${user.phone}`}
                        className="text-ink-2 hover:text-ink font-mono transition-colors"
                      >
                        {formatPhone(user.phone)}
                      </a>
                    </td>

                    {/* Assigned Projects */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {user.role === 'owner' ? (
                        <span className="text-muted text-[11px]">All studio projects</span>
                      ) : user.assignedProjectIds.length === 0 ? (
                        <span className="text-muted text-[11px]">None assigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.assignedProjectIds.map((pId) => {
                            const p = projectMap.get(pId);
                            if (!p) return null;
                            return (
                              <span
                                key={pId}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-sand/30 border border-line/60 text-[11px] text-ink truncate max-w-[140px]"
                                title={p.name}
                              >
                                {p.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {formatStatusBadge(user.status)}
                    </td>

                    {/* Last active */}
                    <td className="py-3.5 px-3 text-muted text-[11px] whitespace-nowrap">
                      {user.status === 'invited' ? (
                        <span className="text-amber">Pending invite</span>
                      ) : user.lastActive ? (
                        formatRelativeTime(user.lastActive)
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="inline-block text-left" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setActiveMenuUserId(isMenuOpen ? null : user.id)}
                          className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-muted hover:text-ink hover:bg-sand/30 transition-colors cursor-pointer"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-4 mt-1 w-48 rounded-xl bg-paper border border-line shadow-lg z-30 py-1.5 text-xs text-left animate-in fade-in zoom-in-95">
                            {/* Change Projects */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuUserId(null);
                                setSelectedUserForProjects(user);
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2.5 text-ink hover:bg-sand/30 transition-colors"
                            >
                              <FolderCheck className="w-4 h-4 text-muted" />
                              <span>Change projects</span>
                            </button>

                            {/* Reset PIN */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuUserId(null);
                                setSelectedUserForResetPin(user);
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2.5 text-ink hover:bg-sand/30 transition-colors"
                            >
                              <Key className="w-4 h-4 text-muted" />
                              <span>Reset PIN</span>
                            </button>

                            {/* Share Invite (if invited) */}
                            {user.status === 'invited' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuUserId(null);
                                  setSelectedUserForShareInvite(user);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-olive hover:bg-sand/30 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Share invite</span>
                              </button>
                            )}

                            <div className="my-1 border-t border-line/60" />

                            {/* Deactivate or Reactivate */}
                            {user.status === 'deactivated' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuUserId(null);
                                  handleReactivate(user);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-olive hover:bg-sand/30 transition-colors"
                              >
                                <UserCheck className="w-4 h-4" />
                                <span>Reactivate member</span>
                              </button>
                            ) : user.role === 'owner' ? (
                              <div
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-muted cursor-not-allowed opacity-50 select-none"
                                title="The studio owner can't be deactivated"
                              >
                                <UserX className="w-4 h-4" />
                                <span>Deactivate</span>
                              </div>
                            ) : isCurrentUser ? (
                              <div
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-muted cursor-not-allowed opacity-50 select-none"
                                title="You cannot deactivate your own account"
                              >
                                <UserX className="w-4 h-4" />
                                <span>Deactivate</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuUserId(null);
                                  setSelectedUserForDeactivate(user);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-rust hover:bg-rust-soft/50 transition-colors cursor-pointer"
                              >
                                <UserX className="w-4 h-4" />
                                <span>Deactivate</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card View (< 1024px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {filteredUsers.map((user) => {
            const isCurrentUser = currentUser?.id === user.id;
            const initials = user.name
              .split(' ')
              .map(part => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border border-line bg-paper shadow-xs space-y-3.5 transition-colors ${
                  user.status === 'deactivated' ? 'opacity-65 bg-sand/5' : ''
                }`}
              >
                {/* Header: Avatar, Name, Role, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-line shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sand/40 border border-line flex items-center justify-center font-medium text-ink shrink-0 text-xs">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-serif text-base font-medium text-ink truncate">
                          {user.name}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] text-muted">(You)</span>
                        )}
                      </div>
                      <p className="text-xs text-muted font-mono mt-0.5">
                        {formatPhone(user.phone)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {formatStatusBadge(user.status)}
                    {formatRoleBadge(user.role)}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg border border-line/60 bg-ivory/40 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted block">Trade</span>
                    <span className="font-medium text-ink">{formatTradeName(user.trade)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted block">Last active</span>
                    <span className="text-ink-2">
                      {user.status === 'invited' ? 'Pending invite' : (user.lastActive ? formatRelativeTime(user.lastActive) : '—')}
                    </span>
                  </div>
                </div>

                {/* Assigned Projects */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted block">
                    Assigned projects ({user.role === 'owner' ? 'All' : user.assignedProjectIds.length})
                  </span>
                  {user.role === 'owner' ? (
                    <span className="text-xs text-muted">All studio projects</span>
                  ) : user.assignedProjectIds.length === 0 ? (
                    <span className="text-xs text-muted">None assigned</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.assignedProjectIds.map((pId) => {
                        const p = projectMap.get(pId);
                        if (!p) return null;
                        return (
                          <span
                            key={pId}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-sand/30 border border-line/60 text-[11px] text-ink"
                          >
                            {p.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUserForProjects(user)}
                      className="px-2.5 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <FolderCheck className="w-3.5 h-3.5 text-muted" />
                      <span>Projects</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUserForResetPin(user)}
                      className="px-2.5 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5 text-muted" />
                      <span>Reset PIN</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.status === 'invited' && (
                      <button
                        type="button"
                        onClick={() => setSelectedUserForShareInvite(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-olive/15 text-olive border border-olive/30 text-xs font-medium hover:bg-olive/25 transition-colors inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Invite</span>
                      </button>
                    )}

                    {user.status === 'deactivated' ? (
                      <button
                        type="button"
                        onClick={() => handleReactivate(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-olive/15 text-olive border border-olive/30 text-xs font-medium hover:bg-olive/25 transition-colors"
                      >
                        Reactivate
                      </button>
                    ) : user.role === 'owner' ? (
                      <span
                        className="px-2.5 py-1.5 rounded-lg border border-line/60 text-muted/60 text-xs font-medium cursor-not-allowed select-none"
                        title="The studio owner can't be deactivated"
                      >
                        Deactivate
                      </span>
                    ) : isCurrentUser ? (
                      <span
                        className="px-2.5 py-1.5 rounded-lg border border-line/60 text-muted/60 text-xs font-medium cursor-not-allowed select-none"
                        title="You cannot deactivate your own account"
                      >
                        Deactivate
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedUserForDeactivate(user)}
                        className="px-2.5 py-1.5 rounded-lg border border-line text-rust text-xs font-medium hover:bg-rust-soft/50 transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center rounded-xl border border-dashed border-line bg-paper space-y-3">
            <Users className="w-8 h-8 text-muted mx-auto" />
            <p className="font-serif text-lg text-ink font-medium">No team members found</p>
            <p className="text-xs text-muted max-w-sm mx-auto">
              No team members match your current filters. Clear the search or filter to see all team members.
            </p>
            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => loadData()}
        projects={projects}
      />

      <ChangeProjectsModal
        isOpen={Boolean(selectedUserForProjects)}
        user={selectedUserForProjects}
        projects={projects}
        onClose={() => setSelectedUserForProjects(null)}
        onSuccess={() => loadData()}
      />

      <ResetPinModal
        isOpen={Boolean(selectedUserForResetPin)}
        user={selectedUserForResetPin}
        onClose={() => setSelectedUserForResetPin(null)}
        onSuccess={() => loadData()}
      />

      <DeactivateConfirmModal
        isOpen={Boolean(selectedUserForDeactivate)}
        user={selectedUserForDeactivate}
        onClose={() => setSelectedUserForDeactivate(null)}
        onSuccess={() => loadData()}
      />

      <ShareInviteModal
        isOpen={Boolean(selectedUserForShareInvite)}
        user={selectedUserForShareInvite}
        onClose={() => setSelectedUserForShareInvite(null)}
      />
    </div>
  );
};