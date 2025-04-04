import React, { useState, useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { UserMetric, UserSkill, ActivityLog } from '@/types/progress';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import { useUserRecommendations } from '@/hooks/useUserRecommendations';
import { SkillsProgressChart } from '@/components/student/progress/SkillsProgressChart';
import { ActivityCalendar } from '@/components/student/progress/ActivityCalendar';
import { RecommendationsList } from '@/components/student/progress/RecommendationsList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Award, Code, BookOpen, Calendar, BarChart2 } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuthState();
  const { skills, loading: skillsLoading } = useUserSkills();
  const { activityLogs, loading: logsLoading } = useUserActivityLogs(30);
  const { recommendations, loading: recommendationsLoading, markRecommendationAsViewed } = useUserRecommendations();
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_metrics')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user metrics:', error);
            return;
          }

          // If we have user metrics, set them
          if (data) {
            setMetrics(data as UserMetric);
          } else {
            // Otherwise set some default values
            setMetrics({
              id: '',
              user_id: user.id,
              course_completions: 0,
              exercises_completed: 0,
              total_time_spent: 0,
              last_login: null,
              created_at: '',
              updated_at: ''
            });
          }
        } catch (error) {
          console.error('Error fetching metrics:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserMetrics();
  }, [user]);

  const handleRecommendationClick = (id: string, type: string, itemId: string) => {
    markRecommendationAsViewed(id);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        heading="Your Learning Progress"
        subheading="Track your skills, activities, and get personalized recommendations"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-10 w-10 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Time Spent Learning</p>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <h3 className="text-3xl font-bold">{metrics?.total_time_spent || 0} min</h3>
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
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <h3 className="text-3xl font-bold">{metrics?.course_completions || 0}</h3>
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
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <h3 className="text-3xl font-bold">{metrics?.exercises_completed || 0}</h3>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Skills */}
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

        {/* Right Column - Recommendations */}
        <div>
          <RecommendationsList 
            recommendations={recommendations}
            loading={recommendationsLoading}
            onRecommendationClick={handleRecommendationClick}
          />
        </div>
      </div>
    </div>
  );
}
