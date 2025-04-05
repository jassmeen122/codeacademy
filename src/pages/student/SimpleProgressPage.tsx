
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const SimpleProgressPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Page en Construction</h1>
          <p>Cette page est actuellement en cours de développement.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
