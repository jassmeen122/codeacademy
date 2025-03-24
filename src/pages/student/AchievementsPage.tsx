
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BadgesList } from "@/components/student/achievements/BadgesList";
import { GamificationStats } from "@/components/student/GamificationStats";
import { useUserBadges } from '@/hooks/useUserBadges';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AchievementsPage = () => {
  const { badges, loading } = useUserBadges();
  const navigate = useNavigate();

  // Get language mastery badges (those with "Mastery" in the name)
  const languageBadges = badges.filter(badge => 
    badge.badge.name.includes('Mastery')
  );
  
  // Get the names of the languages from the badges
  const languageNames = languageBadges.map(badge => 
    badge.badge.name.replace(' Mastery', '')
  );

  // Group languages by category
  const languageGroups = {
    basics: ['Python', 'Java', 'JavaScript'],
    systemLanguages: ['C', 'C++'],
    web: ['PHP', 'SQL']
  };

  const isLanguageCompleted = (lang: string) => {
    return languageNames.includes(lang);
  };

  const getLanguageBadge = (lang: string) => {
    return (
      <span 
        key={lang} 
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isLanguageCompleted(lang) 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {lang}
        {isLanguageCompleted(lang) && (
          <Award className="inline-block h-3 w-3 ml-1 text-amber-500" />
        )}
      </span>
    );
  };

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
                  
                  {/* Group languages by category */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Langages de base</h3>
                      <div className="flex flex-wrap gap-2">
                        {languageGroups.basics.map(lang => getLanguageBadge(lang))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Langages système</h3>
                      <div className="flex flex-wrap gap-2">
                        {languageGroups.systemLanguages.map(lang => getLanguageBadge(lang))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Langages web</h3>
                      <div className="flex flex-wrap gap-2">
                        {languageGroups.web.map(lang => getLanguageBadge(lang))}
                      </div>
                    </div>
                  </div>
                  
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
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/student/languages')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explorer les langages
                  </Button>
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
