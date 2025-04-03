
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const ProgressDashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Progress Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Your learning progress will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgressDashboardPage;
