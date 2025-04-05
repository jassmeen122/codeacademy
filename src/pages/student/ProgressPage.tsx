import React, { useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { ActivityLog } from '@/types/progress';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import { useUserRecommendations } from '@/hooks/useUserRecommendations';
import { useUserMetrics } from '@/hooks/useUserMetrics';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { SkillsProgressChart } from '@/components/student/progress/SkillsProgressChart';
import { ActivityCalendar } from '@/components/student/progress/ActivityCalendar';
import { RecommendationsList } from '@/components/student/progress/RecommendationsList';
import { PointsDisplay } from '@/components/student/progress/PointsDisplay';
import { MagicTips } from '@/components/student/progress/MagicTips';
import { WeeklySummary } from '@/components/student/progress/WeeklySummary';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Award, Code, BookOpen, Calendar, BarChart2, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function ProgressPage() {
  const { user } = useAuthState();
  const { skills, loading: skillsLoading, fetchUserSkills } = useUserSkills();
  const { activityLogs, loading: logsLoading, fetchActivityLogs } = useUserActivityLogs(30);
  const { recommendations, loading: recommendationsLoading, markRecommendationAsViewed } = useUserRecommendations();
  const { metrics, loading: metricsLoading, fetchMetrics } = useUserMetrics();
  const { testUpdateMetrics, updating: trackingUpdating } = useProgressTracking();
  const [refreshing, setRefreshing] = React.useState(false);
  const [weeklyPoints, setWeeklyPoints] = React.useState(0);

  useEffect(() => {
    if (!user) return;
    
    console.log("Initial data fetch for ProgressPage - User:", user.id);
    refreshAllData(false);
    
    const interval = setInterval(() => {
      console.log("Auto-refreshing progress data...");
      refreshAllData(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  useEffect(() => {
    // Calculer les points de la semaine en cours à partir des logs d'activité
    if (activityLogs && activityLogs.length) {
      const today = new Date();
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuste pour commencer le lundi
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Filtrer les logs de la semaine et calculer les points
      const thisWeekLogs = activityLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek;
      });
      
      // 10 points par activité
      const points = thisWeekLogs.reduce((total, log) => total + (log.count * 10), 0);
      setWeeklyPoints(points);
    }
  }, [activityLogs]);
  
  const handleRecommendationClick = (id: string, type: string, itemId: string) => {
    markRecommendationAsViewed(id);
  };
  
  const refreshAllData = async (showToast = true) => {
    if (showToast) {
      setRefreshing(true);
    }
    
    try {
      console.log("Refreshing metrics data");
      await fetchMetrics();
      
      console.log("Refreshing skills and activity logs");
      await Promise.all([
        fetchUserSkills(),
        fetchActivityLogs()
      ]);
      
      if (showToast) {
        toast.success("Données de progression actualisées !");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      if (showToast) {
        toast.error("Impossible d'actualiser les données de progression");
      }
    } finally {
      if (showToast) {
        setRefreshing(false);
      }
    }
  };

  const handleTestMetricsUpdate = async () => {
    console.log("Running test update for exercise completion");
    await testUpdateMetrics('exercise', 1);
    // Fetch updated metrics
    console.log("Fetching fresh metrics after test update");
    await fetchMetrics();
  };

  const handleTestTimeUpdate = async () => {
    console.log("Running test update for time spent");
    // Using 'exercise' as the type instead of 'time' since that's what the function accepts
    await testUpdateMetrics('exercise', 15);
    // Fetch updated metrics
    console.log("Fetching fresh metrics after time update");
    await fetchMetrics();
  };

  // Use a fallback object if metrics is null
  const displayMetrics = metrics || { 
    course_completions: 0, 
    exercises_completed: 0, 
    total_time_spent: 0 
  };
  
  // Total points calculation (10 points per exercise, 50 points per course)
  const totalPoints = (displayMetrics.exercises_completed * 10) + (displayMetrics.course_completions * 50);
  
  // Success status based on recent activity (this would ideally come from actual data)
  const recentSuccess = React.useMemo(() => {
    if (activityLogs && activityLogs.length > 0) {
      // Simuler un succès basé sur le nombre de logs récents
      return activityLogs.length > 2;
    }
    return true; // Par défaut, on suppose un succès
  }, [activityLogs]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <PageHeader
            heading="Ta Progression"
            subheading="Suis tes points et tes succès !"
          />
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={() => refreshAllData(true)} 
              disabled={refreshing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleTestMetricsUpdate()} 
                disabled={trackingUpdating}
                className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <Zap className="h-4 w-4" />
                +10 Points
              </Button>
            </div>
          </div>
        </div>

        {/* Nouveau système de suivi visuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PointsDisplay 
            totalPoints={totalPoints} 
            loading={metricsLoading} 
          />
          
          <MagicTips 
            points={totalPoints} 
            recentSuccess={recentSuccess} 
          />
          
          <WeeklySummary 
            weeklyPoints={weeklyPoints} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-t-4 border-t-blue-400">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Temps d'Apprentissage</p>
                    {metricsLoading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <h3 className="text-2xl font-bold">{displayMetrics.total_time_spent || 0} min</h3>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-green-400">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                    <BookOpen className="h-8 w-8 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">Cours Terminés</p>
                    {metricsLoading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <h3 className="text-2xl font-bold">{displayMetrics.course_completions || 0}</h3>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-purple-400">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                    <Code className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Exercices Terminés</p>
                    {metricsLoading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <h3 className="text-2xl font-bold">{displayMetrics.exercises_completed || 0}</h3>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-amber-400">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-full">
                    <Award className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Compétences</p>
                    {skillsLoading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <h3 className="text-2xl font-bold">{skills.length}</h3>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="skills">
              <TabsList className="mb-4">
                <TabsTrigger value="skills" className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Tes Compétences
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ton Activité
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Tes Compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {skillsLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-[300px] w-full" />
                      </div>
                    ) : skills.length > 0 ? (
                      <SkillsProgressChart skills={skills} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>Pas encore de compétences.</p>
                        <p className="text-sm">Fais des exercices pour développer tes compétences!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Ton Activité (30 Derniers Jours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {logsLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-[300px] w-full" />
                      </div>
                    ) : activityLogs.length > 0 ? (
                      <ActivityCalendar activities={activityLogs as ActivityLog[]} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>Pas encore d'activité enregistrée.</p>
                        <p className="text-sm">Commence à apprendre pour voir ton activité ici !</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <RecommendationsList 
              recommendations={recommendations}
              loading={recommendationsLoading}
              onRecommendationClick={handleRecommendationClick}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
