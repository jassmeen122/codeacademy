
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeCard } from "./ChallengeCard";
import { Target, Calendar, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Challenge {
  id: string;
  description: string;
  target: number;
  current_progress: number;
  challenge_type: string;
  reward_xp: number;
  expires_at: string;
  completed: boolean;
  completed_at?: string;
}

interface ChallengesTabProps {
  challenges: Challenge[];
  loading: boolean;
  onRefresh: () => void;
}

export const ChallengesTab = ({ challenges: initialChallenges, loading, onRefresh }: ChallengesTabProps) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  
  // Add some example challenges if none exist
  useEffect(() => {
    if (initialChallenges.length === 0 && !loading) {
      const exampleChallenges: Challenge[] = [
        {
          id: '1',
          description: 'Compléter 3 leçons aujourd\'hui',
          target: 3,
          current_progress: 1,
          challenge_type: 'daily',
          reward_xp: 30,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '2',
          description: 'Gagner 50 points XP',
          target: 50,
          current_progress: 20,
          challenge_type: 'daily',
          reward_xp: 25,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '3',
          description: 'Se connecter 5 jours de suite',
          target: 5,
          current_progress: 2,
          challenge_type: 'weekly',
          reward_xp: 70,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '4',
          description: 'Résoudre 10 exercices cette semaine',
          target: 10,
          current_progress: 3,
          challenge_type: 'weekly',
          reward_xp: 100,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '5',
          description: 'Terminer un module de cours',
          target: 1,
          current_progress: 1,
          challenge_type: 'daily',
          reward_xp: 40,
          expires_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
          completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setChallenges(exampleChallenges);
    } else {
      setChallenges(initialChallenges);
    }
  }, [initialChallenges, loading]);
  
  const dailyChallenges = challenges.filter(
    challenge => challenge.challenge_type === 'daily'
  );
  
  const weeklyChallenges = challenges.filter(
    challenge => challenge.challenge_type === 'weekly'
  );
  
  const activeDailyChallenges = dailyChallenges.filter(
    challenge => !challenge.completed
  );
  
  const activeWeeklyChallenges = weeklyChallenges.filter(
    challenge => !challenge.completed
  );
  
  const completedChallenges = challenges.filter(
    challenge => challenge.completed
  );
  
  const displayedChallenges = filter === 'all' 
    ? challenges 
    : filter === 'active' 
      ? [...activeDailyChallenges, ...activeWeeklyChallenges]
      : completedChallenges;
    
  console.log("ChallengesTab rendered with:", {
    totalChallenges: challenges.length,
    displayedChallenges: displayedChallenges.length,
    dailyCount: dailyChallenges.length,
    weeklyCount: weeklyChallenges.length
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-lg">Chargement des défis...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-100/50 to-background pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center text-2xl">
              <Target className="mr-2 h-6 w-6 text-blue-600" />
              Vos Défis
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Relevez des défis quotidiens et hebdomadaires pour gagner des points et des badges
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            size="sm"
            className="hover:bg-blue-100/50 transition-colors"
          >
            Actualiser
          </Button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? "default" : "outline"}
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              Tous
            </Button>
            <Button
              size="sm"
              variant={filter === 'active' ? "default" : "outline"}
              onClick={() => setFilter('active')}
              className="text-xs"
            >
              Actifs
            </Button>
            <Button
              size="sm"
              variant={filter === 'completed' ? "default" : "outline"}
              onClick={() => setFilter('completed')}
              className="text-xs"
            >
              Terminés
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {challenges.length > 0 ? (
          <div className="space-y-8">
            {/* Daily Challenges Section */}
            {filter !== 'completed' && activeDailyChallenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-medium text-lg">Défis quotidiens</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDailyChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      id={challenge.id}
                      description={challenge.description}
                      target={challenge.target}
                      currentProgress={challenge.current_progress}
                      type={challenge.challenge_type}
                      rewardXp={challenge.reward_xp}
                      expiresAt={challenge.expires_at}
                      completed={challenge.completed}
                      completedAt={challenge.completed_at}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Weekly Challenges Section */}
            {filter !== 'completed' && activeWeeklyChallenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-3 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-purple-600" />
                  <h3 className="font-medium text-lg">Défis hebdomadaires</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeWeeklyChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      id={challenge.id}
                      description={challenge.description}
                      target={challenge.target}
                      currentProgress={challenge.current_progress}
                      type={challenge.challenge_type}
                      rewardXp={challenge.reward_xp}
                      expiresAt={challenge.expires_at}
                      completed={challenge.completed}
                      completedAt={challenge.completed_at}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Completed Challenges Section */}
            {(filter === 'all' || filter === 'completed') && completedChallenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  <h3 className="font-medium text-lg">Défis terminés</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      id={challenge.id}
                      description={challenge.description}
                      target={challenge.target}
                      currentProgress={challenge.current_progress}
                      type={challenge.challenge_type}
                      rewardXp={challenge.reward_xp}
                      expiresAt={challenge.expires_at}
                      completed={challenge.completed}
                      completedAt={challenge.completed_at}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* No Challenges Found */}
            {displayedChallenges.length === 0 && (
              <div className="text-center py-10">
                <Target className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <h3 className="text-lg font-medium">Aucun défi trouvé</h3>
                <p className="text-muted-foreground mb-3">
                  {filter === 'all' 
                    ? "Vous n'avez pas de défis actuellement"
                    : filter === 'active'
                      ? "Vous n'avez pas de défis actifs"
                      : "Vous n'avez pas encore complété de défis"}
                </p>
                <Button variant="outline" onClick={() => setFilter('all')}>
                  Voir tous les défis
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <Target className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
            <h3 className="text-lg font-medium">Pas encore de défis</h3>
            <p className="text-muted-foreground mb-6">
              Actualisez pour générer de nouveaux défis
            </p>
            <Button onClick={onRefresh}>
              Générer des défis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
