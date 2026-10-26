import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export const SiteMePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-paper border border-line text-center space-y-3">
        <img
          src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"}
          alt={currentUser?.name || "User"}
          className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-line"
        />
        <div>
          <h2 className="font-serif text-xl font-medium text-ink">{currentUser?.name || 'Gurmukh Singh'}</h2>
          <p className="text-xs text-muted capitalize mt-0.5">
            {currentUser?.trade ? `${currentUser.trade} · ` : ''}{currentUser?.role || 'Worker'}
          </p>
          <p className="text-xs text-muted mt-1">+91 {currentUser?.phone || '9850022334'}</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
        <span className="text-xs uppercase tracking-wider text-muted font-medium block">Assigned Sites</span>
        <ul className="text-sm space-y-1 text-ink">
          <li>• Mehta Residence</li>
          <li>• Baner Villa</li>
        </ul>
      </div>

      <button
        onClick={() => {
          logout();
          navigate('/app/login');
        }}
        className="w-full h-12 rounded-2xl border border-line bg-paper hover:bg-rust-soft/30 text-rust text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.5} />
        <span>Sign out</span>
      </button>
    </div>
  );
};
