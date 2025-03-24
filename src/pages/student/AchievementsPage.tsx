
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BadgesList } from "@/components/student/achievements/BadgesList";
import { GamificationStats } from "@/components/student/GamificationStats";
import { useUserBadges } from '@/hooks/useUserBadges';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Code } from 'lucide-react';

const AchievementsPage = () => {
  const { badges, loading } = useUserBadges();

  // Get language mastery badges (those with "Mastery" in the name)
  const languageBadges = badges.filter(badge => 
    badge.badge.name.includes('Mastery')
  );
  
  // Get the names of the languages from the badges
  const languageNames = languageBadges.map(badge => 
    badge.badge.name.replace(' Mastery', '')
  );

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
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  Maîtrise des Langages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Badges de maîtrise obtenus</span>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium">{languageBadges.length}</span>
                    </div>
                  </div>
                  
                  {languageBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {languageNames.map((language, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    {languageBadges.length === 0 ? (
                      <p>
                        Vous n'avez pas encore gagné de badge de maîtrise de langage. 
                        Complétez les résumés et les quiz pour en obtenir !
                      </p>
                    ) : (
                      <p>
                        Félicitations ! Vous avez obtenu {languageBadges.length} badge{languageBadges.length > 1 ? 's' : ''} de maîtrise.
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
