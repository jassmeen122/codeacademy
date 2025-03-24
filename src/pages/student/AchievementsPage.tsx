
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BadgesList } from "@/components/student/achievements/BadgesList";
import { GamificationStats } from "@/components/student/GamificationStats";
import { useUserBadges } from '@/hooks/useUserBadges';

const AchievementsPage = () => {
  const { badges, loading } = useUserBadges();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mes Récompenses</h1>
          <p className="text-gray-600">Suivez vos accomplissements et badges débloqués</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BadgesList badges={badges} />
          </div>
          
          <div className="lg:col-span-1">
            <GamificationStats />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AchievementsPage;
