
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { usePoints } from '@/hooks/usePoints';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface PointsDisplayProps {
  showDetails?: boolean;
  totalPoints?: number;
  loading?: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  showDetails = true,
  totalPoints: externalPoints,
  loading: externalLoading
}) => {
  const { loading: internalLoading, totalPoints: internalPoints, fetchPoints } = usePoints();
  
  // Use external props if provided, otherwise use internal state
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;
  const totalPoints = externalPoints !== undefined ? externalPoints : internalPoints;
  
  useEffect(() => {
    if (externalPoints === undefined) {
      fetchPoints();
    }
  }, [externalPoints, fetchPoints]);
  
  // Define levels based on points
  const getUserLevel = (points: number): { level: number, title: string, nextLevelPoints: number } => {
    if (points < 50) return { level: 1, title: "Débutant", nextLevelPoints: 50 };
    if (points < 150) return { level: 2, title: "Apprenti", nextLevelPoints: 150 };
    if (points < 300) return { level: 3, title: "Intermédiaire", nextLevelPoints: 300 };
    if (points < 600) return { level: 4, title: "Avancé", nextLevelPoints: 600 };
    if (points < 1000) return { level: 5, title: "Expert", nextLevelPoints: 1000 };
    return { level: 6, title: "Maître", nextLevelPoints: Infinity };
  };
  
  const userLevelInfo = getUserLevel(totalPoints);
  const previousLevelPoints = userLevelInfo.level === 1 ? 0 : getUserLevel(userLevelInfo.level - 1).nextLevelPoints;
  const pointsInCurrentLevel = totalPoints - previousLevelPoints;
  const pointsRequiredForNextLevel = userLevelInfo.nextLevelPoints - previousLevelPoints;
  const progressPercentage = Math.min(100, (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100);
  
  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Points & Progression
          </CardTitle>
          {!loading && (
            <Badge variant="outline" className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border-amber-400">
              {formatNumber(totalPoints)} XP
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-amber-100 to-yellow-300 rounded-full">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-lg font-bold flex items-center gap-1.5">
                  Niveau {userLevelInfo.level}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({userLevelInfo.title})
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Progression vers niveau {userLevelInfo.level + 1}</span>
                <span>
                  {pointsInCurrentLevel}/{pointsRequiredForNextLevel} points
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            {showDetails && (
              <>
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-md flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-blue-700">Prochains points</div>
                      <div className="font-medium">+10 XP (Quiz)</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-xs text-purple-700">Badges</div>
                      <div className="font-medium">2 débloqués</div>
                    </div>
                  </div>
                </div>
                
                <Button asChild variant="ghost" className="w-full text-sm">
                  <Link to="/student/progress">Voir les détails</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
