
import React from 'react';
import StudentDashboard from '@/pages/StudentDashboard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const StudentDashboardPage = () => {
  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  );
};

export default StudentDashboardPage;
