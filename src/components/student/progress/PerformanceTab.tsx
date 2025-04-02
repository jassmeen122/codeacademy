
import React from "react";
import { PerformanceCharts } from "./PerformanceCharts";
import { TimeAndStrengthCards } from "./TimeAndStrengthCards";

interface PerformanceTabProps {
  performanceData: any[];
  monthlyActivity: any[];
  retentionRate: any[];
  courseCompletions: any[];
}

export const PerformanceTab = ({ 
  performanceData, 
  monthlyActivity, 
  retentionRate, 
  courseCompletions 
}: PerformanceTabProps) => {
  return (
    <div className="space-y-8">
      <PerformanceCharts 
        performanceData={performanceData}
        monthlyActivity={monthlyActivity}
        retentionRate={retentionRate}
        courseCompletions={courseCompletions}
      />
      <TimeAndStrengthCards />
    </div>
  );
};
