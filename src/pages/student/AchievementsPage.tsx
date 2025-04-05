import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthState } from "@/hooks/useAuthState";
import { useGamification } from "@/hooks/useGamification";
import { BadgesTab } from "@/components/student/badges/BadgesTab";
import {
  Trophy,
  Medal,
  Award,
  Clock,
  CheckCircle2,
  Star,
  Calendar,
  Scroll,
  Target,
  Users,
  Flame,
  Zap
} from "lucide-react";
import { toast } from "sonner";

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

interface UserCertificate {
  id: string;
  title: string;
  description: string;
  certificate_url: string | null;
  issued_at: string;
}

const AchievementsPage = () => {
  const { user } = useAuthState();
  const {
    loading,
    allBadges,
    challenges,
    certificates,
    points,
    leaderboard,
    getUserBadges,
    getUserChallenges,
    getUserCertificates,
    getUserPoints,
    getLeaderboard
  } = useGamification();

  const [activeTab, setActiveTab] = useState("badges");
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'global' | 'weekly'>('global');

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      await Promise.all([
        getUserBadges(),
        getUserChallenges(),
        getUserCertificates(),
        getUserPoints(),
        getLeaderboard(leaderboardPeriod)
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données de gamification:", error);
      toast.error("Impossible de charger les données de gamification");
    }
  };

  const handleLeaderboardPeriodChange = async (period: 'global' | 'weekly') => {
    setLeaderboardPeriod(period);
    await getLeaderboard(period);
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

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="h-5 w-5" />;
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'target': return <Target className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Achievements & Gamification</h1>
            <p className="text-muted-foreground">
              Suivez vos progrès, défis et récompenses
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">{points?.total_points || 0} XP</span>
          </div>
        </div>
        
        {loading && activeTab !== "badges" ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-lg">Chargement des données de gamification...</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="badges" className="flex gap-2 items-center">
                <Medal className="h-4 w-4" /> Badges
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex gap-2 items-center">
                <Target className="h-4 w-4" /> Défis
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex gap-2 items-center">
                <Scroll className="h-4 w-4" /> Certificats
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex gap-2 items-center">
                <Users className="h-4 w-4" /> Classement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="badges" className="space-y-6">
              <BadgesTab 
                badges={allBadges || []} 
                loading={loading} 
                onRefresh={loadGamificationData} 
              />
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Défis Quotidiens</CardTitle>
                    <CardDescription>
                      Complétez ces défis pour gagner des points supplémentaires chaque jour
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {challenges && challenges.filter(c => c.challenge_type === 'daily').length > 0 ? (
                      <div className="space-y-4">
                        {challenges
                          .filter(challenge => challenge.challenge_type === 'daily')
                          .map((challenge) => (
                            <div 
                              key={challenge.id} 
                              className={`border rounded-lg overflow-hidden ${challenge.completed ? 'bg-green-50 border-green-200' : 'border-blue-100'}`}
                            >
                              <div className={`p-3 flex justify-between items-center ${challenge.completed ? 'bg-green-100' : 'bg-blue-50'}`}>
                                <div className="flex items-center gap-2">
                                  {challenge.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Target className="h-5 w-5 text-blue-600" />
                                  )}
                                  <span className={`font-medium ${challenge.completed ? 'text-green-700' : 'text-blue-700'}`}>
                                    Défi quotidien
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {challenge.completed ? 'Terminé' : formatTimeLeft(challenge.expires_at)}
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm mb-2">{challenge.description}</p>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progression</span>
                                  <span>{challenge.current_progress} / {challenge.target}</span>
                                </div>
                                <Progress 
                                  value={Math.min((challenge.current_progress / challenge.target) * 100, 100)} 
                                  className={`h-2 ${challenge.completed ? 'bg-green-100' : ''}`}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <span className={`text-xs font-medium ${challenge.completed ? 'text-green-600' : 'text-blue-600'}`}>
                                    +{challenge.reward_xp} XP
                                  </span>
                                  {challenge.completed && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                      Complété
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                        <h3 className="text-lg font-medium">Pas de défis quotidiens actifs</h3>
                        <p className="text-muted-foreground mb-6">
                          Connectez-vous chaque jour pour recevoir de nouveaux défis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Défis Hebdomadaires</CardTitle>
                    <CardDescription>
                      Des défis plus importants pour des récompenses plus grandes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {challenges && challenges.filter(c => c.challenge_type === 'weekly').length > 0 ? (
                      <div className="space-y-4">
                        {challenges
                          .filter(challenge => challenge.challenge_type === 'weekly')
                          .map((challenge) => (
                            <div 
                              key={challenge.id} 
                              className={`border rounded-lg overflow-hidden ${challenge.completed ? 'bg-green-50 border-green-200' : 'border-purple-100'}`}
                            >
                              <div className={`p-3 flex justify-between items-center ${challenge.completed ? 'bg-green-100' : 'bg-purple-50'}`}>
                                <div className="flex items-center gap-2">
                                  {challenge.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Star className="h-5 w-5 text-purple-600" />
                                  )}
                                  <span className={`font-medium ${challenge.completed ? 'text-green-700' : 'text-purple-700'}`}>
                                    Défi hebdomadaire
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {challenge.completed ? 'Terminé' : formatTimeLeft(challenge.expires_at)}
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm mb-2">{challenge.description}</p>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progression</span>
                                  <span>{challenge.current_progress} / {challenge.target}</span>
                                </div>
                                <Progress 
                                  value={Math.min((challenge.current_progress / challenge.target) * 100, 100)} 
                                  className={`h-2 ${challenge.completed ? 'bg-green-100' : ''}`}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <span className={`text-xs font-medium ${challenge.completed ? 'text-green-600' : 'text-purple-600'}`}>
                                    +{challenge.reward_xp} XP
                                  </span>
                                  {challenge.completed && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                      Complété
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                        <h3 className="text-lg font-medium">Pas de défis hebdomadaires actifs</h3>
                        <p className="text-muted-foreground mb-6">
                          Revenez régulièrement pour découvrir de nouveaux défis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vos Certificats</CardTitle>
                  <CardDescription>
                    Certificats obtenus en complétant des cours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificates && certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {certificates.map((certificate) => (
                        <Card key={certificate.id} className="border hover:shadow-md transition-all">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
                            <Scroll className="h-12 w-12 text-blue-700" />
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-semibold mb-1 text-blue-700">{certificate.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{certificate.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                Délivré le {formatDate(certificate.issued_at)}
                              </span>
                              {certificate.certificate_url && (
                                <Button size="sm" variant="outline" className="text-xs">
                                  Voir
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Scroll className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                      <h3 className="text-lg font-medium">Pas encore de certificats</h3>
                      <p className="text-muted-foreground mb-6">
                        Complétez des cours pour obtenir des certificats
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Classement</CardTitle>
                      <CardDescription>
                        {leaderboardPeriod === 'global' 
                          ? "Classement global basé sur les points totaux"
                          : "Classement de la semaine en cours"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={leaderboardPeriod === 'global' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLeaderboardPeriodChange('global')}
                      >
                        Global
                      </Button>
                      <Button 
                        variant={leaderboardPeriod === 'weekly' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLeaderboardPeriodChange('weekly')}
                      >
                        Cette semaine
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {leaderboard && leaderboard.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboard.map((entry, index) => {
                        const points = leaderboardPeriod === 'global' 
                          ? entry.points 
                          : entry.weekly_points;
                        const name = leaderboardPeriod === 'global'
                          ? entry.full_name
                          : entry.profiles?.full_name;
                          
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center p-3 rounded-lg ${
                              index === 0 ? 'bg-yellow-50 border border-yellow-100' :
                              index === 1 ? 'bg-gray-50 border border-gray-100' :
                              index === 2 ? 'bg-amber-50 border border-amber-100' :
                              'bg-white border'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${
                              index === 0 ? 'bg-yellow-200 text-yellow-800' :
                              index === 1 ? 'bg-gray-200 text-gray-800' :
                              index === 2 ? 'bg-amber-200 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{name || 'Utilisateur'}</p>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-semibold">{points}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                      <h3 className="text-lg font-medium">Aucune donnée de classement disponible</h3>
                      <p className="text-muted-foreground mb-6">
                        Accumulez des points pour apparaître dans le classement
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AchievementsPage;
