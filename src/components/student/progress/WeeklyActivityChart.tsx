
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock8 } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface UserActivity {
  day: string;
  hours: number;
}

interface WeeklyActivityChartProps {
  weeklyActivity: UserActivity[];
}

export const WeeklyActivityChart = ({ weeklyActivity }: WeeklyActivityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock8 className="h-5 w-5 text-primary" />
          Activité d'apprentissage hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyActivity}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" />
              <YAxis label={{ value: 'Heures', angle: -90, position: 'insideLeft' }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorHours)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Total hebdomadaire : {weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1)} heures
        </div>
      </CardContent>
    </Card>
  );
};
