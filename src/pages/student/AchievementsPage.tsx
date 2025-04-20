
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "@/hooks/useAuthState";
import { useAchievements } from "@/hooks/useAchievements";
import { ChallengesList } from "@/components/student/achievements/ChallengesList";
import { BadgesList } from "@/components/student/achievements/BadgesList";

export default function AchievementsPage() {
  const { user } = useAuthState();
  const { badges, challenges, loading } = useAchievements(user?.id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8 gap-3">
            <Trophy className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Vos Achievements & Défis</h1>
          </div>
          <div className="grid gap-8">
            {/* Loading skeleton for challenges */}
            <AchievementsLoadingSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-3">
          <Trophy className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Vos Achievements & Défis</h1>
        </div>

        <div className="grid gap-8">
          {/* Active Challenges */}
          <ChallengesList challenges={challenges} />

          {/* Earned Badges */}
          <BadgesList badges={badges} />
        </div>
      </div>
    </DashboardLayout>
  );
}

// Loading skeleton component
const AchievementsLoadingSkeleton = () => (
  <>
    <Skeleton className="h-[200px] w-full rounded-lg" />
    <Skeleton className="h-[200px] w-full rounded-lg" />
  </>
);
