
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Medal, Trophy, Star, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserMetrics } from '@/hooks/useUserMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Types for badges and challenges
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

  useEffect(() => {
    if (user) {
      fetchUserBadges();
      fetchAvailableBadges();
      fetchUserChallenges();
      fetchLeaderboard();
    }
  }, [user]);

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

      // Transform the data to match our expected format
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

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      // Get user's earned badge IDs
      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      if (userBadgesError) throw userBadgesError;

      // Filter out badges the user already has
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

      // Get user's challenges with their completion status
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

      // Transform to match our expected format
      const formattedChallenges = data.map(item => ({
        id: item.challenges.id,
        title: item.challenges.title,
        description: item.challenges.description,
        type: item.challenges.type,
        points: item.challenges.points,
        start_date: item.challenges.start_date,
        end_date: item.challenges.end_date,
        status: item.status,
        completed_at: item.completed_at
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

      // Get top users by points
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, points')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Add ranking
      const rankedData = data.map((user, index) => ({
        ...user,
        rank: index + 1,
        user_id: user.id
      }));

      setLeaderboard(rankedData);

      // Get current user's rank
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, points')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Count users with more points to determine rank
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
        return <Award className="h-8 w-8 text-orange-500" />;
      case 'zap':
        return <Award className="h-8 w-8 text-blue-500" />;
      case 'code':
        return <Award className="h-8 w-8 text-purple-500" />;
      case 'layers':
        return <Award className="h-8 w-8 text-indigo-500" />;
      default:
        return <Award className="h-8 w-8 text-gray-500" />;
    }
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
                        <Trophy className="h-6 w-6 text-blue-500" />
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
                        <p className="text-xs text-gray-500">
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

    return (
      <div className="space-y-4">
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
      
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-medium">Top Learners</h3>
            <Badge variant="outline" className="bg-white">Global</Badge>
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
            <h3 className="text-md font-medium mb-1">Total badges earned: <span className="font-bold text-blue-600">{badges.length}</span></h3>
            <h3 className="text-md font-medium">Challenges completed: <span className="font-bold text-green-600">{challenges.filter(c => c.status === 'completed').length}</span></h3>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Achievements & Progress</h1>
          
          <div className="mb-4">
            {renderStatsSection()}
          </div>
          
          <Tabs defaultValue="badges" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="badges">My Badges</TabsTrigger>
              <TabsTrigger value="available">Available Badges</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            <TabsContent value="badges" className="mt-4">
              {renderBadgesSection()}
            </TabsContent>
            <TabsContent value="available" className="mt-4">
              {renderAvailableBadgesSection()}
            </TabsContent>
            <TabsContent value="challenges" className="mt-4">
              {renderChallengesSection()}
            </TabsContent>
            <TabsContent value="leaderboard" className="mt-4">
              {renderLeaderboardSection()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AchievementsPage;
