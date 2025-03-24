
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Code, Award, Flame, Calendar, Star, Layers } from "lucide-react";

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

interface ChallengeCardProps {
  challenge: UserChallenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const getChallengeIcon = (title: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'Premier pas': <Trophy className="h-6 w-6" />,
      'Apprenti': <Code className="h-6 w-6" />,
      'Maître du Code': <Award className="h-6 w-6" />,
      'Série en cours': <Flame className="h-6 w-6" />,
      'Challenge du Jour': <Calendar className="h-6 w-6" />,
      'Challenge de la Semaine': <Star className="h-6 w-6" />,
      'Défi Pro': <Target className="h-6 w-6" />,
      'Défi Full Stack': <Layers className="h-6 w-6" />
    };
    
    return iconMap[title] || <Trophy className="h-6 w-6" />;
  };

  const getChallengeTypeColor = (type: string) => {
    return type === 'daily' 
      ? "bg-blue-100 text-blue-700" 
      : "bg-purple-100 text-purple-700";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className={`h-1.5 w-full ${challenge.challenge.type === 'daily' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${challenge.challenge.type === 'daily' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            {getChallengeIcon(challenge.challenge.title)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{challenge.challenge.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {challenge.challenge.description}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className={getChallengeTypeColor(challenge.challenge.type)}>
                {challenge.challenge.type === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
              </Badge>
              <Badge variant="outline" className="bg-amber-50">
                {challenge.challenge.points} points
              </Badge>
              {challenge.status === 'completed' && (
                <Badge variant="default" className="bg-green-500">
                  Complété
                </Badge>
              )}
            </div>
            {challenge.status === 'in_progress' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progression</span>
                  <span>En cours</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
