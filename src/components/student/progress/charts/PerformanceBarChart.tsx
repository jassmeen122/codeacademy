
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { BarChart } from "./BarChart";
import { calculateAverage, formatTooltipValue } from "@/utils/chartUtils";

interface PerformanceBarChartProps {
  performanceData: { name: string; score: number }[];
}

export const PerformanceBarChart = ({ performanceData }: PerformanceBarChartProps) => {
  const averageScore = calculateAverage(performanceData, 'score');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          Tendances de performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart 
          data={performanceData} 
          dataKey="score" 
          xAxisKey="name" 
          yAxisLabel="Score de performance"
          name="Score de performance quotidien"
          color="#8884d8"
          tooltipFormatter={(value) => formatTooltipValue(value, 'score')}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          Score de performance moyen : {averageScore}
        </div>
      </CardContent>
    </Card>
  );
};
