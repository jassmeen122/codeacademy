
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Trophy, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { useAchievements } from "@/hooks/useAchievements";
import { useMetricsDisplay } from "@/hooks/useMetricsDisplay";
import { ChallengesList } from "@/components/student/achievements/ChallengesList";
import { BadgesList } from "@/components/student/achievements/BadgesList";
import { StrengthsWeaknessesCard } from "@/components/student/StrengthsWeaknessesCard";
import { ProgressTipsCard } from "@/components/student/ProgressTipsCard";
import { PointsSummaryCard } from "@/components/student/PointsSummaryCard";

export default function AchievementsPage() {
  const { user } = useAuthState();
  const { badges, challenges, loading: achievementsLoading } = useAchievements(user?.id);
  const { metrics, loading: metricsLoading, refreshMetrics, lastRefresh } = useMetricsDisplay();

  const handleRefresh = () => {
    refreshMetrics();
  };

  const loading = achievementsLoading || metricsLoading;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8 gap-3">
            <Trophy className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Vos Achievements & Points</h1>
          </div>
          <div className="grid gap-8">
            <AchievementsLoadingSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Vos Achievements & Points</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Dernière mise à jour: {lastRefresh}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Rafraîchir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Résumé des points */}
          <PointsSummaryCard 
            exercisesCompleted={metrics.exercises_completed}
            coursesCompleted={metrics.course_completions}
          />
          
          {/* Conseils personnalisés */}
          <ProgressTipsCard
            exercisesCompleted={metrics.exercises_completed}
            coursesCompleted={metrics.course_completions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Points forts et à améliorer */}
          <div className="md:col-span-3">
            <StrengthsWeaknessesCard />
          </div>
        </div>

        <div className="grid gap-8">
          {/* Défis actifs */}
          <ChallengesList challenges={challenges} />

          {/* Badges gagnés */}
          <BadgesList badges={badges} />
        </div>

        {/* Section de debug - uniquement visible en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-10 p-4 border border-dashed rounded-lg">
            <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              {JSON.stringify({
                userId: user?.id,
                lastRefresh: lastRefresh,
                metricsData: metrics
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Loading skeleton component
const AchievementsLoadingSkeleton = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <Skeleton className="h-[250px] w-full rounded-lg" />
      <Skeleton className="h-[250px] w-full rounded-lg" />
    </div>
    <Skeleton className="h-[200px] w-full rounded-lg mb-10" />
    <Skeleton className="h-[200px] w-full rounded-lg" />
    <Skeleton className="h-[200px] w-full rounded-lg" />
  </>
);
