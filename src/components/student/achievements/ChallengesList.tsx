
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Trophy } from "lucide-react";
import { ChallengeCard } from "./ChallengeCard";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  points: number;
  start_date: string;
  end_date: string;
}

interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'in_progress' | 'completed';
  completed_at: string | null;
  challenge: Challenge;
}

interface ChallengesListProps {
  challenges: UserChallenge[];
}

export const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  return (
    <Card className="border-t-4 border-t-blue-500 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Défis Actifs
        </CardTitle>
        <CardDescription>
          Complétez ces défis pour gagner des points et débloquer des badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.challenge_id} challenge={challenge} />
          ))}
        </div>
        {challenges.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun défi actif pour le moment. Revenez plus tard!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
