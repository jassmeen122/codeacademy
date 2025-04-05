
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeCard } from "./ChallengeCard";
import { Calendar, Star } from "lucide-react";
import { generateUserChallenges } from "@/utils/challengeGenerator";
import { useAuthState } from "@/hooks/useAuthState";

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
  onRefresh: () => Promise<void>;
}

export const ChallengesTab = ({ challenges, loading, onRefresh }: ChallengesTabProps) => {
  const { user } = useAuthState();
  const [isGenerating, setIsGenerating] = useState(false);

  const dailyChallenges = challenges.filter(c => c.challenge_type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.challenge_type === 'weekly');

  const handleGenerateChallenge = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      await generateUserChallenges(user.id);
      await onRefresh();
    } catch (error) {
      console.error("Error generating challenges:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Défis Quotidiens</CardTitle>
          <CardDescription>
            Complétez ces défis pour gagner des points supplémentaires chaque jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyChallenges.length > 0 ? (
            <div className="space-y-4">
              {dailyChallenges.map((challenge) => (
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
          ) : (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <h3 className="text-lg font-medium">Pas de défis quotidiens actifs</h3>
              <p className="text-muted-foreground mb-6">
                Générez de nouveaux défis pour progresser plus rapidement
              </p>
              <Button 
                variant="outline" 
                onClick={handleGenerateChallenge}
                disabled={isGenerating}
              >
                {isGenerating ? 'Génération...' : 'Générer des défis'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Défis Hebdomadaires</CardTitle>
          <CardDescription>
            Des défis plus importants pour des récompenses plus grandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyChallenges.length > 0 ? (
            <div className="space-y-4">
              {weeklyChallenges.map((challenge) => (
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
          ) : (
            <div className="text-center py-10">
              <Star className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <h3 className="text-lg font-medium">Pas de défis hebdomadaires actifs</h3>
              <p className="text-muted-foreground mb-6">
                Complétez plus d'activités pour débloquer des défis hebdomadaires
              </p>
              <Button 
                variant="outline" 
                onClick={handleGenerateChallenge}
                disabled={isGenerating}
              >
                {isGenerating ? 'Génération...' : 'Générer des défis'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
