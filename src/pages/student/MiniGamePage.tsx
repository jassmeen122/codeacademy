
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Code, Award, ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { GameDifficulty, useCodingGame } from '@/hooks/useCodingGame';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';
import { CodingMiniGame } from '@/components/student/CodingMiniGame';

// Interface pour le tableau des meilleurs scores
interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  difficulty: string;
  completed_at: string;
  user_name?: string;
}

export default function MiniGamePage() {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('Beginner');
  
  const { gamification } = useCodingGame();
  
  // Récupérer le classement
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true);
        
        // Récupération des meilleurs scores pour la difficulté sélectionnée
        const { data: scores, error: scoresError } = await supabase
          .from('mini_game_scores')
          .select('*')
          .eq('difficulty', selectedDifficulty)
          .order('score', { ascending: false })
          .limit(10);
          
        if (scoresError) throw scoresError;
        
        // Récupération des noms d'utilisateurs
        if (scores && scores.length > 0) {
          const userIds = scores.map(score => score.user_id);
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
            
          if (profilesError) throw profilesError;
          
          // Combiner les scores avec les noms d'utilisateurs
          const leaderboardWithNames = scores.map(score => {
            const userProfile = profiles?.find(profile => profile.id === score.user_id);
            return {
              ...score,
              user_name: userProfile?.full_name || 'Utilisateur inconnu'
            };
          });
          
          setLeaderboard(leaderboardWithNames);
        } else {
          setLeaderboard([]);
        }
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        toast.error('Erreur lors du chargement du classement');
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };
    
    fetchLeaderboard();
  }, [selectedDifficulty]);

  // Rendu du tableau des meilleurs scores
  const renderLeaderboard = () => {
    if (isLoadingLeaderboard) {
      return (
        <div className="py-8 text-center">
          <p>Chargement du classement...</p>
        </div>
      );
    }
    
    if (leaderboard.length === 0) {
      return (
        <div className="py-8 text-center">
          <p>Aucun score enregistré pour ce niveau.</p>
          <p className="text-sm text-muted-foreground mt-2">Soyez le premier à jouer !</p>
        </div>
      );
    }
    
    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.id} 
              className={`flex items-center justify-between p-3 rounded-md ${
                entry.user_id === user?.id ? 'bg-primary/10' : (index % 2 === 0 ? 'bg-muted/50' : '')
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                  index < 3 ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{entry.user_name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">{entry.score}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const getDifficultyBadgeColor = (level: GameDifficulty) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/student')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Mini-Jeu de Code</h1>
          </div>
          {gamification && (
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 text-base">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{gamification.points} points</span>
            </Badge>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-5">
          {/* Section principale du jeu */}
          <div className="md:col-span-3">
            <CodingMiniGame />
          </div>
          
          {/* Section classement et badges */}
          <div className="md:col-span-2">
            <Tabs defaultValue="leaderboard" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboard">Classement</TabsTrigger>
                <TabsTrigger value="badges">Mes Badges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="leaderboard" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Meilleurs Scores</CardTitle>
                    <CardDescription>
                      Les 10 meilleurs joueurs du mini-jeu
                    </CardDescription>
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant={selectedDifficulty === 'Beginner' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('Beginner')}
                        className={selectedDifficulty === 'Beginner' ? 'bg-primary' : ''}
                      >
                        Débutant
                      </Button>
                      <Button 
                        size="sm" 
                        variant={selectedDifficulty === 'Intermediate' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('Intermediate')}
                        className={selectedDifficulty === 'Intermediate' ? 'bg-primary' : ''}
                      >
                        Intermédiaire
                      </Button>
                      <Button 
                        size="sm" 
                        variant={selectedDifficulty === 'Advanced' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('Advanced')}
                        className={selectedDifficulty === 'Advanced' ? 'bg-primary' : ''}
                      >
                        Avancé
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderLeaderboard()}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="badges" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Mes Badges</CardTitle>
                    <CardDescription>
                      Badges débloqués grâce à vos performances
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {gamification && gamification.badges.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {gamification.badges.map(badge => (
                          <Card key={badge} className="p-4 flex flex-col items-center text-center">
                            <Award className="h-10 w-10 text-yellow-500 mb-2" />
                            <CardTitle className="text-base">{badge}</CardTitle>
                            <CardDescription className="text-xs">
                              {badge === 'Débutant' && 'Premier pas dans le codage'}
                              {badge === 'Intermédiaire' && 'Maîtrise des concepts de base'}
                              {badge === 'Pro' && 'Expertise technique confirmée'}
                              {badge === 'Maître' && 'Maîtrise exceptionnelle du code'}
                            </CardDescription>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p>Aucun badge débloqué pour le moment.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Jouez au mini-jeu pour gagner des points et débloquer des badges!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
