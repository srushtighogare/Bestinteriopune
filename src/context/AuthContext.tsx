import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { teamService } from '../services/teamService';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  trustedUser: User | null;
  role: UserRole;
  isDemoMode: boolean;
  isLockedOut: boolean;
  failedPinAttempts: number;
  setCurrentUserById: (userId: string, asDemo?: boolean) => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  standardLogin: (identifier: string) => Promise<boolean>;
  verifyAndLoginWithPin: (pin: string, userToLogin?: User | null) => Promise<{ success: boolean; message?: string }>;
  setTrustedUser: (user: User | null) => void;
  resetLockout: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trustedUser, setTrustedUserState] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return getItem<boolean>('studioos_is_demo_mode', false);
  });
  const [failedPinAttempts, setFailedPinAttempts] = useState<number>(() => {
    return getItem<number>('studioos_failed_pin_attempts', 0);
  });
  const [isLockedOut, setIsLockedOut] = useState<boolean>(() => {
    return getItem<boolean>('studioos_is_locked_out', false);
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const userId = getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'b1eebc99-9c0b-4ef8-bb6d-000000000001');
    if (userId) {
      const user = await teamService.get(userId);
      if (user && user.status === 'deactivated') {
        setCurrentUser(null);
        setItem(STORAGE_KEYS.CURRENT_USER_ID, '');
      } else {
        setCurrentUser(user || null);
      }
    } else {
      setCurrentUser(null);
    }

    // Load trusted phone user (defaults to Gurmukh Singh for site app demonstration)
    const trustedId = getItem<string>('studioos_trusted_user_id', 'b1eebc99-9c0b-4ef8-bb6d-000000000004');
    if (trustedId) {
      const tUser = await teamService.get(trustedId);
      if (tUser && tUser.status === 'deactivated') {
        setTrustedUserState(null);
        setItem('studioos_trusted_user_id', '');
      } else {
        setTrustedUserState(tUser || null);
      }
    }

    setIsDemoMode(getItem<boolean>('studioos_is_demo_mode', false));
    setFailedPinAttempts(getItem<number>('studioos_failed_pin_attempts', 0));
    setIsLockedOut(getItem<boolean>('studioos_is_locked_out', false));
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();

    const handleStorageReset = () => {
      loadUser();
    };

    const handleStorageChange = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail || detail.key === STORAGE_KEYS.USERS || detail.key === STORAGE_KEYS.CURRENT_USER_ID || detail.key === 'studioos_trusted_user_id') {
        loadUser();
      }
    };

    window.addEventListener('studioos_storage_reset', handleStorageReset);
    window.addEventListener('studioos_storage_change', handleStorageChange);
    return () => {
      window.removeEventListener('studioos_storage_reset', handleStorageReset);
      window.removeEventListener('studioos_storage_change', handleStorageChange);
    };
  }, []);

  const setCurrentUserById = async (userId: string, asDemo = true) => {
    const user = await teamService.get(userId);
    if (user) {
      setCurrentUser(user);
      setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      setIsDemoMode(asDemo);
      setItem('studioos_is_demo_mode', asDemo);
      // Also register as trusted user for phone site app if worker or supervisor
      if (user.role === 'worker' || user.role === 'supervisor') {
        setTrustedUserState(user);
        setItem('studioos_trusted_user_id', user.id);
      }
    }
  };

  const switchUserRole = async (targetRole: UserRole) => {
    const users = await teamService.list();
    const match = users.find(u => u.role === targetRole && u.status === 'active');
    if (match) {
      await setCurrentUserById(match.id, true);
    }
  };

  const standardLogin = async (identifier: string): Promise<boolean> => {
    const users = await teamService.list();
    const cleanId = identifier.trim().toLowerCase();
    const match = users.find(
      u => u.name.toLowerCase().includes(cleanId) ||
           u.phone.replace(/\D/g, '').endsWith(cleanId.replace(/\D/g, '')) ||
           cleanId.includes('megha') ||
           cleanId.includes('bestinterio')
    );

    const userToSet = match || users[0];
    setCurrentUser(userToSet);
    setItem(STORAGE_KEYS.CURRENT_USER_ID, userToSet.id);
    setIsDemoMode(false);
    setItem('studioos_is_demo_mode', false);
    return true;
  };

  const setTrustedUser = (user: User | null) => {
    setTrustedUserState(user);
    if (user) {
      setItem('studioos_trusted_user_id', user.id);
    } else {
      setItem('studioos_trusted_user_id', '');
    }
  };

  const resetLockout = () => {
    setIsLockedOut(false);
    setFailedPinAttempts(0);
    setItem('studioos_is_locked_out', false);
    setItem('studioos_failed_pin_attempts', 0);
  };

  const verifyAndLoginWithPin = async (
    enteredPin: string,
    userToLogin?: User | null
  ): Promise<{ success: boolean; message?: string }> => {
    if (isLockedOut) {
      return {
        success: false,
        message: 'Too many tries. Try again in 15 minutes or ask your supervisor to reset your PIN.',
      };
    }

    const targetUser = userToLogin || trustedUser || currentUser;
    if (!targetUser) {
      return { success: false, message: 'User not found. Please enter phone number.' };
    }

    // Check deactivated status
    if (targetUser.status === 'deactivated') {
      return {
        success: false,
        message: 'Your access has been removed. Contact Bestinterio.',
      };
    }

    // Demo wrong PIN simulation: 9999 is the designated wrong PIN for demonstration
    const isWrong = enteredPin === '9999' || (targetUser.pin && targetUser.pin !== enteredPin && targetUser.pin !== '1234');

    if (isWrong) {
      const nextAttempts = failedPinAttempts + 1;
      setFailedPinAttempts(nextAttempts);
      setItem('studioos_failed_pin_attempts', nextAttempts);

      if (nextAttempts >= 5) {
        setIsLockedOut(true);
        setItem('studioos_is_locked_out', true);
        return {
          success: false,
          message: 'Too many tries. Try again in 15 minutes or ask your supervisor to reset your PIN.',
        };
      }

      return {
        success: false,
        message: `Incorrect PIN. ${5 - nextAttempts} attempt${5 - nextAttempts === 1 ? '' : 's'} remaining. (Demo tip: use PIN 9999 to test lockout)`,
      };
    }

    // Success! Reset failed attempts and set current user
    setFailedPinAttempts(0);
    setItem('studioos_failed_pin_attempts', 0);
    setCurrentUser(targetUser);
    setItem(STORAGE_KEYS.CURRENT_USER_ID, targetUser.id);
    setTrustedUserState(targetUser);
    setItem('studioos_trusted_user_id', targetUser.id);

    return { success: true };
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
        trustedUser,
        role,
        isDemoMode,
        isLockedOut,
        failedPinAttempts,
        setCurrentUserById,
        switchUserRole,
        standardLogin,
        verifyAndLoginWithPin,
        setTrustedUser,
        resetLockout,
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
