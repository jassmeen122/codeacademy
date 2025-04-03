
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const AdminDashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Admin dashboard content will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
