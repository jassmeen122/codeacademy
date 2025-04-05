
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProgressDashboard } from '@/components/student/progress/ProgressDashboard';
import { useUserSkills } from '@/hooks/useUserSkills';
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import { useUserRecommendations } from '@/hooks/useUserRecommendations';
import { useUserMetrics } from '@/hooks/useUserMetrics';
import { PageHeader } from '@/components/layout/PageHeader';

const SimpleProgressPage = () => {
  const { skills, loading: skillsLoading, fetchUserSkills } = useUserSkills();
  const { activityLogs, loading: logsLoading, fetchActivityLogs } = useUserActivityLogs(30);
  const { recommendations, loading: recommendationsLoading, markRecommendationAsViewed } = useUserRecommendations();
  const { metrics, loading: metricsLoading, fetchMetrics } = useUserMetrics();

  useEffect(() => {
    // Initial data fetch
    fetchUserSkills();
    fetchActivityLogs();
    fetchMetrics();
  }, [fetchUserSkills, fetchActivityLogs, fetchMetrics]);

  const handleRecommendationClick = (id: string, type: string, itemId: string) => {
    markRecommendationAsViewed(id);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          heading="Your Progress"
          subheading="Track your learning journey and achievements"
        />
        
        <ProgressDashboard
          metrics={metrics}
          skills={skills}
          activityLogs={activityLogs}
          recommendations={recommendations}
          loadingMetrics={metricsLoading}
          loadingSkills={skillsLoading}
          loadingLogs={logsLoading}
          loadingRecommendations={recommendationsLoading}
          onRecommendationClick={handleRecommendationClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default SimpleProgressPage;
