
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const CoursesPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Courses</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Available courses will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
