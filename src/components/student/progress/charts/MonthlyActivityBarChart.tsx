
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { BarChart } from "./BarChart";
import { formatTooltipValue } from "@/utils/chartUtils";

interface MonthlyActivityBarChartProps {
  monthlyActivity: { name: string; value: number }[];
}

export const MonthlyActivityBarChart = ({ monthlyActivity }: MonthlyActivityBarChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Distribution d'activité mensuelle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart 
          data={monthlyActivity} 
          dataKey="value" 
          xAxisKey="name" 
          yAxisLabel="Heures d'apprentissage"
          name="Heures totales"
          color="#82ca9d"
          tooltipFormatter={(value) => formatTooltipValue(value, 'hours')}
        />
      </CardContent>
    </Card>
  );
};
