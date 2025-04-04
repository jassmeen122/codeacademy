
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useSimpleStarProgress } from '@/hooks/useSimpleStarProgress';
import { StarDisplay } from '@/components/student/progress/StarDisplay';
import { QuickTip } from '@/components/student/progress/QuickTip';
import { WeeklyMessage } from '@/components/student/progress/WeeklyMessage';

const SimpleProgressPage = () => {
  const { totalStars, weeklyStars, recentSuccess, loading } = useSimpleStarProgress();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Ma Progression</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <StarDisplay 
              stars={totalStars} 
              loading={loading} 
              maxStars={5} 
            />
          </div>

          <div className="md:col-span-1">
            <QuickTip 
              stars={totalStars} 
              recentSuccess={recentSuccess} 
            />
          </div>

          <div className="md:col-span-1">
            <WeeklyMessage 
              weeklyStars={weeklyStars} 
            />
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Comment fonctionnent les étoiles ?</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">⭐ Les étoiles = Progression</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chaque exercice réussi te rapporte 1 étoile. Plus tu pratiques, plus tu gagnes d'étoiles!
              </p>
            </div>
            <div>
              <h3 className="font-medium">😊 L'indicateur d'humeur</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ton emoji change selon ton nombre d'étoiles pour te montrer ton niveau de progression.
              </p>
            </div>
            <div>
              <h3 className="font-medium">🧙‍♂️ Conseils personnalisés</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tu reçois des astuces adaptées à ton parcours pour t'aider à progresser efficacement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
