import React, { useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { ActivityLog } from '@/types/progress';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import { useUserRecommendations } from '@/hooks/useUserRecommendations';
import { useUserMetrics } from '@/hooks/useUserMetrics';
import { SkillsProgressChart } from '@/components/student/progress/SkillsProgressChart';
import { ActivityCalendar } from '@/components/student/progress/ActivityCalendar';
import { RecommendationsList } from '@/components/student/progress/RecommendationsList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Award, Code, BookOpen, Calendar, BarChart2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function ProgressPage() {
  const { user } = useAuthState();
  const { skills, loading: skillsLoading, fetchUserSkills } = useUserSkills();
  const { activityLogs, loading: logsLoading, fetchActivityLogs } = useUserActivityLogs(30);
  const { recommendations, loading: recommendationsLoading, markRecommendationAsViewed } = useUserRecommendations();
  const { metrics, loading: metricsLoading, fetchMetrics } = useUserMetrics();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!user) return;
    
    console.log("Initial data fetch for ProgressPage");
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
      await fetchMetrics();
      
      await Promise.all([
        fetchUserSkills(),
        fetchActivityLogs()
      ]);
      
      if (showToast) {
        toast.success("Progress data refreshed!");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      if (showToast) {
        toast.error("Couldn't refresh progress data");
      }
    } finally {
      if (showToast) {
        setRefreshing(false);
      }
    }
  };

  const displayMetrics = metrics || { 
    course_completions: 0, 
    exercises_completed: 0, 
    total_time_spent: 0 
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <PageHeader
            heading="Your Learning Progress"
            subheading="Track your skills, activities, and get personalized recommendations"
          />
          <Button 
            variant="default" 
            onClick={() => refreshAllData(true)} 
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Spent Learning</p>
                  {metricsLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <h3 className="text-3xl font-bold">{displayMetrics.total_time_spent || 0} min</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-10 w-10 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                  {metricsLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <h3 className="text-3xl font-bold">{displayMetrics.course_completions || 0}</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Code className="h-10 w-10 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Exercises Completed</p>
                  {metricsLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <h3 className="text-3xl font-bold">{displayMetrics.exercises_completed || 0}</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Award className="h-10 w-10 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Skills Developing</p>
                  {skillsLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <h3 className="text-3xl font-bold">{skills.length}</h3>
                  )}
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
        
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 border border-gray-200 rounded-md">
            <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
            <div className="text-xs text-gray-500">
              <p>User ID: {user?.id || 'Not logged in'}</p>
              <p>Last refresh: {new Date().toLocaleTimeString()}</p>
              <p>Metrics data: {JSON.stringify(metrics || {})}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
