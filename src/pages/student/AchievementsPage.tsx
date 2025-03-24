
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BadgesList } from "@/components/student/achievements/BadgesList";
import { GamificationStats } from "@/components/student/GamificationStats";
import { useUserBadges } from '@/hooks/useUserBadges';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen } from 'lucide-react';

const AchievementsPage = () => {
  const { badges, loading } = useUserBadges();

  // Get the number of language badges (those with "Mastery" in the name)
  const languageBadgesCount = badges.filter(badge => 
    badge.badge.name.includes('Mastery')
  ).length;

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
          
          <div className="lg:col-span-1 space-y-6">
            <GamificationStats />
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Progression des Langages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Badges de maîtrise obtenus</span>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium">{languageBadgesCount}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {languageBadgesCount === 0 ? (
                      <p>
                        Vous n'avez pas encore gagné de badge de maîtrise de langage. 
                        Complétez les résumés et les quiz pour en obtenir !
                      </p>
                    ) : (
                      <p>
                        Félicitations ! Vous avez obtenu {languageBadgesCount} badge{languageBadgesCount > 1 ? 's' : ''} de maîtrise.
                        Continuez à apprendre d'autres langages !
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AchievementsPage;
