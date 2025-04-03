
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const ExercisePage = () => {
  const { exerciseId } = useParams();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Exercise: {exerciseId}</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Exercise content will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExercisePage;
