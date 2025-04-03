
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const TeacherDashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Teacher dashboard content will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboardPage;
