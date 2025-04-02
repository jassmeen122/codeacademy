
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/student/progress/OverviewTab";
import PerformanceTab from "@/components/student/progress/PerformanceTab";
import RecommendationsTab from "@/components/student/progress/RecommendationsTab";
import { useUserPerformance } from "@/hooks/useUserPerformance";
import { toast } from "sonner";

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    loading, 
    error, 
    metrics, 
    activities, 
    recommendations, 
    progressReport, 
    logUserActivity 
  } = useUserPerformance();

  useEffect(() => {
    // Log that user has viewed the progress page
    logUserActivity('page_view', { page: 'progress' });
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load progress data: " + error);
    }
  }, [error]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Log tab change activity
    logUserActivity('tab_change', { from: activeTab, to: value });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Learning Progress</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              loading={loading} 
              progressReport={progressReport} 
              activities={activities}
            />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab 
              loading={loading} 
              metrics={metrics} 
              activities={activities}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsTab 
              loading={loading} 
              recommendations={recommendations} 
              progressReport={progressReport}
              onRecommendationAction={(id, action) => 
                logUserActivity('recommendation_action', { id, action })
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
