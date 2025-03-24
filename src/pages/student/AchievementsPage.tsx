
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Award, 
  Zap, 
  Code, 
  Users, 
  Target, 
  Trophy, 
  Flame,
  Star,
  Layers,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
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

interface UserBadge {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
  };
  earned_at: string;
}

export default function AchievementsPage() {
  const { user } = useAuthState();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBadgesAndChallenges();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBadgesAndChallenges = async () => {
    try {
      if (!user) return;

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges (*)
        `)
        .eq('user_id', user.id);

      if (badgesError) throw badgesError;
      setBadges(badgesData || []);

      // Fetch all challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .gte('end_date', new Date().toISOString());

      if (challengesError) throw challengesError;
      setAllChallenges(challengesData as Challenge[] || []);

      // Fetch user challenges
      const { data: userChallengesData, error: userChallengesError } = await supabase
        .from('user_challenges')
        .select(`
          id,
          user_id,
          challenge_id,
          status,
          completed_at,
          challenge:challenges (*)
        `)
        .eq('user_id', user.id);

      if (userChallengesError) throw userChallengesError;

      // Process challenges - combine existing user challenges with all challenges
      const processedChallenges: UserChallenge[] = challengesData.map((challenge: Challenge) => {
        const userChallenge = userChallengesData?.find(
          (uc) => uc.challenge_id === challenge.id
        );
        
        if (userChallenge) {
          return userChallenge as UserChallenge;
        } else {
          // Challenge exists but user hasn't started it yet
          return {
            id: 'temp-' + challenge.id,
            user_id: user.id,
            challenge_id: challenge.id,
            status: 'in_progress',
            completed_at: null,
            challenge: challenge
          };
        }
      });

      setChallenges(processedChallenges);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error("Impossible de charger les récompenses");
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'code': return <Code className="h-6 w-6" />;
      case 'users': return <Users className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'layers': return <Layers className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

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

  const getChallengeTypeColor = (type: 'daily' | 'weekly') => {
    return type === 'daily' 
      ? "bg-blue-100 text-blue-700" 
      : "bg-purple-100 text-purple-700";
  };
  
  const getBadgeColor = (name: string) => {
    const colorMap: Record<string, string> = {
      'Débutant': "bg-green-100 text-green-800 border-green-200",
      'Intermédiaire': "bg-blue-100 text-blue-800 border-blue-200",
      'Expert': "bg-purple-100 text-purple-800 border-purple-200",
      'Motivé': "bg-orange-100 text-orange-800 border-orange-200",
      'Challengeur': "bg-yellow-100 text-yellow-800 border-yellow-200",
      'Pro du Debug': "bg-cyan-100 text-cyan-800 border-cyan-200",
      'Full Stack Dev': "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    
    return colorMap[name] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-md mb-8"></div>
          <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-3">
          <Trophy className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Vos Achievements & Défis</h1>
        </div>

        <div className="grid gap-8">
          {/* Current Challenges */}
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
                  <Card key={challenge.challenge_id} className="overflow-hidden hover:shadow-lg transition-all">
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

          {/* Earned Badges */}
          <Card className="border-t-4 border-t-purple-500 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Badges Débloqués
              </CardTitle>
              <CardDescription>
                Vos accomplissements et récompenses obtenues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {badges.map((userBadge) => (
                  <Card key={userBadge.badge.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${userBadge.badge.name === 'Expert' ? 'from-purple-400 to-pink-500' : 'from-blue-400 to-indigo-500'}`}></div>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${getBadgeColor(userBadge.badge.name)}`}>
                          {getIconComponent(userBadge.badge.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{userBadge.badge.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {userBadge.badge.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-gray-100">
                              {userBadge.badge.points} points
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              Débloqué
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {badges.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore débloqué de badges. Complétez des défis pour en gagner!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
