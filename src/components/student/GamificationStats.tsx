
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Zap, Star } from 'lucide-react';
import { UserGamification } from '@/types/course';
import { useAuthState } from '@/hooks/useAuthState';

export const GamificationStats = () => {
  const { user } = useAuthState();
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [loading, setLoading] = useState(true);

  // Badge levels with their thresholds
  const badgeLevels = [
    { name: 'Débutant', threshold: 50, icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { name: 'Intermédiaire', threshold: 100, icon: <Award className="h-4 w-4 text-blue-500" /> },
    { name: 'Pro', threshold: 200, icon: <Zap className="h-4 w-4 text-purple-500" /> },
    { name: 'Maître', threshold: 500, icon: <Star className="h-4 w-4 text-red-500" /> }
  ];

  useEffect(() => {
    const fetchGamificationData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
          throw error;
        }

        setGamification(data as UserGamification);
      } catch (error: any) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de Gamification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gamification) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de Gamification</CardTitle>
          <CardDescription>Jouez au mini-jeu pour commencer à gagner des points!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p>Aucune statistique disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find the next badge level
  const currentPoints = gamification.points;
  const nextBadgeLevel = badgeLevels.find(badge => !gamification.badges.includes(badge.name)) || badgeLevels[badgeLevels.length - 1];
  const progressToNextBadge = Math.min(
    100, 
    nextBadgeLevel ? (currentPoints / nextBadgeLevel.threshold) * 100 : 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Statistiques de Gamification
        </CardTitle>
        <CardDescription>Votre progression dans le système de points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Points */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Points</span>
              <span className="text-sm">{gamification.points}</span>
            </div>
            <div className="bg-muted h-16 rounded-md flex items-center justify-center">
              <span className="text-3xl font-bold">{gamification.points}</span>
            </div>
          </div>

          {/* Progress to next badge */}
          {nextBadgeLevel && !gamification.badges.includes(nextBadgeLevel.name) && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Prochain Badge: {nextBadgeLevel.name}</span>
                <span className="text-sm">{currentPoints}/{nextBadgeLevel.threshold}</span>
              </div>
              <Progress value={progressToNextBadge} className="h-2" />
            </div>
          )}

          {/* Badges */}
          <div>
            <h4 className="text-sm font-medium mb-3">Badges débloqués</h4>
            {gamification.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {gamification.badges.map(badgeName => {
                  const badgeInfo = badgeLevels.find(b => b.name === badgeName);
                  return (
                    <Badge key={badgeName} variant="secondary" className="flex items-center gap-2 py-1.5 px-3">
                      {badgeInfo?.icon || <Award className="h-4 w-4" />}
                      {badgeName}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun badge débloqué pour le moment</p>
            )}
          </div>

          {/* Badge levels */}
          <div>
            <h4 className="text-sm font-medium mb-3">Niveaux de Badge</h4>
            <div className="space-y-2">
              {badgeLevels.map(badge => {
                const isUnlocked = gamification.badges.includes(badge.name);
                return (
                  <div 
                    key={badge.name} 
                    className={`flex items-center justify-between p-2 rounded-md ${
                      isUnlocked ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {badge.icon}
                      <span className={isUnlocked ? 'font-medium' : 'text-muted-foreground'}>
                        {badge.name}
                      </span>
                    </div>
                    <span className="text-sm">{badge.threshold} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
