import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineNotice: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-100 bg-rust text-paper px-4 py-2 text-center text-xs font-medium shadow-md flex items-center justify-center gap-2 animate-in fade-in duration-200 print:hidden">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>You're offline — your entry will be ready to send when you're back online</span>
    </div>
  );
};
