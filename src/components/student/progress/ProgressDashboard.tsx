
import React from 'react';
import { ProgressCharts } from './ProgressCharts';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { ProgressReport } from './ProgressReport';
import { UserMetric, UserSkill, ActivityLog, UserRecommendation } from '@/types/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, FileText, Lightbulb } from 'lucide-react';

interface ProgressDashboardProps {
  metrics: UserMetric | null;
  skills: UserSkill[];
  activityLogs: ActivityLog[];
  recommendations: UserRecommendation[];
  loadingMetrics: boolean;
  loadingSkills: boolean;
  loadingLogs: boolean;
  loadingRecommendations: boolean;
  onRecommendationClick: (id: string, type: string, itemId: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  metrics,
  skills,
  activityLogs,
  recommendations,
  loadingMetrics,
  loadingSkills,
  loadingLogs,
  loadingRecommendations,
  onRecommendationClick
}) => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="justify-start mb-6">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Progress Report
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          <ProgressCharts 
            skills={skills}
            activityLogs={activityLogs}
            metrics={metrics}
            loading={loadingSkills || loadingLogs || loadingMetrics}
          />
        </TabsContent>
        
        <TabsContent value="report" className="space-y-6">
          <ProgressReport
            metrics={metrics}
            skills={skills}
            activityLogs={activityLogs}
            loading={loadingMetrics || loadingSkills || loadingLogs}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <PersonalizedRecommendations
            recommendations={recommendations}
            loading={loadingRecommendations}
            onRecommendationClick={onRecommendationClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
