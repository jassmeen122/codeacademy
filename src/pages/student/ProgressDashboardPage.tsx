import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { UserMetric } from "@/types/progress";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useUserSkills } from "@/hooks/useUserSkills";

const ProgressDashboardPage = () => {
  const { user } = useAuthState();
  const { skills, loading: skillsLoading } = useUserSkills();
  const { 
    timeline, 
    languagePerformance, 
    recommendations, 
    loading: metricsLoading,
    markRecommendationAsViewed 
  } = usePerformanceMetrics();
  
  const [userMetrics, setUserMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchUserMetrics();
    }
  }, [user]);
  
  const fetchUserMetrics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // If we have metrics data, use it
      if (data) {
        setUserMetrics(data as UserMetric);
      } else {
        // Otherwise create a default metrics object
        setUserMetrics({
          id: '',
          user_id: user.id,
          course_completions: 0,
          exercises_completed: 0,
          total_time_spent: 0,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewRecommendation = (recommendationId: string) => {
    markRecommendationAsViewed(recommendationId);
    toast.success("Recommendation noted. We'll improve future suggestions.");
  };
  
  const isLoading = loading || metricsLoading || skillsLoading;
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Progress Dashboard</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <ProgressOverview
              courseCompletions={userMetrics?.course_completions || 0}
              exercisesCompleted={userMetrics?.exercises_completed || 0}
              totalTimeSpent={userMetrics?.total_time_spent || 0}
              timelineData={timeline}
              languagePerformance={languagePerformance}
              recommendations={recommendations}
              onViewRecommendation={handleViewRecommendation}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {skills.length > 0 ? (
                    <div className="space-y-4">
                      {skills.map(skill => (
                        <div key={skill.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{skill.skill_name}</span>
                            <span className="text-sm text-muted-foreground">
                              {skill.progress}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${skill.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Complete exercises and courses to develop your skills
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Total Progress</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Based on completed exercises and courses
                      </p>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ 
                            width: `${userMetrics 
                              ? Math.min(100, ((userMetrics.exercises_completed || 0) / 50) * 100) 
                              : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h3 className="text-sm font-medium">Learning Streak</h3>
                        <p className="text-2xl font-bold mt-1">3 days</p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h3 className="text-sm font-medium">Consistency</h3>
                        <p className="text-2xl font-bold mt-1">Good</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                      <div className="text-xs text-muted-foreground">
                        <p className="mb-1">• Completed JavaScript exercise (2 hours ago)</p>
                        <p className="mb-1">• Viewed SQL basics lesson (yesterday)</p>
                        <p>• Finished Python course module (3 days ago)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProgressDashboardPage;
