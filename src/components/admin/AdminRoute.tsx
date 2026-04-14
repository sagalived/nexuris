import React from 'react';
import { useAuth } from '@/src/lib/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminRoute: React.FC = () => {
  const { profile, loading, isAdmin, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 p-8">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full bg-zinc-800" />
          <Skeleton className="h-64 w-full bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (!isDemoMode && (!profile || !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
