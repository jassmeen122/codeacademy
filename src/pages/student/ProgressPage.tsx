
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
  
  // Debug metrics information
  console.log("Current metrics state:", { metrics, displayMetrics, loading: metricsLoading });
  
  // Motivational messages based on metrics
  const getTimeMessage = () => {
    const time = displayMetrics.total_time_spent || 0;
    if (time === 0) return "Commencez votre voyage d'apprentissage!";
    if (time < 60) return "Bon début! Continuez!";
    if (time < 120) return "Vous prenez le rythme!";
    return "Quelle persévérance impressionnante!";
  };
  
  const getExerciseMessage = () => {
    const count = displayMetrics.exercises_completed || 0;
    if (count === 0) return "Relevez votre premier défi!";
    if (count < 5) return "Bon début! Continuez!";
    if (count < 10) return "Vous progressez bien!";
    return "Excellent travail! Continuez ainsi!";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <PageHeader
            heading="Votre Progression d'Apprentissage"
            subheading="Suivez vos compétences et obtenez des recommandations personnalisées"
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
                Test Exercice
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleTestTimeUpdate()} 
                disabled={trackingUpdating}
                className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Clock className="h-4 w-4" />
                +15 min
              </Button>
            </div>
          </div>
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
              <div className="px-6 py-4">
                <p className="text-xs text-muted-foreground">{getTimeMessage()}</p>
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
              <div className="px-6 py-4">
                <p className="text-xs text-muted-foreground">
                  {displayMetrics.course_completions ? "Excellent progrès!" : "Commencez votre premier cours!"}
                </p>
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
              <div className="px-6 py-4">
                <p className="text-xs text-muted-foreground">{getExerciseMessage()}</p>
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
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Compétences en Développement</p>
                    {skillsLoading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <h3 className="text-2xl font-bold">{skills.length}</h3>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-muted-foreground">
                  {skills.length ? "Vos compétences grandissent!" : "Développez vos premières compétences!"}
                </p>
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
                  Skills Progress
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Activity Log
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Skills Development</CardTitle>
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
                        <p>No skills data available yet.</p>
                        <p className="text-sm">Complete courses and exercises to build your skills!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Activity (Last 30 Days)</CardTitle>
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
                        <p>No activity data available for the last 30 days.</p>
                        <p className="text-sm">Start learning to see your activity here!</p>
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
        
        <div className="mt-8 p-4 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
          <div className="text-xs text-gray-500">
            <p>User ID: {user?.id || 'Not logged in'}</p>
            <p>Last refresh: {new Date().toLocaleTimeString()}</p>
            <p>Loading states: metrics={String(metricsLoading)}, skills={String(skillsLoading)}, logs={String(logsLoading)}</p>
            <p>Metrics data: {JSON.stringify(metrics || {})}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
