
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Target, Star } from "lucide-react";

interface ChallengeCardProps {
  id: string;
  description: string;
  target: number;
  currentProgress: number;
  type: string;
  rewardXp: number;
  expiresAt: string;
  completed: boolean;
  completedAt?: string;
}

export const ChallengeCard = ({
  description,
  target,
  currentProgress,
  type,
  rewardXp,
  expiresAt,
  completed
}: ChallengeCardProps) => {
  const formatTimeLeft = (expiresAt: string): string => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Expiré";
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    } else {
      return `${diffMins} minutes`;
    }
  };

  const isDailyChallenge = type === 'daily';
  const bgColorClass = isDailyChallenge 
    ? (completed ? 'bg-green-50 border-green-200' : 'border-blue-100')
    : (completed ? 'bg-green-50 border-green-200' : 'border-purple-100');
  
  const headerBgClass = isDailyChallenge
    ? (completed ? 'bg-green-100' : 'bg-blue-50')
    : (completed ? 'bg-green-100' : 'bg-purple-50');
  
  const iconColorClass = isDailyChallenge
    ? (completed ? 'text-green-600' : 'text-blue-600')
    : (completed ? 'text-green-600' : 'text-purple-600');
  
  const textColorClass = isDailyChallenge
    ? (completed ? 'text-green-700' : 'text-blue-700')
    : (completed ? 'text-green-700' : 'text-purple-700');
  
  const rewardColorClass = isDailyChallenge
    ? (completed ? 'text-green-600' : 'text-blue-600')
    : (completed ? 'text-green-600' : 'text-purple-600');

  return (
    <div className={`border rounded-lg overflow-hidden ${bgColorClass}`}>
      <div className={`p-3 flex justify-between items-center ${headerBgClass}`}>
        <div className="flex items-center gap-2">
          {completed ? (
            <CheckCircle2 className={`h-5 w-5 ${iconColorClass}`} />
          ) : (
            isDailyChallenge ? <Target className={`h-5 w-5 ${iconColorClass}`} /> : <Star className={`h-5 w-5 ${iconColorClass}`} />
          )}
          <span className={`font-medium ${textColorClass}`}>
            {isDailyChallenge ? 'Défi quotidien' : 'Défi hebdomadaire'}
          </span>
        </div>
        <div className="text-xs">
          <Clock className="h-3 w-3 inline mr-1" />
          {completed ? 'Terminé' : formatTimeLeft(expiresAt)}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm mb-2">{description}</p>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progression</span>
          <span>{currentProgress} / {target}</span>
        </div>
        <Progress 
          value={Math.min((currentProgress / target) * 100, 100)} 
          className={`h-2 ${completed ? 'bg-green-100' : ''}`}
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs font-medium ${rewardColorClass}`}>
            +{rewardXp} XP
          </span>
          {completed && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Complété
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
