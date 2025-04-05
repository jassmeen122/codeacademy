import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Medal, Trophy, Star, Check, Flame, Zap, Calendar, Target, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserMetrics } from '@/hooks/useUserMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned_at: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  points: number;
  start_date: string;
  end_date: string;
  status?: string;
  completed_at?: string;
  progress?: number;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  points: number;
  rank: number;
}

const AchievementsPage = () => {
  const { user } = useAuthState();
  const { metrics, loading: metricsLoading } = useUserMetrics();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelXp, setNextLevelXp] = useState(100);
  const [currentXp, setCurrentXp] = useState(0);
  const [xpProgress, setXpProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBadges();
      fetchAvailableBadges();
      fetchUserChallenges();
      fetchLeaderboard();
      fetchUserStreak();
    }
  }, [user]);
  
  useEffect(() => {
    if (metrics) {
      const totalXp = (metrics.exercises_completed * 10) + (metrics.course_completions * 50);
      const calculatedLevel = Math.floor(Math.sqrt(totalXp / 25)) + 1;
      setLevel(calculatedLevel);
      
      const nextLevelRequiredXp = Math.pow(calculatedLevel, 2) * 25;
      const prevLevelXp = Math.pow(calculatedLevel - 1, 2) * 25;
      setNextLevelXp(nextLevelRequiredXp);
      
      setCurrentXp(totalXp - prevLevelXp);
      
      const levelXpRange = nextLevelRequiredXp - prevLevelXp;
      const progressPercentage = ((totalXp - prevLevelXp) / levelXpRange) * 100;
      setXpProgress(Math.min(progressPercentage, 100));
    }
  }, [metrics]);

  const fetchUserStreak = async () => {
    try {
      if (!user) return;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('user_activities')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setStreak(0);
        return;
      }

      const activityDays = new Set();
      data.forEach(activity => {
        if (activity.created_at) {
          const date = new Date(activity.created_at);
          activityDays.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
        }
      });

      const sortedDays = Array.from(activityDays).sort().reverse();

      let currentStreak = 1;
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      
      const hasActivityToday = sortedDays[0] === todayStr;
      
      if (!hasActivityToday) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
        if (sortedDays[0] !== yesterdayStr) {
          setStreak(0);
          return;
        }
      }

      for (let i = 1; i < sortedDays.length; i++) {
        const currentDateStr = sortedDays[i-1];
        const prevDateStr = sortedDays[i];
        
        if (typeof currentDateStr === 'string' && typeof prevDateStr === 'string') {
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
      }

      setStreak(currentStreak);
    } catch (error) {
      console.error('Error fetching user streak:', error);
      toast.error('Failed to calculate learning streak');
    }
  };

  const fetchUserBadges = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          id,
          earned_at,
          badges (
            id,
            name,
            description,
            icon,
            points
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedBadges = data.map(item => ({
        id: item.id,
        name: item.badges.name,
        description: item.badges.description,
        icon: item.badges.icon,
        points: item.badges.points,
        earned_at: item.earned_at
      }));

      setBadges(formattedBadges);
    } catch (error) {
      console.error('Error fetching user badges:', error);
      toast.error('Failed to load your badges');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBadges = async () => {
    try {
      if (!user) return;

      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      if (userBadgesError) throw userBadgesError;

      const userBadgeIds = userBadges.map(ub => ub.badge_id);
      const availableBadges = allBadges.filter(badge => !userBadgeIds.includes(badge.id));

      setAvailableBadges(availableBadges);
    } catch (error) {
      console.error('Error fetching available badges:', error);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          id,
          completed_at,
          status,
          challenges (
            id,
            title,
            description,
            type,
            points,
            start_date,
            end_date
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedChallenges = data.map(item => ({
        id: item.challenges.id,
        title: item.challenges.title,
        description: item.challenges.description,
        type: item.challenges.type,
        points: item.challenges.points,
        start_date: item.challenges.start_date,
        end_date: item.challenges.end_date,
        status: item.status,
        completed_at: item.completed_at,
        progress: item.status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 : 100
      }));

      setChallenges(formattedChallenges);
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      toast.error('Failed to load your challenges');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, points')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;

      const rankedData = data.map((user, index) => ({
        ...user,
        rank: index + 1,
        user_id: user.id
      }));

      setLeaderboard(rankedData);

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, points')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const { count, error: rankError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('points', userData.points);

      if (rankError) throw rankError;

      const userRankData = {
        ...userData,
        user_id: userData.id,
        rank: (count || 0) + 1
      };

      setUserRank(userRankData as LeaderboardEntry);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="h-8 w-8 text-yellow-500" />;
      case 'trophy':
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 'star':
        return <Star className="h-8 w-8 text-yellow-500" />;
      case 'medal':
        return <Medal className="h-8 w-8 text-yellow-500" />;
      case 'check':
        return <Check className="h-8 w-8 text-green-500" />;
      case 'flame':
        return <Flame className="h-8 w-8 text-orange-500" />;
      case 'zap':
        return <Zap className="h-8 w-8 text-blue-500" />;
      default:
        return <Award className="h-8 w-8 text-gray-500" />;
    }
  };

  const renderXPCard = () => {
    if (metricsLoading) {
      return <Skeleton className="h-40 w-full" />;
    }

    const totalXp = (metrics?.exercises_completed || 0) * 10 + (metrics?.course_completions || 0) * 50;

    return (
      <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              XP & Level Progress
            </CardTitle>
            <Badge className="bg-violet-600">{totalXp} XP Total</Badge>
          </div>
          <CardDescription>Level {level}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-violet-700">{currentXp} XP</span>
              <span className="text-violet-700">{nextLevelXp} XP</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-violet-100" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{(nextLevelXp - currentXp)} XP needed for level {level+1}</span>
              {streak > 0 && (
                <div className="flex items-center">
                  <Flame className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="font-medium text-orange-600">{streak} day streak!</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBadgesSection = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      );
    }

    if (badges.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
          <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-yellow-800">No badges earned yet</h3>
          <p className="text-yellow-600 mt-1">
            Complete lessons, exercises and challenges to earn your first badge!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <Card key={badge.id} className="overflow-hidden border-2 border-green-100 bg-white">
            <CardHeader className="bg-green-50 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md">{badge.name}</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {badge.points} XP
                </Badge>
              </div>
              <CardDescription>
                Earned on {format(new Date(badge.earned_at), 'PP')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full border border-green-100">
                  {getIconComponent(badge.icon)}
                </div>
                <p className="text-gray-600 text-sm">{badge.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAvailableBadgesSection = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      );
    }

    if (availableBadges.length === 0) {
      return (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
          <Trophy className="h-12 w-12 text-blue-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-blue-800">All badges earned!</h3>
          <p className="text-blue-600 mt-1">
            Congratulations! You've earned all available badges.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableBadges.map((badge) => (
          <Card key={badge.id} className="overflow-hidden border border-gray-200 bg-gray-50">
            <CardHeader className="bg-gray-100 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md text-gray-600">{badge.name}</CardTitle>
                <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                  {badge.points} XP
                </Badge>
              </div>
              <CardDescription className="text-gray-500">
                Not yet earned
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 p-2 rounded-full">
                  {getIconComponent(badge.icon)}
                </div>
                <p className="text-gray-500 text-sm">{badge.description}</p>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 pt-0 pb-3">
              <div className="text-xs text-gray-500 w-full">
                <div className="flex items-center justify-between">
                  <span>Requirement:</span>
                  <span className="font-medium">
                    {badge.name.includes('Beginner') ? '1 exercise' : 
                     badge.name.includes('Intermédiaire') ? '5 exercises' : 
                     badge.name.includes('Expert') ? '1 course completion' :
                     badge.name.includes('Motivé') ? '3 day streak' :
                     badge.name.includes('Challengeur') ? 'Complete a challenge' : 
                     'Special achievement'}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderChallengesSection = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (challenges.length === 0) {
      return (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 text-center">
          <Star className="h-12 w-12 text-purple-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-purple-800">No active challenges</h3>
          <p className="text-purple-600 mt-1">
            Check back soon for new challenges or complete lessons to unlock them!
          </p>
        </div>
      );
    }

    const activeChallenges = challenges.filter(c => c.status !== 'completed');
    const completedChallenges = challenges.filter(c => c.status === 'completed');

    return (
      <div className="space-y-6">
        {activeChallenges.length > 0 && (
          <>
            <h3 className="text-lg font-medium">Active Challenges</h3>
            <div className="grid grid-cols-1 gap-4">
              {activeChallenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden border-2 border-blue-100">
                  <div className="flex items-center p-4 gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      {challenge.type === 'daily' ? (
                        <Star className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Calendar className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {challenge.type === 'daily' ? 'Daily' : 'Weekly'} · {challenge.points} XP
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Expires: {format(new Date(challenge.end_date), 'PPp')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {completedChallenges.length > 0 && (
          <>
            <h3 className="text-lg font-medium mt-6">Completed Challenges</h3>
            <div className="grid grid-cols-1 gap-4">
              {completedChallenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden bg-green-50 border border-green-100">
                  <div className="flex items-center p-4 gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          {challenge.points} XP earned
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Completed: {challenge.completed_at ? format(new Date(challenge.completed_at), 'PPp') : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLeaderboardSection = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (leaderboard.length === 0) {
      return (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 text-center">
          <Trophy className="h-12 w-12 text-orange-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-orange-800">Leaderboard not available</h3>
          <p className="text-orange-600 mt-1">
            Start learning to appear on the leaderboard!
          </p>
        </div>
      );
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + (6 - today));

    return (
      <div className="space-y-6">
        {userRank && (
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-blue-200 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {userRank.rank}
                  </div>
                  <div>
                    <p className="font-medium">{userRank.full_name || 'You'}</p>
                    <p className="text-sm text-blue-600">{userRank.points} XP</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Your Rank
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-4 mb-2">
          <Button variant="outline" className="flex-1 bg-white" disabled>
            <Target className="h-4 w-4 mr-2" />
            Global
          </Button>
          <Button variant="outline" className="flex-1 bg-blue-50 border-blue-200 text-blue-700">
            <Clock className="h-4 w-4 mr-2" />
            Weekly
          </Button>
          <Button variant="outline" className="flex-1 bg-white" disabled>
            <Users className="h-4 w-4 mr-2" />
            Friends
          </Button>
        </div>
        
        <div className="text-sm text-center text-gray-500 mb-2">
          Week of {format(new Date(), 'MMM d')} - {format(weekEnd, 'MMM d')}
        </div>
      
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-medium">Top Learners</h3>
            <Badge variant="outline" className="bg-white">This Week</Badge>
          </div>
          <div>
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-3 ${index < leaderboard.length - 1 ? 'border-b' : ''} ${entry.user_id === user?.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center w-12 justify-center">
                  {index === 0 ? (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-5 w-5 text-gray-400" />
                  ) : index === 2 ? (
                    <Medal className="h-5 w-5 text-amber-700" />
                  ) : (
                    <span className="text-gray-500 text-sm font-medium">{entry.rank}</span>
                  )}
                </div>
                <div className="flex-1 ml-2">
                  <p className={`font-medium ${entry.user_id === user?.id ? 'text-blue-700' : ''}`}>
                    {entry.full_name || 'Anonymous User'}
                    {entry.user_id === user?.id && " (You)"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-700">{entry.points}</span>
                  <span className="text-gray-500 text-sm"> XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStatsSection = () => {
    if (metricsLoading) {
      return <Skeleton className="h-40 w-full" />;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Stats</CardTitle>
          <CardDescription>Track your progress and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-orange-700">Courses Completed</h3>
              <p className="text-3xl font-bold text-orange-900">{metrics?.course_completions || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-green-700">Exercises Completed</h3>
              <p className="text-3xl font-bold text-green-900">{metrics?.exercises_completed || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-purple-700">Learning Time</h3>
              <p className="text-3xl font-bold text-purple-900">{metrics?.total_time_spent || 0} min</p>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">Total badges earned: <span className="font-bold text-blue-600">{badges.length}</span></h3>
              {streak > 0 && (
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-500 mr-1" />
                  <span className="font-medium text-orange-600">{streak} day streak!</span>
                </div>
              )}
            </div>
            <h3 className="text-md font-medium mt-1">Challenges completed: <span className="font-bold text-green-600">{challenges.filter(c => c.status === 'completed').length}</span></h3>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Vos Achievements & Progression</h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-blue-600" />
                  Statistiques d'Apprentissage
                </CardTitle>
                <CardDescription>Suivez votre progression et vos réalisations</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-100 shadow-sm">
                    <h3 className="text-sm font-medium text-orange-700 mb-1">Cours Terminés</h3>
                    <p className="text-3xl font-bold text-orange-900">{metrics?.course_completions || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100 shadow-sm">
                    <h3 className="text-sm font-medium text-green-700 mb-1">Exercices Terminés</h3>
                    <p className="text-3xl font-bold text-green-900">{metrics?.exercises_completed || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-100 shadow-sm">
                    <h3 className="text-sm font-medium text-purple-700 mb-1">Temps d'Apprentissage</h3>
                    <p className="text-3xl font-bold text-purple-900">{metrics?.total_time_spent || 0} min</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-md font-medium">Total des badges obtenus: <span className="font-bold text-blue-600">{badges.length}</span></h3>
                    {streak > 0 && (
                      <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                        <Flame className="h-5 w-5 text-orange-500 mr-1" />
                        <span className="font-medium text-orange-600">{streak} jour{streak > 1 ? 's' : ''} de série!</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-md font-medium mt-2">Défis terminés: <span className="font-bold text-green-600">{challenges.filter(c => c.status === 'completed').length}</span></h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200 shadow-md h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    XP & Niveau
                  </CardTitle>
                  <Badge className="bg-violet-600">
                    {(metrics?.exercises_completed || 0) * 10 + (metrics?.course_completions || 0) * 50} XP
                  </Badge>
                </div>
                <CardDescription>Niveau {level}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-violet-700">{currentXp} XP</span>
                    <span className="text-violet-700">{nextLevelXp} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-3 bg-violet-100" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{(nextLevelXp - currentXp)} XP pour niveau {level+1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="badges" className="text-base">Mes Badges</TabsTrigger>
            <TabsTrigger value="available" className="text-base">Badges Disponibles</TabsTrigger>
            <TabsTrigger value="challenges" className="text-base">Défis</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-base">Classement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="mt-6 animate-fadeIn">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : badges.length === 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-100 rounded-xl p-8 text-center shadow-sm">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-yellow-800">Aucun badge obtenu</h3>
                <p className="text-yellow-600 mt-2">
                  Complétez des leçons, exercices et défis pour obtenir votre premier badge !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <Card key={badge.id} className="overflow-hidden border-2 border-green-100 bg-white hover:shadow-md transition-shadow">
                    <CardHeader className="bg-green-50 pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {badge.points} XP
                        </Badge>
                      </div>
                      <CardDescription>
                        Obtenu le {format(new Date(badge.earned_at), 'PP')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full border-2 border-green-100 shadow-sm">
                          {getIconComponent(badge.icon)}
                        </div>
                        <p className="text-gray-600">{badge.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="mt-6 animate-fadeIn">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : availableBadges.length === 0 ? (
              <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-8 text-center shadow-sm">
                <Trophy className="h-16 w-16 text-blue-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-blue-800">Tous les badges sont obtenus!</h3>
                <p className="text-blue-600 mt-2">
                  Félicitations! Vous avez obtenu tous les badges disponibles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableBadges.map((badge) => (
                  <Card key={badge.id} className="overflow-hidden border border-gray-200 bg-gray-50">
                    <CardHeader className="bg-gray-100 pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md text-gray-600">{badge.name}</CardTitle>
                        <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                          {badge.points} XP
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-500">
                        Pas encore obtenu
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-200 p-3 rounded-full">
                          {getIconComponent(badge.icon)}
                        </div>
                        <p className="text-gray-500">{badge.description}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 pt-0 pb-4">
                      <div className="text-xs text-gray-500 w-full">
                        <div className="flex items-center justify-between">
                          <span>Prérequis:</span>
                          <span className="font-medium">
                            {badge.name.includes('Débutant') ? '1 exercice' : 
                             badge.name.includes('Intermédiaire') ? '5 exercices' : 
                             badge.name.includes('Expert') ? '1 cours terminé' :
                             badge.name.includes('Motivé') ? '3 jours de série' :
                             badge.name.includes('Challenger') ? 'Compléter un défi' : 
                             'Accomplissement spécial'}
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="challenges" className="mt-6 animate-fadeIn">
            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : challenges.length === 0 ? (
              <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-8 text-center shadow-sm">
                <Star className="h-16 w-16 text-purple-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-purple-800">Aucun défi actif</h3>
                <p className="text-purple-600 mt-2">
                  Revenez bientôt pour voir de nouveaux défis ou complétez des leçons pour les débloquer!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {challenges.filter(c => c.status !== 'completed').length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium mb-4">Défis Actifs</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {challenges.filter(c => c.status !== 'completed').map((challenge) => (
                        <Card key={challenge.id} className="overflow-hidden border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                            <div className="bg-blue-100 p-3 rounded-full self-start">
                              {challenge.type === 'daily' ? (
                                <Star className="h-6 w-6 text-blue-500" />
                              ) : (
                                <Calendar className="h-6 w-6 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <h4 className="font-medium text-lg">{challenge.title}</h4>
                                  <p className="text-gray-600">{challenge.description}</p>
                                </div>
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 self-start">
                                  {challenge.type === 'daily' ? 'Quotidien' : 'Hebdomadaire'} · {challenge.points} XP
                                </Badge>
                              </div>
                              <div className="mt-3">
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Progression</span>
                                    <span>{challenge.progress}%</span>
                                  </div>
                                  <Progress value={challenge.progress} className="h-2" />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  Expire: {format(new Date(challenge.end_date), 'PPp')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {challenges.filter(c => c.status === 'completed').length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium mb-4">Défis Complétés</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {challenges.filter(c => c.status === 'completed').map((challenge) => (
                        <Card key={challenge.id} className="overflow-hidden bg-green-50 border border-green-100 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                            <div className="bg-green-100 p-3 rounded-full self-start">
                              <Check className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <h4 className="font-medium text-lg">{challenge.title}</h4>
                                  <p className="text-gray-600">{challenge.description}</p>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 self-start">
                                  {challenge.points} XP gagnés
                                </Badge>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                  Complété: {challenge.completed_at ? format(new Date(challenge.completed_at), 'PPp') : 'Date inconnue'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-6 animate-fadeIn">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-8 text-center shadow-sm">
                <Trophy className="h-16 w-16 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-orange-800">Classement indisponible</h3>
                <p className="text-orange-600 mt-2">
                  Commencez à apprendre pour apparaître dans le classement!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userRank && (
                  <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-blue-200 mb-6 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                            {userRank.rank}
                          </div>
                          <div>
                            <p className="font-medium text-lg">{userRank.full_name || 'Vous'}</p>
                            <p className="text-blue-600">{userRank.points} XP</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Votre rang
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex gap-4 mb-4">
                  <Button variant="outline" className="flex-1 bg-white" disabled>
                    <Target className="h-4 w-4 mr-2" />
                    Global
                  </Button>
                  <Button variant="outline" className="flex-1 bg-blue-50 border-blue-200 text-blue-700">
                    <Clock className="h-4 w-4 mr-2" />
                    Hebdomadaire
                  </Button>
                  <Button variant="outline" className="flex-1 bg-white" disabled>
                    <Users className="h-4 w-4 mr-2" />
                    Amis
                  </Button>
                </div>
                
                <Card className="shadow-md border-gray-200">
                  <CardHeader className="p-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Top Apprenants</CardTitle>
                      <Badge variant="outline" className="bg-white">Cette Semaine</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {leaderboard.map((entry, index) => (
                      <div 
                        key={entry.id} 
                        className={`flex items-center p-4 ${index < leaderboard.length - 1 ? 'border-b' : ''} ${entry.user_id === user?.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center w-12 justify-center">
                          {index === 0 ? (
                            <div className="bg-yellow-100 p-2 rounded-full">
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            </div>
                          ) : index === 1 ? (
                            <div className="bg-gray-100 p-2 rounded-full">
                              <Medal className="h-5 w-5 text-gray-400" />
                            </div>
                          ) : index === 2 ? (
                            <div className="bg-amber-100 p-2 rounded-full">
                              <Medal className="h-5 w-5 text-amber-700" />
                            </div>
                          ) : (
                            <span className="text-gray-500 text-lg font-medium">{entry.rank}</span>
                          )}
                        </div>
                        <div className="flex-1 ml-4">
                          <p className={`font-medium ${entry.user_id === user?.id ? 'text-blue-700' : ''}`}>
                            {entry.full_name || 'Utilisateur Anonyme'}
                            {entry.user_id === user?.id && " (Vous)"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-700">{entry.points}</span>
                          <span className="text-gray-500 text-sm"> XP</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AchievementsPage;
