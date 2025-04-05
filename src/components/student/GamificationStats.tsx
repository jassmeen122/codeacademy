import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Target, Trophy, Clock, Flame, ArrowRight } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useGamification } from '@/hooks/useGamification';

interface UserPoints {
  id: string;
  daily_points: number;
  weekly_points: number;
  total_points: number;
  last_updated: string;
}

interface UserChallenge {
  id: string;
  description: string;
  target: number;
  current_progress: number;
  challenge_type: string;
  reward_xp: number;
  expires_at: string;
  completed: boolean;
}

export const GamificationStats = () => {
  const { user } = useAuthState();
  const { 
    addPoints, 
    getUserPoints, 
    getUserChallenges,
    points, 
    challenges,
    loading,
  } = useGamification();
  
  const [streak, setStreak] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState<UserChallenge | null>(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState<UserChallenge | null>(null);

  useEffect(() => {
    if (user) {
      getUserPoints();
      fetchUserChallenges();
      fetchStreakAndBadges();
    }
  }, [user]);

  useEffect(() => {
    if (challenges && challenges.length > 0) {
      setDailyChallenge(challenges.find(c => c.challenge_type === 'daily') || null);
      setWeeklyChallenge(challenges.find(c => c.challenge_type === 'weekly') || null);
    }
  }, [challenges]);

  // Fetch or generate user challenges
  const fetchUserChallenges = async () => {
    if (!user) return;
    
    try {
      await getUserChallenges();
    } catch (error) {
      console.error('Error fetching/generating challenges:', error);
    }
  };

  // Fetch streak and badge count
  const fetchStreakAndBadges = async () => {
    if (!user) return;
    
    try {
      // Get user's activities from the last 30 days to calculate streak
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
      } else if (activities && activities.length > 0) {
        // Group activities by day
        const activityDays = new Set();
        activities.forEach(activity => {
          if (activity.created_at) {
            const date = new Date(activity.created_at);
            activityDays.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
          }
        });

        // Calculate streak
        const sortedDays = Array.from(activityDays).sort().reverse();
        let currentStreak = 1;
        
        for (let i = 1; i < sortedDays.length; i++) {
          const currentDateStr = sortedDays[i-1] as string;
          const prevDateStr = sortedDays[i] as string;
          
          // Parse date strings safely
          const currentParts = currentDateStr.split('-').map(Number);
          const prevParts = prevDateStr.split('-').map(Number);
          
          if (currentParts.length === 3 && prevParts.length === 3) {
            const currentDate = new Date(currentParts[0], currentParts[1], currentParts[2]);
            const prevDate = new Date(prevParts[0], prevParts[1], prevParts[2]);
            
            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }

        setStreak(currentStreak);
      }

      // Count user badges
      const { count, error: badgeError } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (badgeError) {
        console.error('Error counting badges:', badgeError);
      } else {
        setBadgeCount(count || 0);
      }
    } catch (error) {
      console.error('Error in fetchStreakAndBadges:', error);
    }
  };

  // Function to test adding points (in development mode)
  const handleAddTestPoints = async (amount: number) => {
    if (!user) return;
    await addPoints(amount, `Test points`);
    getUserPoints(); // Refresh points data
  };

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Votre Progression
          </CardTitle>
          {points && (
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 font-medium">
              {points.total_points} XP
            </Badge>
          )}
        </div>
        <CardDescription>Défis et récompenses</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center p-4">Chargement...</div>
        ) : (
          <div className="space-y-5">
            {/* Streak indicator */}
            <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-md">
              <div className="bg-orange-100 p-2 rounded-full">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Série actuelle</div>
                  <div className="text-orange-600 font-bold">{streak} jour{streak > 1 ? 's' : ''}</div>
                </div>
                <Progress value={Math.min(streak * 20, 100)} className="h-2 mt-1" />
              </div>
            </div>
            
            {/* Points summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 p-2 rounded-md">
                <div className="text-xs text-blue-600 font-medium">Aujourd'hui</div>
                <div className="font-bold text-lg">{points?.daily_points || 0}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded-md">
                <div className="text-xs text-purple-600 font-medium">Semaine</div>
                <div className="font-bold text-lg">{points?.weekly_points || 0}</div>
              </div>
              <div className="bg-green-50 p-2 rounded-md">
                <div className="text-xs text-green-600 font-medium">Badges</div>
                <div className="font-bold text-lg">{badgeCount}</div>
              </div>
            </div>
            
            {/* Daily challenge */}
            {dailyChallenge && (
              <div className="border border-blue-100 rounded-md overflow-hidden">
                <div className="bg-blue-50 px-3 py-2 border-b border-blue-100 flex justify-between items-center">
                  <div className="text-sm font-medium text-blue-700 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Défi quotidien
                  </div>
                  <div className="text-xs text-blue-600">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatTimeLeft(dailyChallenge.expires_at)}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm mb-2">{dailyChallenge.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{dailyChallenge.current_progress} / {dailyChallenge.target}</span>
                  </div>
                  <Progress 
                    value={Math.min((dailyChallenge.current_progress / dailyChallenge.target) * 100, 100)} 
                    className="h-2" 
                  />
                  <div className="text-right text-xs text-green-600 font-medium mt-1">
                    +{dailyChallenge.reward_xp} XP
                  </div>
                </div>
              </div>
            )}
            
            {/* Weekly challenge */}
            {weeklyChallenge && (
              <div className="border border-purple-100 rounded-md overflow-hidden">
                <div className="bg-purple-50 px-3 py-2 border-b border-purple-100 flex justify-between items-center">
                  <div className="text-sm font-medium text-purple-700 flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Défi hebdomadaire
                  </div>
                  <div className="text-xs text-purple-600">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatTimeLeft(weeklyChallenge.expires_at)}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm mb-2">{weeklyChallenge.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{weeklyChallenge.current_progress} / {weeklyChallenge.target}</span>
                  </div>
                  <Progress 
                    value={Math.min((weeklyChallenge.current_progress / weeklyChallenge.target) * 100, 100)} 
                    className="h-2" 
                  />
                  <div className="text-right text-xs text-purple-600 font-medium mt-1">
                    +{weeklyChallenge.reward_xp} XP
                  </div>
                </div>
              </div>
            )}
            
            {/* Test buttons (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="pt-2 border-t flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleAddTestPoints(10)}
                  variant="outline"
                  className="text-xs border-green-200 text-green-700"
                >
                  +10 XP (Test)
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleAddTestPoints(50)}
                  variant="outline"
                  className="text-xs border-blue-200 text-blue-700"
                >
                  +50 XP (Test)
                </Button>
              </div>
            )}
            
            {/* Link to achievements page */}
            <Button 
              variant="link" 
              className="w-full text-sm p-0 h-auto mt-2 text-gray-500"
              asChild
            >
              <Link to="/student/achievements" className="flex items-center justify-center">
                Voir tous vos badges et succès
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
