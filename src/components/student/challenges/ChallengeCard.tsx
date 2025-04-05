
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle, Trophy, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";

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
  id, 
  description, 
  target, 
  currentProgress, 
  type, 
  rewardXp, 
  expiresAt, 
  completed, 
  completedAt 
}: ChallengeCardProps) => {
  const { updateChallengeProgress } = useGamification();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatTimeLeft = () => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    // If already expired
    if (expiry < now) {
      return "Expiré";
    }
    
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}j ${diffHrs}h`;
    } else {
      return `${diffHrs}h`;
    }
  };

  const progressPercentage = (currentProgress / target) * 100;

  // Function to simulate challenge progress (in a real app, this would be triggered by actual user actions)
  const simulateProgress = async () => {
    if (completed || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newProgress = Math.min(currentProgress + 1, target);
      await updateChallengeProgress(id, newProgress, target);
      
      if (newProgress >= target) {
        toast.success(`Défi terminé ! +${rewardXp} XP`);
      } else {
        toast.success(`Progression mise à jour ! (${newProgress}/${target})`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du défi:", error);
      toast.error("Impossible de mettre à jour la progression");
    } finally {
      setIsUpdating(false);
    }
  };

  const isExpired = new Date(expiresAt) < new Date();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={`overflow-hidden ${completed 
        ? 'border-green-200 shadow-sm bg-green-50/30' 
        : isExpired 
          ? 'border-red-200 shadow-sm bg-red-50/10'
          : 'hover:shadow-md'}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              {type === 'daily' ? (
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              ) : (
                <Trophy className="h-4 w-4 mr-2 text-purple-600" />
              )}
              <Badge variant={type === 'daily' ? 'default' : 'secondary'} className="text-xs">
                {type === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
              </Badge>
            </div>
            <div className="flex items-center">
              {!completed && !isExpired && (
                <div className="flex items-center text-xs text-amber-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatTimeLeft()}</span>
                </div>
              )}
              {completed && (
                <Badge variant="outline" className="bg-green-100 text-green-800 text-xs border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Terminé
                </Badge>
              )}
              {isExpired && !completed && (
                <Badge variant="outline" className="bg-red-100 text-red-800 text-xs border-red-200">
                  Expiré
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-sm font-medium mb-3">{description}</p>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progression</span>
              <span>{currentProgress} / {target}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-emerald-600 font-medium">
              <Target className="h-4 w-4 mr-1" />
              {rewardXp} XP
            </div>
            
            {!completed && !isExpired && (
              <Button 
                size="sm" 
                onClick={simulateProgress} 
                disabled={isUpdating}
                variant="outline"
                className="text-xs h-8"
              >
                {isUpdating ? 'Mise à jour...' : 'Simuler progression'}
              </Button>
            )}
            
            {completed && completedAt && (
              <span className="text-xs text-muted-foreground">
                Complété le {formatDate(completedAt)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
