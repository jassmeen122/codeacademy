
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PieChart } from "./PieChart";
import { formatTooltipValue } from "@/utils/chartUtils";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface CourseProgressionPieChartProps {
  courseCompletions: { name: string; completion: number }[];
}

export const CourseProgressionPieChart = ({ courseCompletions }: CourseProgressionPieChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Progression des cours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PieChart 
          data={courseCompletions}
          dataKey="completion"
          nameKey="name"
          colors={COLORS}
          tooltipFormatter={(value) => formatTooltipValue(value, 'percentage')}
          label={({ name, completion }) => `${name} (${completion}%)`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {courseCompletions.map((course, index) => (
            <div key={course.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-sm truncate">{course.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">{course.completion}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
