
import React from 'react';
import { useSimpleStarProgress } from '@/hooks/useSimpleStarProgress';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StarDisplay } from '@/components/student/progress/StarDisplay';
import { WeeklyMessage } from '@/components/student/progress/WeeklyMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

const SimpleProgressPage = () => {
  const { totalStars, weeklyStars, loading } = useSimpleStarProgress();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">Ton Parcours Étoilé</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </>
            ) : (
              <>
                <StarDisplay stars={totalStars} maxStars={10} />
                <WeeklyMessage starsEarned={weeklyStars} />
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
