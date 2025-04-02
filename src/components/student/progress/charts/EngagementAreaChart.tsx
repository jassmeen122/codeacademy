
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { AreaChart } from "./AreaChart";
import { calculateAverage, formatTooltipValue } from "@/utils/chartUtils";

interface EngagementAreaChartProps {
  retentionRate: { month: string; rate: number }[];
}

export const EngagementAreaChart = ({ retentionRate }: EngagementAreaChartProps) => {
  const averageEngagement = calculateAverage(retentionRate, 'rate');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Taux d'engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart 
          data={retentionRate} 
          dataKey="rate" 
          xAxisKey="month" 
          yAxisLabel="Taux d'engagement (%)"
          color="#FF8042"
          gradientId="colorRetention"
          tooltipFormatter={(value) => formatTooltipValue(value, 'percentage')}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          Engagement moyen : {averageEngagement}%
        </div>
      </CardContent>
    </Card>
  );
};
