import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { teamService } from '../services/teamService';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  setCurrentUserById: (userId: string) => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const userId = getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'user-owner');
    const user = await teamService.get(userId);
    if (user) {
      setCurrentUser(user);
    } else {
      const all = await teamService.list();
      if (all.length > 0) {
        setCurrentUser(all[0]);
        setItem(STORAGE_KEYS.CURRENT_USER_ID, all[0].id);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();

    const handleStorageReset = () => {
      loadUser();
    };

    window.addEventListener('studioos_storage_reset', handleStorageReset);
    return () => {
      window.removeEventListener('studioos_storage_reset', handleStorageReset);
    };
  }, []);

  const setCurrentUserById = async (userId: string) => {
    const user = await teamService.get(userId);
    if (user) {
      setCurrentUser(user);
      setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    }
  };

  const switchUserRole = async (targetRole: UserRole) => {
    const users = await teamService.list();
    const match = users.find(u => u.role === targetRole);
    if (match) {
      await setCurrentUserById(match.id);
    }
  };

  const logout = () => {
    // In demo mode, reset to owner or null
    setItem(STORAGE_KEYS.CURRENT_USER_ID, '');
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role || 'owner';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        setCurrentUserById,
        switchUserRole,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
