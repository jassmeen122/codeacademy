
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, Zap, Code, Users, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface UserBadge {
  badge: Badge;
  earned_at: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  points: number;
  start_date: string;
  end_date: string;
}

export default function AchievementsPage() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadgesAndChallenges();
  }, []);

  const fetchBadgesAndChallenges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges (*)
        `)
        .eq('user_id', user.id);

      // Fetch active challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .gte('end_date', new Date().toISOString());

      // Transform badgesData to ensure it matches the UserBadge type
      const typedBadges: UserBadge[] = badgesData ? badgesData.map((item: any) => ({
        earned_at: item.earned_at,
        badge: {
          id: item.badge.id || '',
          name: item.badge.name || '',
          description: item.badge.description || '',
          icon: item.badge.icon || 'trophy',
          points: item.badge.points || 0
        }
      })) : [];

      setBadges(typedBadges);
      // Type assertion to ensure the data matches the Challenge interface
      setChallenges((challengesData?.filter(challenge => 
        challenge.type === 'daily' || challenge.type === 'weekly'
      ) || []) as Challenge[]);

    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return Award;
      case 'zap': return Zap;
      case 'code': return Code;
      case 'users': return Users;
      case 'target': return Target;
      default: return Trophy;
    }
  };

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Achievements & Challenges</h1>

        {/* Current Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary text-primary-foreground">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge>{challenge.type}</Badge>
                          <Badge variant="secondary">{challenge.points} points</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {challenges.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No active challenges at the moment. Check back soon!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Earned Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {badges.map((userBadge) => {
                const IconComponent = getIconComponent(userBadge.badge.icon);
                return (
                  <Card key={userBadge.badge.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary text-primary-foreground">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{userBadge.badge.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {userBadge.badge.description}
                          </p>
                          <div className="mt-2">
                            <Badge variant="secondary">
                              {userBadge.badge.points} points
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {badges.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No badges earned yet. Complete challenges and courses to earn badges!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
