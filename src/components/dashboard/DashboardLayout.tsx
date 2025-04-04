
import React, { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
