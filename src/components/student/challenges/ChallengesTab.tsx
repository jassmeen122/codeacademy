
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, RotateCw, FilterX, Check } from "lucide-react";
import { ChallengeCard } from './ChallengeCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';
import { generateUserChallenges } from '@/utils/challengeGenerator';

interface ChallengesTabProps {
  challenges: any[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export const ChallengesTab: React.FC<ChallengesTabProps> = ({
  challenges = [],
  loading,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthState();

  const dailyChallenges = challenges.filter(challenge => challenge.challenge_type === 'daily');
  const weeklyChallenges = challenges.filter(challenge => challenge.challenge_type === 'weekly');
  const completedChallenges = challenges.filter(challenge => challenge.completed);
  
  const filteredChallenges = filter === 'all' 
    ? challenges 
    : filter === 'active' 
      ? challenges.filter(challenge => !challenge.completed) 
      : completedChallenges;

  const handleRefreshChallenges = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour générer des défis");
      return;
    }
    
    try {
      setRefreshing(true);
      console.log("Generating new challenges...");
      
      // Generate challenges
      const result = await generateUserChallenges(user.id);
      
      if (result) {
        toast.success("Nouveaux défis générés !");
      } else {
        toast.info("Vous avez déjà des défis actifs");
      }
      
      // Refresh the challenges list
      await onRefresh();
    } catch (error) {
      console.error("Error generating challenges:", error);
      toast.error("Impossible de générer de nouveaux défis");
    } finally {
      setRefreshing(false);
    }
  };

  console.log("ChallengesTab rendered with:", {
    totalChallenges: challenges.length,
    displayedChallenges: filteredChallenges.length,
    dailyCount: dailyChallenges.length,
    weeklyCount: weeklyChallenges.length
  });

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-background">
        <CardTitle className="flex items-center text-2xl">
          <Target className="h-6 w-6 mr-2 text-orange-600" />
          Vos Défis
        </CardTitle>
        <CardDescription className="text-base">
          Relevez des défis quotidiens et hebdomadaires pour gagner des points et des badges
        </CardDescription>
      </CardHeader>
      
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tous
          </Button>
          <Button 
            variant={filter === 'active' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('active')}
            className="flex items-center gap-1"
          >
            <Target className="h-4 w-4" />
            Actifs
          </Button>
          <Button 
            variant={filter === 'completed' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('completed')}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Terminés
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshChallenges}
          disabled={refreshing || loading}
          className="flex items-center gap-1"
        >
          <RotateCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <CardContent className="p-6 pt-0">
        {loading || refreshing ? (
          <div className="py-12 flex justify-center items-center">
            <div className="text-center">
              <RotateCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Chargement des défis...</p>
            </div>
          </div>
        ) : filteredChallenges.length > 0 ? (
          <div className="space-y-4">
            {dailyChallenges.length > 0 && filter !== 'completed' && (
              <div>
                <h3 className="text-lg font-medium mb-3">Défis Quotidiens</h3>
                <div className="space-y-3">
                  {dailyChallenges
                    .filter(challenge => filter === 'all' || (filter === 'active' && !challenge.completed))
                    .map(challenge => (
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
              </div>
            )}
            
            {weeklyChallenges.length > 0 && filter !== 'completed' && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Défis Hebdomadaires</h3>
                <div className="space-y-3">
                  {weeklyChallenges
                    .filter(challenge => filter === 'all' || (filter === 'active' && !challenge.completed))
                    .map(challenge => (
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
              </div>
            )}
            
            {completedChallenges.length > 0 && filter !== 'active' && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Défis Terminés</h3>
                <div className="space-y-3">
                  {completedChallenges
                    .filter(challenge => filter === 'all' || filter === 'completed')
                    .map(challenge => (
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
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Pas encore de défis</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Actualisez pour générer de nouveaux défis
            </p>
            <Button 
              onClick={handleRefreshChallenges}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RotateCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Générer des défis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
