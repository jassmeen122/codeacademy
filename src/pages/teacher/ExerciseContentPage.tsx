
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ExerciseContentManager } from '@/components/teacher/ExerciseContentManager';
import { Dumbbell } from 'lucide-react';

const ExerciseContentPage = () => {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Dumbbell className="h-8 w-8" />
            Gestion des Exercices
          </h1>
          <p className="text-gray-600">Créez et gérez vos exercices de programmation</p>
        </div>
        
        <ExerciseContentManager />
      </div>
    </DashboardLayout>
  );
};

export default ExerciseContentPage;
