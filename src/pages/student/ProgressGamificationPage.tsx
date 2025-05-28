
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useGamification } from '@/hooks/useGamification';
import { SkillsProgress } from '@/components/gamification/SkillsProgress';
import { DailyChallenges } from '@/components/gamification/DailyChallenges';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { Trophy, Target, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProgressGamificationPage() {
  const {
    skills,
    dailyChallenges,
    leaderboard,
    userStats,
    loading,
    submitChallenge
  } = useGamification();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-3">
          <Trophy className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Progression & Gamification</h1>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Compétences
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Défis Quotidiens
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Classement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-6">
            <div className="grid gap-6">
              <SkillsProgress skills={skills} loading={loading} />
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <div className="grid gap-6">
              <DailyChallenges 
                challenges={dailyChallenges}
                onSubmitChallenge={submitChallenge}
                loading={loading}
              />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <div className="grid gap-6">
              <Leaderboard 
                leaderboard={leaderboard}
                userStats={userStats}
                loading={loading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
