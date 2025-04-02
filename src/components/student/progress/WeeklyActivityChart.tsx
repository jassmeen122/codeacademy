
import React from "react";
import { WeeklyActivityAreaChart } from "./charts/WeeklyActivityAreaChart";

interface UserActivity {
  day: string;
  hours: number;
}

interface WeeklyActivityChartProps {
  weeklyActivity: UserActivity[];
}

export const WeeklyActivityChart = ({ weeklyActivity }: WeeklyActivityChartProps) => {
  return <WeeklyActivityAreaChart weeklyActivity={weeklyActivity} />;
};
