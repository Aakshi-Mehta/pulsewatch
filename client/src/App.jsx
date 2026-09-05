import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';

const MainApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-xs text-gray-400 font-mono">Loading PulseWatch Engine...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <WatchlistProvider>
      <Dashboard />
    </WatchlistProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
