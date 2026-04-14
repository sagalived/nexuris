import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="p-4 md:ml-64">
        <div className="mx-auto max-w-7xl pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
