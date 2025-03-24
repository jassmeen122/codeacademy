
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Code, Award, CheckCircle, XCircle, ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useCodingGame } from '@/hooks/useCodingGame';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

// Interface pour le tableau des meilleurs scores
interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  completed_at: string;
  user_name?: string;
}

export default function MiniGamePage() {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  
  const {
    currentQuiz,
    currentQuizIndex,
    selectedAnswer,
    isCorrect,
    score,
    gameState,
    gamification,
    startGame,
    selectAnswer,
    resetGame,
    totalQuestions
  } = useCodingGame();
  
  // Récupérer le classement
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true);
        
        // Récupération des meilleurs scores
        const { data: scores, error: scoresError } = await supabase
          .from('mini_game_scores')
          .select('*')
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
  }, [gameState]);
  
  // Rendu des options de réponse
  const renderAnswerButton = (option: string) => {
    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = currentQuiz?.correct_answer === option;
    
    let className = "justify-start text-left h-auto py-3 px-4 font-normal";
    
    if (selectedAnswer) {
      if (isSelected) {
        className += isCorrect 
          ? " bg-green-100 border-green-400 hover:bg-green-100" 
          : " bg-red-100 border-red-400 hover:bg-red-100";
      } else if (isCorrectAnswer) {
        className += " bg-green-100 border-green-400 hover:bg-green-100";
      }
    }
    
    return (
      <Button
        key={option}
        variant="outline"
        className={className}
        onClick={() => selectAnswer(option)}
        disabled={!!selectedAnswer}
      >
        <span className="flex items-center w-full">
          <span className="flex-1">{option}</span>
          {selectedAnswer && isCorrectAnswer && (
            <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
          )}
          {selectedAnswer && isSelected && !isCorrect && (
            <XCircle className="h-5 w-5 text-red-600 ml-2" />
          )}
        </span>
      </Button>
    );
  };

  // Rendu des options
  const renderOptions = () => {
    if (!currentQuiz) return null;
    
    // Récupérer et mélanger les options
    const options = [
      currentQuiz.correct_answer,
      currentQuiz.option1,
      currentQuiz.option2,
      currentQuiz.option3
    ].filter((value, index, self) => 
      // Filtrer les doublons potentiels (au cas où correct_answer est identique à une option)
      value && self.indexOf(value) === index
    ).sort(() => 0.5 - Math.random());
    
    return (
      <div className="space-y-3">
        {options.map(option => renderAnswerButton(option))}
      </div>
    );
  };

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
          <p>Aucun score enregistré pour le moment.</p>
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

  // Rendu de l'état du jeu
  const renderGameState = () => {
    switch (gameState) {
      case 'loading':
        return (
          <div className="py-8 text-center">
            <p>Chargement des questions...</p>
          </div>
        );
      
      case 'ready':
        return (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Mini-Jeu de Programmation</h3>
            <p className="text-muted-foreground">
              Testez vos connaissances avec 5 questions rapides!
            </p>
            {gamification && (
              <div className="text-sm text-muted-foreground mt-2">
                Points actuels: <span className="font-medium">{gamification.points}</span>
              </div>
            )}
            <Button className="mt-4" onClick={startGame}>
              Commencer le jeu
            </Button>
          </div>
        );
      
      case 'playing':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm font-medium">Question {currentQuizIndex + 1}/{totalQuestions}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{score}</span>
              </div>
            </div>
            
            <Progress value={(currentQuizIndex / totalQuestions) * 100} className="h-2 mb-6" />
            
            <div className="space-y-6">
              <div className="text-lg font-medium">{currentQuiz?.question}</div>
              {renderOptions()}
            </div>
          </>
        );
      
      case 'finished':
        return (
          <div className="py-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold">
              {score > 3 ? "Bravo, tu as réussi!" : "Réessaie encore!"}
            </h3>
            
            <div className="text-4xl font-bold">
              {score}/{totalQuestions}
            </div>
            
            <p className="text-muted-foreground">
              {score > 3 
                ? "Excellentes connaissances en programmation!" 
                : "Continue de pratiquer, tu progresseras!"}
            </p>
            
            {gamification && gamification.badges.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Badges débloqués:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {gamification.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-3 mt-4">
              <Button onClick={resetGame}>
                Rejouer
              </Button>
              <Button variant="outline" onClick={() => navigate('/student')}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        );
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
            <Card className="h-full">
              <CardHeader className={gameState === 'playing' ? 'pb-2' : ''}>
                <CardTitle className={gameState === 'playing' ? 'text-lg' : 'sr-only'}>
                  Mini-Jeu de Code
                </CardTitle>
                {gameState === 'ready' && (
                  <CardDescription>
                    Répondez à des questions de programmation pour gagner des points et débloquer des badges.
                    Plus vous répondez correctement, plus vous gagnez de points!
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="h-full flex flex-col">
                {renderGameState()}
              </CardContent>
            </Card>
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
