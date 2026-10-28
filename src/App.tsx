import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import { initializeStorage } from './services/storage';
import { OfflineNotice } from './components/common/OfflineNotice';
import { TitleManager } from './components/common/TitleManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  useEffect(() => {
    // Ensure localStorage contains initial mock data
    initializeStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TitleManager />
          <OfflineNotice />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
