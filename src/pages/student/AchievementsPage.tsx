
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { useGamification } from "@/hooks/useGamification";
import { BadgesTab } from "@/components/student/badges/BadgesTab";
import { ChallengesTab } from "@/components/student/challenges/ChallengesTab";
import {
  Trophy,
  Medal,
  Scroll,
  Users,
  Target,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGamificationData().then(() => setIsLoading(false));
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      console.log("Loading gamification data...");
      await Promise.all([
        getUserBadges(),
        getUserChallenges(),
        getUserCertificates(),
        getUserPoints(),
        getLeaderboard(leaderboardPeriod)
      ]);
      console.log("Data loaded successfully");
    } catch (error) {
      console.error("Erreur lors du chargement des données de gamification:", error);
      toast.error("Impossible de charger les données de gamification");
    }
  };

  const handleLeaderboardPeriodChange = async (period: 'global' | 'weekly') => {
    setLeaderboardPeriod(period);
    await getLeaderboard(period);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  console.log("Rendering AchievementsPage with:", {
    loading: isLoading,
    badgesCount: allBadges?.length || 0,
    challengesCount: challenges?.length || 0,
    certificatesCount: certificates?.length || 0
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
              Achievements & Gamification
            </h1>
            <p className="text-muted-foreground">
              Suivez vos progrès, défis et récompenses
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 p-3 rounded-lg shadow-sm">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="font-semibold text-lg">{points?.total_points || 0} XP</span>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-lg">Chargement des données de gamification...</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-2 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="badges" className="flex gap-2 items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Medal className="h-4 w-4" /> Badges
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex gap-2 items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4" /> Défis
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex gap-2 items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Scroll className="h-4 w-4" /> Certificats
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex gap-2 items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
              <ChallengesTab
                challenges={challenges || []}
                loading={loading}
                onRefresh={loadGamificationData}
              />
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-background">
                  <CardTitle className="flex items-center text-2xl">
                    <Scroll className="h-6 w-6 mr-2 text-blue-600" />
                    Vos Certificats
                  </CardTitle>
                  <CardDescription className="text-base">
                    Certificats obtenus en complétant des cours
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {certificates && certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {certificates.map((certificate) => (
                        <motion.div
                          key={certificate.id}
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Card className="border hover:shadow-md transition-all overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
                              <Scroll className="h-16 w-16 text-blue-700" />
                            </div>
                            <CardContent className="p-5">
                              <h3 className="font-semibold text-lg mb-2 text-blue-700">{certificate.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4">{certificate.description}</p>
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
                        </motion.div>
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
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-background">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center text-2xl">
                        <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                        Classement des Étudiants
                      </CardTitle>
                      <CardDescription className="text-base">
                        {leaderboardPeriod === 'global' 
                          ? "Classement global basé sur les points totaux"
                          : "Classement des étudiants de la semaine en cours"}
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
                <CardContent className="p-6">
                  {leaderboard && leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => {
                        const points = leaderboardPeriod === 'global' 
                          ? entry.points 
                          : entry.weekly_points;
                        const name = leaderboardPeriod === 'global'
                          ? entry.full_name
                          : entry.profiles?.full_name;
                          
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div 
                              className={`flex items-center p-4 rounded-lg shadow-sm ${
                                index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200' :
                                index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200' :
                                index === 2 ? 'bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200' :
                                'bg-white border hover:bg-gray-50 transition-colors'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold text-lg ${
                                index === 0 ? 'bg-yellow-200 text-yellow-800' :
                                index === 1 ? 'bg-gray-200 text-gray-800' :
                                index === 2 ? 'bg-amber-200 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-lg">{name || 'Utilisateur'}</p>
                              </div>
                              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="font-bold">{points}</span>
                              </div>
                            </div>
                          </motion.div>
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
                      <Button onClick={() => loadGamificationData()}>
                        Actualiser
                      </Button>
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
