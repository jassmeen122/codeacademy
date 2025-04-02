
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock8 } from "lucide-react";
import { AreaChart } from "./AreaChart";
import { calculateTotal, formatTooltipValue } from "@/utils/chartUtils";

interface WeeklyActivityAreaChartProps {
  weeklyActivity: { day: string; hours: number }[];
}

export const WeeklyActivityAreaChart = ({ weeklyActivity }: WeeklyActivityAreaChartProps) => {
  const totalHours = calculateTotal(weeklyActivity, 'hours').toFixed(1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock8 className="h-5 w-5 text-primary" />
          Activité d'apprentissage hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart 
          data={weeklyActivity} 
          dataKey="hours" 
          xAxisKey="day" 
          yAxisLabel="Heures"
          color="#8884d8"
          gradientId="colorHours"
          tooltipFormatter={(value) => formatTooltipValue(value, 'hours')}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          Total hebdomadaire : {totalHours} heures
        </div>
      </CardContent>
    </Card>
  );
};
