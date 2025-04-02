
import React from "react";
import { PerformanceBarChart } from "./charts/PerformanceBarChart";
import { MonthlyActivityBarChart } from "./charts/MonthlyActivityBarChart";
import { EngagementAreaChart } from "./charts/EngagementAreaChart";
import { CourseProgressionPieChart } from "./charts/CourseProgressionPieChart";

interface PerformanceChartsProps {
  performanceData: any[];
  monthlyActivity: any[];
  retentionRate: any[];
  courseCompletions: any[];
}

export const PerformanceCharts = ({ 
  performanceData, 
  monthlyActivity, 
  retentionRate, 
  courseCompletions 
}: PerformanceChartsProps) => {
  return (
    <>
      <PerformanceBarChart performanceData={performanceData} />
      <MonthlyActivityBarChart monthlyActivity={monthlyActivity} />
      <EngagementAreaChart retentionRate={retentionRate} />
      <CourseProgressionPieChart courseCompletions={courseCompletions} />
    </>
  );
};
