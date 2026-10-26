import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { teamService } from '../services/teamService';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isDemoMode: boolean;
  setCurrentUserById: (userId: string, asDemo?: boolean) => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  standardLogin: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return getItem<boolean>('studioos_is_demo_mode', false);
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const userId = getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'b1eebc99-9c0b-4ef8-bb6d-000000000001');
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
    setIsDemoMode(getItem<boolean>('studioos_is_demo_mode', false));
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

  const setCurrentUserById = async (userId: string, asDemo = true) => {
    const user = await teamService.get(userId);
    if (user) {
      setCurrentUser(user);
      setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      setIsDemoMode(asDemo);
      setItem('studioos_is_demo_mode', asDemo);
    }
  };

  const switchUserRole = async (targetRole: UserRole) => {
    const users = await teamService.list();
    const match = users.find(u => u.role === targetRole);
    if (match) {
      await setCurrentUserById(match.id, true);
    }
  };

  const standardLogin = () => {
    setIsDemoMode(false);
    setItem('studioos_is_demo_mode', false);
  };

  const logout = () => {
    setItem(STORAGE_KEYS.CURRENT_USER_ID, '');
    setItem('studioos_is_demo_mode', false);
    setIsDemoMode(false);
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role || 'owner';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isDemoMode,
        setCurrentUserById,
        switchUserRole,
        standardLogin,
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
